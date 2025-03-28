<script>
	import { P, Heading } from 'flowbite-svelte';
	import { Table, TableHead, TableBody } from 'flowbite-svelte';
	import { TableHeadCell, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
	import { page } from '$app/stores';
	import { sortPlayerIDs } from '$lib/PlayerUtil';
	import { getPlayerName } from '$lib/PlayerUtil';

	let { data } = $props();

	const allPlayers = data.players;
	const tourPlayers = data.tournament.players;
	sortPlayerIDs(tourPlayers, allPlayers);
</script>

<Heading tag="h5">Spieler-Statistiken</Heading>
<br />
<P>Bitte Spielername anklicken...</P>
<br />
<Table shadow hoverable={true}>
	<TableHead>
		<TableHeadCell class="text-center">Spieler</TableHeadCell>
	</TableHead>
	<TableBody tableBodyClass="divide-y">
		{#each tourPlayers as player, i}
			<TableBodyRow>
				<TableBodyCell tdClass="text-center">
					<a href={'/liga/flipliga/' + $page.params.id + '/statistics/' + player}
						>{getPlayerName(player, allPlayers)}</a
					>
				</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>
