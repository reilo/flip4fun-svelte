<script>
	import { invalidateAll } from '$app/navigation';
	import { calcStrength } from '$lib/TourUtil';
	import { roundNumberForDB } from '$lib/TypeUtil';
	import { randomPin, getOldTypes, getNewTypes } from '$lib/PinUtil';
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
		tournament.status === 'Active' && (!round || round.status === 'Completed')
	);
	let startRoundForm = $state(false);

	let endRoundEnabled = $derived(
		tournament.status === 'Active' &&
			round &&
			round.status === 'Active' &&
			frames.every((frame) => {
				return (
					frame.scores.length > 0 &&
					frame.scores.every((score) => {
						return score > 0;
					})
				);
			})
	);
	let endRoundForm = $state(false);

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
		successMessage = 'Das Start-Turnier wurde erfolgreich gestartet!';
		invalidateAll();
	}

	async function startRound() {
		const rankInit = [];
		const playingLevels = [];
		const pcount = tournament.players.length;
		const inactivePlayers = tournament.settings.inactivePlayers;
		const roundPlayers = [];
		if (!round) {
			// it is the first round of the tournament
			let previousStrength = calcStrength(1, pcount);
			let currentPlayers = [];
			// generate initial ranking levels for next round
			tournament.players.forEach((player, i) => {
				const strength = calcStrength(++i, pcount);
				if (strength === previousStrength) {
					currentPlayers.push(player);
				}
				if (strength !== previousStrength || i === pcount - 1) {
					let newPlayers = [];
					const count = currentPlayers.length;
					currentPlayers.forEach((player2, j) => {
						newPlayers.push({
							id: player2,
							fine:
								(count === 1 ? 1 : roundNumberForDB((count - j - 1) / (count - 1))) *
								tournament.settings.maxStartBonus
						});
					});
					rankInit.unshift({ level: previousStrength, players: newPlayers });
					previousStrength = strength;
					currentPlayers = [player];
				}
				if (!inactivePlayers.includes(player)) {
					roundPlayers.push(player);
				}
			});
			// generate list of levels playing in next round
			rankInit.every((row) => {
				row.players.every((player) => {
					if (!inactivePlayers.includes(player.id)) {
						playingLevels.push(row.level);
						return false;
					}
					return true;
				});
				return playingLevels.length ? false : true;
			});
		} else {
		}
		// generate all matches
		const frames = [];
		const usedPins = [];
		const pinTypes = tournament.settings.pinTypes;
		playingLevels.forEach((level) => {
			const players = [];
			rankInit[level - 1].players.forEach((item) => {
				if (!inactivePlayers.includes(item.id)) {
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
			const pin1 = randomPin(pins, true, true, true, true, usedPins);
			frames.push({ name: frameName + '1', pin: pin1.id, players: players });
			usedPins.push(pin1.id);
			const useOldPins = pinTypes === 0 || !getOldTypes().includes(pin1.type);
			const useNewPins = pinTypes === 0 || pinTypes === 2 || !getNewTypes().includes(pin1.type);
			const pin2 = randomPin(pins, useOldPins, useOldPins, useNewPins, useNewPins, usedPins);
			frames.push({ name: frameName + '2', pin: pin2.id, players: players });
			usedPins.push(pin2.id);
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
		const playerResults = [];
		// evaluate all played matches
		frames.forEach((frame) => {
			const playerScores = [];
			frame.players.forEach((player, i) => {
				playerScores.push({ player: player, score: frame.scores[i] });
			});
			playerScores.sort((a, b) => (a.score < b.score ? 1 : a.score > b.score ? -1 : 0));
			let prevScore = 0;
			let prevPos = 0;
			const maxScore = playerScores[0].score;
			playerScores.forEach((ps, i) => {
				const pos = ps.score !== prevScore ? i + 1 : prevPos;
				prevScore = ps.score;
				prevPos = pos;
				const pts = roundNumberForDB(ps.score / maxScore);
				const idx = playerResults.findIndex((pr) => pr.player === ps.player);
				if (idx === -1) {
					playerResults.push({ player: ps.player, position: pos, fine: pts });
				} else {
					playerResults[idx].position += pos;
					playerResults[idx].fine += pts;
				}
			});
		});
		// calculate new ranking
		const rankInit = round.settings.rankInit;
		const playingLevels = round.settings.playingLevels;
		const rankFinal = JSON.parse(JSON.stringify(rankInit));
		rankFinal.forEach((item, i) => {
			if (playingLevels.includes(item.level)) {
				item.players.forEach((player, j) => {
					const result = playerResults.find((pr) => pr.player === player.id);
					if (result) {
						rankFinal[i].players[j].fine += result.fine;
						rankFinal[i].players[j].position = result.position;
					}
				});
			}
		});
		// push results to DB
		const response = await fetch('/api/round/' + round.id, {
			method: 'PUT',
			body: JSON.stringify({
				results: { rankFinal: rankFinal },
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
</script>

<Box
	title={'Turnier starten'}
	description={'Sobald das Final-Turnier gestartet wurde, müssen nicht teilnehmende Spieler deaktiviert werden. ' +
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
