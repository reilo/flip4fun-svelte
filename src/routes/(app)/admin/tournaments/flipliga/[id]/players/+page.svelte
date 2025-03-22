<script>
	import { Card, Button } from 'flowbite-svelte';

	let { data } = $props();

	let usedPlayers = $state([]);
	let unusedPlayers = $state([]);
	let changed = $state();

	let allPlayers = data.players;
	let playerMap = [];
	const settingsEnabled =
		data.tournament.status === 'Planned' ||
		(data.blob != undefined && data.blob.status !== 'Active');

	const usePlayer = (player) => {
		usedPlayers.push(player);
		const index = unusedPlayers.indexOf(player);
		unusedPlayers.splice(index, 1);
		changed = true;
	};

	const unusePlayer = (player) => {
		unusedPlayers.push(player);
		const index = usedPlayers.indexOf(player);
		usedPlayers.splice(index, 1);
		changed = true;
	};

	$effect.pre(() => {
		let unusedPlayers2 = [];
		let usedPlayers2 = [];

		if (data.blob == undefined) {
			allPlayers.forEach((item) => {
				const playerName = item.forename + ' ' + item.surname;
				unusedPlayers2.push(playerName);
				playerMap.push({ id: item.id, name: playerName });
			});
		} else {
			allPlayers.forEach((item) => {
				const playerName = item.forename + ' ' + item.surname;
				const existing = data.blob.results.rankInit.find((item2) => item2.player === item.id);
				if (existing) {
					usedPlayers2.push(playerName);
				} else {
					unusedPlayers2.push(playerName);
				}
				playerMap.push({ id: item.id, name: playerName });
			});
		}
		usedPlayers = usedPlayers2;
		unusedPlayers = unusedPlayers2;
	});
</script>

<form>
	<div class="flex flex-col sm:flex-row justify-center content-center gap-3">
		<div>
			<Card>
				<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
					Teilnehmende Spieler
				</h5>
				{#each usedPlayers as player, i}
					<Button disabled={!settingsEnabled} outline size="xs" on:click={unusePlayer(player)}>
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
					<Button disabled={!settingsEnabled} outline size="xs" on:click={usePlayer(player)}>
						{player}
					</Button>
				{/each}
			</Card>
		</div>
		{#if settingsEnabled}
			<div>
				<Card>
					<Button disabled={!changed} on:click={updateSettings}>Speichern</Button>
				</Card>
			</div>
		{/if}
	</div>
</form>
