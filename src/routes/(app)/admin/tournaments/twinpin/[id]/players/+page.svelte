<script>
	import { invalidateAll } from '$app/navigation';
	import Players from '$lib/components/Players.svelte';
	import { Card, Badge } from 'flowbite-svelte';
	import { mapTourStatus } from '$lib/TourUtil';

	let { data } = $props();

	const description = [
		'Hier kannst du neue Spieler zum Turnier hinzufügen.',
		'Klicke die Spieler an, die am Turnier teilnehmen sollen. Die Reihenfolge spielt keine Rolle.'
	];

	async function updatePlayers(players) {
		const response = await fetch('/api/tournament/' + data.tournament.id, {
			method: 'PUT',
			body: JSON.stringify({
				players: players
			}),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
		const result = await response.json();
		if (response.status !== 200) {
			alert(JSON.stringify(result));
			return false;
		} else {
			invalidateAll();
			return true;
		}
	}
</script>

<div class="space-y-6">
	<Card class="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 border-blue-200 dark:border-blue-700 w-full !p-3">
		<div class="space-y-2">
			<div class="flex items-center gap-3">
				<span class="text-lg font-bold text-gray-800 dark:text-white">{data.tournament.name}</span>
				<Badge color={data.tournament.status === 'Planned' ? 'yellow' : data.tournament.status === 'Active' ? 'green' : 'blue'}>{mapTourStatus(data.tournament.status)}</Badge>
			</div>
			{#if data.round}
				<hr class="border-blue-200 dark:border-blue-700" />
				<div class="flex items-center gap-3">
					<span class="text-sm text-gray-600 dark:text-gray-300"><span class="font-semibold">Runde</span> {data.round.rid}</span>
					<Badge color={data.round.status === 'Active' ? 'green' : 'blue'}>{mapTourStatus(data.round.status)}</Badge>
				</div>
			{/if}
		</div>
	</Card>

	<Players
		tournament={data.tournament}
		allPlayers={data.players}
		{description}
		addEnabled={data.tournament.status !== 'Completed' &&
			(!data.round || data.round.status !== 'Active')}
		delEnabled={data.tournament.status !== 'Completed' &&
			(!data.round || data.round.status !== 'Active')}
		update={updatePlayers}
		importFrom={''}
	/>
</div>
