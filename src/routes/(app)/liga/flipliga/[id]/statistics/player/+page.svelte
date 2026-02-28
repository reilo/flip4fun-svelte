<script>
	import { Card, Badge, Select } from 'flowbite-svelte';
	import { page } from '$app/state';
	import { innerWidth } from 'svelte/reactivity/window';
	import { mapDate } from '$lib/TypeUtil';
	import { getPinName } from '$lib/PinUtil';
	import { sortPlayerIDs } from '$lib/PlayerUtil';
	import { getPlayerName as _getPlayerName } from '$lib/PlayerUtil';
	import { mapTourStatus } from '$lib/TourUtil';

	let isPhone = $derived(innerWidth.current <= 480);

	let { data } = $props();

	const initPage = () => {
		if (page.url.searchParams.has('player')) {
			selected = page.url.searchParams.get('player');
			playerChanged();
		}
	};

	let selected = $state('');

	const rounds = data.rounds;
	const allPlayers = data.players;
	const tourPlayers = data.tournament.players;
	sortPlayerIDs(tourPlayers, allPlayers);

	const getPlayerName = (player, short) => {
		return _getPlayerName(player, allPlayers, short);
	};

	let playerMap = [];
	tourPlayers.forEach((player) => {
		playerMap.push({ value: player, name: getPlayerName(player) });
	});

	let matches = $state([]);
	let opponents1 = $state([]); // vom aktuellen Spieler herausgeforderte Gegner
	let opponents2 = $state([]); // Gegner, die aktuellen Spieler herausgefordert haben

	const playerChanged = () => {
		let opps1 = [];
		let opps2 = [];
		opponents1 = [];
		opponents2 = [];
		matches = [];
		data.tournament.players.forEach((item) => {
			opps1.push({ p: item, e: 0 });
			opps2.push({ p: item, e: 0 });
		});
		rounds.forEach((round) => {
			round.matches.forEach((match) => {
				if (match.player1 === selected || match.player2 === selected) {
					let newMatch = JSON.parse(JSON.stringify(match));
					newMatch.round = round.rid;
					matches.push(newMatch);
					if (match.player1 === selected) {
						const index = opps1.findIndex((opp1) => opp1.p == match.player2);
						opps1[index].e += 1;
					} else {
						const index = opps2.findIndex((opp2) => opp2.p == match.player1);
						opps2[index].e += 1;
					}
				}
			});
			opps1.forEach((item) => {
				if (item.e >= data.tournament.settings.challengeSame) {
					opponents1.push(item.p);
				}
			});
			opps2.forEach((item) => {
				if (item.e >= data.tournament.settings.challengeSame) {
					opponents2.push(item.p);
				}
			});
		});
	};

	initPage();

	let tournament = $derived(data.tournament);
	let round = $derived(data.round);
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

	<div class="flex flex-wrap items-center gap-3">
		<p class="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">Spieler-Statistiken für:</p>
		<Select
			class="w-fit"
			placeholder="Auswählen ..."
			items={playerMap}
			bind:value={selected}
			on:change={playerChanged}
		/>
	</div>

{#if selected}
	<p class="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">Matches</p>

	<div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
		<div class="grid {isPhone ? 'grid-cols-[3rem_1fr_1fr_5rem]' : 'grid-cols-[4rem_8rem_1fr_1fr_5rem_10rem]'} bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
			<div class="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-center">{isPhone ? 'Runde' : 'Spieltag'}</div>
			{#if !isPhone}
				<div class="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-center">Datum</div>
			{/if}
			<div class="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-right">{isPhone ? 'Sp. 1' : 'Spieler 1'}</div>
			<div class="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-left">{isPhone ? 'Sp. 2' : 'Spieler 2'}</div>
			<div class="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-center">Sätze</div>
			{#if !isPhone}
				<div class="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-center">Flipper</div>
			{/if}
		</div>
		{#if !matches.length}
			<div class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">Noch keine Matches</div>
		{:else}
			{#each matches as match, i}
				<div
					class="grid {isPhone ? 'grid-cols-[3rem_1fr_1fr_5rem]' : 'grid-cols-[4rem_8rem_1fr_1fr_5rem_10rem]'} items-center border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors hover:bg-blue-50 dark:hover:bg-blue-950"
					class:bg-gray-100={i % 2 === 1}
					class:dark:bg-gray-700={i % 2 === 1}
				>
					<div class="px-3 py-2 text-sm font-mono text-center text-gray-700 dark:text-gray-300">{match.round}</div>
					{#if !isPhone}
						<div class="px-3 py-2 text-sm text-center text-gray-500 dark:text-gray-400">{mapDate(match.created)}</div>
					{/if}
					<div class="px-3 py-2 text-sm text-right {match.score1 > match.score2 ? 'font-semibold text-green-600 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}">
						{getPlayerName(match.player1, isPhone)}
					</div>
					<div class="px-3 py-2 text-sm text-left {match.score1 < match.score2 ? 'font-semibold text-green-600 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}">
						{getPlayerName(match.player2, isPhone)}
					</div>
					<div class="px-3 py-2 text-sm font-mono text-center text-gray-700 dark:text-gray-300">
						{match.score1 + ' - ' + match.score2}
					</div>
					{#if !isPhone}
						<div class="px-3 py-2 text-sm text-center text-gray-700 dark:text-gray-300">
							{getPinName(match.pin, data.pins)}
						</div>
					{/if}
				</div>
			{/each}
		{/if}
	</div>

	<p class="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">Verfügbare Gegner</p>

	<div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
		<div class="grid grid-cols-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
			<div class="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-center">Als Herausforderer</div>
			<div class="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-center">Als Herausgeforderter</div>
		</div>
		{#each tourPlayers.filter(p => p !== selected) as player, i}
			<div
				class="grid grid-cols-2 items-center border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors hover:bg-blue-50 dark:hover:bg-blue-950"
				class:bg-gray-100={i % 2 === 1}
				class:dark:bg-gray-700={i % 2 === 1}
			>
				<div class="px-4 py-2 text-sm text-center {opponents1.includes(player) ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}">
					{getPlayerName(player)}
				</div>
				<div class="px-4 py-2 text-sm text-center {opponents2.includes(player) ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}">
					{getPlayerName(player)}
				</div>
			</div>
		{/each}
	</div>
{/if}

</div>
