<script>
	import { P, Card, Button, Label, Select, Modal } from 'flowbite-svelte';
	import { CloseCircleOutline } from 'flowbite-svelte-icons';
	import { getPlayerName, formatPlayerName } from '$lib/PlayerUtil';
	import { generatePlayersPDF } from '$lib/PDFUtil';

	let {
		tournament,
		tournaments,
		allPlayers,
		description,
		addEnabled,
		delEnabled,
		importFrom,
		update
	} = $props();

	let usedPlayers = $state([]);
	let unusedPlayers = $state([]);
	let changed = $state();

	let showSelect = $state(false);
	let showNone = $state(false);
	let alertMsg = $state('');
	let tourSelect = $state([]);
	let tourSelected = $state('');

	let playerMap = [];

	function addPlayer(player) {
		usedPlayers.push(player);
		const index = unusedPlayers.indexOf(player);
		unusedPlayers.splice(index, 1);
		changed = true;
	}

	function delPlayer(player) {
		unusedPlayers.push(player);
		const index = usedPlayers.indexOf(player);
		usedPlayers.splice(index, 1);
		changed = true;
	}

	function restoreSettings() {
		initPlayers(tournament.players);
		changed = false;
	}

	async function updateSettings() {
		let usedPlayerIDs = [];
		usedPlayers.forEach((item) => {
			usedPlayerIDs.push(playerMap.find((item2) => item2.name === item).id);
		});
		if (await update(usedPlayerIDs)) {
			changed = false;
			tournament.players = usedPlayerIDs;
		}
	}

	const prepareImport = () => {
		tourSelect = [];
		tournaments.forEach((tournament) => {
			if (tournament.type === importFrom && tournament.status === 'Completed') {
				tourSelect.push({ value: tournament.id, name: tournament.name });
			}
		});
		if (tourSelect.length > 0) {
			showSelect = true;
		} else {
			alertMsg = 'Kein Turnier für Import vorhanden.';
			showNone = true;
		}
	};

	const executeImport = () => {
		usedPlayers.splice(0, usedPlayers.length);
		const tournament = tournaments.find((item) => item.id === tourSelected);
		if (tournament && tournament.results.rankFinal && tournament.results.rankFinal.length > 0) {
			initPlayers(tournament.results.rankFinal);
			showSelect = false;
			changed = true;
		} else {
			showSelect = false;
			alertMsg = 'Keine Spieler für Import vorhanden.';
			showNone = true;
		}
	};

	const cancelImport = () => {
		showSelect = false;
	};

	const initPlayers = (players) => {
		let unusedPlayers2 = [];
		let usedPlayers2 = [];
		playerMap.splice(0, playerMap.length);

		players.forEach((item) => {
			const playerName = getPlayerName(item, allPlayers);
			usedPlayers2.push(playerName);
			playerMap.push({ id: item, name: playerName });
		});

		allPlayers.forEach((item) => {
			if (item.active && !players.includes(item.id)) {
				const playerName = formatPlayerName(item);
				unusedPlayers2.push(playerName);
				playerMap.push({ id: item.id, name: playerName });
			}
		});

		usedPlayers = usedPlayers2;
		unusedPlayers = unusedPlayers2;
	};
	initPlayers(tournament.players);
</script>

<div class="flex-1 flex-col sm:flex-row justify-center content-center gap-3">
	<div>
		{#each description as line}
			<P class="py-1">{line}</P>
		{/each}
		<br />
	</div>

	<form>
		<div class="flex gap-3">
			<div>
				<Card>
					<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
						Teilnehmende Spieler
					</h5>
					{#each usedPlayers as player, i}
						<Button disabled={!delEnabled} outline size="xs" on:click={() => delPlayer(player)}>
							{player}
						</Button>
					{/each}
				</Card>
			</div>
			<div>
				<Card>
					<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
						Verfügbare Spieler
					</h5>
					{#each unusedPlayers as player, i}
						<Button disabled={!addEnabled} outline size="xs" on:click={() => addPlayer(player)}>
							{player}
						</Button>
					{/each}
				</Card>
			</div>
			<div>
				<Card>
					<Button disabled={!changed} on:click={updateSettings}>Speichern</Button>
					<br />
					<Button disabled={!changed} on:click={restoreSettings}>Zurücksetzen</Button>
					<br />
					<Button disabled={!addEnabled || !importFrom} on:click={prepareImport}>Importieren</Button
					>
					<br />
					<Button
						disabled={changed}
						on:click={() =>
							generatePlayersPDF(tournament.name + ' - Spieler', tournament.players, allPlayers)}
						>PDF Export
					</Button>
				</Card>
			</div>
		</div>
	</form>
</div>

<div>
	<Modal
		title={'Aus ' + importFrom + ' importieren'}
		bind:open={showSelect}
		autoclose={false}
		class="max-w-sm"
	>
		<form class="flex flex-col space-y-6" action="#">
			<Label>
				Turnier auswählen:
				<Select
					class="w-44 p-3 space-y-3 text-sm"
					items={tourSelect}
					bind:value={tourSelected}
					placeholder="Turnier"
				></Select>
			</Label>
			<Button color="alternative" on:click={executeImport}>Importieren</Button>
			<Button color="primary" on:click={cancelImport}>Abbrechen</Button>
		</form>
	</Modal>

	<Modal bind:open={showNone} size="xs" autoclose>
		<div class="text-center">
			<CloseCircleOutline class="mx-auto mb-4 text-red-700 w-12 h-12 dark:text-red-700" />
			<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
				{alertMsg}
			</h3>
			<Button color="alternative">Schließen</Button>
		</div>
	</Modal>
</div>
