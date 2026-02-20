<script>
	import { invalidateAll } from '$app/navigation';
	import { randomPin, getOldTypes, getNewTypes } from '$lib/PinUtil';
	import { hasFrameResult } from '$lib/FrameUtil';
	import { Button } from 'flowbite-svelte';
	import Success from '$lib/components/dialogs/Success.svelte';
	import Sure from '$lib/components/dialogs/Sure.svelte';
	import Box from '$lib/components/Box.svelte';

	let { data } = $props();

	let tournament = $derived(data.tournament);
	let round = $derived(data.round);
	let pins = $derived(data.pins);

	let startTourEnabled = $derived(tournament.status === 'Planned');
	let startTourForm = $state(false);

	let startRoundEnabled = $derived(
		tournament.status === 'Active' && (!round || round.status === 'Completed')
	);
	let startRoundForm = $state(false);

	let endRoundEnabled = $derived(
		tournament.status === 'Active' &&
			round &&
			round.status === 'Active' &&
			round.matches.every((match) => {
				return match.score1 !== 0 || match.score2 !== 0;
			})
	);
	let endRoundForm = $state(false);

	let endTourEnabled = $derived(
		tournament.status === 'Active' && round && round.status === 'Completed'
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
		const roundPlayers = [];
		tournament.players.forEach((player, i) => {
			if (!tournament.settings.inactivePlayers.includes(player)) {
				roundPlayers.push(player);
			}
		});
		// shuffle players
		for (let i = roundPlayers.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[roundPlayers[i], roundPlayers[j]] = [roundPlayers[j], roundPlayers[i]];
		}
		// generate all matches
		const matchns = [];
		const usedPins = [];
		// create matchns: 2v2 as much as possible, then 2v1, 1v1, or bye
		const rest = roundPlayers.length % 4;
		const fullMatchCount = (roundPlayers.length - rest) / 4;

		const rid = round ? round.rid + 1 : 1;

		// Generate 2v2 matches
		for (let i = 0; i < fullMatchCount; i++) {
			const idx = i * 4;
			const team1 = [roundPlayers[idx], roundPlayers[idx + 1]];
			const team2 = [roundPlayers[idx + 2], roundPlayers[idx + 3]];
			let pin = randomPin(pins, true, true, true, true, usedPins);
			if (pin) {
				usedPins.push(pin.id);
			}
			matchns.push({
				name: tournament.name + ' - Runde ' + rid.toString() + ' - Match ' + (matchns.length + 1),
				team1: team1,
				team2: team2,
				score1: 0,
				score2: 0,
				pin: pin.id
			});
		}

		// Handle remaining players
		const remainingStart = fullMatchCount * 4;
		if (rest === 3) {
			// 2v1 match
			let pin = randomPin(pins, true, true, true, true, usedPins);
			if (pin) {
				usedPins.push(pin.id);
			}
			matchns.push({
				name: tournament.name + ' - Runde ' + rid.toString() + ' - Match ' + (matchns.length + 1),
				team1: [roundPlayers[remainingStart], roundPlayers[remainingStart + 1]],
				team2: [roundPlayers[remainingStart + 2]],
				score1: 0,
				score2: 0,
				pin: pin.id
			});
		} else if (rest === 2) {
			// 1v1 match
			let pin = randomPin(pins, true, true, true, true, usedPins);
			if (pin) {
				usedPins.push(pin.id);
			}
			matchns.push({
				name: tournament.name + ' - Runde ' + rid.toString() + ' - Match ' + (matchns.length + 1),
				team1: [roundPlayers[remainingStart]],
				team2: [roundPlayers[remainingStart + 1]],
				score1: 0,
				score2: 0,
				pin: pin.id
			});
		} else if (rest === 1) {
			// Bye (Freilos)
			matchns.push({
				name: tournament.name + ' - Runde ' + rid.toString() + ' - Match ' + (matchns.length + 1),
				team1: [roundPlayers[remainingStart]],
				team2: [],
				score1: 1,
				score2: 0,
				pin: '' // No pin needed for bye
			});
		}

		// create round
		const response = await fetch('/api/tournament/' + tournament.id + '/round?addMatches', {
			method: 'POST',
			body: JSON.stringify({
				tid: tournament.id,
				rid: rid,
				name: tournament.name + ' - Runde ' + rid.toString(),
				status: 'Active',
				players: [],
				settings: {},
				matches: matchns
			}),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
		const result = await response.json();
		if (response.status !== 200) {
			alert(JSON.stringify(result));
			return;
		}
		startRoundForm = false;
		successForm = true;
		successMessage = 'Die nächste Runde wurde erfolgreich gestartet!';
		invalidateAll();
	}

	async function endRound() {
		const response = await fetch('/api/round/' + round.id, {
			method: 'PUT',
			body: JSON.stringify({
				status: 'Completed',
				results: {}
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
		endRoundForm = false;
		successForm = true;
		successMessage = 'Die Runde wurde erfolgreich beendet!';
		invalidateAll();
	}

	async function endTour() {
		const response = await fetch('/api/tournament/' + tournament.id, {
			method: 'PUT',
			body: JSON.stringify({
				status: 'Completed',
				results: round.results
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
		successMessage = 'Das Turnier wurde erfolgreich beendet!';
		invalidateAll();
	}

	const startTourPrepare = () => {
		startTourForm = true;
	};

	const startRoundPrepare = () => {
		startRoundForm = true;
	};

	const endRoundPrepare = () => {
		endRoundForm = true;
	};

	const endTourPrepare = () => {
		endTourForm = true;
	};
</script>

<Box
	title={'Turnier starten'}
	description={'Wenn das Turnier gestartet wurde, kann die Spielerliste noch geändert werden. ' +
		'Ab sofort kann die erste Runde gestartet werden.'}
	action={() => (startTourForm = true)}
	enabled={startTourEnabled}
	buttonOk={'Starten'}
	loading={false}
/>

<Sure
	show={startTourForm}
	title={'Turnier starten'}
	message="Soll das Turnier wirklich gestartet werden?"
	actionOk={startTour}
	actionCancel={() => (startTourForm = false)}
	buttonOk={'Ja, starten'}
/>

<Box
	title={'Neue Runde starten'}
	description={'Matches werden ausgelost und die Runde gestartet.'}
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
	description={'Die aktuelle Runde wird beendet und die Rangfolge neu berechnet. ' +
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

<Box
	title={'Turnier beenden'}
	description={'Das Turnier kann beendet wurden, wenn keine neue Runde mehr gespielt werden soll.'}
	action={() => (endTourForm = true)}
	enabled={endTourEnabled}
	buttonOk={'Beenden'}
	loading={false}
/>

<Sure
	show={endTourForm}
	title={'Turnier beenden'}
	message={'Soll das Turnier wirklich beendet werden?'}
	actionOk={endTour}
	actionCancel={() => (endTourForm = false)}
	buttonOk={'Ja, beenden'}
/>
