<script>
	import { P, Card, Button } from 'flowbite-svelte';
	import { FilePdfOutline } from 'flowbite-svelte-icons';
	import { invalidateAll } from '$app/navigation';
	import { getPlayerName, formatPlayerName } from '$lib/PlayerUtil';
	import { generatePlayersPDF } from '$lib/PDFUtil';

	let { data } = $props();

	let usedPlayers = $state([]);
	let unusedPlayers = $state([]);
	let changed = $state();

	let playerMap = [];
	const addEnabled = data.tournament.status !== 'Completed';
	const delEnabled = data.tournament.status === 'Planned';

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
		initPlayers();
		changed = false;
	}

	function updateSettings() {
		let usedPlayerIDs = [];
		usedPlayers.forEach((item) => {
			usedPlayerIDs.push(playerMap.find((item2) => item2.name === item).id);
		});
		updatePlayers(usedPlayerIDs);
		changed = false;
		data.tournament.players = usedPlayerIDs;
	}

	async function updatePlayers(players) {
		const response = await fetch('/api/tournament/' + data.tournament.id, {
			method: 'PUT',
			body: JSON.stringify({
				players: players
			}),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
		const result = await response.json();
		if (response.status !== 200) {
			alert(JSON.stringify(result));
		}
	}

	const initPlayers = () => {
		let unusedPlayers2 = [];
		let usedPlayers2 = [];

		data.tournament.players.forEach((item) => {
			const playerName = getPlayerName(item, data.players);
			usedPlayers2.push(playerName);
			playerMap.push({ id: item, name: playerName });
		});

		data.players.forEach((item) => {
			if (!data.tournament.players.includes(item.id)) {
				const playerName = formatPlayerName(item);
				unusedPlayers2.push(playerName);
				playerMap.push({ id: item.id, name: playerName });
			}
		});

		usedPlayers = usedPlayers2;
		unusedPlayers = unusedPlayers2;
	};
	initPlayers();
</script>

<div class="flex-1 flex-col sm:flex-row justify-center content-center gap-3">
	<div>
		<P class="py-1">Hier kannst du neue Spieler zur Liga hinzufügen.</P>
		<P class="py-1"
			>Zum Ligastart klicke die Spieler in der Reihenfolge an, wie sie beim Start-Turnier ermittelt
			wurde.</P
		>
		<P class="py-1"
			>Neue Spieler kannst du hier jederzeit ergänzen, diese werden aber erst zum Start des nächsten
			Spieltages berücksichtigt.</P
		>
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
					<Button
						disabled={changed}
						on:click={generatePlayersPDF(
							data.tournament.name + ' - Spieler',
							data.tournament.players,
							data.allPlayers
						)}
						>PDF Export<FilePdfOutline class="w-3.5 h-3.5 mr-2" />
					</Button>
				</Card>
			</div>
		</div>
	</form>
</div>
