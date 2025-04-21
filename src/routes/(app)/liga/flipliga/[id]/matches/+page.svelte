<script>
	import { outerWidth } from 'svelte/reactivity/window';
	import Matches from '$lib/components/flipliga/Matches.svelte';
	import Ranking from '$lib/components/flipliga/Ranking.svelte';
	let { data } = $props();
</script>

<Matches {data} />

<!-- in full hd view show ranking too -->
{#if outerWidth.current >= 1920}
	<Ranking {data} />
{/if}
