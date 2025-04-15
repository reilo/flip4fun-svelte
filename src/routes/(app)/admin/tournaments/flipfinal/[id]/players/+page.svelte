<script>
	import { invalidateAll } from '$app/navigation';
	import Players from '$lib/components/Players.svelte';

	let { data } = $props();
	console.log(data);

	const description = [
		'Hier kannst du Spieler zum Liga-Finale hinzufügen.',
		'Klicke die Spieler in der Reihenfolge des finalen Liga-Rankings an.'
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
	tournaments={data.tournaments}
	allPlayers={data.players}
	{description}
	addEnabled={data.tournament.status === 'Planned'}
	delEnabled={data.tournament.status === 'Planned'}
	importFrom={"flipliga"}
	update={updatePlayers}
/>
