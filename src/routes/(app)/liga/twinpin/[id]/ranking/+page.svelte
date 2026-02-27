<script>
	import { Card, Badge } from 'flowbite-svelte';
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
	<Card class="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 border-blue-200 dark:border-blue-700 w-full !p-3">
		<div class="space-y-2">
			<div class="flex items-center gap-3">
				<span class="text-lg font-bold text-gray-800 dark:text-white">{tournament.name}</span>
				<Badge color={tournament.status === 'Planned' ? 'yellow' : tournament.status === 'Active' ? 'green' : 'blue'}>{mapTourStatus(tournament.status)}</Badge>
			</div>
			{#if round}
				<hr class="border-blue-200 dark:border-blue-700" />
				<div class="flex items-center gap-3">
					<span class="text-sm text-gray-600 dark:text-gray-300"><span class="font-semibold">Runde</span> {round.rid}</span>
					<Badge color={round.status === 'Active' ? 'green' : 'blue'}>{mapTourStatus(round.status)}</Badge>
				</div>
			{/if}
		</div>
	</Card>

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
				class:bg-gray-50={i % 2 === 1}
				class:dark:bg-gray-700={i % 2 === 1}
			>
				<div class="px-3 py-2 text-sm text-center text-gray-700 dark:text-gray-300">{i + 1}</div>
				<div class="px-3 py-2 text-sm {active ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}">{getPlayerName(rank.player, players)}</div>
				<div class="px-3 py-2 text-sm text-right font-mono {active ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}">{rank.score}</div>
			</div>
		{/each}
	</div>
</div>