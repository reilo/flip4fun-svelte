<script>
	import { Table, TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
	import { TableHead, TableHeadCell } from 'flowbite-svelte';
	import { Modal, Label, Input, Button, Select, Card, Badge } from 'flowbite-svelte';
	import { invalidateAll } from '$app/navigation';
	import { getPinName } from '$lib/PinUtil';
	import { getPlayerName } from '$lib/PlayerUtil';
	import { hasFrameResult } from '$lib/FrameUtil';
	import { mapTourStatus } from '$lib/TourUtil';

	let { data } = $props();

	let frames = $derived(data.frames);
	let round = $derived(data.round);
	let tournament = $derived(data.tournament);

	let showForm = $state(false);
	let frameToUpdate = $state(null);
	let scores = $state([]);
	let scoreDisplays = $state([]);
	let playedPin = $state('');

	const formatScore = (value) => {
		const num = parseInt(String(value).replace(/\D/g, ''), 10);
		return isNaN(num) ? '' : num.toLocaleString('de-DE');
	};

	const onScoreInput = (i, event) => {
		const raw = event.target.value.replace(/\D/g, '');
		const num = parseInt(raw, 10);
		scores[i] = isNaN(num) ? 0 : num;
		scoreDisplays[i] = isNaN(num) ? '' : num.toLocaleString('de-DE');
		event.target.value = scoreDisplays[i];
	};

	const pinMap = [];
	data.pins.forEach((item) => {
		if (item.active) {
			pinMap.push({ name: item.name, value: item.id });
		}
	});

	const getFrameName = (frame) => {
		return frame ? frame.name.substring(frame.name.indexOf('Ebene')) : '';
	};

	const sortFrameByResult = (frame) => {
		const sortedFrame = [];
		for (let idx = 0; idx < frame.players.length; idx++) {
			sortedFrame.push({
				player: frame.players[idx],
				score: frame.scores.length > idx ? frame.scores[idx] : 0
			});
		}
		sortedFrame.sort((a, b) => (a.score < b.score ? 1 : a.score > b.score ? -1 : 0));
		return sortedFrame;
	};

	const prepareUpdateForm = (frame) => {
		scores =
			frame.players.length === frame.scores.length
				? [...frame.scores]
				: Array(frame.players.length).fill(0);
		scoreDisplays = scores.map(formatScore);
		playedPin = frame.pin;
		showForm = true;
		frameToUpdate = frame;
	};

	async function performUpdate() {
		const data = {
			scores: scores,
			pin: playedPin
		};
		const response = await fetch('/api/frame/' + frameToUpdate.id, {
			method: 'PUT',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
		const result = await response.json();
		if (response.status !== 200) {
			alert(JSON.stringify(result));
		}
		invalidateAll();
		showForm = false;
	}

	const cancelUpdateForm = () => {
		showForm = false;
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

<Table>
	<TableHead>
		<TableHeadCell>Match</TableHeadCell>
		<TableHeadCell>Spieler</TableHeadCell>
		<TableHeadCell>Score</TableHeadCell>
		<TableHeadCell>Flipper</TableHeadCell>
		<TableHeadCell>Status</TableHeadCell>
		<TableHeadCell></TableHeadCell>
	</TableHead>
	<TableBody tableBodyClass="divide-y">
		{#each frames as frame}
			<TableBodyRow>
				<TableBodyCell class="py-2">
					{getFrameName(frame)}
				</TableBodyCell>
				<TableBodyCell>
					{#each sortFrameByResult(frame) as item}
						{getPlayerName(item.player, data.players)}<br />
					{/each}
				</TableBodyCell>
				<TableBodyCell tdClass="text-right">
					{#if frame.scores.length === frame.players.length}
						{#each sortFrameByResult(frame) as item}
							{frame.players.length > 1 ? item.score.toLocaleString() : ''}<br />
						{/each}
					{/if}
				</TableBodyCell>
				<TableBodyCell class="py-0">
					{frame.players.length > 1 ? getPinName(frame.pin, data.pins) : '(Freirunde)'}
				</TableBodyCell>
				<TableBodyCell>
					{hasFrameResult(frame) ? 'Fertig' : 'Offen'}
				</TableBodyCell>
				<TableBodyCell>
					{#if round && round.status === 'Active' && frame.players.length > 1}
						<Button on:click={() => prepareUpdateForm(frame)}>Bearbeiten</Button>
					{:else}
						<Button disabled>Bearbeiten</Button>
					{/if}
				</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>

<Modal title={getFrameName(frameToUpdate)} bind:open={showForm} autoclose={false} class="max-w-sm">
	<form class="flex flex-col space-y-2" action="#">
		{#each frameToUpdate.players as player, i}
			<Label class="space-y-2">
				<span>{getPlayerName(player, data.players)}</span>
				<Input
					type="text"
					inputmode="numeric"
					value={scoreDisplays[i]}
					oninput={(e) => onScoreInput(i, e)}
				/>
			</Label>
		{/each}
		<Label>
			Gespielter Flipper
			<Select class="mt-4 mb-4 p-3 space-y-3 text-sm" items={pinMap} bind:value={playedPin}></Select>
		</Label>
		<Button color="alternative" on:click={performUpdate}>Speichern</Button>
		<Button color="primary" on:click={cancelUpdateForm}>Abbrechen</Button>
	</form>
</Modal>
</div>
