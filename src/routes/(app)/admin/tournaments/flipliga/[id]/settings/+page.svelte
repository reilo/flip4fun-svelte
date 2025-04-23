<script>
	import { Button, NumberInput, Label } from 'flowbite-svelte';
	import { page } from '$app/state';

	let { data } = $props();

	const status = data.tournament.status;
	const settingsEnabled = status == 'Planned';
	let originalSettings = $state(data.tournament.settings);
	let settings = $state(data.tournament.settings);
	let changed = $derived(JSON.stringify(settings) !== JSON.stringify(originalSettings));
	let id = page.params.id;

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
			<span>Basispunkte für jeden Spieler zu Saisonbeginn</span>
			<NumberInput disabled={!settingsEnabled} min="30" max="60" bind:value={settings.baseline} />
		</Label>

		<Label class="mb-3">
			<span>Wie oft darf der gleiche Gegner je Saison gefordert werden</span>
			<NumberInput
				disabled={!settingsEnabled}
				min="1"
				max="3"
				bind:value={settings.challengeSame}
			/>
		</Label>

		<Label class="mb-3">
			<span>Bonuspunkt(e) für jedes absolvierte Match</span>
			<NumberInput disabled={!settingsEnabled} min="0" max="3" bind:value={settings.matchBonus} />
		</Label>
		
		<Label class="mb-3">
			<span>Strafpunkt(e) für Fehlmatches pro Spieltag</span>
			<NumberInput disabled={!settingsEnabled} min="-1" max="3" bind:value={settings.matchPenalty} />
		</Label>

		<Label class="mb-3">
			<span>Wie viele Matches muss ein Spieler pro Spieltag spielen?</span>
			<NumberInput disabled={!settingsEnabled} min="1" max="5" bind:value={settings.minMatchesRound} />
		</Label>

		<Label class="mb-3">
			<span>Ab welcher Runde erfolgen Punktabzüge?</span>
			<NumberInput disabled={!settingsEnabled} min="3" max="8" bind:value={settings.penaltyFirstRound} />
		</Label>

		{#if settingsEnabled}
			<Button disabled={!changed} on:click={updateSettings}>Speichern</Button>
			<Button disabled={!changed} on:click={restoreSettings}>Zurücksetzen</Button>
		{/if}
	</div>
</form>
