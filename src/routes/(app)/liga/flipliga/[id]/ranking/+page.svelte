<script>
	import { P, Heading } from 'flowbite-svelte';
	import { Table, TableHead, TableBody } from 'flowbite-svelte';
	import { TableHeadCell, TableBodyCell, TableBodyRow } from 'flowbite-svelte';

	let { data } = $props();
	let players = data.players;
	let blob = data.blob;

	const ranking = blob.results.rankFinal;

	const getPlayerName = (id) => {
		const player = players.find((item) => item.id === id);
		if (player === null) {
			return `Unbekannt (${id})`;
		} else {
			return `${player.forename} ${player.surname}`;
		}
	};

	const getPlayerStrength = (id) => {
		const player = blob.results.rankInit.find((item) => item.player === id);
		return player.strength;
	};

	const getPlayerRankChange = (id) => {
		const rank1 = blob.results.rankInit.findIndex((item) => item.player === id);
		const rank2 = blob.results.rankFinal.findIndex((item) => item.player === id);
		const rankChange = rank1 - rank2;
		return rankChange != 0 ? rankChange : '';
	};

	const formatPlayerRankChange = (id) => {
		const rankChange = getPlayerRankChange(id);
		return (rankChange > 0 ? '+' : '') + rankChange;
	};

	const getPlayerRankChangeStyle = (id) => {
		const rankChange = getPlayerRankChange(id);
		return rankChange != '' && rankChange > 0
			? 'color:green; text-decoration:underline;'
			: rankChange < 0
				? 'color:red;'
				: 'color:default;';
	};

	const getPlayerScoring = (id) => {
		const player1 = blob.results.rankInit.find((item) => item.player === id);
		const player2 = blob.results.rankFinal.find((item) => item.player === id);
		return player2.points - player1.points;
	};

	const getCountMatches = (id) => {
		return blob.results.matches.reduce((count, item) => {
			if (item.player1 === id || item.player2 === id) {
				count += 1;
			}
			return count;
		}, 0);
	};

	const roundNumber = (num) => {
		return (Math.round(num * 10) / 10).toFixed(1);
	};
</script>

<div>
	<Heading tag="h5">Rangfolge</Heading>
	<br />

	<Table hoverable={true}>
		<TableHead>
			<TableHeadCell>Spieler</TableHeadCell>
			<TableHeadCell>Spielstärke</TableHeadCell>
			<TableHeadCell>Tendenz</TableHeadCell>
			<TableHeadCell>Punkte</TableHeadCell>
			<TableHeadCell>Punktgewinn</TableHeadCell>
			<TableHeadCell>Matches</TableHeadCell>
		</TableHead>
		<TableBody tableBodyClass="divide-y">
			{#each ranking as rank, i}
				<TableBodyRow>
					<TableBodyCell>
						{getPlayerName(rank.player)}
					</TableBodyCell>
					<TableBodyCell>
						{getPlayerStrength(rank.player)}
					</TableBodyCell>
					<TableBodyCell>
						<div style={getPlayerRankChangeStyle(rank.player)}>
							{formatPlayerRankChange(rank.player)}
						</div>
					</TableBodyCell>
					<TableBodyCell>
						{roundNumber(rank.points)}
					</TableBodyCell>
					<TableBodyCell>
						{roundNumber(getPlayerScoring(rank.player))}
					</TableBodyCell>
					<TableBodyCell>
						{getCountMatches(rank.player)}
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</div>
