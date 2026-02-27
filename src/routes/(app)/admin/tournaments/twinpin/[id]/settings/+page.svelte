<script>
	import { Button, Checkbox, Card, Badge } from 'flowbite-svelte';
	import { page } from '$app/state';
	import { mapTourStatus } from '$lib/TourUtil';

	let { data } = $props();

	let tournament = data.tournament;
	let round = data.round ?? null;
	const tourStatus = tournament.status;
	const roundStatus = round?.status ?? null;

	const settingsRules = {
		allowBye: { tourStatus: ['Planned', 'Active'], roundStatus: [null, 'Completed'] }
	};

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
			<div class="flex items-center gap-3 py-2.5">
				<Checkbox id="allowBye" disabled={!isEditable('allowBye')} bind:checked={settings.allowBye} />
				<label for="allowBye" class="text-sm text-gray-700 dark:text-gray-300">Freilos erlauben bei 4n+1 Teilnehmern</label>
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
