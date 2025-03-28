<script>
	import { Heading } from 'flowbite-svelte';
	import { Modal, Button, Label, Select } from 'flowbite-svelte';
	import { Table, TableHead, TableBody } from 'flowbite-svelte';
	import { TableHeadCell, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
	import { ExclamationCircleOutline, CloseCircleOutline } from 'flowbite-svelte-icons';
	import { invalidateAll } from '$app/navigation';
	import { calcPoints } from '$lib/MatchUtil';
	import { getPlayerName as _getPlayerName } from '$lib/PlayerUtil';
	import { getPinName } from '$lib/PinUtil.js';

	let { data } = $props();

	let newForm = $state(false);
	let showAlert1 = $state(false);
	let showAlert2 = $state(false);
	let showSure = $state(false);

	const matches = $derived(data.round ? data.round.matches : []);
	const tempData = $derived(data.round ? data.round.tempData : {});
	const rankInit = data.round ? data.round.settings.rankInit : [];

	const addMatchEnabled = data.round && data.round.status === 'Active';

	const getPlayerName = (id) => {
		return _getPlayerName(id, data.players);
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
		return (num == 1 ? result.player1 : result.player2) + data.tournament.settings.matchBonus;
	};

	const roundNumber = (num) => {
		return (Math.round(num * 10) / 10).toFixed(1);
	};

	const matchLimitReached = (player1, player2) => {
		const entry = tempData.encounters.find((item) => item.p === player1 + '-' + player2);
		return data.tournament.settings.challengeSame <= entry.e;
	};

	const updateTempData = (player1, player2) => {
		const index = tempData.encounters.findIndex((item) => item.p === player1 + '-' + player2);
		tempData.encounters[index].e += 1;
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
			showAlert1 = true;
		} else if (matchLimitReached(selPlayer1, selPlayer2)) {
			showAlert2 = true;
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
		updateTempData(selPlayer1, selPlayer2);
		// TODO: need db transaction here!!!
		const tourResponse = await fetch(
			'/api/round/' + data.round.id,
			{
				method: 'PUT',
				body: JSON.stringify({
					tempData: tempData
				}),
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				}
			}
		);
		const tourResult = await tourResponse.json();
		if (tourResponse.status !== 200) {
			alert(JSON.stringify(tourResult));
		} else {
			const matchResponse = await fetch(
				'/api/tournament/' + data.tournament.id + '/round/' + data.round.rid + '/match',
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
		}
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

	const pinMap = [];
	data.pins.forEach((item) => {
		pinMap.push({ name: item.name, value: item.id });
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
	<Heading tag="h5">Matches Spieltag</Heading>
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
			<Modal bind:open={showAlert1} size="xs" autoclose>
				<div class="text-center">
					<CloseCircleOutline class="mx-auto mb-4 text-red-700 w-12 h-12 dark:text-red-700" />
					<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
						Daten sind fehlerhaft oder unvollständig. Bitte korrigieren!
					</h3>
					<Button color="alternative">Schließen</Button>
				</div>
			</Modal>
		</div>

		<div>
			<Modal bind:open={showAlert2} size="xs" autoclose>
				<div class="text-center">
					<CloseCircleOutline class="mx-auto mb-4 text-red-700 w-12 h-12 dark:text-red-700" />
					<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
						Dieses Match wurde schon {data.tournament.settings.challengeSame} mal gespielt!
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
			<TableHeadCell>Punkte</TableHeadCell>
			<TableHeadCell>Flipper</TableHeadCell>
		</TableHead>
		<TableBody tableBodyClass="divide-y">
			{#each matches as match, i}
				<TableBodyRow>
					<TableBodyCell>
						<div style={getPlayer1ColorStyle(match)}>
							{getPlayerName(match.player1) + ' (' + getStrength(match.player1) + ')'}
						</div>
					</TableBodyCell>
					<TableBodyCell>
						<div style={getPlayer2ColorStyle(match)}>
							{getPlayerName(match.player2) + ' (' + getStrength(match.player2) + ')'}
						</div>
					</TableBodyCell>
					<TableBodyCell align="left">
						{formatResultString(match.score1, match.score2)}
					</TableBodyCell>
					<TableBodyCell align="left">
						{formatResultString(roundNumber(getPoints(match, 1)), roundNumber(getPoints(match, 2)))}
					</TableBodyCell>
					<TableBodyCell>
						{getPinName(match.pin, data.pins)}
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</div>
