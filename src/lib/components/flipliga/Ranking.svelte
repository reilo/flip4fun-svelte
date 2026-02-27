<script>
	import { Spinner } from 'flowbite-svelte';
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

	const getOldStrength = (id) => {
		const player = round.settings.rankInit.find((item) => item.player === id);
		return player.strength;
	};

	const getNewStrength = (id) => {
		const index = ranking.findIndex((item) => item.player === id);
		if (index >= 0) {
			return calcStrength(index + 1, ranking.length);
		}
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

	let cols = $derived(
		isPhone
			? 'grid-cols-[3rem_1fr_5rem]'
			: tourCompleted
				? 'grid-cols-[3rem_1fr_6rem_7rem]'
				: 'grid-cols-[3rem_4rem_1fr_5rem_6rem_6rem_6rem_6rem]'
	);

	afterNavigate(async () => {
		showProgress = -1;
	});
</script>

<div class="space-y-2">
	<p class="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">{'Rangfolge' + (!tourCompleted ? ' Spieltag' : '')}</p>
	<p class="text-xs text-gray-400 dark:text-gray-500">Spielername anklicken für Statistiken.</p>

	<div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
		<!-- Header -->
		<div class="grid {cols} bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
			<div class="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-center">#</div>
			{#if !tourCompleted && !isPhone}
				<div class="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-center">Δ</div>
			{/if}
			<div class="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Spieler</div>
			{#if !tourCompleted && !isPhone}
				<div class="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-center">Stärke</div>
			{/if}
			<div class="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-center">Punkte</div>
			{#if !tourCompleted && !isPhone}
				<div class="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-center">Pkt±</div>
				<div class="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-center">M Tag</div>
			{/if}
			{#if !isPhone}
				<div class="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-center">M Ges.</div>
			{/if}
		</div>
		<!-- Rows -->
		{#each ranking as rank, i}
			<div
				class="grid {cols} items-center border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors hover:bg-blue-50 dark:hover:bg-blue-950"
				class:bg-gray-50={i % 2 === 1}
				class:dark:bg-gray-700={i % 2 === 1}
			>
				<div class="px-3 py-2 text-sm text-center text-gray-700 dark:text-gray-300">{i + 1}</div>
				{#if !tourCompleted && !isPhone}
					<div class="px-3 py-2 text-xs text-center font-semibold {rank.rankChange < 0 ? 'text-red-500' : rank.rankChange > 0 ? 'text-green-500' : 'text-gray-400'}">
						{rank.rankChange > 0 ? '+' : ''}{rank.rankChange !== 0 ? rank.rankChange : '—'}
					</div>
				{/if}
				<div class="px-3 py-2 text-sm">
					<a
						href={'/liga/flipliga/' + page.params.id + '/statistics/player?player=' + rank.player}
						class="text-blue-600 dark:text-blue-400 hover:underline"
						onclick={() => (showProgress = i)}>{getPlayerName(rank.player, players)}</a>
					<Spinner size="4" class={showProgress === i ? 'inline ml-1' : 'hidden'} />
				</div>
				{#if !tourCompleted && !isPhone}
					<div class="px-3 py-2 text-sm text-center text-gray-600 dark:text-gray-300">{getOldStrength(rank.player)}</div>
				{/if}
				<div class="px-3 py-2 text-sm text-center font-mono text-gray-900 dark:text-white">{roundNumberToStrg(rank.points)}</div>
				{#if !tourCompleted && !isPhone}
					<div class="px-3 py-2 text-sm text-center font-mono {getPlayerScoring(rank.player) > 0 ? 'text-green-600' : getPlayerScoring(rank.player) < 0 ? 'text-red-500' : 'text-gray-400'}">
						{roundNumberToStrg(getPlayerScoring(rank.player))}
					</div>
					<div class="px-3 py-2 text-sm text-center text-gray-600 dark:text-gray-300">{getCountMatches(rank.player)}</div>
				{/if}
				{#if !isPhone}
					<div class="px-3 py-2 text-sm text-center text-gray-600 dark:text-gray-300">{getTotalCountMatches(rank.player)}</div>
				{/if}
			</div>
		{/each}
	</div>
</div>
