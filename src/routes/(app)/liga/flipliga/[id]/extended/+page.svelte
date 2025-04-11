<script>
	import { Button, Card } from 'flowbite-svelte';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';
	import { generateLigaResultsPDF } from '$lib/PDFUtil';
	let { data } = $props();
	let pdfEnabled = data.round && data.round.status === 'Completed';
</script>

<div>
	<Card>
		<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
			Ergebnis-PDF generieren
		</h5>
		<p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
			Generiere hier das PDF mit allen Statistiken für alle Spieltage. Kann etwas länger dauern...
		</p>
		<Button disabled={!pdfEnabled} on:click={() => generateLigaResultsPDF(data)} class="w-fit">
			Generiere PDF<ArrowRightOutline class="w-3.5 h-3.5 ml-2 text-white" />
		</Button>
	</Card>
</div>
