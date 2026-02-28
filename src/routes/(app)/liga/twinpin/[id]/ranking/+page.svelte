<script>
	import { Card, Badge } from 'flowbite-svelte';
	import TourBreadcrumb from '$lib/components/TourBreadcrumb.svelte';
	import { getPlayerName } from '$lib/PlayerUtil';
	import { calcTwinpinRanking, mapTourStatus } from '$lib/TourUtil';

	let { data } = $props();

	let tournament = $derived(data.tournament);
	let round = $derived(data.round);
	let rounds = $derived(data.rounds);
	let players = $derived(data.players);

	let progress = $derived(round && round.status === 'Active');
	let title = "Aktuelle Rangfolge";

	let ranking = $derived(
		!round
			? tournament.players.map((p) => ({ player: p, score: 0 }))
			: calcTwinpinRanking(rounds)
	);

</script>

<div class="space-y-4">
	<TourBreadcrumb {tournament} {round} />

	<p class="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">{title}</p>

	<div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
		<div class="grid grid-cols-[3rem_1fr_6rem] bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
			<div class="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-center">#</div>
			<div class="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Spieler</div>
			<div class="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-right">Punkte</div>
		</div>
		{#each ranking as rank, i}
			{@const active = tournament.players.includes(rank.player)}
			<div
				class="grid grid-cols-[3rem_1fr_6rem] items-center border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors hover:bg-blue-50 dark:hover:bg-blue-950"
				class:bg-gray-100={i % 2 === 1}
				class:dark:bg-gray-700={i % 2 === 1}
			>
				<div class="px-3 py-2 text-sm text-center text-gray-700 dark:text-gray-300">{i + 1}</div>
				<div class="px-3 py-2 text-sm {active ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}">{getPlayerName(rank.player, players)}</div>
				<div class="px-3 py-2 text-sm text-right font-mono {active ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}">{rank.score}</div>
			</div>
		{/each}
	</div>
</div>