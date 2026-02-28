<script>
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

	<Ranking {data} />
</div>
