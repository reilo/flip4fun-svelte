<script>
	import { outerWidth } from 'svelte/reactivity/window';
	import Matches from '$lib/components/flipliga/Matches.svelte';
	import Ranking from '$lib/components/flipliga/Ranking.svelte';
	import { Card, Badge } from 'flowbite-svelte';
	import { mapTourStatus } from '$lib/TourUtil';
	let { data } = $props();
	let tournament = $derived(data.tournament);
	let round = $derived(data.round);
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

	<Matches {data} />

	<!-- in full hd view show ranking too -->
	{#if outerWidth.current >= 1920}
		<Ranking {data} />
	{/if}
</div>
