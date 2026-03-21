<script>
	import { outerWidth } from 'svelte/reactivity/window';
	import Matches from '$lib/components/flipliga/Matches.svelte';
	import Ranking from '$lib/components/flipliga/Ranking.svelte';
	import { Card, Badge } from 'flowbite-svelte';
	import TourBreadcrumb from '$lib/components/TourBreadcrumb.svelte';
	import { mapTourStatus } from '$lib/TourUtil';
	let { data } = $props();
	let tournament = $derived(data.tournament);
	let round = $derived(data.round);
</script>

<div class="space-y-4">
	<TourBreadcrumb {tournament} {round} />

	{#if outerWidth.current >= 1920}
		<div class="flex gap-4">
			<div class="flex-1"><Matches {data} /></div>
			<div class="flex-1"><Ranking {data} /></div>
		</div>
	{:else}
		<Matches {data} />
	{/if}
</div>
