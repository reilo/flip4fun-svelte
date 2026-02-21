<script>
	import { Heading, Button, Card } from 'flowbite-svelte';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';
	import { generateMatchCardsPDF, generateFinalResultsPDF } from '$lib/PDFFinalUtil';

	let { data } = $props();

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

<div>
	<Card>
		<Heading tag="h5" class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
			Rundenzettel-PDF generieren
		</Heading>
		<p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
			Generiere hier das PDF mit den Rundenzetteln für die aktuelle Runde.
		</p>
		<Button disabled={!roundActive} on:click={() => generateMatchCards()} class="w-fit">
			Generiere PDF<ArrowRightOutline class="w-3.5 h-3.5 ml-2 text-white" />
		</Button>
	</Card>
</div>

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
