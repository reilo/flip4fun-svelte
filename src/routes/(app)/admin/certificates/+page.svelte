<script>
	import { Button } from 'flowbite-svelte';
	import { Heading } from 'flowbite-svelte';
	import { Label } from 'flowbite-svelte';
	import { Select } from 'flowbite-svelte';
	import { Input } from 'flowbite-svelte';
	import { P } from 'flowbite-svelte';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';
	import { generateCertificatePDF } from '$lib/PDFUtil';

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

<div>
	<Heading tag="h5">Urkunden-PDF generieren</Heading>

	<P class="mb-3">Gebe alle Daten ein und generiere die Urkunde.</P>

	<div class="grid gap-6 mb-3 md:grid-cols-2">
		<Label class="space-y-2">
			<span>Turnier-Name</span>
			<Input clearable bind:value={tourName} placeholder="" />
		</Label>
	</div>

	<div class="grid gap-6 mb-3 md:grid-cols-2">
		<Label class="space-y-2">
			<span>Titel / Platzierung</span>
			<Input data={ranks} clearable bind:value={rankName} placeholder="" />
		</Label>
	</div>

	<div class="grid gap-6 mb-3 md:grid-cols-2">
		<Label>
			Spieler:
			<Select
				class="mt-4 p-3 space-y-3 text-sm"
				items={playerMap}
				bind:value={selPlayer}
				placeholder="Spieler"
			></Select>
		</Label>
	</div>

	<div class="grid gap-6 mb-3">
		<Label class="space-y-2">
			<span>Zeile 1</span>
			<Input clearable bind:value={line1} placeholder="" />
		</Label>
	</div>

	<div class="grid gap-6 mb-3">
		<Label class="space-y-2">
			<span>Zeile 2</span>
			<Input clearable bind:value={line2} placeholder="" />
		</Label>
	</div>

	<div class="grid gap-6 mb-3 mt-6 md:grid-cols-2">
		<Button on:click={() => generateCertificates()}>
			Generiere PDF<ArrowRightOutline class="w-3.5 h-3.5 ml-2 text-white" />
		</Button>
	</div>
</div>
