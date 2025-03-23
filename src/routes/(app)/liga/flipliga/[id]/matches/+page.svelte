<script>
	import { P, Heading } from 'flowbite-svelte';
	import { Table, TableHead, TableBody } from 'flowbite-svelte';
	import { TableHeadCell, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
	import { CalcPoints } from '$lib/MatchUtil';

	let { data } = $props();
	let players = data.players;
	let pins = data.pins;
	let blob = data.blob;
	let tournament = data.tournament;

	const matches = blob.results.matches;
	const rankInit = blob.results.rankInit;

	const getPlayerName = (id) => {
		const player = players.find((item) => item.id === id);
		return player != null ? `${player.forename} ${player.surname}` : `Unbekannt (${id})`;
	};

	const getPinName = (id) => {
		const pin = pins.find((item) => item.id === id);
		return pin != null ? pin.name : `Unbekannt (${id})`;
	};

	const getStrength = (playerName) => {
		const rank = rankInit.find((item) => item.player === playerName);
		return rank != null ? rank.strength : 0;
	};

	const formatResultString = (p1, p2) => {
		return `${p1} : ${p2}`;
	};

	const getPlayer1ColorStyle = (match) => {
		return match.score1 > match.score2
			? 'color:green; text-decoration:underline;'
			: 'color:default;';
	};

	const getPlayer2ColorStyle = (match) => {
		return match.score1 < match.score2
			? 'color:green; text-decoration:underline;'
			: 'color:default;';
	};

	const getPoints = (match, num) => {
		const result = CalcPoints(match, getStrength(match.player1), getStrength(match.player2));
		return (num == 1 ? result.player1 : result.player2) + tournament.settings.matchBonus;
	};

	const roundNumber = (num) => {
		return (Math.round(num * 10) / 10).toFixed(1);
	};
</script>

<div>
	<Heading tag="h5">Matches Spieltag</Heading>
	<br />

	<Table hoverable={true}>
		<TableHead>
			<TableHeadCell>Spieler 1</TableHeadCell>
			<TableHeadCell>Spieler 2</TableHeadCell>
			<TableHeadCell>Sätze</TableHeadCell>
			<TableHeadCell>Punkte</TableHeadCell>
			<TableHeadCell>Flipper</TableHeadCell>
		</TableHead>
		<TableBody tableBodyClass="divide-y">
			{#each matches as match, i}
				<TableBodyRow>
					<TableBodyCell>
						<div style={getPlayer1ColorStyle(match)}>
							{getPlayerName(match.player1) + ' (' + getStrength(match.player1) + ')'}
						</div>
					</TableBodyCell>
					<TableBodyCell>
						<div style={getPlayer2ColorStyle(match)}>
							{getPlayerName(match.player2) + ' (' + getStrength(match.player2) + ')'}
						</div>
					</TableBodyCell>
					<TableBodyCell align="left">
						{formatResultString(match.score1, match.score2)}
					</TableBodyCell>
					<TableBodyCell align="left">
						{formatResultString(roundNumber(getPoints(match, 1)), roundNumber(getPoints(match, 2)))}
					</TableBodyCell>
					<TableBodyCell>
						{getPinName(match.pin)}
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</div>
