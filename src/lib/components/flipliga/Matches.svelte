<script>
	import { Heading } from 'flowbite-svelte';
	import { Modal, Button, Label, Select } from 'flowbite-svelte';
	import { Table, TableHead, TableBody } from 'flowbite-svelte';
	import { TableHeadCell, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
	import { ExclamationCircleOutline, CloseCircleOutline } from 'flowbite-svelte-icons';
	import { invalidateAll } from '$app/navigation';
	import { innerWidth } from 'svelte/reactivity/window';
	import { access, ReadAccess, AdminAccess } from '/src/stores.js';
	import { calcPoints } from '$lib/MatchUtil';
	import { roundNumberToStrg } from '$lib/TypeUtil';
	import { getPlayerName as _getPlayerName } from '$lib/PlayerUtil';
	import { getPinName } from '$lib/PinUtil';
	import { logInfo } from '$lib/LogUtil';

	let { data } = $props();

	let isPhone = $derived(innerWidth.current <= 480);

	const py = 'py-1';

	let accessValue = $state(ReadAccess);
	access.subscribe((value) => {
		accessValue = value;
	});

	let newForm = $state(false);
	let showAlert = $state(false);
	let alertMessage = $state('');
	let showSure = $state(false);
	let alertMessageDelete = $state('');
	let showSureDelete = $state(false);

	let matches = $derived(data.round ? data.round.matches : []);

	let cache = data.round ? data.round.cache : {};
	let rankInit = data.round ? data.round.settings.rankInit : [];

	let matchToDelete;

	const addMatchEnabled =
		import.meta.env.VITE_APP_FULL && data.round && data.round.status === 'Active';
	const tourCompleted = data.tournament.status === 'Completed';
	const settings = data.tournament.settings;

	const getPlayerName = (id, short = false) => {
		return _getPlayerName(id, data.players, short);
	};

	const getStrength = (playerName) => {
		const rank = rankInit.find((item) => item.player === playerName);
		return rank != null ? rank.strength : 0;
	};

	const formatResultString = (p1, p2) => {
		return `${p1} : ${p2}`;
	};

	const getPlayer1ColorStyle = (match) => {
		return match.score1 > match.score2
			? 'color:green; text-decoration:underline;'
			: 'color:default;';
	};

	const getPlayer2ColorStyle = (match) => {
		return match.score1 < match.score2
			? 'color:green; text-decoration:underline;'
			: 'color:default;';
	};

	const getPoints = (match, num) => {
		const result = calcPoints(match, getStrength(match.player1), getStrength(match.player2));
		return (num == 1 ? result.player1 : result.player2) + settings.matchBonus;
	};

	const matchLimitReached = (player1, player2) => {
		const entry = cache.encounters.find((item) => item.p === player1 + '-' + player2);
		return settings.challengeSame <= entry.e;
	};

	const updateCache = (player1, player2, add) => {
		const index = cache.encounters.findIndex((item) => item.p === player1 + '-' + player2);
		cache.encounters[index].e += add ? 1 : -1;
	};

	const checkMatch = () => {
		if (
			!selPlayer1 ||
			!selPlayer2 ||
			selPlayer1 === selPlayer2 ||
			!selPin ||
			selPin === '' ||
			selPoints1 == null ||
			selPoints2 == null ||
			selPoints1 === selPoints2
		) {
			alertMessage = 'Daten sind fehlerhaft oder unvollständig. Bitte korrigieren!';
			showAlert = true;
		} else if (matchLimitReached(selPlayer1, selPlayer2)) {
			alertMessage = 'Dieses Match wurde schon ' + settings.challengeSame + ' mal gespielt!';
			showAlert = true;
		} else {
			showSure = true;
		}
	};

	async function storeMatch() {
		const pName1 = _getPlayerName(selPlayer1, data.players);
		const pName2 = _getPlayerName(selPlayer2, data.players);
		const matchName =
			data.tournament.name + ' - Runde ' + data.round.rid + ' - ' + pName1 + ' : ' + pName2;
		let match = {
			name: matchName,
			player1: selPlayer1,
			player2: selPlayer2,
			score1: selPoints1,
			score2: selPoints2,
			pin: selPin
		};
		// set additional data for cache update
		updateCache(selPlayer1, selPlayer2, true);
		match.cache = cache;
		match.roundId = data.round.id; // round internal ID, not rid
		const matchResponse = await fetch(
			'/api/tournament/' + data.tournament.id + '/round/' + data.round.rid + '/match?updateCache',
			{
				method: 'POST',
				body: JSON.stringify(match),
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				}
			}
		);
		const matchResult = await matchResponse.json();
		if (matchResponse.status !== 200) {
			alert(JSON.stringify(matchResult));
		}
		logInfo('Angelegt: ' + matchName + ' - ' + selPoints1 + ' : ' + selPoints2);
		invalidateAll();

		showSure = newForm = false;
		resetFormFields();
	}

	const cancelAddMatch = () => {
		newForm = false;
		resetFormFields();
	};

	const resetFormFields = () => {
		selPin = '';
		selPlayer1 = '';
		selPlayer2 = '';
		selPoints1 = 0;
		selPoints2 = 0;
	};

	const verifyDelete = (match) => {
		alertMessageDelete =
			'Das Match ' +
			_getPlayerName(match.player1, data.players) +
			' gegen ' +
			_getPlayerName(match.player2, data.players) +
			' wirklich löschen?';
		showSureDelete = true;
		matchToDelete = match;
	};

	async function deleteMatch() {
		updateCache(matchToDelete.player1, matchToDelete.player2, false);
		let body = {
			cache: cache,
			roundId: data.round.id // round internal ID, not rid
		};
		const matchResponse = await fetch('/api/match/' + matchToDelete.id + '?updateCache', {
			method: 'DELETE',
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
		const matchResult = await matchResponse.json();
		if (matchResponse.status !== 200) {
			alert(JSON.stringify(matchResult));
		}
		logInfo('Gelöscht: ' + matchToDelete.name);
		invalidateAll();

		showSureDelete = false;
	}

	const pinMap = [];
	data.pins.forEach((item) => {
		if (item.active) {
			pinMap.push({ name: item.name, value: item.id });
		}
	});

	let playerMap = [];
	data.tournament.players.forEach((item) => {
		const player = data.players.find((item2) => item2.id === item);
		const name = player ? player.forename + ' ' + player.surname : `Unbekannt (${item})`;
		playerMap.push({ name: name, value: item });
	});
	playerMap.sort((a, b) => {
		const val = a.name > b.name ? 1 : b.name > a.name ? -1 : 0;
		return val;
	});

	const pointsMap = [];
	for (let i = 0; i <= 7; ++i) {
		pointsMap.push({ name: i, value: i });
	}

	let selPin = $state('');
	let selPlayer1 = $state('');
	let selPlayer2 = $state('');
	let selPoints1 = $state(0);
	let selPoints2 = $state(0);
</script>

<div>
	<Heading tag="h5"
		>{tourCompleted
			? 'Letzter Spieltag'
			: 'Aktueller Spieltag' + ' - ' + matches.length + ' Matches'}</Heading
	>
	<br />

	{#if addMatchEnabled}
		<div>
			<Button on:click={() => (newForm = true)}>Spieleingabe...</Button>

			<Modal title="Spieleingabe" bind:open={newForm} autoclose={false} class="max-w-sm">
				<form class="flex flex-col space-y-6" action="#">
					<div class="grid gap-6 mb-6 md:grid-cols-2">
						<Label>
							Spieler 1:
							<Select
								class="mt-4 w-40 p-3 space-y-3 text-sm"
								items={playerMap}
								bind:value={selPlayer1}
								placeholder="Spieler 1"
							></Select>
						</Label>
						<Label>
							Punkte 1:
							<Select
								class="mt-4 w-40 p-3 space-y-3 text-sm"
								items={pointsMap}
								bind:value={selPoints1}
								placeholder="Punkte Spieler 1"
							></Select>
						</Label>
						<Label>
							Spieler 2:
							<Select
								class="mt-4 w-40 p-3 space-y-3 text-sm"
								items={playerMap}
								bind:value={selPlayer2}
								placeholder="Spieler 2"
							></Select>
						</Label>
						<Label>
							Punkte 1:
							<Select
								class="mt-4 w-40 p-3 space-y-3 text-sm"
								items={pointsMap}
								bind:value={selPoints2}
								placeholder="Punkte Spieler 2"
							></Select>
						</Label>
					</div>
					<Label>
						Flipper auswählen:
						<Select
							class="mt-4 p-3 space-y-3 text-sm"
							items={pinMap}
							bind:value={selPin}
							placeholder="Flipper"
						></Select>
					</Label>
					<Button color="alternative" on:click={checkMatch}>Anlegen</Button>
					<Button color="primary" on:click={cancelAddMatch}>Abbrechen</Button>
				</form>
			</Modal>
		</div>

		<div>
			<Modal bind:open={showAlert} size="xs" autoclose>
				<div class="text-center">
					<CloseCircleOutline class="mx-auto mb-4 text-red-700 w-12 h-12 dark:text-red-700" />
					<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
						{alertMessage}
					</h3>
					<Button color="alternative">Schließen</Button>
				</div>
			</Modal>
		</div>

		<div>
			<Modal bind:open={showSure} size="xs" autoclose>
				<div class="text-center">
					<ExclamationCircleOutline
						class="mx-auto mb-4 text-green-700 w-12 h-12 dark:text-green-700"
					/>
					<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
						{getPlayerName(selPlayer1) +
							' : ' +
							getPlayerName(selPlayer2) +
							' = ' +
							selPoints1 +
							' : ' +
							selPoints2}
					</h3>
					<Button color="red" class="me-2" on:click={storeMatch}>Ja, ich bin sicher</Button>
					<Button color="alternative">Nein, abbrechen</Button>
				</div>
			</Modal>
		</div>

		<br />
	{/if}

	<Table shadow hoverable={true}>
		<TableHead>
			<TableHeadCell>Spieler 1</TableHeadCell>
			<TableHeadCell>Spieler 2</TableHeadCell>
			<TableHeadCell>Sätze</TableHeadCell>
			{#if !isPhone}
				<TableHeadCell>Punkte</TableHeadCell>
				<TableHeadCell>Flipper</TableHeadCell>
				<TableHeadCell></TableHeadCell>
			{/if}
		</TableHead>
		<TableBody tableBodyClass="divide-y">
			{#each [...matches].reverse() as match, i}
				<TableBodyRow>
					<TableBodyCell class={py}>
						<div style={getPlayer1ColorStyle(match)}>
							{#if isPhone}
								{getPlayerName(match.player1, true)}
							{:else}
								{getPlayerName(match.player1) + ' (' + getStrength(match.player1) + ')'}
							{/if}
						</div>
					</TableBodyCell>
					<TableBodyCell class={py}>
						<div style={getPlayer2ColorStyle(match)}>
							{#if isPhone}
								{getPlayerName(match.player2, true)}
							{:else}
								{getPlayerName(match.player2) + ' (' + getStrength(match.player2) + ')'}
							{/if}
						</div>
					</TableBodyCell>
					<TableBodyCell class={py} align="left">
						{formatResultString(match.score1, match.score2)}
					</TableBodyCell>
					{#if !isPhone}
						<TableBodyCell class={py} align="left">
							{formatResultString(
								roundNumberToStrg(getPoints(match, 1)),
								roundNumberToStrg(getPoints(match, 2))
							)}
						</TableBodyCell>
						<TableBodyCell class={py}>
							{getPinName(match.pin, data.pins)}
						</TableBodyCell>
						<TableBodyCell class={py}>
							{#if accessValue >= AdminAccess}
								{#if data.round.status === 'Active'}
									<Button on:click={() => verifyDelete(match)} size="xs">Löschen</Button>
								{:else}
									<Button disabled size="xs">Löschen</Button>
								{/if}
							{/if}
						</TableBodyCell>
					{/if}
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>

	<div>
		<Modal bind:open={showSureDelete} size="xs" autoclose>
			<div class="text-center">
				<ExclamationCircleOutline
					class="mx-auto mb-4 text-green-700 w-12 h-12 dark:text-green-700"
				/>
				<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
					{alertMessageDelete}
				</h3>
				<Button color="red" class="me-2" on:click={deleteMatch}>Ja, ich bin sicher</Button>
				<Button color="alternative">Nein, abbrechen</Button>
			</div>
		</Modal>
	</div>
</div>
