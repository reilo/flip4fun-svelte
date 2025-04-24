<script>
	import { Heading, P } from 'flowbite-svelte';
	import { Table, TableHead, TableBody } from 'flowbite-svelte';
	import { TableHeadCell, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
	import { Select } from 'flowbite-svelte';
	import { Card, Listgroup, Avatar } from 'flowbite-svelte';
	import { page } from '$app/state';
	import { innerWidth } from 'svelte/reactivity/window';
	import { mapDate } from '$lib/TypeUtil';
	import { getPinName } from '$lib/PinUtil';
	import { sortPlayerIDs } from '$lib/PlayerUtil';
	import { getPlayerName as _getPlayerName } from '$lib/PlayerUtil';

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

	let countMatches = $state(0);
	let countSets = $state(0);
	let pinActivity = $state([]);
	let roundActivity = $state([]);
	let playerActivity = $state([]);

	const initData = () => {
		countMatches = 0;
		countSets = 0;
		pinActivity = [];
		data.pins.forEach((pin) => {
			pinActivity.push({ id: pin.id, count: 0 });
		});
		roundActivity = [];
		playerActivity = [];
		data.tournament.players.forEach((player) => {
			playerActivity.push({ id: player, count: 0 });
		});

		rounds.forEach((round, i) => {
			countMatches += round.matches.length;
			roundActivity.push({ num: i + 1, date: round.created, count: round.matches.length });
			round.matches.forEach((match) => {
				countSets += match.score1 + match.score2;
				pinActivity[pinActivity.findIndex((pin) => pin.id === match.pin)].count++;
				playerActivity[playerActivity.findIndex((player) => player.id === match.player1)].count++;
				playerActivity[playerActivity.findIndex((player) => player.id === match.player2)].count++;
			});
		});
		pinActivity.sort((a, b) => (a.count < b.count ? 1 : b.count < a.count ? -1 : 0));
		playerActivity.sort((a, b) => (a.count < b.count ? 1 : b.count < a.count ? -1 : 0));
		roundActivity.sort((a, b) => (a.count < b.count ? 1 : b.count < a.count ? -1 : 0));

		if (pinActivity.length > 5) {
			pinActivity.splice(5);
		}
		if (playerActivity.length > 5) {
			playerActivity.splice(5);
		}
		if (roundActivity.length > 5) {
			roundActivity.splice(5);
		}
	};

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
	initData();
</script>

<Heading tag="h5" class="mb-3"
	>Bisher wurden {countMatches} Matches in {countSets} Sätzen gespielt!</Heading
>

<div class="flex flex-1 flex-col md:flex-row justify-center content-center gap-3">

	<div>
		<Card padding="xl" size="md" class="mb-3">
			<div class="flex justify-between items-center mb-4">
				<h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">
					Aktivste Spieler
				</h5>
			</div>
			<Listgroup items={playerActivity} let:item class="border-0 dark:bg-transparent!">
				<div class="flex items-center space-x-4 rtl:space-x-reverse">
					<Avatar src={'/photos/' + item.id + '.jpg'} />
					<div class="flex-1 min-w-0">
						<p class="text-sm font-medium text-gray-900 truncate dark:text-white">
							{getPlayerName(item.id)}
						</p>
					</div>
					<div
						class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white"
					>
						{item.count} Matches
					</div>
				</div>
			</Listgroup>
		</Card>
	</div>

	<div>
		<Card padding="xl" size="md" class="mb-3">
			<div class="flex justify-between items-center mb-4">
				<h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">
					Am häufigsten gespielte Flipper
				</h5>
			</div>
			<Listgroup items={pinActivity} let:item class="border-0 dark:bg-transparent!">
				<div class="flex items-center space-x-4 rtl:space-x-reverse">
					<Avatar src={'/favicon.png'} />
					<div class="flex-1 min-w-0">
						<p class="text-sm font-medium text-gray-900 truncate dark:text-white">
							{getPinName(item.id, data.pins)}
						</p>
					</div>
					<div
						class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white"
					>
						{item.count} mal gespielt
					</div>
				</div>
			</Listgroup>
		</Card>
	</div>

	<div>
		<Card padding="xl" size="md" class="mb-3">
			<div class="flex justify-between items-center mb-4">
				<h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">
					Aktivste Spieltage
				</h5>
			</div>
			<Listgroup items={roundActivity} let:item class="border-0 dark:bg-transparent!">
				<div class="flex items-center space-x-4 rtl:space-x-reverse">
					<div class="flex-1 min-w-0">
						<p class="text-sm font-medium text-gray-900 truncate dark:text-white">
							Spieltag {item.num}
						</p>
						<p class="text-sm text-gray-500 truncate dark:text-gray-400">
							{mapDate(item.date)}
						</p>
					</div>
					<div
						class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white"
					>
						{item.count} Matches
					</div>
				</div>
			</Listgroup>
		</Card>
	</div>
</div>

<div>
	<Heading tag="h5">Spieler-Statistiken für:</Heading>

	<div>
		<Select
			class="mt-2 w-fit mb-3"
			placeholder="Auswählen ..."
			items={playerMap}
			bind:value={selected}
			on:change={playerChanged}
		/>
	</div>

	{#if selected}
		<Table shadow hoverable={true}>
			<TableHead>
				{#if isPhone}
					<TableHeadCell class="text-center">Spiel<br />tag</TableHeadCell>
				{:else}
					<TableHeadCell class="text-center">Spieltag</TableHeadCell>
				{/if}
				{#if !isPhone}
					<TableHeadCell class="text-center">Datum</TableHeadCell>
				{/if}
				<TableHeadCell class="text-right">{isPhone ? 'Sp. 1' : 'Spieler 1'}</TableHeadCell>
				<TableHeadCell class="text-center"></TableHeadCell>
				<TableHeadCell class="text-left">{isPhone ? 'Sp. 2' : 'Spieler 2'}</TableHeadCell>
				<TableHeadCell class="text-center">Sätze</TableHeadCell>
				{#if !isPhone}
					<TableHeadCell class="text-center">Flipper</TableHeadCell>
				{/if}
			</TableHead>
			<TableBody tableBodyClass="divide-y">
				{#if !matches.length}
					noch keine Matches
				{:else}
					{#each matches as match, i}
						<TableBodyRow>
							<TableBodyCell tdClass="text-center">
								{match.round}
							</TableBodyCell>
							{#if !isPhone}
								<TableBodyCell tdClass="text-center">
									{mapDate(match.created)}
								</TableBodyCell>
							{/if}
							<TableBodyCell tdClass="text-right">
								<div
									style={match.score1 > match.score2
										? 'color:green; text-decoration:underline;'
										: 'color:default;'}
								>
									{getPlayerName(match.player1, isPhone)}
								</div>
							</TableBodyCell>
							<TableBodyCell></TableBodyCell>
							<TableBodyCell tdClass="text-left">
								<div
									style={match.score1 < match.score2
										? 'color:green; text-decoration:underline;'
										: 'color:default;'}
								>
									{getPlayerName(match.player2, isPhone)}
								</div>
							</TableBodyCell>
							<TableBodyCell tdClass="text-center">
								{match.score1 + ' - ' + match.score2}
							</TableBodyCell>
							{#if !isPhone}
								<TableBodyCell tdClass="text-center">
									{getPinName(match.pin, data.pins)}
								</TableBodyCell>
							{/if}
						</TableBodyRow>
					{/each}
				{/if}
			</TableBody>
		</Table>

		<div>
			<Heading tag="h6" class="mt-3 mb-3">Verfügbare Gegner</Heading>
		</div>

		<Table shadow hoverable={true}>
			<TableHead>
				<TableHeadCell class="text-center">Als Herausforderer</TableHeadCell>
				<TableHeadCell class="text-center">Als Herausgeforderter</TableHeadCell>
			</TableHead>
			<TableBody tableBodyClass="divide-y">
				{#each tourPlayers as player}
					{#if player !== selected}
						<TableBodyRow>
							<TableBodyCell tdClass="text-center">
								{#if opponents1.includes(player)}
									<del>{getPlayerName(player)}</del>
								{:else}
									{getPlayerName(player)}
								{/if}
							</TableBodyCell>
							<TableBodyCell tdClass="text-center">
								{#if opponents2.includes(player)}
									<del>{getPlayerName(player)}</del>
								{:else}
									{getPlayerName(player)}
								{/if}
							</TableBodyCell>
						</TableBodyRow>
					{/if}
				{/each}
			</TableBody>
		</Table>
	{/if}
</div>
