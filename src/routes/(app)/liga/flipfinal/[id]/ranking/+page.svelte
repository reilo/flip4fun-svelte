<script>
	import { Card, Badge } from 'flowbite-svelte';
	import TourBreadcrumb from '$lib/components/TourBreadcrumb.svelte';
	import { getPlayerName } from '$lib/PlayerUtil';
	import { calcInitialLevels, mapTourStatus } from '$lib/TourUtil';

	let { data } = $props();

	let tournament = $derived(data.tournament);
	let round = $derived(data.round);
	let players = $derived(data.players);

	let progress = $derived(round && round.status === 'Active');
	let title = $derived(
		!round
			? 'Rangfolge Turnierbeginn'
			: (progress ? 'Rangfolge Beginn Runde ' : 'Rangfolge Ende Runde ') + round.rid.toString()
	);

	let ranking = $derived(
		!round
			? calcInitialLevels(tournament.players, tournament.settings.maxStartBonus)
			: progress
				? round.settings.rankInit
				: round.results.rankFinal
	);

</script>

<div class="space-y-4">
	<TourBreadcrumb {tournament} {round} />

	<p class="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">{title}</p>

	<div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
		<div class="grid grid-cols-[3rem_1fr_8rem] bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
			<div class="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-center">#</div>
			<div class="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Spieler</div>
			<div class="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-center">Feinwertung</div>
		</div>
		{#each ranking.slice().reverse() as level, i}
			{#each level.players as player, j}
				{@const active = round && round.players.includes(player.id)}
				{@const pos = ranking.length - 1 - i}
				<div
					class="grid grid-cols-[3rem_1fr_8rem] items-center border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors hover:bg-blue-50 dark:hover:bg-blue-950"
					class:bg-gray-100={i % 2 === 1}
					class:dark:bg-gray-700={i % 2 === 1}
				>
					<div class="px-3 py-2 text-sm text-center text-gray-700 dark:text-gray-300">{pos + 1}</div>
					<div class="px-3 py-2 text-sm {active ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}">{getPlayerName(player.id, players)}</div>
					<div class="px-3 py-2 text-sm text-center font-mono {active ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}">{player.fine.toFixed(2)}</div>
				</div>
			{/each}
		{/each}
	</div>
</div>