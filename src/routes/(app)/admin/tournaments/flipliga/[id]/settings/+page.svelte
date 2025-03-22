<script>
	import { Button, NumberInput, Label } from 'flowbite-svelte';
	import { page } from '$app/stores';

	let { data } = $props();

	const status = data.tournament.status;
	const settingsEnabled = status == 'Planned';
	let originalSettings = $state(data.tournament.settings);
	let settings = $state(data.tournament.settings);
	let changed = $derived(JSON.stringify(settings) !== JSON.stringify(originalSettings));
	let id = $page.params.id;

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
			originalSettings = JSON.parse(JSON.stringify(settings));
		} else {
			alert(JSON.stringify(result));
		}
	}

</script>

<form>
	<div>
		<Label>
			<span>Basispunkte für jeden Spieler zu Saisonbeginn</span>
			<NumberInput disabled={!settingsEnabled} min="30" max="60" bind:value={settings.baseline} />
		</Label>
		<br />

		<Label>
			<span>Wie oft darf der gleiche Gegner je Saison gefordert werden</span>
			<NumberInput disabled={!settingsEnabled} min="1" max="3" bind:value={settings.challengeSame} />
		</Label>
		<br />

		<Label>
			<span>Bonuspunkte für jedes absolvierte Match</span>
			<NumberInput disabled={!settingsEnabled} min="0" max="3" bind:value={settings.matchBonus} />
		</Label>
		<br />

		<Label>
			<span>Wie viele Matches muss ein Spieler pro Spieltag spielen?</span>
			<NumberInput disabled={!settingsEnabled} min="1" max="3" bind:value={settings.minMatches} />
		</Label>
		<br />

		<Label>
			<span>Ab welcher Runde erfolgen Matchabzüge?</span>
			<NumberInput disabled={!settingsEnabled} min="3" max="8" bind:value={settings.minRound} />
		</Label>
		<br />

		{#if settingsEnabled}
			<Button disabled={!changed} on:click={updateSettings}>Speichern</Button>
		{/if}
	</div>
</form>
