<script>
	import { Heading, Button, Card, Badge } from 'flowbite-svelte';
	import TourBreadcrumb from '$lib/components/TourBreadcrumb.svelte';
	import { FilePdfOutline } from 'flowbite-svelte-icons';
	import { generateMatchCardsPDF, generateFinalResultsPDF } from '$lib/PDFFinalUtil';
	import { mapTourStatus } from '$lib/TourUtil';

	let { data } = $props();

	let tournament = $derived(data.tournament);
	let round = $derived(data.round);
	let tourCompleted = $derived(data.round && data.round.status === 'Completed');
	let roundActive = $derived(data.round && data.round.status === 'Active');

	const generateMatchCards = () => {
		const matches = [];
		let item;
		data.frames.forEach((frame) => {
			let idx = matches.findIndex((m) => m.level === frame.lid);
			if (idx === -1) {
				let count = 0;
				if (frame.players.length > 3) {
					count = 2;
				} else if (frame.players.length > 1) {
					count = 1;
				}
				item = { level: frame.lid, count: count };
				if (frame.mid === 1) {
					item.pin1 = frame.pin;
				} else {
					item.pin2 = frame.pin;
				}
				item.created = frame.created;
				matches.push(item);
			} else {
				item = matches[idx];
				if (frame.mid === 1) {
					item.pin1 = frame.pin;
				} else {
					item.pin2 = frame.pin;
				}
			}
		});
		generateMatchCardsPDF(data.tournament.name, data.round.rid, matches, data.pins);
	};
</script>

<div class="space-y-6">
	<!-- Status Summary -->
	<TourBreadcrumb {tournament} {round} />

	<!-- Action Cards -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		<Card class="p-6 hover:shadow-lg transition-shadow">
			<div class="flex flex-col h-full">
				<div class="flex items-center gap-3 mb-3">
					<div class="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
						<FilePdfOutline class="w-5 h-5 text-amber-600 dark:text-amber-300" />
					</div>
					<Heading tag="h5" class="text-xl font-bold text-gray-900 dark:text-white">
						Rundenzettel-PDF
					</Heading>
				</div>
				<p class="text-base text-gray-600 dark:text-gray-400 mb-4">
					Generiere das PDF mit den Rundenzetteln für die aktuelle Runde.
				</p>
				{#if !roundActive}
					<Badge color="indigo" class="w-fit mb-3">Runde nicht aktiv</Badge>
				{/if}
				<Button disabled={!roundActive} onclick={() => generateMatchCards()} class="w-full mt-auto text-base">
					<FilePdfOutline class="w-4 h-4 mr-2" />
					Generiere PDF
				</Button>
			</div>
		</Card>

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
					Generiere das PDF mit Ergebnissen aller Runden und Spiele.
				</p>
				{#if !tourCompleted}
					<Badge color="indigo" class="w-fit mb-3">Turnier nicht abgeschlossen</Badge>
				{/if}
				<Button disabled={!tourCompleted} onclick={() => generateFinalResultsPDF(data, true)} class="w-full mt-auto text-base">
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
				{#if !tourCompleted}
					<Badge color="indigo" class="w-fit mb-3">Turnier nicht abgeschlossen</Badge>
				{/if}
				<Button disabled={!tourCompleted} onclick={() => generateFinalResultsPDF(data, false)} class="w-full mt-auto text-base">
					<FilePdfOutline class="w-4 h-4 mr-2" />
					Generiere PDF
				</Button>
			</div>
		</Card>
	</div>
</div>
