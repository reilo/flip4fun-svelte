<script>
	import { invalidateAll } from '$app/navigation';
	import { randomPin, getOldTypes, getNewTypes } from '$lib/PinUtil';
	import { calcInitialLevels, calcPlayingLevels, calcFinalResults, mapTourStatus } from '$lib/TourUtil';
	import { hasFrameResult } from '$lib/FrameUtil';
	import Success from '$lib/components/dialogs/Success.svelte';
	import Sure from '$lib/components/dialogs/Sure.svelte';
	import { Card, Badge, Heading } from 'flowbite-svelte';
	import { PlayOutline, CheckCircleOutline, FlagOutline } from 'flowbite-svelte-icons';

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
					Nicht teilnehmende Spieler deaktivieren. Erste Runde starten.
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
					Ebenen neu berechnen. Alle Matches müssen komplett sein.
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
					Finalturnier abschließen. Alle Runden müssen komplett sein.
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
		message={'Soll das Finalturnier wirklich gestartet werden?'}
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
		message={'Soll das Finalturnier wirklich beendet werden?'}
		actionOk={endTour}
		actionCancel={() => (endTourForm = false)}
		buttonOk={'Ja, beenden'}
	/>
</div>
