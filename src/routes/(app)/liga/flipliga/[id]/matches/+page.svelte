<script>

    import { P, Heading } from 'flowbite-svelte';
    import { Table, TableHead, TableBody, TableHeadCell, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
	import { MapTourStatus } from '$lib/utils';

	let { data } = $props();
    let tournament = data.tournament;
    let players = data.players;
    let pins = data.pins;

    const numRounds = tournament.results.length;
    const status = MapTourStatus(tournament.results[numRounds-1].status);
    const matches = tournament.results[numRounds-1].matches;

    const getPlayerName = (id) => {
        const player = players.find(item => item.id === id);
        if (player === null) {
            return `Unbekannt (${id})`;
        } else {
            return `${player.forename} ${player.surname}`;
        }
    }

    const getPinName = (id) => {
        const pin = pins.find(item => item.id === id);
        if (pin === null) {
            return `Unbekannt (${id})`;
        } else {
            return pin.name;
        }
    }

    const formatResultString = (p1, p2) => {
        return `${p1} : ${p2}`;
    }

</script>

<Heading tag="h5">Aktuelle Runde {numRounds} ({status})</Heading>
<br />

<div>
	<Heading tag="h5">Matches Spieltag</Heading>
	<br />

	<Table hoverable={true}>
		<TableHead>
			<TableHeadCell>Spieler 1</TableHeadCell>
			<TableHeadCell>Spieler 2</TableHeadCell>
			<TableHeadCell>Ergebnis</TableHeadCell>
            <TableHeadCell>Flipper</TableHeadCell>
		</TableHead>
		<TableBody tableBodyClass="divide-y">
			{#each matches as match, i}
					<TableBodyRow>
						<TableBodyCell>
							{getPlayerName(match.player1)}
						</TableBodyCell>
						<TableBodyCell>
							{getPlayerName(match.player2)}
						</TableBodyCell>
						<TableBodyCell align="left">
							{formatResultString(match.score1, match.score2)}
						</TableBodyCell>
						<TableBodyCell>
							{getPinName(match.pin)}
						</TableBodyCell>
					</TableBodyRow>
			{/each}
		</TableBody>
	</Table>

</div>
