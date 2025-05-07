<script>
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Modal,
		Label,
		Input,
		Button
	} from 'flowbite-svelte';
	import { invalidateAll } from '$app/navigation';
	import { getPinName } from '$lib/PinUtil';
	import { getPlayerName } from '$lib/PlayerUtil';

	let { data } = $props();

	let players = $derived(data.players);
	let pins = $derived(data.pins);
	let frames = $derived(data.frames);

	let showForm = $state(false);
	let frameToUpdate = $state(null);
	let scores = $state([]);

	const getFrameName = (frame) => {
		return frame ? frame.name.substring(frame.name.indexOf('Ebene')) : '';
	};

	const prepareUpdateForm = (frame) => {
		scores =
			frame.players.length === frame.scores.length
				? [...frame.scores]
				: Array(frame.players.length).fill(0);
		showForm = true;
		frameToUpdate = frame;
	};

	async function performUpdate() {
		const data = {
			scores: scores
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
					{#each frame.players as player}
						{getPlayerName(player, players)}<br />
					{/each}
				</TableBodyCell>
				<TableBodyCell>
					{#if frame.scores.length === frame.players.length}
						{#each frame.scores as score}
							{score}<br />
						{/each}
					{/if}
				</TableBodyCell>
				<TableBodyCell class="py-0">
					{getPinName(frame.pin, pins)}
				</TableBodyCell>
				<TableBodyCell>
					{frame.scores.length > 0 &&
					frame.scores.every((score) => {
						return score > 0;
					})
						? 'Fertig'
						: 'Offen'}
				</TableBodyCell>
				<TableBodyCell>
					<Button on:click={() => prepareUpdateForm(frame)}>Bearbeiten</Button>
				</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>

<Modal title={getFrameName(frameToUpdate)} bind:open={showForm} autoclose={false} class="max-w-sm">
	<form class="flex flex-col space-y-2" action="#">
		{#each frameToUpdate.players as player, i}
			<Label class="space-y-2">
				<span>{getPlayerName(player, players)}</span>
				<Input type="number" bind:value={scores[i]} />
			</Label>
		{/each}
		<Button color="alternative" on:click={performUpdate}>Speichern</Button>
		<Button color="primary" on:click={cancelUpdateForm}>Abbrechen</Button>
	</form>
</Modal>