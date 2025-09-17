<script>
	import { Heading, Button, Card } from 'flowbite-svelte';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';
	import { generateLigaResultsPDF } from '$lib/PDFUtil';
	import { getPlayerName } from '$lib/PlayerUtil';

	let { data } = $props();

	let pdfEnabled = $state(data.round && data.round.status === 'Completed');

	const generateResults = (color) => {
		generateLigaResultsPDF(
			{
				pins: data.pins,
				players: data.players,
				tournament: data.tournament,
				round: data.round,
				rounds: data.rounds
			},
			color
		);
	};
</script>

<div>
	<Card>
		<Heading tag="h5" class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
			Ergebnis-PDF generieren
		</Heading>
		<p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
			Generiere hier das PDF mit Ergebnissen und Statistiken für alle Spieltage.
		</p>
		<Button disabled={!pdfEnabled} on:click={() => generateResults(true)} class="w-fit">
			Generiere PDF<ArrowRightOutline class="w-3.5 h-3.5 ml-2 text-white" />
		</Button>
	</Card>
</div>

<div>
	<Card>
		<Heading tag="h5" class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
			Ergebnis-PDF - Druckversion
		</Heading>
		<p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
			Generiere hier das Ergebnis-PDF in Graustufendarstellung für die Druckausgabe.
		</p>
		<Button disabled={!pdfEnabled} on:click={() => generateResults(false)} class="w-fit">
			Generiere PDF<ArrowRightOutline class="w-3.5 h-3.5 ml-2 text-white" />
		</Button>
	</Card>
</div>
