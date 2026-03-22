<script>
	import { Card, Badge, Select } from 'flowbite-svelte';
	import TourBreadcrumb from '$lib/components/TourBreadcrumb.svelte';
	import { page } from '$app/state';
	import { innerWidth } from 'svelte/reactivity/window';
	import { mapDate } from '$lib/TypeUtil';
	import { getPinName } from '$lib/PinUtil';
	import PinName from '$lib/components/PinName.svelte';
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

	const rounds = $derived(data.rounds);
	const allPlayers = $derived(data.players);
	const tourPlayers = $derived(data.tournament.players);

	const getPlayerName = (player, short) => {
		return _getPlayerName(player, allPlayers, short);
	};

	const playerMap = $derived.by(() => {
		const sorted = [...tourPlayers];
		sortPlayerIDs(sorted, allPlayers);
		return sorted.map((player) => ({ value: player, name: getPlayerName(player) }));
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
	<TourBreadcrumb {tournament} {round} />

	<div class="flex flex-wrap items-center gap-3">
		<p class="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">Spieler-Statistiken für:</p>
		<Select
			class="w-fit"
			placeholder="Auswählen ..."
			items={playerMap}
			bind:value={selected}
			onchange={playerChanged}
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
							<PinName name={getPinName(match.pin, data.pins)} />
						</div>
					{/if}
				</div>
			{/each}
		{/if}
	</div>

	<p class="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">Verfügbare Gegner</p>

	<div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
		<div class="grid grid-cols-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
			<div class="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-center flex items-center justify-center gap-1.5">
				<svg class="w-4 h-4 text-red-500 dark:text-red-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 17.5L3 6V3h3l11.5 11.5"/><path d="M13 19l6-6 2 2-6 6-2-2z" fill="currentColor" stroke="none"/><path d="M9.5 17.5L21 6V3h-3L6.5 14.5"/><path d="M11 19l-6-6-2 2 6 6 2-2z" fill="currentColor" stroke="none"/></svg>
				Als Herausforderer
			</div>
			<div class="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-center flex items-center justify-center gap-1.5">
				<svg class="w-4 h-4 text-blue-500 dark:text-blue-400 shrink-0" viewBox="0 0 512 512" fill="currentColor"><path d="M256 0C114.6 0 64 64 64 64v224c0 141.4 150 224 192 224s192-82.6 192-224V64S397.4 0 256 0zm0 480c-26.5 0-160-70.4-160-192V83.2C121.6 67.2 166.4 32 256 32s134.4 35.2 160 51.2V288c0 121.6-133.5 192-160 192z"/><path d="M256 64c-70.7 0-128 21.3-128 32v192c0 106 96 160 128 160s128-54 128-160V96c0-10.7-57.3-32-128-32z" opacity=".2"/></svg>
				Als Herausgeforderter
			</div>
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
