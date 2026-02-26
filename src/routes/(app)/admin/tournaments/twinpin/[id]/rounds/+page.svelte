<script>
	import { invalidateAll } from '$app/navigation';
	import { randomPin, getOldTypes, getNewTypes } from '$lib/PinUtil';
	import { hasFrameResult } from '$lib/FrameUtil';
	import { mapTourStatus } from '$lib/TourUtil';
	import { Card, Badge, Heading } from 'flowbite-svelte';
	import Success from '$lib/components/dialogs/Success.svelte';
	import Sure from '$lib/components/dialogs/Sure.svelte';
	import { PlayOutline, CheckCircleOutline, FlagOutline } from 'flowbite-svelte-icons';

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
			roundPlayers.push(player);
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
		const allowBye = tournament.settings.allowBye;
		const rest = roundPlayers.length % 4;
		// If bye is not allowed and we'd have 1 leftover, steal one 2v2 group to get 5 remaining
		const byeCase = rest === 1 && !allowBye;
		const fullMatchCount = byeCase
			? (roundPlayers.length - 5) / 4
			: (roundPlayers.length - rest) / 4;

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
		if (byeCase) {
			// 5 remaining: split into 2v1 + 1v1 (no bye)
			let pin1 = randomPin(pins, true, true, true, true, usedPins);
			if (pin1) {
				usedPins.push(pin1.id);
			}
			matchns.push({
				name: tournament.name + ' - Runde ' + rid.toString() + ' - Match ' + (matchns.length + 1),
				team1: [roundPlayers[remainingStart], roundPlayers[remainingStart + 1]],
				team2: [roundPlayers[remainingStart + 2]],
				score1: 0,
				score2: 0,
				pin: pin1.id
			});
			let pin2 = randomPin(pins, true, true, true, true, usedPins);
			if (pin2) {
				usedPins.push(pin2.id);
			}
			matchns.push({
				name: tournament.name + ' - Runde ' + rid.toString() + ' - Match ' + (matchns.length + 1),
				team1: [roundPlayers[remainingStart + 3]],
				team2: [roundPlayers[remainingStart + 4]],
				score1: 0,
				score2: 0,
				pin: pin2.id
			});
		} else if (rest === 3) {
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
			// Bye (Freilos) — only reached when allowBye is true
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
</script>

<div class="space-y-6">
	<!-- Status Summary -->
	<Card class="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 border-blue-200 dark:border-blue-700">
		<div class="flex items-start justify-between">
			<div>
				<p class="text-lg text-gray-600 dark:text-gray-300">
					{#if round}
						<span class="font-semibold">Aktuelle Runde:</span> {round.rid} / Status: <Badge color={round.status === 'Active' ? 'green' : 'blue'}>{mapTourStatus(round.status)}</Badge>
					{:else}
						<span class="font-semibold">Status:</span> <Badge color={tournament.status === 'Planned' ? 'yellow' : 'green'}>{mapTourStatus(tournament.status)}</Badge>
					{/if}
				</p>
			</div>
		</div>
	</Card>

	<!-- Action Cards Grid -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
		<!-- Start Tour Card -->
		<Card class="hover:shadow-lg transition-shadow">
			<div class="flex flex-col h-full">
				<div class="flex items-center gap-3 mb-3">
					<div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
						<PlayOutline class="w-5 h-5 text-blue-600 dark:text-blue-300" />
					</div>
					<Heading tag="h5" class="text-lg font-bold text-gray-900 dark:text-white">
						Turnier starten
					</Heading>
				</div>
				<p class="text-base text-gray-600 dark:text-gray-400 mb-4">
					Erste Runde kann gestartet werden.
				</p>
				{#if !startTourEnabled}
					<Badge color="gray" class="mb-3">Nicht verfügbar</Badge>
				{/if}
				<button 
					disabled={!startTourEnabled}
					onclick={() => (startTourForm = true)}
					class="w-full px-4 py-2 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center justify-center gap-2 mt-auto"
				>
					<PlayOutline class="w-4 h-4" />
					Starten
				</button>
			</div>
		</Card>

		<!-- Start Round Card -->
		<Card class="hover:shadow-lg transition-shadow">
			<div class="flex flex-col h-full">
				<div class="flex items-center gap-3 mb-3">
					<div class="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
						<PlayOutline class="w-5 h-5 text-green-600 dark:text-green-300" />
					</div>
					<Heading tag="h5" class="text-lg font-bold text-gray-900 dark:text-white">
						Neue Runde
					</Heading>
				</div>
				<p class="text-base text-gray-600 dark:text-gray-400 mb-4">
					Matches auslosen und Runde starten.
				</p>
				{#if !startRoundEnabled}
					<Badge color="gray" class="mb-3">
						{#if tournament.status !== 'Active'}
							Warte auf Turnier-Start
						{:else if round && round.status === 'Active'}
							Runde noch aktiv
						{:else}
							Nicht verfügbar
						{/if}
					</Badge>
				{/if}
				<button 
					disabled={!startRoundEnabled}
					onclick={() => (startRoundForm = true)}
					class="w-full px-4 py-2 text-base font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center justify-center gap-2 mt-auto"
				>
					<PlayOutline class="w-4 h-4" />
					Starten
				</button>
			</div>
		</Card>

		<!-- End Round Card -->
		<Card class="hover:shadow-lg transition-shadow">
			<div class="flex flex-col h-full">
				<div class="flex items-center gap-3 mb-3">
					<div class="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
						<CheckCircleOutline class="w-5 h-5 text-amber-600 dark:text-amber-300" />
					</div>
					<Heading tag="h5" class="text-lg font-bold text-gray-900 dark:text-white">
						Runde beenden
					</Heading>
				</div>
				<p class="text-base text-gray-600 dark:text-gray-400 mb-4">
					Rangfolge neu berechnen. Alle Matches müssen komplett sein.
				</p>
				{#if !endRoundEnabled}
					<Badge color="gray" class="mb-3">
						{#if !round}
							Keine aktive Runde
						{:else}
							Nicht alle Matches fertig
						{/if}
					</Badge>
				{/if}
				<button 
					disabled={!endRoundEnabled}
					onclick={() => (endRoundForm = true)}
					class="w-full px-4 py-2 text-base font-medium text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center justify-center gap-2 mt-auto"
				>
					<CheckCircleOutline class="w-4 h-4" />
					Beenden
				</button>
			</div>
		</Card>

		<!-- End Tour Card -->
		<Card class="hover:shadow-lg transition-shadow">
			<div class="flex flex-col h-full">
				<div class="flex items-center gap-3 mb-3">
					<div class="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
						<FlagOutline class="w-5 h-5 text-purple-600 dark:text-purple-300" />
					</div>
					<Heading tag="h5" class="text-lg font-bold text-gray-900 dark:text-white">
						Turnier beenden
					</Heading>
				</div>
				<p class="text-base text-gray-600 dark:text-gray-400 mb-4">
					Turnier abschließen. Keine weiteren Runden möglich.
				</p>
				{#if !endTourEnabled}
					<Badge color="gray" class="mb-3">
						Warte auf Rundenabschluss
					</Badge>
				{/if}
				<button 
					disabled={!endTourEnabled}
					onclick={() => (endTourForm = true)}
					class="w-full px-4 py-2 text-base font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center justify-center gap-2 mt-auto"
				>
					<FlagOutline class="w-4 h-4" />
					Beenden
				</button>
			</div>
		</Card>
	</div>

	<!-- Dialogs -->
	<Sure
		show={startTourForm}
		title={'Turnier starten'}
		message="Soll das Turnier wirklich gestartet werden?"
		actionOk={startTour}
		actionCancel={() => (startTourForm = false)}
		buttonOk={'Ja, starten'}
	/>

	<Sure
		show={startRoundForm}
		title={'Runde starten'}
		message={'Soll wirklich eine neue Runde gestartet werden?'}
		actionOk={startRound}
		actionCancel={() => (startRoundForm = false)}
		buttonOk={'Ja, starten'}
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

	<Sure
		show={endTourForm}
		title={'Turnier beenden'}
		message={'Soll das Turnier wirklich beendet werden?'}
		actionOk={endTour}
		actionCancel={() => (endTourForm = false)}
		buttonOk={'Ja, beenden'}
	/>
</div>
