<script>
	import { Card, Button } from 'flowbite-svelte';

	let { data } = $props();
	let allPlayers = data.players;
	let usedPlayers = $state([]);
	let tempArray = [];
	allPlayers.forEach((item) => {
		tempArray.push(item.id);
	});
	let unusedPlayers = $state(tempArray);

	const usePlayer = (player) => {
		usedPlayers.push(player);
		const index = unusedPlayers.indexOf(player);
		unusedPlayers.splice(index, 1);
	};

	const unusePlayer = (player) => {
		unusedPlayers.push(player);
		const index = usedPlayers.indexOf(player);
		usedPlayers.splice(index, 1);
	};
</script>

<div>
	<Card>
		<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
			Teilnehmende Spieler
		</h5>
		{#each usedPlayers as player, i}
			<br />
			<Button size="xs" class="w-fit" on:click={unusePlayer(player)}>
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
			<br />
			<Button size="xs" class="w-fit" on:click={usePlayer(player)}>
				{player}
			</Button>
		{/each}
	</Card>
</div>
