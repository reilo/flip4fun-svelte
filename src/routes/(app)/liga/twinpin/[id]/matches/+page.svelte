<script>
	import TourBreadcrumb from '$lib/components/TourBreadcrumb.svelte';
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
	<TourBreadcrumb {tournament} {round} />

	<p class="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">{title}</p>

{#if currentMatches && currentMatches.length > 0}
	<div class="space-y-3 mt-4">
		{#each currentMatches as match, matchIdx}
			{@const winner = getWinner(matchStates[matchIdx]?.score1 ?? match.score1, matchStates[matchIdx]?.score2 ?? match.score2)}
			{@const isCompleted = round?.status === 'Completed'}
			<div class="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
				<!-- Header: match number + pin -->
				<div class="flex items-center justify-between px-3 py-1.5 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
					<span class="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">Match {matchIdx + 1}</span>
					<span class="text-xs text-gray-500 dark:text-gray-400">{match.pin ? getPinName(match.pin, pins) : '—'}</span>
				</div>
				<!-- Teams side by side -->
				<div class="grid grid-cols-2 divide-x divide-gray-200 dark:divide-gray-700">
					<!-- Team 1 -->
					<div class="p-3 flex flex-col gap-2 transition-colors {winner === 1 ? 'bg-green-50 dark:bg-green-900/20' : ''}">
						<p class="text-sm font-medium leading-snug text-gray-900 dark:text-gray-100">{formatTeamNames(match.team1)}</p>
						<button
							class="self-start text-xs font-medium px-2.5 py-1 rounded border transition-colors"
							class:bg-green-500={winner === 1}
							class:border-green-500={winner === 1}
							class:text-white={winner === 1}
							class:bg-white={winner !== 1}
							class:dark:bg-gray-800={winner !== 1}
							class:border-gray-300={winner !== 1}
							class:dark:border-gray-600={winner !== 1}
							class:text-gray-600={winner !== 1}
							class:dark:text-gray-400={winner !== 1}
							class:opacity-50={isCompleted}
							class:cursor-default={isCompleted}
							disabled={isCompleted}
							onclick={() => setWinner(matchIdx, 1)}
						>{winner === 1 ? '✓ Sieger' : 'Sieger'}</button>
					</div>
					<!-- Team 2 -->
					<div class="p-3 flex flex-col gap-2 transition-colors {winner === 2 ? 'bg-green-50 dark:bg-green-900/20' : ''}">
						<p class="text-sm font-medium leading-snug text-gray-900 dark:text-gray-100">{formatTeamNames(match.team2)}</p>
						<button
							class="self-start text-xs font-medium px-2.5 py-1 rounded border transition-colors"
							class:bg-green-500={winner === 2}
							class:border-green-500={winner === 2}
							class:text-white={winner === 2}
							class:bg-white={winner !== 2}
							class:dark:bg-gray-800={winner !== 2}
							class:border-gray-300={winner !== 2}
							class:dark:border-gray-600={winner !== 2}
							class:text-gray-600={winner !== 2}
							class:dark:text-gray-400={winner !== 2}
							class:opacity-50={isCompleted}
							class:cursor-default={isCompleted}
							disabled={isCompleted}
							onclick={() => setWinner(matchIdx, 2)}
						>{winner === 2 ? '✓ Sieger' : 'Sieger'}</button>
					</div>
				</div>
			</div>
		{/each}
	</div>
{:else}
	<p class="mt-4 text-sm text-gray-500 dark:text-gray-400">Keine Matches für diese Runde vorhanden.</p>
{/if}
</div>
