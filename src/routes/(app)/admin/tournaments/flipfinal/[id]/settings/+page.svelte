<script>
	import { Button, NumberInput, Label, Select } from 'flowbite-svelte';
	import { page } from '$app/state';

	let { data } = $props();

	const status = data.tournament.status;
	const settingsEnabled = status == 'Planned';
	let originalSettings = $state(data.tournament.settings);
	let settings = $state(data.tournament.settings);
	let changed = $derived(JSON.stringify(settings) !== JSON.stringify(originalSettings));
	let id = page.params.id;

	let pinTypeOptions = [
		{ value: 0, name: 'beliebige Auswahl' },
		{ value: 1, name: 'genau ein DMD & ein Early' },
		{ value: 2, name: 'mindestens ein DMD' }
	];

	async function updateSettings() {
		const response = await fetch('/api/tournament/' + id, {
			method: 'PUT',
			body: JSON.stringify({
				settings: settings
			}),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
		let result = await response.json();
		if (response.status === 200) {
			originalSettings = JSON.parse(JSON.stringify(settings)); // triggers 'changed' update
			data.tournament.settings = JSON.parse(JSON.stringify(settings));
		} else {
			alert(JSON.stringify(result));
		}
	}
	const restoreSettings = () => {
		settings = data.tournament.settings;
	};
</script>

<form>
	<div>
		<Label class="mb-3">
			<span>Wieviele Spieler sollen in die oberste Ebene aufsteigen?</span>
			<NumberInput disabled={!settingsEnabled} min="3" max="4" bind:value={settings.numFinalists} />
		</Label>

		<Label class="mb-3">
			Welche Flipper-Kombination soll für jedes Double-Match gelost werden?
			<Select disabled={!settingsEnabled} class="mt-2" items={pinTypeOptions} bind:value={settings.pinTypes} />
		</Label>

		<Label class="mb-3">
			<span>Wie hoch soll der maximale Start-Bonus sein?</span>
			<NumberInput disabled={!settingsEnabled} min="0" max="5" bind:value={settings.maxStartBonus} />
		</Label>

		{#if settingsEnabled}
			<Button disabled={!changed} on:click={updateSettings}>Speichern</Button>
			<Button disabled={!changed} on:click={restoreSettings}>Zurücksetzen</Button>
		{/if}
	</div>
</form>
