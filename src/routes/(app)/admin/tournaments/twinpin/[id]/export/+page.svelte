<script>
	import { Heading, Button, Card, Badge } from 'flowbite-svelte';
	import TourBreadcrumb from '$lib/components/TourBreadcrumb.svelte';
	import { FilePdfOutline } from 'flowbite-svelte-icons';
	import { generateTwinpinResultsPDF } from '$lib/PDFTwinpinUtil';
	import { mapTourStatus } from '$lib/TourUtil';

	let { data } = $props();

	let tournament = $derived(data.tournament);
	let round = $derived(data.round);
	let pdfEnabled = $derived(
		tournament.status === 'Completed' ||
		(tournament.status === 'Active' && round?.status === 'Completed')
	);
</script>

<div class="space-y-6">
	<!-- Status Summary -->
	<TourBreadcrumb {tournament} {round} />

	<!-- Action Cards -->
	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<Card class="p-6 hover:shadow-lg transition-shadow">
			<div class="flex flex-col h-full">
				<div class="flex items-center gap-3 mb-3">
					<div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
						<FilePdfOutline class="w-5 h-5 text-blue-600 dark:text-blue-300" />
					</div>
					<Heading tag="h5" class="text-xl font-bold text-gray-900 dark:text-white">
						Ergebnis-PDF generieren
					</Heading>
				</div>
				<p class="text-base text-gray-600 dark:text-gray-400 mb-4">
					Generiere das PDF mit Gesamtwertung und Matches aller Runden.
				</p>
				{#if !pdfEnabled}
					<Badge color="indigo" class="w-fit mb-3">Keine abgeschlossene Runde</Badge>
				{/if}
				<Button disabled={!pdfEnabled} onclick={() => generateTwinpinResultsPDF(data, true)} class="w-full mt-auto text-base">
					<FilePdfOutline class="w-4 h-4 mr-2" />
					Generiere PDF
				</Button>
			</div>
		</Card>

		<Card class="p-6 hover:shadow-lg transition-shadow">
			<div class="flex flex-col h-full">
				<div class="flex items-center gap-3 mb-3">
					<div class="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
						<FilePdfOutline class="w-5 h-5 text-gray-600 dark:text-gray-300" />
					</div>
					<Heading tag="h5" class="text-xl font-bold text-gray-900 dark:text-white">
						Ergebnis-PDF – Druckversion
					</Heading>
				</div>
				<p class="text-base text-gray-600 dark:text-gray-400 mb-4">
					Generiere das Ergebnis-PDF in Graustufendarstellung für die Druckausgabe.
				</p>
				{#if !pdfEnabled}
					<Badge color="indigo" class="w-fit mb-3">Keine abgeschlossene Runde</Badge>
				{/if}
				<Button disabled={!pdfEnabled} onclick={() => generateTwinpinResultsPDF(data, false)} class="w-full mt-auto text-base">
					<FilePdfOutline class="w-4 h-4 mr-2" />
					Generiere PDF
				</Button>
			</div>
		</Card>
	</div>
</div>
