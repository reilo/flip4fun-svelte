<script>
	import { Heading, Button, Card, Badge } from 'flowbite-svelte';
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

	<!-- Action Cards -->
	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<Card class="hover:shadow-lg transition-shadow">
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
					<Badge color="gray" class="mb-3">Keine abgeschlossene Runde</Badge>
				{/if}
				<Button disabled={!pdfEnabled} on:click={() => generateTwinpinResultsPDF(data, true)} class="w-full mt-auto text-base">
					<FilePdfOutline class="w-4 h-4 mr-2" />
					Generiere PDF
				</Button>
			</div>
		</Card>

		<Card class="hover:shadow-lg transition-shadow">
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
					<Badge color="gray" class="mb-3">Keine abgeschlossene Runde</Badge>
				{/if}
				<Button disabled={!pdfEnabled} on:click={() => generateTwinpinResultsPDF(data, false)} class="w-full mt-auto text-base">
					<FilePdfOutline class="w-4 h-4 mr-2" />
					Generiere PDF
				</Button>
			</div>
		</Card>
	</div>
</div>
