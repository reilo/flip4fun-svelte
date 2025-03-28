<script>
	import { Heading, Avatar } from 'flowbite-svelte';
	import { Table, TableHead, TableBody } from 'flowbite-svelte';
	import { TableHeadCell, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
	import { ArrowUpOutline, ArrowDownOutline, ArrowsRepeatOutline } from 'flowbite-svelte-icons';
	import { page } from '$app/stores';
	import { calcRanking as _calcRanking } from '$lib/MatchUtil';
	import { getPlayerName } from '$lib/PlayerUtil';

	let { data } = $props();
	const players = data.players;
	const round = data.round;
	const tournament = data.tournament;

	const getStrength = (id) => {
		const player = round.settings.rankInit.find((item) => item.player === id);
		return player.strength;
	};

	const getPlayerRankChange = (id) => {
		const rank1 = round.settings.rankInit.findIndex((item) => item.player === id);
		const rank2 = ranking.findIndex((item) => item.player === id);
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
		const player1 = round.settings.rankInit.find((item) => item.player === id);
		const player2 = ranking.find((item) => item.player === id);
		return player2.points - player1.points;
	};

	const getCountMatches = (id) => {
		return round.matches.reduce((count, item) => {
			if (item.player1 === id || item.player2 === id) {
				count += 1;
			}
			return count;
		}, 0);
	};

	const getTotalCountMatches = (id) => {
		const entry = round.settings.rankInit.find((item) => item.player === id);
		return getCountMatches(id) + entry.matches;
	};

	const roundNumber = (num) => {
		return (Math.round(num * 10) / 10).toFixed(1);
	};

	const calcRanking = () => {
		let ranking = [];
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
		return ranking;
	};

	let ranking = $state([]);
	ranking = calcRanking();
</script>

<div>
	<Heading tag="h5">Rangfolge</Heading>
	<br />

	<Table shadow hoverable={true}>
		<TableHead>
			<!--TableHeadCell></TableHeadCell-->
			<TableHeadCell>Spieler</TableHeadCell>
			<TableHeadCell class="text-center">Spielstärke</TableHeadCell>
			<!--TableHeadCell>Tendenz</TableHeadCell-->
			<TableHeadCell class="text-center">Tendenz</TableHeadCell>
			<TableHeadCell class="text-center">Punkte</TableHeadCell>
			<TableHeadCell class="text-center">Punkte<br />gewinn</TableHeadCell>
			<TableHeadCell class="text-center">Matches<br />Spieltag</TableHeadCell>
			<TableHeadCell class="text-center">Matches<br />Gesamt</TableHeadCell>
		</TableHead>
		<TableBody tableBodyClass="divide-y">
			{#each ranking as rank, i}
				<TableBodyRow>
					<!--TableBodyCell>
						{#if rank.rankChange < 0}
							<Avatar
								alt={rank.player}
								src={import.meta.env.VITE_IMAGE_DIR + rank.player + '.jpg'}
								dot={{ color: 'red' }}
							/>
						{:else if rank.rankChange > 0}
							<Avatar
								alt={rank.player}
								src={import.meta.env.VITE_IMAGE_DIR + rank.player + '.jpg'}
								dot={{ color: 'green' }}
							/>
						{:else}
							<Avatar
								alt={rank.player}
								src={import.meta.env.VITE_IMAGE_DIR + rank.player + '.jpg'}
								dot={{}}
							/>
						{/if}
					</TableBodyCell-->
					<TableBodyCell>
						<a href={'/liga/flipliga/' + $page.params.id + '/statistics/' + rank.player}
							>{getPlayerName(rank.player, players)}</a
						>
					</TableBodyCell>
					<TableBodyCell tdClass="text-center">
						{getStrength(rank.player)}
					</TableBodyCell>
					<!--TableBodyCell>
						{#if rank.rankChange < 0}
						<div style=color:red>
							<ArrowDownOutline class="w-5 h-5" />
						</div>
						{:else if rank.rankChange > 0}
						<div style='color:green;'>
							<ArrowUpOutline class="w-5 h-5" />
						</div>
						{:else}
						<div style=color:default>
							<!--ArrowsRepeatOutline class="w-5 h-5" />
						</div>
						{/if}
					</TableBodyCell-->
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
					<TableBodyCell tdClass="text-center">
						{roundNumber(rank.points)}
					</TableBodyCell>
					<TableBodyCell tdClass="text-center">
						{roundNumber(getPlayerScoring(rank.player))}
					</TableBodyCell>
					<TableBodyCell tdClass="text-center">
						{getCountMatches(rank.player)}
					</TableBodyCell>
					<TableBodyCell tdClass="text-center">
						{getTotalCountMatches(rank.player)}
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</div>
