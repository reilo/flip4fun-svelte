<script>
	import { Heading, P, Button, Avatar } from 'flowbite-svelte';
	import { Table, TableHead, TableHeadCell } from 'flowbite-svelte';
	import { TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
	import { Checkbox, Alert } from 'flowbite-svelte';
	import { InfoCircleSolid } from 'flowbite-svelte-icons';
	import { formatPlayerName } from '$lib/PlayerUtil';

	let { data } = $props();
	let showError = $derived(!data || !data.players);

	async function updatePlayer(id, active) {
		const url = '/api/player/' + id;
		const response = await fetch(url, {
			method: 'PUT',
			body: JSON.stringify({
				active: active
			}),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
		const result = await response.json();
		if (response.status !== 200) {
			alert(JSON.stringify(result));
		}
	}
</script>

{#if showError}
	<Alert border color="red">
		<InfoCircleSolid slot="icon" class="w-5 h-5" />
		<span class="font-medium">Interner Fehler!</span>
		<br />
		{data.message}
		<br />
		{data.error}
	</Alert>
{/if}
<br />

<div>
	<Heading tag="h5">Spieler hinzufügen oder aktiv/inaktiv schalten</Heading>
	<P>Jeder Klick auf eine Checkbox wird sofort gespeichert!</P>
	<br />
	<Button disabled>Neuer Spieler...</Button>
	<br />
	<br />

	<Table shadow hoverable={true}>
		<TableHead>
			<TableHeadCell></TableHeadCell>
			<TableHeadCell>Name</TableHeadCell>
			<TableHeadCell>Aktiv</TableHeadCell>
			<TableHeadCell></TableHeadCell>
		</TableHead>
		<TableBody tableBodyClass="divide-y">
			{#each data.players as player, i}
				<TableBodyRow>
					<TableBodyCell class="py-0"
						><Avatar src={import.meta.env.VITE_IMAGE_DIR + player.id + '.jpg'} /></TableBodyCell
					>
					<TableBodyCell>{formatPlayerName(player)}</TableBodyCell>
					<TableBodyCell>
						{#if player.active == true}
							<Checkbox checked on:change={() => updatePlayer(player.id, !player.active)} />
						{:else}
							<Checkbox on:change={() => updatePlayer(player.id, !player.active)} />
						{/if}
					</TableBodyCell>
					<TableBodyCell class="py-0">
						<Button disabled size="xs">Bearbeiten</Button>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</div>
