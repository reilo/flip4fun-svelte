<script>
	import { Button, Label } from 'flowbite-svelte';
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
			<span>Es gibt noch keine Einstellungen für dieses Turnier.</span>
		</Label>

		{#if true/*settingsEnabled*/}
			<Button disabled={!changed} on:click={updateSettings}>Speichern</Button>
			<Button disabled={!changed} on:click={restoreSettings}>Zurücksetzen</Button>
		{/if}
	</div>
</form>
