<script>
	import { invalidateAll } from '$app/navigation';
	import { randomPin, getOldTypes, getNewTypes } from '$lib/PinUtil';
	import { calcInitialLevels, calcPlayingLevels, calcFinalResults } from '$lib/TourUtil';
	import { hasFrameResult } from '$lib/FrameUtil';
	import Success from '$lib/components/dialogs/Success.svelte';
	import Sure from '$lib/components/dialogs/Sure.svelte';
	import Box from '$lib/components/Box.svelte';

	let { data } = $props();

	let tournament = $derived(data.tournament);
	let round = $derived(data.round);
	let frames = $derived(data.frames);
	let pins = $derived(data.pins);

	let startTourEnabled = $derived(tournament.status === 'Planned');
	let startTourForm = $state(false);

	let startRoundEnabled = $derived(
		tournament.status === 'Active' &&
			(!round || round.status === 'Completed') &&
			!maxFinalistsReached(round, tournament)
	);
	let startRoundForm = $state(false);

	let endRoundEnabled = $derived(
		tournament.status === 'Active' &&
			round &&
			round.status === 'Active' &&
			frames.every((frame) => {
				return hasFrameResult(frame);
			})
	);
	let endRoundForm = $state(false);

	let endTourEnabled = $derived(
		tournament.status === 'Active' &&
			round &&
			round.status === 'Completed' &&
			maxFinalistsReached(round, tournament)
	);
	let endTourForm = $state(false);

	let successForm = $state(false);
	let successMessage = $state('');

	async function startTour() {
		let settings = tournament.settings;
		settings.inactivePlayers = [];
		const response = await fetch('/api/tournament/' + tournament.id, {
			method: 'PUT',
			body: JSON.stringify({
				status: 'Active',
				settings: settings
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
		startTourForm = false;
		successForm = true;
		successMessage = 'Das Turnier wurde erfolgreich gestartet!';
		invalidateAll();
	}

	async function startRound() {
		let rankInit;
		let playingLevels;
		const roundPlayers = [];
		tournament.players.forEach((player, i) => {
			if (!tournament.settings.inactivePlayers.includes(player)) {
				roundPlayers.push(player);
			}
		});
		if (!round) {
			// it is the first round of the tournament
			// generate initial ranking levels for next round
			rankInit = calcInitialLevels(tournament.players, tournament.settings.maxStartBonus);
		} else {
			// it is the second or later round
			rankInit = JSON.parse(JSON.stringify(round.results.rankFinal));
		}
		// generate list of levels playing in next round
		playingLevels = calcPlayingLevels(
			rankInit,
			roundPlayers,
			round ? round.settings.playingLevels : []
		);
		// generate all matches
		const frames = [];
		const usedPins = [];
		const pinTypes = tournament.settings.pinTypes;
		playingLevels.forEach((level) => {
			const players = [];
			rankInit[level - 1].players.forEach((item) => {
				if (roundPlayers.includes(item.id)) {
					players.push(item.id);
				}
			});
			const frameName =
				tournament.name +
				' - Runde ' +
				(round ? (round.rid + 1).toString() : '1') +
				' - Ebene ' +
				level.toString() +
				' - Match ';
			if (players.length > 1) {
				const pin1 = randomPin(pins, true, true, true, true, usedPins);
				frames.push({ lid: level, mid: 1, name: frameName + '1', pin: pin1.id, players: players });
				usedPins.push(pin1.id);
				const useOldPins = pinTypes === 0 || !getOldTypes().includes(pin1.type);
				const useNewPins = pinTypes === 0 || pinTypes === 2 || !getNewTypes().includes(pin1.type);
				const pin2 = randomPin(pins, useOldPins, useOldPins, useNewPins, useNewPins, usedPins);
				frames.push({ lid: level, mid: 2, name: frameName + '2', pin: pin2.id, players: players });
				usedPins.push(pin2.id);
			} else {
				frames.push({
					lid: level,
					mid: 1,
					name: frameName + '1',
					pin: '',
					players: players,
					scores: [1]
				});
				frames.push({
					lid: level,
					mid: 2,
					name: frameName + '2',
					pin: '',
					players: players,
					scores: [1]
				});
			}
		});
		const rid = round ? round.rid + 1 : 1;
		// push all changes to DB: new round, new frames
		const response = await fetch('/api/tournament/' + tournament.id + '/round?addFrames', {
			method: 'POST',
			body: JSON.stringify({
				tid: tournament.id,
				rid: rid,
				name: tournament.name + ' - Runde ' + rid.toString(),
				status: 'Active',
				players: roundPlayers,
				settings: { rankInit: rankInit, playingLevels: playingLevels },
				frames: frames
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
		// close form and show success
		startRoundForm = false;
		successForm = true;
		successMessage = 'Die neue Runde wurde erfolgreich gestartet!';
		invalidateAll();
	}

	async function endRound() {
		const results = calcFinalResults(round, frames);
		// push results to DB
		const response = await fetch('/api/round/' + round.id, {
			method: 'PUT',
			body: JSON.stringify({
				results: { rankFinal: results.rankFinal },
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
		// close form and show success
		endRoundForm = false;
		successForm = true;
		successMessage = 'Die Runde wurde erfolgreich beendet!';
		invalidateAll();
	}

	async function endTour() {
		const response = await fetch('/api/tournament/' + tournament.id, {
			method: 'PUT',
			body: JSON.stringify({
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
		endTourForm = false;
		successForm = true;
		successMessage = 'Das Finalturnier wurde erfolgreich beendet!';
		invalidateAll();
	}

	const maxFinalistsReached = (round, tournament) => {
		let result = false;
		if (round && round.results && round.results.rankFinal) {
			const levels = round.results.rankFinal;
			const level = levels[levels.length - 1];
			if (tournament && tournament.settings && tournament.settings.numFinalists) {
				result = level.players.length === tournament.settings.numFinalists;
			}
		}
		return result;
	};
</script>

<Box
	title={'Turnier starten'}
	description={'Sobald das Finalturnier gestartet wurde, müssen nicht teilnehmende Spieler deaktiviert werden. ' +
		'Anschließend kann die erste Runde gestartet werden.'}
	action={() => (startTourForm = true)}
	enabled={startTourEnabled}
	buttonOk={'Starten'}
	loading={false}
/>

<Sure
	show={startTourForm}
	title={'Turnier starten'}
	message={'Soll das Finalturnier wirklich gestartet werden?'}
	actionOk={startTour}
	actionCancel={() => (startTourForm = false)}
	buttonOk={'Ja, starten'}
/>

<Box
	title={'Neue Runde starten'}
	description={'Matches für alle teilnehmenden Ebenen werden ausgelost und die Runde gestartet.'}
	action={() => (startRoundForm = true)}
	enabled={startRoundEnabled}
	buttonOk={'Starten'}
	loading={false}
/>

<Sure
	show={startRoundForm}
	title={'Runde starten'}
	message={'Soll wirklich eine neue Runde gestartet werden?'}
	actionOk={startRound}
	actionCancel={() => (startRoundForm = false)}
	buttonOk={'Ja, starten'}
/>

<Box
	title={'Runde beenden'}
	description={'Die aktuelle Runde wird beendet und die Ebenen neu berechnet. ' +
		'Die Runde kann erst beendet werden, wenn die Ergebnisse für alle Matches eingetragen wurden.'}
	action={() => (endRoundForm = true)}
	enabled={endRoundEnabled}
	buttonOk={'Beenden'}
	loading={false}
/>

<Sure
	show={endRoundForm}
	title={'Runde beenden'}
	message={'Soll die aktuelle Runde wirklich beendet werden?'}
	actionOk={endRound}
	actionCancel={() => (endRoundForm = false)}
	buttonOk={'Ja, beenden'}
/>

<Success show={successForm} message={successMessage} onClose={() => (successForm = false)} />

<Box
	title={'Turnier beenden'}
	description={'Das Final-Turnier kann beendet wurden, sobald alle Runden abgeschlossen sind.'}
	action={() => (endTourForm = true)}
	enabled={endTourEnabled}
	buttonOk={'Beenden'}
	loading={false}
/>

<Sure
	show={endTourForm}
	title={'Turnier beenden'}
	message={'Soll das Finalturnier wirklich beendet werden?'}
	actionOk={endTour}
	actionCancel={() => (endTourForm = false)}
	buttonOk={'Ja, beenden'}
/>
