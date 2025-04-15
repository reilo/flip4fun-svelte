<script>
	import { P, Card, Button } from 'flowbite-svelte';
	import { getPlayerName, formatPlayerName } from '$lib/PlayerUtil';
	import { generatePlayersPDF } from '$lib/PDFUtil';

	let { tournament, allPlayers, description, addEnabled, delEnabled, update } = $props();

	let usedPlayers = $state([]);
	let unusedPlayers = $state([]);
	let changed = $state();

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
		initPlayers();
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

	const initPlayers = () => {
		let unusedPlayers2 = [];
		let usedPlayers2 = [];

		tournament.players.forEach((item) => {
			const playerName = getPlayerName(item, allPlayers);
			usedPlayers2.push(playerName);
			playerMap.push({ id: item, name: playerName });
		});

		allPlayers.forEach((item) => {
			if (item.active && !tournament.players.includes(item.id)) {
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
