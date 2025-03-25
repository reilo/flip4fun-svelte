<script>
	import { Modal, Label, Button } from 'flowbite-svelte';
	import { Card } from 'flowbite-svelte';
	import { ArrowRightOutline, ExclamationCircleOutline } from 'flowbite-svelte-icons';
	import { CalcStrength } from '$lib/TourUtil';
	import { CalcRanking } from '$lib/MatchUtil';
	import { jsPDF } from 'jspdf';

	let { data } = $props();

	let startForm = $state(false);
	let endForm = $state(false);

	let startEnabled = $state(
		(!data.round && data.tournament.status == 'Planned' && data.tournament.players.length >= 8) ||
			(data.round && data.round.status === 'Completed')
	);
	let endEnabled = $state(data.round && data.round.status === 'Active');

	const nextRound = data.round ? data.round.rid + 1: 1;
	const nextRoundName = data.tournament.name + ' - Runde ' + nextRound;
	const baseline = data.tournament.settings.baseline;

	async function startRound() {
		// create first or next round
		let rankInit = [];
		if (!data.round) {
			// first round of tournament
			data.tournament.players.forEach((item, i) => {
				const strength = CalcStrength(i + 1, data.tournament.players.length);
				rankInit.push({ player: item, strength: strength, points: baseline + strength });
			});
		} else {
			// next round, add new players
			let allPlayers = data.tournament.players.slice();
			const numPlayers = allPlayers.length;
			let insertPos = numPlayers;
			data.round.results.rankFinal.forEach((item, i) => {
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
		const settings = { rankInit: rankInit };
		const matches = [];
		const results = { rankFinal: [] };
		createRound(data.tournament.id, nextRoundName, nextRound, settings, matches, results);
		if (data.round) {
			data.round.settings = settings;
		}
		updateTournamentStatus(data.tournament.id, 'Active');
		startForm = startEnabled = false;
		endEnabled = true;
	}

	async function endRound() {
		// calculate final results and set status to Completed
		const results = data.round.results;
		results.rankFinal = CalcRanking(data.round.settings.rankInit, data.round.matches, data.tournament.settings.matchBonus);
		updateRound(data.tournament.id, data.round.rid, results);
		data.round.results = results;
		endForm = endEnabled = false;
		startEnabled = true;
	}

	async function createRound(tid, name, rid, settings, matches, results) {
		const response = await fetch('/api/tournament/' + tid + "/round", {
			method: 'POST',
			body: JSON.stringify({
				tid: tid,
				rid: rid,
				name: name,
				status: 'Active',
				settings: settings,
				matches: matches,
				results: results
			}),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
		const result = await response.json();
	}

	async function updateRound(tid, rid, results) {
		const response = await fetch('/api/tournament/' + tid + '/round/' + rid, {
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
				<Button color="alternative" on:click={startRound}>Ja, starten</Button>
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
				<Button color="alternative" on:click={endRound}>Ja, beenden</Button>
				<Button color="primary" on:click={() => (endForm = false)}>Nein, abbrechen</Button>
			</form>
		</div>
	</Modal>
</div>
