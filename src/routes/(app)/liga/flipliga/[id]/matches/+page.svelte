<script>
	import { Heading } from 'flowbite-svelte';
	import { Modal, Button, Label, Input, Select } from 'flowbite-svelte';
	import { Table, TableHead, TableBody } from 'flowbite-svelte';
	import { TableHeadCell, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
	import { ExclamationCircleOutline, CloseCircleOutline } from 'flowbite-svelte-icons';
	import { CalcPoints } from '$lib/MatchUtil';

	let { data } = $props();
	let players = data.players;
	let pins = data.pins;
	let blob = data.blob;
	let tournament = data.tournament;

	let newForm = $state(false);
	let showAlert = $state(false);
	let showSure = $state(false);

	const matches = blob.results.matches;
	const rankInit = blob.results.rankInit;

	const addMatchEnabled = blob.status === 'Active';

	const getPlayerName = (id) => {
		const player = players.find((item) => item.id === id);
		return player != null ? `${player.forename} ${player.surname}` : `Unbekannt (${id})`;
	};

	const getPinName = (id) => {
		const pin = pins.find((item) => item.id === id);
		return pin != null ? pin.name : `Unbekannt (${id})`;
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
		const result = CalcPoints(match, getStrength(match.player1), getStrength(match.player2));
		return (num == 1 ? result.player1 : result.player2) + tournament.settings.matchBonus;
	};

	const roundNumber = (num) => {
		return (Math.round(num * 10) / 10).toFixed(1);
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
			showAlert = true;
		} else {
			showSure = true;
		}
	};

	const storeMatch = () => {
		let match = {
				player1: selPlayer1,
				player2: selPlayer2,
				score1: selPoints1,
				score2: selPoints2,
				pin: selPin
			};
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
	pins.forEach((item) => {
		pinMap.push({ name: item.name, value: item.id });
	});

	const playerMap = [];
	tournament.players.forEach((item) => {
		const player = players.find((item2) => item2.id === item);
		playerMap.push({ name: player.forename + ' ' + player.surname, value: item });
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

	$effect.pre(() => {});
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
			<Modal bind:open={showAlert} size="xs" autoclose>
				<div class="text-center">
					<CloseCircleOutline
						class="mx-auto mb-4 text-red-700 w-12 h-12 dark:text-red-700"
					/>
					<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
						Daten sind nicht korrekt oder unvollständig. Bitte korrigieren!
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
						{getPlayerName(selPlayer1) + " : " + getPlayerName(selPlayer2) + " = " + selPoints1 + " : " + selPoints2}
					</h3>
					<Button color="red" class="me-2" on:click={storeMatch}>Ja, ich bin sicher</Button>
					<Button color="alternative">Nein, abbrechen</Button>
				</div>
			</Modal>
		</div>

		<br />
	{/if}

	<Table hoverable={true}>
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
						{getPinName(match.pin)}
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</div>
