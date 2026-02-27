<script>
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

	<p class="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">Matches</p>

	<div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
		<div class="grid grid-cols-[8rem_1fr_7rem_10rem_6rem_7rem] bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
			<div class="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Match</div>
			<div class="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Spieler</div>
			<div class="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-right">Score</div>
			<div class="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Flipper</div>
			<div class="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-center">Status</div>
			<div class="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"></div>
		</div>
		{#each frames as frame, i}
			<div class="grid grid-cols-[8rem_1fr_7rem_10rem_6rem_7rem] items-start border-b border-gray-100 dark:border-gray-700 last:border-b-0 {i % 2 === 1 ? 'bg-gray-50 dark:bg-gray-700/50' : ''}">
				<div class="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{getFrameName(frame)}</div>
				<div class="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 flex flex-col gap-0.5">
					{#each sortFrameByResult(frame) as item}
						<span>{getPlayerName(item.player, data.players)}</span>
					{/each}
				</div>
				<div class="px-4 py-2 text-sm font-mono text-right text-gray-700 dark:text-gray-300 flex flex-col gap-0.5">
					{#if frame.scores.length === frame.players.length}
						{#each sortFrameByResult(frame) as item}
							<span>{frame.players.length > 1 ? item.score.toLocaleString() : ''}</span>
						{/each}
					{/if}
				</div>
				<div class="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
					{frame.players.length > 1 ? getPinName(frame.pin, data.pins) : '(Freirunde)'}
				</div>
				<div class="px-4 py-2 flex items-start justify-center pt-3">
					<Badge color={hasFrameResult(frame) ? 'green' : 'yellow'}>{hasFrameResult(frame) ? 'Fertig' : 'Offen'}</Badge>
				</div>
				<div class="px-4 py-2">
					{#if round && round.status === 'Active' && frame.players.length > 1}
						<Button size="xs" on:click={() => prepareUpdateForm(frame)}>Bearbeiten</Button>
					{:else}
						<Button size="xs" disabled>Bearbeiten</Button>
					{/if}
				</div>
			</div>
		{/each}
	</div>

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
