<!--
    "baseline": 50, // Basispunkte für jeden Spieler zu Saisonbeginn
    "challengeSame": 1, // Wie oft der gleiche Gegner je Saison gefordert werden darf
    "matchBonus": 1, // Bonuspunkte für jedes angetretene Match
    "minMatches": 1, // Wie viele Matches ein Spieler pro Spieltag spielen muss
    "minRound": 5 // Ab welcher Runde erfolgen Matchabzüge
-->

<script>

    import { P, Heading } from 'flowbite-svelte';
    import { Table, TableHead, TableBody, TableHeadCell, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
	import { MapTourStatus } from '$lib/utils';

	/** @type {{data: any}} */
	let { data } = $props();
    let tournament = data.tournament;
    let players = data.players;

    const numRounds = tournament.results.length;
    const status = MapTourStatus(tournament.results[numRounds-1].status);
    const ranking = tournament.results[numRounds-1].rank;

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
