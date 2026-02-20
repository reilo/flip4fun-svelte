<script>
	import { invalidateAll } from '$app/navigation';
	import Players from '$lib/components/Players.svelte';

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
