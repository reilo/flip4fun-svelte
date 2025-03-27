<script>
	import { Heading, P, Avatar } from 'flowbite-svelte';
	import { Table, TableHead, TableHeadCell } from 'flowbite-svelte';
	import { TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
	import { Checkbox, Alert } from 'flowbite-svelte';
	import { InfoCircleSolid } from 'flowbite-svelte-icons';

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
	<Heading tag="h5">Spieler aktiv oder inaktiv schalten</Heading>
	<P>Jeder Klick wird sofort gespeichert!</P>
	<br />

	<Table hoverable={true}>
		<TableHead>
			<TableHeadCell></TableHeadCell>
			<TableHeadCell>Name</TableHeadCell>
			<TableHeadCell>Aktiv</TableHeadCell>
		</TableHead>
		<TableBody tableBodyClass="divide-y">
			{#each data.players as player, i}
				<TableBodyRow>
					<TableBodyCell
						><Avatar src={import.meta.env.VITE_IMAGE_DIR + player.id + '.jpg'} /></TableBodyCell
					>
					<TableBodyCell
						>{player.forename +
							' ' +
							player.surname +
							(player.shortname ? ' (' + player.shortname + ')' : '')}</TableBodyCell
					>
					<TableBodyCell>
						{#if player.active == true}
							<Checkbox checked on:change={() => updatePlayer(player.id, !player.active)} />
						{:else}
							<Checkbox on:change={() => updatePlayer(player.id, !player.active)} />
						{/if}
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</div>
