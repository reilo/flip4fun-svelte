<script>
	import { invalidateAll } from '$app/navigation';
	import { calcStrength } from '$lib/TourUtil';
	import { roundNumberForDB } from '$lib/TypeUtil';
	import Success from '$lib/components/dialogs/Success.svelte';
	import Sure from '$lib/components/dialogs/Sure.svelte';
	import Box from '$lib/components/Box.svelte';

	let { data } = $props();

	let tournament = $derived(data.tournament);
	let round = $derived(data.round);

	let startTourEnabled = $derived(tournament.status === 'Planned');
	let startTourForm = $state(false);

	let startRoundEnabled = $derived(
		tournament.status === 'Active' && (!round || round.status === 'Completed')
	);
	let startRoundForm = $state(false);

	let endRoundEnabled = $derived(
		tournament.status === 'Active' && round && round.status === 'Active'
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
		if (!round) {
			// it is the first round of the tournament
			let previousStrength = calcStrength(1, pcount);
			let currentPlayers = [];
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
							score: count === 1 ? 1 : roundNumberForDB((count - j - 1) / (count - 1))
						});
					});
					rankInit.unshift({ level: previousStrength, players: newPlayers });
					previousStrength = strength;
					currentPlayers = [player];
				}
			});
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
		console.log(rankInit);
		console.log(playingLevels);
		startRoundForm = false;
		successForm = true;
		successMessage = 'Die neue Runde wurde erfolgreich gestartet!';
		invalidateAll();
	}

	async function endRound() {
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
	action={startTour}
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
	action={startRound}
	buttonOk={'Ja, starten'}
/>

<Box
	title={'Runde beenden'}
	description={'Die aktuelle Runde wird beendet und die Ebenen neu berechnet.'}
	action={() => (endRoundForm = true)}
	enabled={endRoundEnabled}
	buttonOk={'Beenden'}
	loading={false}
/>

<Sure
	show={endRoundForm}
	title={'Runde beenden'}
	message={'Soll die aktuelle Runde wirklich beendet werden?'}
	action={endRound}
	buttonOk={'Ja, beenden'}
/>

<Success show={successForm} message={successMessage} />
