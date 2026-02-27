<script>
	import { Table, TableHead, TableBody, TableHeadCell, TableBodyRow, TableBodyCell, Button, Input } from 'flowbite-svelte';
	import { Heading, P, Card, Badge } from 'flowbite-svelte';
	import { getPlayerName } from '$lib/PlayerUtil';
	import { getPinName } from '$lib/PinUtil';
	import { mapTourStatus } from '$lib/TourUtil';

	let { data } = $props();

	let tournament = $derived(data.tournament);
	let round = $derived(data.round);
	let pins = $derived(data.pins);
	let players = $derived(data.players);

	const py = 'py-1';

	let title = $derived(
		!round ? 'Matches' : 'Matches - Runde ' + round.rid.toString()
	);

	let currentMatches = $derived(round && round.matches ? round.matches : []);

	// State for managing scores
	let matchStates = $state({});

	$effect(() => {
		// Initialize match states when matches change
		currentMatches.forEach((match, idx) => {
			if (!matchStates[idx]) {
				matchStates[idx] = {
					score1: match.score1,
					score2: match.score2
				};
			}
		});
	});

	const getRowColor = (i) => {
		return i % 2 ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-800';
	};

	const formatTeamNames = (team) => {
		if (!team || team.length === 0) return 'Freilos';
		return team.map((player) => getPlayerName(player, players)).join(', ');
	};

	const getWinner = (score1, score2) => {
		if (score1 === null || score2 === null) return null;
		if (score1 > score2) return 1;
		if (score2 > score1) return 2;
		return 0; // Tie
	};

	const setWinner = (matchIdx, winnerTeam) => {
		const match = currentMatches[matchIdx];
		if (!matchStates[matchIdx]) matchStates[matchIdx] = {};

		if (winnerTeam === 1) {
			matchStates[matchIdx].score1 = 1;
			matchStates[matchIdx].score2 = 0;
		} else if (winnerTeam === 2) {
			matchStates[matchIdx].score1 = 0;
			matchStates[matchIdx].score2 = 1;
		}
		saveMatch(matchIdx);
	};

	const updateScore = (matchIdx, team, value) => {
		if (!matchStates[matchIdx]) matchStates[matchIdx] = {};
		const score = parseInt(value) || 0;
		if (team === 1) {
			matchStates[matchIdx].score1 = score;
		} else {
			matchStates[matchIdx].score2 = score;
		}
		saveMatch(matchIdx);
	};

	const saveMatch = async (matchIdx) => {
		const match = currentMatches[matchIdx];
		const state = matchStates[matchIdx];

		const response = await fetch('/api/matchn/' + match.id, {
			method: 'PUT',
			body: JSON.stringify({
				score1: state.score1,
				score2: state.score2
			}),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});

		if (response.ok) {
			// Update the match in currentMatches
			match.score1 = state.score1;
			match.score2 = state.score2;
		} else {
			alert('Fehler beim Speichern des Matches');
		}
	};

</script>

<div class="space-y-4">
	<Card class="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 border-blue-200 dark:border-blue-700 w-full !p-3">
		<div class="space-y-2">
			<div class="flex items-center gap-3">
				<span class="text-lg font-bold text-gray-800 dark:text-white">{tournament.name}</span>
				<Badge color={tournament.status === 'Planned' ? 'yellow' : tournament.status === 'Active' ? 'green' : 'blue'}>{mapTourStatus(tournament.status)}</Badge>
			</div>
			{#if round}
				<hr class="border-blue-200 dark:border-blue-700" />
				<div class="flex items-center gap-3">
					<span class="text-sm text-gray-600 dark:text-gray-300"><span class="font-semibold">Runde</span> {round.rid}</span>
					<Badge color={round.status === 'Active' ? 'green' : 'blue'}>{mapTourStatus(round.status)}</Badge>
				</div>
			{/if}
		</div>
	</Card>

	<Heading tag="h5">{title}</Heading>

{#if currentMatches && currentMatches.length > 0}
	<div class="space-y-4 mt-4">
		{#each currentMatches as match, matchIdx}
			<div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
				<div class="grid grid-cols-4 gap-4 items-start">
					<!-- Left column: Match number -->
					<div class="flex flex-col items-center justify-center">
						<div class="text-2xl font-bold text-gray-400">{matchIdx + 1}</div>
						<p class="text-sm text-gray-500 mt-2 text-center">{match.pin ? getPinName(match.pin, pins) : 'Freilos'}</p>
					</div>

					<!-- Team 1 -->
					<div class="border rounded p-3">
						<p class="text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">{formatTeamNames(match.team1)}</p>
						<div class="flex gap-2 items-center">
							<span class="text-lg font-mono w-8 text-center text-gray-900 dark:text-gray-100">{matchStates[matchIdx]?.score1 ?? match.score1}</span>
							<Button
								size="sm"
								color={getWinner(matchStates[matchIdx]?.score1, matchStates[matchIdx]?.score2) === 1 ? 'green' : 'light'}
								disabled={round?.status === 'Completed'}
								on:click={() => setWinner(matchIdx, 1)}
							>
								Winner
							</Button>
						</div>
					</div>

					<!-- Team 2 -->
					<div class="border rounded p-3">
						<p class="text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">{formatTeamNames(match.team2)}</p>
						<div class="flex gap-2 items-center">
							<span class="text-lg font-mono w-8 text-center text-gray-900 dark:text-gray-100">{matchStates[matchIdx]?.score2 ?? match.score2}</span>
							<Button
								size="sm"
								color={getWinner(matchStates[matchIdx]?.score1, matchStates[matchIdx]?.score2) === 2 ? 'green' : 'light'}
								disabled={round?.status === 'Completed'}
								on:click={() => setWinner(matchIdx, 2)}
							>
								Winner
							</Button>
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>
{:else}
	<P class="mt-4 text-gray-500">Keine Matches für diese Runde vorhanden.</P>
{/if}
</div>
