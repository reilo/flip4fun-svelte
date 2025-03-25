<script>
	import { Modal, Label, Button } from 'flowbite-svelte';
	import { Card } from 'flowbite-svelte';
	import { ArrowRightOutline, ExclamationCircleOutline } from 'flowbite-svelte-icons';
	import { Increment } from '$lib/BlobUtil';
	import { CalcStrength } from '$lib/TourUtil';
	import { CalcRanking } from '$lib/MatchUtil';
	import { jsPDF } from 'jspdf';

	let { data } = $props();

	let startForm = $state(false);
	let endForm = $state(false);

	let startEnabled = $state(
		(!data.blob && data.tournament.status == 'Planned' && data.tournament.players.length >= 8) ||
			(data.blob && data.blob.status === 'Completed')
	);
	let endEnabled = $state(data.blob && data.blob.status === 'Active');

	const nextBlobID = data.blob ? Increment(data.blob.blobid) : '0001';
	const nextRound = parseInt(nextBlobID);
	const nextBlobName = data.tournament.name + ' - Runde ' + nextRound;
	const baseline = data.tournament.settings.baseline;

	async function startBlob() {
		// create first or next blob
		let rankInit = [];
		if (!data.blob) {
			// first blob of tournament
			data.tournament.players.forEach((item, i) => {
				const strength = CalcStrength(i + 1, data.tournament.players.length);
				rankInit.push({ player: item, strength: strength, points: baseline + strength });
			});
		} else {
			// next blob, add new players
			let allPlayers = data.tournament.players.slice();
			const numPlayers = allPlayers.length;
			let insertPos = numPlayers;
			data.blob.results.rankFinal.forEach((item, i) => {
				rankInit.push({
					player: item.player,
					points: item.points
				});
				allPlayers.splice(allPlayers.indexOf(item.player), 1);
				if (item.points < baseline) {
					insertPos = i;
				}
			});
			allPlayers.forEach((item, i) => {
				rankInit.splice(insertPos++, 0, {
					player: item,
					points: baseline
				});
			});
			rankInit.forEach((item, i) => {
				rankInit[i].strength = CalcStrength(i + 1, numPlayers);
			});
		}
		const results = { rankInit: rankInit, matches: [], rankFinal: [] };
		createBlob(data.tournament.id, nextBlobName, nextBlobID, results);
		data.blob.results = results;
		updateTournamentStatus(data.tournament.id, 'Active');
		startForm = startEnabled = false;
		endEnabled = true;
	}

	async function endBlob() {
		// calculate final results and set status to Completed
		const results = data.blob.results;
		results.rankFinal = CalcRanking(data.blob.results, data.tournament.settings.matchBonus);
		updateBlob(data.blob.id, results);
		data.blob.results = results;
		endForm = endEnabled = false;
		startEnabled = true;
	}

	async function createBlob(tid, name, bid, results) {
		const response = await fetch('/api/tournament', {
			method: 'POST',
			body: JSON.stringify({
				name: name,
				type: 'blob',
				id: tid + ':' + bid,
				status: 'Active',
				settings: {},
				results: results
			}),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
		const result = await response.json();
	}

	async function updateBlob(id, results) {
		const response = await fetch('/api/tournament/' + id, {
			method: 'PUT',
			body: JSON.stringify({
				results: results,
				status: 'Completed'
			}),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
		const result = await response.json();
	}

	async function updateTournamentStatus(tid, status) {
		const response = await fetch('/api/tournament/' + tid, {
			method: 'PUT',
			body: JSON.stringify({
				status: status
			}),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
		const result = await response.json();
	}

	function generatePDF() {
		const doc = new jsPDF();
		doc.text('Hello world!', 10, 10);
		doc.save('a4.pdf');
	}
</script>

<div>
	<Card>
		<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
			Spieltag starten
		</h5>
		<p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
			Sobald der Spieltag gestartet wurde, können im laufenden Spieltag keine neuen Spieler
			hinzugefügt werden.
		</p>
		<Button disabled={!startEnabled} on:click={() => (startForm = true)} class="w-fit">
			Starten<ArrowRightOutline class="w-3.5 h-3.5 ml-2 text-white" />
		</Button>
	</Card>
</div>

<div>
	<Card>
		<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
			Spieltag beenden
		</h5>
		<p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
			Sobald der Spieltag beendet wurde, können keine Matches mehr nachgetragen oder korrigiert
			werden.
		</p>
		<Button disabled={!endEnabled} on:click={() => (endForm = true)} class="w-fit">
			Beenden<ArrowRightOutline class="w-3.5 h-3.5 ml-2 text-white" />
		</Button>
	</Card>
</div>

<div>
	<Card>
		<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
			Ergebnis-PDF generieren
		</h5>
		<p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">...</p>
		<Button disabled={false} on:click={generatePDF} class="w-fit">
			Generiere PDF<ArrowRightOutline class="w-3.5 h-3.5 ml-2 text-white" />
		</Button>
	</Card>
</div>

<div>
	<Modal title="Spieltag starten" bind:open={startForm} autoclose={false} class="max-w-sm">
		<div class="text-center">
			<ExclamationCircleOutline class="mx-auto mb-4 text-green-700 w-12 h-12 dark:text-green-700" />
			<form class="flex flex-col space-y-6" action="#">
				<Label class="space-y-2">Soll der {nextRound}. Spieltag wirklich gestartet werden?</Label>
				<Button color="alternative" on:click={startBlob}>Ja, starten</Button>
				<Button color="primary" on:click={() => (startForm = false)}>Nein, abbrechen</Button>
			</form>
		</div>
	</Modal>
</div>

<div>
	<Modal title="Spieltag beenden" bind:open={endForm} autoclose={false} class="max-w-sm">
		<div class="text-center">
			<ExclamationCircleOutline class="mx-auto mb-4 text-green-700 w-12 h-12 dark:text-green-700" />
			<form class="flex flex-col space-y-6" action="#">
				<Label class="space-y-2">Soll der {nextRound}. Spieltag wirklich beendet werden?</Label>
				<Button color="alternative" on:click={endBlob}>Ja, beenden</Button>
				<Button color="primary" on:click={() => (endForm = false)}>Nein, abbrechen</Button>
			</form>
		</div>
	</Modal>
</div>
