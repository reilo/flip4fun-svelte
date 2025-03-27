<script>
	import { P, Heading } from 'flowbite-svelte';
	import { Table, TableHead, TableBody } from 'flowbite-svelte';
	import { TableHeadCell, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
	import { page } from '$app/stores';

	let { data } = $props();

	const allPlayers = data.players;
	const tourPlayers = data.tournament.players;
	tourPlayers.sort((a, b) => {
		const ae = allPlayers.find((item) => item.id === a);
		const be = allPlayers.find((item) => item.id === b);
		const an = ae.forename + ' ' + ae.surname;
		const bn = be.forename + ' ' + be.surname;
		return an < bn ? -1 : bn < an ? 1 : 0;
	});

	const getPlayerName = (id) => {
		const player = allPlayers.find((item) => item.id === id);
		return player != null ? `${player.forename} ${player.surname}` : `Unbekannt (${id})`;
	};
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
						>{getPlayerName(player)}</a
					>
				</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>
