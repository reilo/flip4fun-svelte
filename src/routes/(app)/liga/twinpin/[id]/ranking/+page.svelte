<script>
	import {
		Table,
		TableHead,
		TableBody,
		TableHeadCell,
		TableBodyRow,
		TableBodyCell
	} from 'flowbite-svelte';
	import { Heading, P } from 'flowbite-svelte';
	import { getPlayerName } from '$lib/PlayerUtil';
	import { calcTwinpinRanking } from '$lib/TourUtil';

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
			: calcTwinpinRanking(tournament.players, rounds)
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

<Heading tag="h5">{title}</Heading>

<Table class="mt-3" shadow hoverable={true}>
	<TableHead>
		<TableHeadCell>Platz</TableHeadCell>
		<TableHeadCell>Spieler</TableHeadCell>
		<TableHeadCell>Punkte</TableHeadCell>
	</TableHead>
	<TableBody tableBodyClass="divide-y">
		{#each ranking as rank, i}
			<TableBodyRow class={getRowColor(i)}>
				<TableBodyCell class={py} tdClass="text-center">{increment()}</TableBodyCell>
				<TableBodyCell class={py}>{getPlayerName(rank.player, players)}</TableBodyCell>
				<TableBodyCell class={py} tdClass="text-right font-mono">{rank.score}</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>
