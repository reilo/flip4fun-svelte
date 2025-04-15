<script>
	import { invalidateAll } from '$app/navigation';
	import Players from '$lib/components/Players.svelte';

	let { data } = $props();

	const description = [
		'Hier kannst du neue Spieler zur Liga hinzufügen.',
		'Zum Ligastart klicke die Spieler in der Reihenfolge an, wie sie beim Start-Turnier ermittelt wurde.',
		'Neue Spieler kannst du hier jederzeit ergänzen, diese werden aber erst zum Start des nächsten Spieltages berücksichtigt.'
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
	addEnabled={data.tournament.status !== 'Completed'}
	delEnabled={data.tournament.status === 'Planned'}
	update={updatePlayers}
/>
