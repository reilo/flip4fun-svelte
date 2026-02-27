<script>
	import { Button, NumberInput, Select, Card, Badge } from 'flowbite-svelte';
	import { page } from '$app/state';
	import { mapTourStatus } from '$lib/TourUtil';

	let { data } = $props();

	let tournament = data.tournament;
	let round = data.round ?? null;
	const tourStatus = tournament.status;
	const roundStatus = round?.status ?? null;

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

<form>
	<Card class="!p-3">
		<p class="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">Einstellungen</p>
		<div class="divide-y divide-gray-100 dark:divide-gray-700">
			<div class="flex items-center justify-between gap-4 py-2.5">
				<label for="numFinalists" class="text-sm text-gray-700 dark:text-gray-300">Wieviele Spieler sollen in die oberste Ebene aufsteigen?</label>
				<NumberInput id="numFinalists" disabled={!isEditable('numFinalists')} min="3" max="4" bind:value={settings.numFinalists} class="w-20 text-center" />
			</div>
			<div class="flex items-center justify-between gap-4 py-2.5">
				<label for="pinTypes" class="text-sm text-gray-700 dark:text-gray-300">Welche Flipper-Kombination soll für jedes Double-Match gelost werden?</label>
				<Select id="pinTypes" disabled={!isEditable('pinTypes')} class="w-56" items={pinTypeOptions} bind:value={settings.pinTypes} />
			</div>
			<div class="flex items-center justify-between gap-4 py-2.5">
				<label for="maxStartBonus" class="text-sm text-gray-700 dark:text-gray-300">Wie hoch soll der maximale Start-Bonus sein?</label>
				<NumberInput id="maxStartBonus" disabled={!isEditable('maxStartBonus')} min="0" max="5" bind:value={settings.maxStartBonus} class="w-20 text-center" />
			</div>
		</div>
		{#if anyEditable}
			<div class="flex gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
				<Button size="sm" disabled={!changed} on:click={updateSettings}>Speichern</Button>
				<Button size="sm" color="alternative" disabled={!changed} on:click={restoreSettings}>Zurücksetzen</Button>
			</div>
		{/if}
	</Card>
</form>
</div>
