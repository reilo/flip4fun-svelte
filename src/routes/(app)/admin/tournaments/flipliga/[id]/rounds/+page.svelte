<script>
	import { Modal, Label, Button, Card } from 'flowbite-svelte';
	import { ArrowRightOutline, QuestionCircleOutline, ThumbsUpOutline } from 'flowbite-svelte-icons';
	import { invalidateAll } from '$app/navigation';
	import { calcStrength } from '$lib/TourUtil';
	import { calcRanking } from '$lib/MatchUtil';
	import { generateLigaResultsPDF } from '$lib/PDFUtil';

	let { data } = $props();

	let tournament = $derived(data.tournament);
	let round = $derived(data.round);
	let nextRound = $derived(data.round ? data.round.rid + 1 : 1);
	let nextRoundName = $derived(data.tournament.name + ' - Runde ' + nextRound);

	let startForm = $state(false);
	let endForm = $state(false);
	let endLigaForm = $state(false);
	let startSuccess = $state(false);
	let endSuccess = $state(false);
	let endLigaSuccess = $state(false);

	let startEnabled = $state(
		(!data.round && data.tournament.status == 'Planned' && data.tournament.players.length >= 4) ||
			(data.round && data.round.status === 'Completed' && data.tournament.status === 'Active')
	);
	let endEnabled = $state(data.round && data.round.status === 'Active');
	let endLigaEnabled = $state(
		data.round && data.round.status === 'Completed' && data.tournament.status === 'Active'
	);
	let pdfEnabled = $state(data.round && data.round.status === 'Completed');

	const baseline = data.tournament.settings.baseline;

	async function startRound() {
		// create first or next round
		let rankInit = [];
		if (!round) {
			// first round of tournament
			tournament.players.forEach((item, i) => {
				const strength = calcStrength(i + 1, tournament.players.length);
				rankInit.push({
					player: item,
					strength: strength,
					matches: 0,
					points: baseline + strength,
					bonus: 0,
					mismatch: 0,
					penalty: 0
				});
			});
		} else {
			// next round
			let allPlayers = tournament.players.slice();
			const numPlayers = allPlayers.length;
			// existing players
			round.results.rankFinal.forEach((item, i) => {
				rankInit.push({
					player: item.player,
					matches: item.matches,
					points: item.points,
					bonus: item.bonus,
					mismatch: item.mismatch,
					penalty: item.penalty
				});
				allPlayers.splice(allPlayers.indexOf(item.player), 1);
			});
			// new players
			let penalty = 0;
			let mismatch = 0;
			if (nextRound - tournament.settings.penaltyFirstRound >= 0) {
				mismatch = nextRound - 1; // mismatch count equals count of alrady played rounds
				let penaltyFactor = tournament.settings.matchPenalty;
				if (penaltyFactor < 0) {
					// player strength should be used instead of fix number, but new player has no strength yet, therefore using 1
					penaltyFactor = 1;
				}
				penalty = mismatch * penaltyFactor;
			}
			allPlayers.forEach((item) => {
				rankInit.push({
					player: item,
					points: baseline - penalty,
					matches: 0,
					bonus: 0,
					mismatch: mismatch,
					penalty: penalty
				});
			});

			rankInit.sort((a, b) => (a.points < b.points ? 1 : b.points < a.points ? -1 : 0));
			rankInit.forEach((item, i) => {
				rankInit[i].strength = calcStrength(i + 1, numPlayers);
			});
		}

		const settings = { rankInit: rankInit };
		const results = { rankFinal: [] };
		const cache = createCache();

		await createRound(
			tournament.id,
			nextRoundName,
			nextRound,
			tournament.players,
			settings,
			results,
			cache
		);
		invalidateAll();

		startForm = false;
		startEnabled = endLigaEnabled = pdfEnabled = false;
		endEnabled = true;

		startSuccess = true;
	}

	async function endRound() {
		// calculate final results and set status to Completed
		const results = round.results;
		results.rankFinal = calcRanking(
			round.rid,
			round.settings.rankInit,
			round.matches,
			tournament.settings
		);
		await updateRound(round.id, results, {});
		invalidateAll();

		endForm = false;
		startEnabled = endLigaEnabled = pdfEnabled = true;
		endEnabled = false;

		endSuccess = true;
	}

	async function endLiga() {
		let rankFinal = [];
		round.results.rankFinal.forEach((item) => {
			rankFinal.push(item.player);
		});
		const results = { rankFinal: rankFinal };

		await updateTournamentStatus(tournament.id, 'Completed', results);
		invalidateAll();

		endLigaForm = false;
		startEnabled = endEnabled = endLigaEnabled = false;
		pdfEnabled = true;

		endLigaSuccess = true;
	}

	const createCache = () => {
		let encounters = [];
		tournament.players.forEach((p1) => {
			tournament.players.forEach((p2) => {
				encounters.push({ p: p1 + '-' + p2, e: 0 });
			});
		});
		data.rounds.forEach((round) => {
			round.matches.forEach((match) => {
				const index = encounters.findIndex(
					(encounter) => encounter.p === match.player1 + '-' + match.player2
				);
				encounters[index].e += 1;
			});
		});
		return { encounters: encounters };
	};

	async function createRound(tid, name, rid, players, settings, results, cache) {
		let fetchUrl = '/api/tournament/' + tid + '/round';
		if (tournament.status != 'Active') {
			fetchUrl += '?updateTournamentStatus';
		}
		const response = await fetch(fetchUrl, {
			method: 'POST',
			body: JSON.stringify({
				tid: tid,
				rid: rid,
				name: name,
				status: 'Active',
				players: players,
				settings: settings,
				results: results,
				cache: cache
			}),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
		const result = await response.json();
		if (response.status !== 200) {
			alert(JSON.stringify(result));
		}
	}

	async function updateRound(id, results, cache) {
		const response = await fetch('/api/round/' + id, {
			method: 'PUT',
			body: JSON.stringify({
				id: id,
				results: results,
				cache: cache,
				status: 'Completed'
			}),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
		const result = await response.json();
		if (response.status !== 200) {
			alert(JSON.stringify(result));
		}
	}

	async function updateTournamentStatus(tid, status, results) {
		const response = await fetch('/api/tournament/' + tid, {
			method: 'PUT',
			body: JSON.stringify({
				status: status,
				results: results
			}),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
		const result = await response.json();
		if (response.status !== 200) {
			alert(JSON.stringify(result));
		}
	}

	const generateResults = () => {
		generateLigaResultsPDF({
			pins: data.pins,
			players: data.players,
			tournament: data.tournament,
			round: data.round,
			rounds: data.rounds
		});
	};
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
		<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
			Liga beenden
		</h5>
		<p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
			Hiermit wird die Liga abgeschlossen. Danach können keine weiteren Spieltage mehr gestartet
			werden.
		</p>
		<Button disabled={!endLigaEnabled} on:click={() => (endLigaForm = true)} class="w-fit">
			Beenden<ArrowRightOutline class="w-3.5 h-3.5 ml-2 text-white" />
		</Button>
	</Card>
</div>

<div>
	<Modal title="Spieltag starten" bind:open={startForm} autoclose={false} class="max-w-sm">
		<div class="text-center">
			<QuestionCircleOutline class="mx-auto mb-4 text-red-700 w-12 h-12 dark:text-red-700" />
			<form class="flex flex-col space-y-6" action="#">
				<Label class="space-y-2">Soll der {nextRound}. Spieltag wirklich gestartet werden?</Label>
				<Button color="alternative" on:click={startRound}>Ja, starten</Button>
				<Button color="primary" on:click={() => (startForm = false)}>Nein, abbrechen</Button>
			</form>
		</div>
	</Modal>
</div>

<div>
	<Modal bind:open={startSuccess} size="xs" autoclose>
		<div class="text-center">
			<ThumbsUpOutline class="mx-auto mb-4 text-green-700 w-12 h-12 dark:green-red-700" />
			<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
				Der Spieltag wurde erfolgreich gestartet!
			</h3>
			<Button color="alternative">Schließen</Button>
		</div>
	</Modal>
</div>

<div>
	<Modal title="Spieltag beenden" bind:open={endForm} autoclose={false} class="max-w-sm">
		<div class="text-center">
			<QuestionCircleOutline class="mx-auto mb-4 text-red-700 w-12 h-12 dark:text-red-700" />
			<form class="flex flex-col space-y-6" action="#">
				<Label class="space-y-2">Soll der {nextRound - 1}. Spieltag wirklich beendet werden?</Label>
				<Button color="alternative" on:click={endRound}>Ja, beenden</Button>
				<Button color="primary" on:click={() => (endForm = false)}>Nein, abbrechen</Button>
			</form>
		</div>
	</Modal>
</div>

<div>
	<Modal bind:open={endSuccess} size="xs" autoclose>
		<div class="text-center">
			<ThumbsUpOutline class="mx-auto mb-4 text-green-700 w-12 h-12 dark:green-red-700" />
			<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
				Der Spieltag wurde erfolgreich beendet!
			</h3>
			<Button color="alternative">Schließen</Button>
		</div>
	</Modal>
</div>

<div>
	<Modal title="Liga beenden" bind:open={endLigaForm} autoclose={false} class="max-w-sm">
		<div class="text-center">
			<QuestionCircleOutline class="mx-auto mb-4 text-red-700 w-12 h-12 dark:text-red-700" />
			<form class="flex flex-col space-y-6" action="#">
				<Label class="space-y-2">Soll diese Liga wirklich endgültig beendet werden?</Label>
				<Button color="alternative" on:click={endLiga}>Ja, beenden</Button>
				<Button color="primary" on:click={() => (endLigaForm = false)}>Nein, abbrechen</Button>
			</form>
		</div>
	</Modal>
</div>

<div>
	<Modal bind:open={endLigaSuccess} size="xs" autoclose>
		<div class="text-center">
			<ThumbsUpOutline class="mx-auto mb-4 text-green-700 w-12 h-12 dark:green-red-700" />
			<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
				Die Liga wurde erfolgreich beendet!
			</h3>
			<Button color="alternative">Schließen</Button>
		</div>
	</Modal>
</div>
