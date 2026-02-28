<script>
	import { Checkbox, Card, Badge } from 'flowbite-svelte';
	import { mapTourStatus } from '$lib/TourUtil';
	import { invalidateAll } from '$app/navigation';
	import { getPlayerName } from '$lib/PlayerUtil';
	import Players from '$lib/components/Players.svelte';

	let { data } = $props();

	let tournament = $derived(data.tournament);
	let round = $derived(data.round);
	let settings = $derived(tournament.settings);
	let allPlayers = $derived(data.players);

	const playersEnabled = $derived(tournament.status !== 'Completed' && (!round || round.status === 'Completed'));

	const description = [
		'Hier kannst du Spieler zum Liga-Finale hinzufügen.',
		'Klicke die Spieler in der Reihenfolge des finalen Liga-Rankings an.',
		'Oder besser noch, importiere die Liste direkt aus der vorangegangenen Liga.'
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

	async function updatePlayerStatus(player, active) {
		const url = '/api/tournament/' + tournament.id;
		const idx = settings.inactivePlayers.indexOf(player);
		if (active) {
			if (idx > -1) {
				settings.inactivePlayers.splice(idx, 1);
			}
		} else {
			if (idx === -1) {
				settings.inactivePlayers.push(player);
			}
		}
		const response = await fetch(url, {
			method: 'PUT',
			body: JSON.stringify({
				active: active,
				settings: settings
			}),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
		const result = await response.json();
		if (response.status !== 200) {
			alert(JSON.stringify(result));
		} else {
			invalidateAll();
		}
	}
</script>

<div class="space-y-6">
	<!-- Status Summary -->
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

{#if tournament.status === 'Planned'}
	<Players
		tournament={data.tournament}
		tournaments={data.tournaments}
		allPlayers={data.players}
		{description}
		addEnabled={data.tournament.status === 'Planned'}
		delEnabled={data.tournament.status === 'Planned'}
		importFrom={'flipliga'}
		update={updatePlayers}
	/>
{:else}
	<div>
		<p class="text-sm text-gray-500 dark:text-gray-400 mb-3">Deaktiviere alle nicht anwesenden Spieler. Jeder Klick wird sofort gespeichert.</p>
		<div class="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
			<div class="grid grid-cols-[1fr_auto] text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800 px-3 py-2 border-b border-gray-200 dark:border-gray-700">
				<span>Name</span>
				<span>Aktiv</span>
			</div>
			{#each tournament.players as player, i}
				<div
					class="grid grid-cols-[1fr_auto] items-center px-3 py-1.5 text-sm"
					class:bg-white={i % 2 === 0}
					class:dark:bg-gray-900={i % 2 === 0}
					class:bg-gray-100={i % 2 !== 0}
					class:dark:bg-gray-800={i % 2 !== 0}
				>
					<span class="text-gray-800 dark:text-gray-200">{getPlayerName(player, allPlayers)}</span>
					<Checkbox
						checked={!settings.inactivePlayers.includes(player)}
						disabled={!playersEnabled}
						on:change={(e) => updatePlayerStatus(player, e.target.checked)}
					/>
				</div>
			{/each}
		</div>
	</div>
{/if}
</div>
