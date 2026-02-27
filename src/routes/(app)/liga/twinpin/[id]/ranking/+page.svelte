<script>
	import { Table, TableHead, TableBody, TableHeadCell, TableBodyRow, TableBodyCell } from 'flowbite-svelte';
	import { Heading, P, Card, Badge } from 'flowbite-svelte';
	import { getPlayerName } from '$lib/PlayerUtil';
	import { calcTwinpinRanking, mapTourStatus } from '$lib/TourUtil';

	let { data } = $props();

	let tournament = $derived(data.tournament);
	let round = $derived(data.round);
	let rounds = $derived(data.rounds);
	let players = $derived(data.players);

	const py = 'py-1';
	const pygray = 'py-1 text-gray-400 dark:text-gray-400';

	let progress = $derived(round && round.status === 'Active');
	let title = "Aktuelle Rangfolge";

	let ranking = $derived(
		!round
			? tournament.players.map((p) => ({ player: p, score: 0 }))
			: calcTwinpinRanking(rounds)
	);

	let counter = 0;
	const increment = () => {
		counter++;
		return counter;
	};

	const getRowColor = (i) => {
		return i % 2 ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-800';
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

<Table class="mt-3" shadow hoverable={true}>
	<TableHead>
		<TableHeadCell>Platz</TableHeadCell>
		<TableHeadCell>Spieler</TableHeadCell>
		<TableHeadCell>Punkte</TableHeadCell>
	</TableHead>
	<TableBody tableBodyClass="divide-y">
		{#each ranking as rank, i}
			{@const isInTournament = tournament.players.includes(rank.player)}
			{@const cellClass = isInTournament ? py : pygray}
			<TableBodyRow class={getRowColor(i)}>
				<TableBodyCell class={cellClass} tdClass="text-center">{increment()}</TableBodyCell>
				<TableBodyCell class={cellClass}>{getPlayerName(rank.player, players)}</TableBodyCell>
				<TableBodyCell class={cellClass} tdClass="text-right font-mono">{rank.score}</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table></div>