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
	import { calcInitialLevels } from '$lib/TourUtil';

	let { data } = $props();

	let tournament = $derived(data.tournament);
	let round = $derived(data.round);
	let players = $derived(data.players);

	const py = 'py-1';

	let progress = $derived(round && round.status === 'Active');
	let title = $derived(
		!round
			? 'Rangfolge Turnierbeginn'
			: (progress ? 'Rangfolge Beginn Runde ' : 'Rangfolge Ende Runde ') + round.rid.toString()
	);

	let ranking = $derived(
		!round
			? calcInitialLevels(tournament.players, tournament.settings.maxStartBonus)
			: progress
				? round.settings.rankInit
				: round.results.rankFinal
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
		<TableHeadCell>Feinwertung</TableHeadCell>
	</TableHead>
	<TableBody tableBodyClass="divide-y">
		{#each ranking.slice().reverse() as level, i}
			{#each level.players as player}
				<TableBodyRow class={getRowColor(i)}>
					<TableBodyCell class={py} tdClass="text-center">{increment()}</TableBodyCell>
					<TableBodyCell class={py}>{getPlayerName(player.id, players)}</TableBodyCell>
					<TableBodyCell class={py} tdClass="text-center">{player.fine.toFixed(2)}</TableBodyCell>
				</TableBodyRow>
			{/each}
		{/each}
	</TableBody>
</Table>
