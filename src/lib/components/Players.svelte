<script>
	import { Card, Button, Label, Select, Modal } from 'flowbite-svelte';
	import { CloseCircleOutline } from 'flowbite-svelte-icons';
	import { getPlayerName, formatPlayerName } from '$lib/PlayerUtil';
	import { generatePlayersPDF } from '$lib/PDFPlayerUtil';

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

<div class="flex-1 flex-col md:flex-row justify-center content-center gap-3">
	<div class="mb-3">
		{#each description as line}
			<p class="text-sm text-gray-500 dark:text-gray-400 mb-1">{line}</p>
		{/each}
	</div>

	<form>
		<div class="flex gap-3 mt-3">
			<div>
				<Card class="!p-3 min-w-[160px]">
					<p class="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">Teilnehmende Spieler</p>
					<div class="flex flex-col gap-0.5">
						{#each usedPlayers as player}
							<button
								type="button"
								class="text-left text-sm px-2 py-1 rounded transition-colors text-gray-800 dark:text-gray-200"
								class:hover:bg-blue-50={delEnabled}
								class:dark:hover:bg-blue-900={delEnabled}
								class:cursor-pointer={delEnabled}
								class:opacity-40={!delEnabled}
								class:pointer-events-none={!delEnabled}
								onclick={() => delPlayer(player)}
							>
								{player}
							</button>
						{/each}
					</div>
				</Card>
			</div>
			<div>
				<Card class="!p-3 min-w-[160px]">
					<p class="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">Verfügbare Spieler</p>
					<div class="flex flex-col gap-0.5">
						{#each unusedPlayers as player}
							<button
								type="button"
								class="text-left text-sm px-2 py-1 rounded transition-colors text-gray-800 dark:text-gray-200"
								class:hover:bg-blue-50={addEnabled}
								class:dark:hover:bg-blue-900={addEnabled}
								class:cursor-pointer={addEnabled}
								class:opacity-40={!addEnabled}
								class:pointer-events-none={!addEnabled}
								onclick={() => addPlayer(player)}
							>
								{player}
							</button>
						{/each}
					</div>
				</Card>
			</div>
			<div>
				<Card class="!p-3">
					<div class="flex flex-col gap-2">
						<Button size="sm" disabled={!changed} on:click={updateSettings}>Speichern</Button>
						<Button size="sm" color="alternative" disabled={!changed} on:click={restoreSettings}>Zurücksetzen</Button>
						<Button size="sm" color="alternative" disabled={!addEnabled || !importFrom} on:click={prepareImport}>Importieren</Button>
						<Button
							size="sm"
							color="alternative"
							disabled={changed}
							on:click={() => generatePlayersPDF(tournament.name + ' - Spieler', tournament.players, allPlayers)}
						>PDF Export</Button>
					</div>
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
			<p class="mb-5 text-base text-gray-500 dark:text-gray-400">{alertMsg}</p>
			<Button color="alternative">Schließen</Button>
		</div>
	</Modal>
</div>
