<script>
	import { Heading, P } from 'flowbite-svelte';
	import { Table, TableHead, TableBody } from 'flowbite-svelte';
	import { TableHeadCell, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
	import { page } from '$app/state';
	import { calcRanking as _calcRanking } from '$lib/MatchUtil';
	import { roundNumberToStrg } from '$lib/TypeUtil';
	import { getPlayerName } from '$lib/PlayerUtil';
	import { logInfo } from '$lib/LogUtil';

	let { data } = $props();

	const round = $derived(data.round);

	const players = data.players;
	const tournament = data.tournament;
	const tourCompleted = data.tournament.status === 'Completed';

	const getStrength = (id) => {
		const player = round.settings.rankInit.find((item) => item.player === id);
		return player.strength;
	};

	const getPlayerScoring = (playerID) => {
		const player1 = round.settings.rankInit.find((item) => item.player === playerID);
		const player2 = ranking.find((item) => item.player === playerID);
		return player2.points - player1.points;
	};

	const getCountMatches = (playerID) => {
		return round.matches.reduce((count, item) => {
			if (item.player1 === playerID || item.player2 === playerID) {
				count += 1;
			}
			return count;
		}, 0);
	};

	const getTotalCountMatches = (playerID) => {
		const entry = round.settings.rankInit.find((item) => item.player === playerID);
		return getCountMatches(playerID) + entry.matches;
	};

	const calcRanking = () => {
		let ranking = [];
		if (round) {
			if (round.status === 'Completed') {
				ranking = round.results.rankFinal;
			} else {
				ranking = _calcRanking(
					round.rid,
					round.settings.rankInit,
					round.matches,
					tournament.settings
				);
			}
		}
		return ranking;
	};

	let ranking = $state([]);
	ranking = calcRanking();
</script>

<div>
	<P>Spielername anklicken für Statistiken.</P>
	<br />
	<Heading tag="h5">{'Rangfolge' + (!tourCompleted ? ' Spieltag' : '')}</Heading>
	<br />

	<Table striped={true} shadow >
		<TableHead>
			<TableHeadCell></TableHeadCell>
			<TableHeadCell>Spieler</TableHeadCell>
			{#if !tourCompleted}
				<TableHeadCell class="text-center">Spiel<br />stärke</TableHeadCell>
			{/if}
			{#if !tourCompleted}
				<TableHeadCell class="text-center">Tendenz</TableHeadCell>
			{/if}
			<TableHeadCell class="text-center">Punkte</TableHeadCell>
			{#if !tourCompleted}
				<TableHeadCell class="text-center">Punkt<br />gewinn</TableHeadCell>
			{/if}
			{#if !tourCompleted}
				<TableHeadCell class="text-center">Matches<br />Spieltag</TableHeadCell>
			{/if}
			<TableHeadCell class="text-center">Matches<br />Gesamt</TableHeadCell>
		</TableHead>
		<TableBody tableBodyClass="divide-y">
			{#each ranking as rank, i}
				<TableBodyRow>
					<TableBodyCell>{i+1}</TableBodyCell>
					<TableBodyCell>
						<a href={'/liga/flipliga/' + page.params.id + '/statistics?player=' + rank.player}
							>{getPlayerName(rank.player, players)}</a
						>
					</TableBodyCell>
					{#if !tourCompleted}
						<TableBodyCell tdClass="text-center">
							{getStrength(rank.player)}
						</TableBodyCell>
					{/if}
					{#if !tourCompleted}
						<TableBodyCell tdClass="text-center">
							{#if rank.rankChange < 0}
								<div style="color:red">
									{rank.rankChange}
								</div>
							{:else if rank.rankChange > 0}
								<div style="color:green;">
									+{rank.rankChange}
								</div>
							{:else}
								<div style="color:default"></div>
							{/if}
						</TableBodyCell>
					{/if}
					<TableBodyCell tdClass="text-center">
						{roundNumberToStrg(rank.points)}
					</TableBodyCell>
					{#if !tourCompleted}
						<TableBodyCell tdClass="text-center">
							{roundNumberToStrg(getPlayerScoring(rank.player))}
						</TableBodyCell>
					{/if}
					{#if !tourCompleted}
						<TableBodyCell tdClass="text-center">
							{getCountMatches(rank.player)}
						</TableBodyCell>
					{/if}
					<TableBodyCell tdClass="text-center">
						{getTotalCountMatches(rank.player)}
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</div>
