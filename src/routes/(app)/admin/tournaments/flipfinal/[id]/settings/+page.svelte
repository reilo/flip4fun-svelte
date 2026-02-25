<script>
	import { Button, NumberInput, Label, Select } from 'flowbite-svelte';
	import { page } from '$app/state';

	let { data } = $props();

	const tourStatus = data.tournament.status;
	const roundStatus = data.round?.status ?? null;

	/**
	 * Per-setting editability rules.
	 * Each key corresponds to a setting property.
	 * `tourStatus` defines in which tournament statuses the setting is editable.
	 * `roundStatus` (optional) additionally restricts to specific round statuses.
	 *   - If omitted or null, the round status is not checked.
	 *   - Use [null] to require that no round exists yet.
	 *   - Use [null, 'Completed'] to allow editing when no round exists OR round is completed.
	 */
	const settingsRules = {
		numFinalists:  { tourStatus: ['Planned', 'Active'], roundStatus: [null, 'Completed'] },
		pinTypes:      { tourStatus: ['Planned', 'Active'], roundStatus: [null, 'Completed'] },
		maxStartBonus: { tourStatus: ['Planned'] }
	};

	/** Check if a specific setting is editable based on current tournament/round status */
	function isEditable(settingKey) {
		const rule = settingsRules[settingKey];
		if (!rule) return false;
		if (!rule.tourStatus.includes(tourStatus)) return false;
		if (rule.roundStatus && !rule.roundStatus.includes(roundStatus)) return false;
		return true;
	}

	const anyEditable = Object.keys(settingsRules).some(isEditable);

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
			<NumberInput disabled={!isEditable('numFinalists')} min="3" max="4" bind:value={settings.numFinalists} />
		</Label>

		<Label class="mb-3">
			Welche Flipper-Kombination soll für jedes Double-Match gelost werden?
			<Select disabled={!isEditable('pinTypes')} class="mt-2" items={pinTypeOptions} bind:value={settings.pinTypes} />
		</Label>

		<Label class="mb-3">
			<span>Wie hoch soll der maximale Start-Bonus sein?</span>
			<NumberInput disabled={!isEditable('maxStartBonus')} min="0" max="5" bind:value={settings.maxStartBonus} />
		</Label>

		{#if anyEditable}
			<Button disabled={!changed} on:click={updateSettings}>Speichern</Button>
			<Button disabled={!changed} on:click={restoreSettings}>Zurücksetzen</Button>
		{/if}
	</div>
</form>
