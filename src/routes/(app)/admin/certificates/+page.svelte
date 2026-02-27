<script>
	import { Button, Label, Select, Input } from 'flowbite-svelte';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';
	import { generateCertificatePDF } from '$lib/PDFCertUtil';

	let { data } = $props();

	let selPlayer = $state('');
	let tourName = $state('Isar-Amper-Liga ' + new Date().getFullYear());
	let rankName = $state('1. Platz');
	let line1 = $state('Wir gratulieren zur hervorragenden Leistung');
	let line2 = $state('und überreichen die Urkunde an');

	const ranks = [
		'1. Platz',
		'2. Platz',
		'3. Platz',
		'Aktivster Spieler',
		'Aktivste Spielerin',
		'Bester Newcomer'
	];

	const generateCertificates = () => {
		const title = tourName;
		const version = rankName;
		const playerName = selPlayer
			? playerMap.find((p) => p.value === selPlayer)?.name
			: 'Max Mustermann';
		const lines = [line1, line2];

		generateCertificatePDF(title, [version], lines, [playerName]);
	};

	let playerMap = [];
	data.players.forEach((player) => {
		if (player.active) {
			const name = player.forename + ' ' + player.surname;
			playerMap.push({ name: name, value: player.id });
		}
	});
	playerMap.sort((a, b) => {
		const val = a.name > b.name ? 1 : b.name > a.name ? -1 : 0;
		return val;
	});
</script>

<div class="space-y-4">

	<p class="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">Urkundendaten</p>

	<div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-5 space-y-4">
		<div class="grid gap-4 md:grid-cols-2">
			<Label class="space-y-2">
				<span class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Turnier-Name</span>
				<Input clearable bind:value={tourName} placeholder="" />
			</Label>
			<Label class="space-y-2">
				<span class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Titel / Platzierung</span>
				<Input clearable bind:value={rankName} placeholder="" />
			</Label>
		</div>

		<Label class="space-y-2">
			<span class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Spieler</span>
			<Select
				class="p-3 text-sm"
				items={playerMap}
				bind:value={selPlayer}
				placeholder="Spieler auswählen …"
			/>
		</Label>

		<hr class="border-gray-200 dark:border-gray-700" />

		<Label class="space-y-2">
			<span class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Zeile 1</span>
			<Input clearable bind:value={line1} placeholder="" />
		</Label>

		<Label class="space-y-2">
			<span class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Zeile 2</span>
			<Input clearable bind:value={line2} placeholder="" />
		</Label>
	</div>

	<Button on:click={() => generateCertificates()}>
		Generiere PDF <ArrowRightOutline class="w-3.5 h-3.5 ml-2 text-white" />
	</Button>

</div>
