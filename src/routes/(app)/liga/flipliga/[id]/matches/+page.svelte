<script>
	import { P, Heading } from 'flowbite-svelte';
	import { Table, TableHead, TableBody } from 'flowbite-svelte';
	import { TableHeadCell, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
	import * as TourUtil from '$lib/TourUtil';

	let { data } = $props();
	let tournament = data.tournament;
	let players = data.players;
	let pins = data.pins;
	let blob = data.blob;

	const numRounds = tournament.results.currentRound;
	const status = TourUtil.MapStatus(blob.status);
	const matches = blob.results.matches;
	const ranks = blob.results.rankInit;

	const getPlayerName = (id) => {
		const player = players.find((item) => item.id === id);
		if (player === null) {
			return `Unbekannt (${id})`;
		} else {
			return `${player.forename} ${player.surname}`;
		}
	};

	const getPinName = (id) => {
		const pin = pins.find((item) => item.id === id);
		if (pin === null) {
			return `Unbekannt (${id})`;
		} else {
			return pin.name;
		}
	};

	const getStrength = (playerName) => {
		const rank = ranks.find((item) => item.player === playerName);
		if (rank === null) {
			return -1;
		} else {
			return rank.strength;
		}
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
		let result;
		let strength1 = getStrength(match.player1);
		let strength2 = getStrength(match.player2);
		if (num === 1) {
			if (match.score1 > match.score2) {
				result = strength2 * (1 - match.score2 / match.score1);
			} else {
				result =
					-Math.min(strength1, Math.abs(strength1 - strength2)) * (1 - match.score1 / match.score2);
			}
		} else {
			if (match.score2 > match.score1) {
				result = strength1 * (1 - match.score1 / match.score2);
			} else {
				result =
					-Math.min(strength2, Math.abs(strength1 - strength2)) * (1 - match.score2 / match.score1);
			}
		}
		return result + 1;
	};

	const roundNumber = (num) => {
		return (Math.round(num * 10) / 10).toFixed(1);
	};
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
