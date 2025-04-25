<script>
	import { Heading, Button, Card } from 'flowbite-svelte';
	import { ArrowRightOutline, QuestionCircleOutline, ThumbsUpOutline } from 'flowbite-svelte-icons';
	import { generateLigaResultsPDF, generateCertificatePDF } from '$lib/PDFUtil';
	import { getPlayerName } from '$lib/PlayerUtil';
	import { mapDate } from '$lib/TypeUtil';

	let { data } = $props();

	let pdfEnabled = $state(data.round && data.round.status === 'Completed');

	const generateResults = () => {
		generateLigaResultsPDF({
			pins: data.pins,
			players: data.players,
			tournament: data.tournament,
			round: data.round,
			rounds: data.rounds
		});
	};

	const generateCertificates = () => {
		let playerIDs = [];
		playerIDs.push(data.round.results.rankFinal[0].player);
		playerIDs.push(data.round.results.rankFinal[1].player);
		playerIDs.push(data.round.results.rankFinal[2].player);

		let maxMatches = 0;
		data.round.results.rankFinal.forEach((item) => {
			if (item.matches > maxMatches) {
				maxMatches = item.matches;
			}
		});

		let mostActivePlayerIDs = [];
		data.round.results.rankFinal.forEach((item) => {
			if (item.matches === maxMatches) {
				mostActivePlayerIDs.push(item.player);
			}
		});

		const title = data.tournament.name;

		const versions = ['1. Platz', '2. Platz', '3. Platz'];
		mostActivePlayerIDs.forEach((item) => {
			versions.push('Aktivster Spieler');
			playerIDs.push(item);
		});

		let playerNames = [];
		playerIDs.forEach((item) => {
			playerNames.push(getPlayerName(item, data.players));
		});

		const lines = ['Wir gratulieren zur hervorragenden Leistung', 'und überreichen die Urkunde an'];

		generateCertificatePDF(title, versions, lines, playerNames);
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
		<Button disabled={!pdfEnabled} on:click={() => generateResults()} class="w-fit">
			Generiere PDF<ArrowRightOutline class="w-3.5 h-3.5 ml-2 text-white" />
		</Button>
	</Card>
</div>

<div>
	<Card>
		<Heading tag="h5" class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
			Urkunden-PDF generieren
		</Heading>
		<p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
			Generiere hier das PDF mit den Urkunden für Platz 1 bis 3 und den aktivsten Spieler.
		</p>
		<Button disabled={!pdfEnabled} on:click={() => generateCertificates()} class="w-fit">
			Generiere PDF<ArrowRightOutline class="w-3.5 h-3.5 ml-2 text-white" />
		</Button>
	</Card>
</div>
