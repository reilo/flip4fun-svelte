<script>

    import { P, Heading } from 'flowbite-svelte';
    import { Table, TableHead, TableBody, TableHeadCell, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
	import { MapTourStatus } from '$lib/utils';

	let { data } = $props();
    let tournament = data.tournament;
    let players = data.players;
	let blob = data.blob;

    const numRounds = tournament.results.currentRound;
    const status = MapTourStatus(blob.status);
    const ranking = blob.results.rankFinal;

    const getPlayerName = (id) => {
        const player = players.find(item => item.id === id);
        if (player === null) {
            return `Unbekannt (${id})`;
        } else {
            return `${player.forename} ${player.surname}`;
        }
    }

</script>


<Heading tag="h5">Aktuelle Runde {numRounds} ({status})</Heading>
<br />

<div>
	<Heading tag="h5">Rangfolge</Heading>
	<br />

	<Table hoverable={true}>
		<TableHead>
			<TableHeadCell>Spieler</TableHeadCell>
			<TableHeadCell>Punkte</TableHeadCell>
		</TableHead>
		<TableBody tableBodyClass="divide-y">
			{#each ranking as rank, i}
					<TableBodyRow>
						<TableBodyCell>
							{getPlayerName(rank.player)}
						</TableBodyCell>
						<TableBodyCell align="right">
							{(Math.round(rank.points * 10) / 10).toFixed(1)}
						</TableBodyCell>
					</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</div>
