<script>
	import { Heading, P } from 'flowbite-svelte';
	import { Table, TableHead, TableBody } from 'flowbite-svelte';
	import { TableHeadCell, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
	import { page } from '$app/stores';
	import { sortPlayerIDs, getPlayerName as _getPlayerName } from '$lib/PlayerUtil';
	import { getPinName } from '$lib/PinUtil.js';
	import { mapDate } from '$lib/TypeUtil';

	let { data } = $props();

	const rounds = data.rounds;
	const allPlayers = data.players;
	const tourPlayers = data.tournament.players;
	sortPlayerIDs(tourPlayers, allPlayers);

	const currentPlayer = $page.params.player;

	let allPlayerIDs = [];
	allPlayers.forEach((player) => {
		allPlayerIDs.push(player.id);
	});

	let matches = [];
	let opponents1 = []; // vom aktuellen Spieler herausgeforderte Gegner
	let opponents2 = []; // Gegner, die aktuellen Spieler herausgefordert haben

	let opps1 = [],
		opps2 = [];
	data.tournament.players.forEach((item) => {
		opps1.push({ p: item, e: 0 });
		opps2.push({ p: item, e: 0 });
	});
	rounds.forEach((round) => {
		round.matches.forEach((match) => {
			if (match.player1 === currentPlayer || match.player2 === currentPlayer) {
				let newMatch = JSON.parse(JSON.stringify(match));
				newMatch.round = round.rid;
				matches.push(newMatch);
				if (match.player1 === currentPlayer) {
					const index = opps1.findIndex((opp1) => opp1.p == match.player2);
					opps1[index].e += 1;
				} else {
					const index = opps2.findIndex((opp2) => opp2.p == match.player1);
					opps2[index].e += 1;
				}
			}
		});
		opps1.forEach((item) => {
			if (item.e >= data.tournament.settings.challengeSame) {
				opponents1.push(item.p);
			}
		});
		opps2.forEach((item) => {
			if (item.e >= data.tournament.settings.challengeSame) {
				opponents2.push(item.p);
			}
		});
	});

	const getPlayerName = (pl) => {
		return _getPlayerName(pl, allPlayers);
	};
</script>

<div>
	<Heading tag="h5">Statistiken für {getPlayerName(currentPlayer)}</Heading>
	<br />
</div>

<div>
	<Heading tag="h6">Alle Matches</Heading>
	<br />
</div>

<Table shadow hoverable={true}>
	<TableHead>
		<TableHeadCell class="text-center">Spieltag</TableHeadCell>
		<TableHeadCell class="text-center">Datum</TableHeadCell>
		<TableHeadCell class="text-right">Spieler 1</TableHeadCell>
		<TableHeadCell class="text-center"></TableHeadCell>
		<TableHeadCell class="text-left">Spieler 2</TableHeadCell>
		<TableHeadCell class="text-center">Sätze</TableHeadCell>
		<TableHeadCell class="text-center">Flipper</TableHeadCell>
	</TableHead>
	<TableBody tableBodyClass="divide-y">
		{#if !matches.length}
			noch keine Matches
		{:else}
			{#each matches as match, i}
				<TableBodyRow>
					<TableBodyCell tdClass="text-center">
						{match.round}
					</TableBodyCell>
					<TableBodyCell tdClass="text-center">
						{mapDate(match.created)}
					</TableBodyCell>
					<TableBodyCell tdClass="text-right">
						<div
							style={match.score1 > match.score2
								? 'color:green; text-decoration:underline;'
								: 'color:default;'}
						>
							{getPlayerName(match.player1)}
						</div>
					</TableBodyCell>
					<TableBodyCell></TableBodyCell>
					<TableBodyCell tdClass="text-left">
						<div
							style={match.score1 < match.score2
								? 'color:green; text-decoration:underline;'
								: 'color:default;'}
						>
							{getPlayerName(match.player2)}
						</div>
					</TableBodyCell>
					<TableBodyCell tdClass="text-center">
						{match.score1 + ' - ' + match.score2}
					</TableBodyCell>
					<TableBodyCell tdClass="text-center">
						{getPinName(match.pin, data.pins)}
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		{/if}
	</TableBody>
</Table>
<br />

<div>
	<Heading tag="h6">Verfügbare Gegner</Heading>
	<br />
</div>

<Table shadow hoverable={true}>
	<TableHead>
		<TableHeadCell class="text-center">Als Herausforderer</TableHeadCell>
		<TableHeadCell class="text-center">Als Herausgeforderter</TableHeadCell>
	</TableHead>
	<TableBody tableBodyClass="divide-y">
		{#each tourPlayers as player}
			{#if player !== currentPlayer}
				<TableBodyRow>
					<TableBodyCell tdClass="text-center">
						{#if opponents1.includes(player)}
							<del>{getPlayerName(player)}</del>
						{:else}
							{getPlayerName(player)}
						{/if}
					</TableBodyCell>
					<TableBodyCell tdClass="text-center">
						{#if opponents2.includes(player)}
							<del>{getPlayerName(player)}</del>
						{:else}
							{getPlayerName(player)}
						{/if}
					</TableBodyCell>
				</TableBodyRow>
			{/if}
		{/each}
	</TableBody>
</Table>
