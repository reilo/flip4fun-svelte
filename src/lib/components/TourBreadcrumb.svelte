<script>
	import { Badge } from 'flowbite-svelte';
	import { mapTourStatus } from '$lib/TourUtil';

	let { tournament, round = null } = $props();
</script>

<div class="flex items-center gap-2 flex-wrap py-1.5 px-3 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-800 text-sm">
	<span class="font-semibold text-gray-800 dark:text-gray-100">{tournament.name}</span>
	<Badge color={tournament.status === 'Planned' ? 'yellow' : tournament.status === 'Active' ? 'green' : 'blue'}>
		{mapTourStatus(tournament.status)}
	</Badge>
	{#if round}
		<span class="text-gray-400 dark:text-gray-500 select-none">›</span>
		<span class="text-gray-600 dark:text-gray-300"><span class="font-medium">Runde</span> {round.rid}</span>
		<Badge color={round.status === 'Active' ? 'green' : 'blue'}>
			{mapTourStatus(round.status)}
		</Badge>
	{/if}
</div>
