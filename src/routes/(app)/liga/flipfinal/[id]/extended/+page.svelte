<script>
	import { Heading, Button, Card } from 'flowbite-svelte';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';
	import { generateFinalResultsPDF } from '$lib/PDFFinalUtil';

	let { data } = $props();

	let tourCompleted = $derived(data.round && data.round.status === 'Completed');
	let roundActive = $derived(data.round && data.round.status === 'Active');

</script>

<div>
	<Card>
		<Heading tag="h5" class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
			Ergebnis-PDF generieren
		</Heading>
		<p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
			Generiere hier das PDF mit Ergebnissen aller Runden und Spiele.
		</p>
		<Button disabled={!tourCompleted} on:click={() => generateFinalResultsPDF(data, true)} class="w-fit">
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
		<Button disabled={!tourCompleted} on:click={() => generateFinalResultsPDF(data, false)} class="w-fit">
			Generiere PDF<ArrowRightOutline class="w-3.5 h-3.5 ml-2 text-white" />
		</Button>
	</Card>
</div>
