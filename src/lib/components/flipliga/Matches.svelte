<script>
	import { Heading } from 'flowbite-svelte';
	import { Modal, Button, Badge, Label, Select } from 'flowbite-svelte';
	import { ExclamationCircleOutline, CloseCircleOutline } from 'flowbite-svelte-icons';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import { innerWidth } from 'svelte/reactivity/window';
	import { accessState, ReadAccess, AdminAccess } from '/src/state.svelte.js';
	import { calcPoints, getMatchToastMessage } from '$lib/MatchUtil';
	import { roundNumberToStrg } from '$lib/TypeUtil';
	import { getPlayerName as _getPlayerName } from '$lib/PlayerUtil';
	import { getPinName } from '$lib/PinUtil';
	import { logInfo } from '$lib/LogUtil';

	let { data } = $props();

	let isPhone = $derived(innerWidth.current <= 480);

	const py = 'py-1';


	let newForm = $state(false);
	let showAlert = $state(false);
	let alertMessage = $state('');
	let showSure = $state(false);
	let alertMessageDelete = $state('');
	let showSureDelete = $state(false);
	let showToast = $state(false);
	let toastMessage = $state('');

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
		return (num == 1 ? result.player1 : result.player2);// + settings.matchBonus;
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
		if (settings.showToast) {
			showToast = true;
			toastMessage = getMatchToastMessage(
				data.players.find((p) => p.id === selPlayer1)?.forename ?? selPlayer1,
				data.players.find((p) => p.id === selPlayer2)?.forename ?? selPlayer2,
				selPoints1,
				selPoints2
			);
			setTimeout(() => (showToast = false), 5000);
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
	<p class="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
		{tourCompleted ? 'Letzter Spieltag' : 'Aktueller Spieltag'} &middot; {matches.length} Matches
	</p>

	{#if addMatchEnabled}
		<div>
			<Button class="mb-3" on:click={() => (newForm = true)}>Spieleingabe...</Button>

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
							Punkte 2:
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
					<Button color="primary" on:click={checkMatch}>Speichern</Button>
					<Button color="alternative" on:click={cancelAddMatch}>Abbrechen</Button>
				</form>
			</Modal>
		</div>

		{#if showToast}
			<div class="mb-3 px-4 py-3 rounded-lg bg-orange-400 text-white font-semibold text-sm">
			{toastMessage}
		</div>
		{/if}

		<div>
			<Modal bind:open={showAlert} size="xs" autoclose>
				<div class="text-center">
					<CloseCircleOutline class="mx-auto mb-4 text-red-700 w-12 h-12 dark:text-red-700" />
					<Heading tag="h3" class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
						{alertMessage}
					</Heading>
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
					<Heading tag="h3" class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
						{getPlayerName(selPlayer1) +
							' : ' +
							getPlayerName(selPlayer2) +
							' = ' +
							selPoints1 +
							' : ' +
							selPoints2}
					</Heading>
					<Button color="red" class="me-2" on:click={storeMatch}>Ja, ich bin sicher</Button>
					<Button color="alternative">Nein, abbrechen</Button>
				</div>
			</Modal>
		</div>
	{/if}

	<div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
		<div class="grid {isPhone ? 'grid-cols-[1fr_1fr_5rem]' : 'grid-cols-[1fr_1fr_5rem_7rem_10rem_6rem]'} bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
			<div class="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Spieler 1</div>
			<div class="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Spieler 2</div>
			<div class="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-center">Sätze</div>
			{#if !isPhone}
				<div class="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-center">Punkte</div>
				<div class="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Flipper</div>
				<div class="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"></div>
			{/if}
		</div>
		{#each [...matches].reverse() as match, i}
			<div
				class="grid {isPhone ? 'grid-cols-[1fr_1fr_5rem]' : 'grid-cols-[1fr_1fr_5rem_7rem_10rem_6rem]'} items-center border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors hover:bg-blue-50 dark:hover:bg-blue-950"
				class:bg-gray-100={i % 2 === 1}
				class:dark:bg-gray-700={i % 2 === 1}
			>
				<div class="px-4 py-2 text-sm {match.score1 > match.score2 ? 'font-semibold text-green-600 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}">
					<a href={'/liga/flipliga/' + page.params.id + '/statistics/player?player=' + match.player1} class="hover:underline">
						{isPhone ? getPlayerName(match.player1, true) : getPlayerName(match.player1) + ' (' + getStrength(match.player1) + ')'}
					</a>
				</div>
				<div class="px-4 py-2 text-sm {match.score1 < match.score2 ? 'font-semibold text-green-600 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}">
					<a href={'/liga/flipliga/' + page.params.id + '/statistics/player?player=' + match.player2} class="hover:underline">
						{isPhone ? getPlayerName(match.player2, true) : getPlayerName(match.player2) + ' (' + getStrength(match.player2) + ')'}
					</a>
				</div>
				<div class="px-4 py-2 text-sm font-mono text-center text-gray-700 dark:text-gray-300">
					{formatResultString(match.score1, match.score2)}
				</div>
				{#if !isPhone}
					<div class="px-4 py-2 text-sm font-mono text-center text-gray-700 dark:text-gray-300">
						{formatResultString(roundNumberToStrg(getPoints(match, 1)), roundNumberToStrg(getPoints(match, 2)))}
					</div>
					<div class="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
						{getPinName(match.pin, data.pins)}
					</div>
					<div class="px-4 py-2">
						{#if accessState.value >= AdminAccess}
							{#if data.round.status === 'Active'}
								<Button on:click={() => verifyDelete(match)} size="xs">Löschen</Button>
							{:else}
								<Button disabled size="xs">Löschen</Button>
							{/if}
						{/if}
					</div>
				{/if}
			</div>
		{/each}
	</div>

	<div>
		<Modal bind:open={showSureDelete} size="xs" autoclose>
			<div class="text-center">
				<ExclamationCircleOutline
					class="mx-auto mb-4 text-green-700 w-12 h-12 dark:text-green-700"
				/>
				<Heading tag="h3" class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
					{alertMessageDelete}
				</Heading>
				<Button color="red" class="me-2" on:click={deleteMatch}>Ja, ich bin sicher</Button>
				<Button color="alternative">Nein, abbrechen</Button>
			</div>
		</Modal>
	</div>
</div>
