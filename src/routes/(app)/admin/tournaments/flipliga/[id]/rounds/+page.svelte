<script>
	import { invalidateAll } from '$app/navigation';
	import { calcStrength } from '$lib/TourUtil';
	import { calcRanking } from '$lib/MatchUtil';
	import Box from '$lib/components/Box.svelte';
	import Sure from '$lib/components/dialogs/Sure.svelte';
	import Success from '$lib/components/dialogs/Success.svelte';

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
		startEnabled = endLigaEnabled = false;
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
		startEnabled = endLigaEnabled = true;
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
</script>

<Box
	title={'Spieltag starten'}
	description={'Sobald der Spieltag gestartet wurde, können im laufenden Spieltag keine neuen Spieler	hinzugefügt werden.'}
	action={(startForm = true)}
	enabled={startEnabled}
	buttonOk={'Starten'}
	loading={false}
/>

<Box
	title={'Spieltag beenden'}
	description={'Sobald der Spieltag beendet wurde, können keine Matches mehr nachgetragen oder korrigiert werden.'}
	action={(endForm = true)}
	enabled={endEnabled}
	buttonOk={'Beenden'}
	loading={false}
/>

<Box
	title={'Liga beenden'}
	description={'Hiermit wird die Liga abgeschlossen. Danach können keine weiteren Spieltage mehr gestartet werden.'}
	action={(endLigaForm = true)}
	enabled={endLigaEnabled}
	buttonOk={'Beenden'}
	loading={false}
/>

<Sure
	show={startForm}
	title={'Spieltag starten'}
	message={'Soll der nächste Spieltag wirklich gestartet werden?'}
	actionOk={startRound}
	actionCancel={() => (startForm = false)}
	buttonOk={'Ja, starten'}
/>

<Success
	show={startSuccess}
	message={'Der Spieltag wurde erfolgreich gestartet!'}
	onClose={() => (startSuccess = false)}
/>

<Sure
	show={endForm}
	title={'Spieltag beenden'}
	message={'Soll der aktuelle Spieltag wirklich beendet werden?'}
	actionOk={endRound}
	actionCancel={() => (endForm = false)}
	buttonOk={'Ja, beenden'}
/>

<Success
	show={endSuccess}
	message={'Der Spieltag wurde erfolgreich beendet!'}
	onClose={() => (endSuccess = false)}
/>

<Sure
	show={endLigaForm}
	title={'Liga beenden'}
	message={'Soll diese Liga wirklich endgültig beendet werden?'}
	actionOk={endLiga}
	actionCancel={() => (endLigaForm = false)}
	buttonOk={'Ja, beenden'}
/>

<Success
	show={endLigaSuccess}
	message={'Die Liga wurde erfolgreich beendet!'}
	onClose={() => (endLigaSuccess = false)}
/>
