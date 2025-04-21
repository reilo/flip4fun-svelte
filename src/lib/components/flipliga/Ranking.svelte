<script>
	import { Heading, P, Spinner } from 'flowbite-svelte';
	import { Table, TableHead, TableBody } from 'flowbite-svelte';
	import { TableHeadCell, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
	import { page } from '$app/state';
	import { afterNavigate } from '$app/navigation';
	import { innerWidth } from 'svelte/reactivity/window';
	import { calcRanking as _calcRanking } from '$lib/MatchUtil';
	import { roundNumberToStrg } from '$lib/TypeUtil';
	import { calcStrength } from '$lib/TourUtil';
	import { getPlayerName } from '$lib/PlayerUtil';
	import { logInfo } from '$lib/LogUtil';

	let { data } = $props();

	let showProgress = $state(-1);

	let isPhone = $derived(innerWidth.current <= 480);
	let round = $derived(data.round);

	const py = 'py-1.5';

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

	const getRowColor = (i) => {
		return calcStrength(i + 1, 50) % 2
			? 'bg-gray-100 dark:bg-gray-700'
			: 'bg-white dark:bg-gray-800';
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

	let ranking = $derived(calcRanking());

	afterNavigate(async () => {
		showProgress = -1;
	});
</script>

<div>
	<Heading tag="h5">{'Rangfolge' + (!tourCompleted ? ' Spieltag' : '')}</Heading>
	<P>Spielername anklicken für Statistiken.</P>
	<br />

	<Table shadow hoverable={true}>
		<TableHead>
			<TableHeadCell></TableHeadCell>
			<TableHeadCell>Spieler</TableHeadCell>
			{#if !tourCompleted && !isPhone}
				<TableHeadCell class="text-center">Spiel<br />stärke</TableHeadCell>
			{/if}
			{#if !tourCompleted && !isPhone}
				<TableHeadCell class="text-center">Tendenz</TableHeadCell>
			{/if}
			<TableHeadCell class="text-center">Punkte</TableHeadCell>
			{#if !tourCompleted && !isPhone}
				<TableHeadCell class="text-center">Punkt<br />gewinn</TableHeadCell>
			{/if}
			{#if !tourCompleted && !isPhone}
				<TableHeadCell class="text-center">Matches<br />Spieltag</TableHeadCell>
			{/if}
			{#if !isPhone}
				<TableHeadCell class="text-center">Matches<br />Gesamt</TableHeadCell>
			{/if}
		</TableHead>
		<TableBody tableBodyClass="divide-y">
			{#each ranking as rank, i}
				<TableBodyRow class={getRowColor(i)}>
					<TableBodyCell class={py}>{i + 1}</TableBodyCell>
					<TableBodyCell class={py}>
						<a
							href={'/liga/flipliga/' + page.params.id + '/statistics?player=' + rank.player}
							onclick={() => (showProgress = i)}>{getPlayerName(rank.player, players)}</a
						>
						<Spinner size="4" class={showProgress === i ? '' : 'hidden'} />
					</TableBodyCell>
					{#if !tourCompleted && !isPhone}
						<TableBodyCell class={py} tdClass="text-center">
							{getStrength(rank.player)}
						</TableBodyCell>
					{/if}
					{#if !tourCompleted && !isPhone}
						<TableBodyCell class={py} tdClass="text-center">
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
					<TableBodyCell class={py} tdClass="text-center">
						{roundNumberToStrg(rank.points)}
					</TableBodyCell>
					{#if !tourCompleted && !isPhone}
						<TableBodyCell class={py} tdClass="text-center">
							{roundNumberToStrg(getPlayerScoring(rank.player))}
						</TableBodyCell>
					{/if}
					{#if !tourCompleted && !isPhone}
						<TableBodyCell class={py} tdClass="text-center">
							{getCountMatches(rank.player)}
						</TableBodyCell>
					{/if}
					{#if !isPhone}
						<TableBodyCell class={py} tdClass="text-center">
							{getTotalCountMatches(rank.player)}
						</TableBodyCell>
					{/if}
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</div>
