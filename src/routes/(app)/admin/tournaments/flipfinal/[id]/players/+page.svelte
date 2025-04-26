<script>
	import { Table, TableHead, TableBody } from 'flowbite-svelte';
	import { TableHeadCell, TableBodyRow, TableBodyCell } from 'flowbite-svelte';
	import { Checkbox } from 'flowbite-svelte';
	import { invalidateAll } from '$app/navigation';
	import { getPlayerName } from '$lib/PlayerUtil';
	import Players from '$lib/components/Players.svelte';

	let { data } = $props();

	let tournament = $derived(data.tournament);
	let settings = $derived(tournament.settings);
	let allPlayers = $derived(data.players);

	const settingsEnabled = $derived(tournament.status === 'Planned');

	const py = 'py-1';

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
	<Table shadow hoverable={true}>
		<TableHead>
			<TableHeadCell>Name</TableHeadCell>
			<TableHeadCell>Aktiv</TableHeadCell>
		</TableHead>
		<TableBody tableBodyClass="divide-y">
			{#each tournament.players as player, i}
				<TableBodyRow>
					<TableBodyCell class={py}>{getPlayerName(player, allPlayers)}</TableBodyCell>
					<TableBodyCell class={py}>
						{#if !settings.inactivePlayers.includes(player)}
							<Checkbox
								checked
								disabled={!settingsEnabled}
								on:change={() => updatePlayerStatus(player, false)}
							/>
						{:else}
							<Checkbox
								disabled={!settingsEnabled}
								on:change={() => updatePlayerStatus(player, true)}
							/>
						{/if}
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
{/if}
