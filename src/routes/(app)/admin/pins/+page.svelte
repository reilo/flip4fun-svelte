<script>
	import { Heading, P, Checkbox, Alert } from 'flowbite-svelte';
	import { Table, TableHead, TableHeadCell } from 'flowbite-svelte';
	import { TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
	import { InfoCircleSolid } from 'flowbite-svelte-icons';

	let { data } = $props();
	let showError = $derived(!data || !data.pins);

	async function updatePin(id, active) {
		const url = '/api/pin/' + id;
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
	<Heading tag="h5">Flipper aktiv oder inaktiv schalten</Heading>
	<P>Jeder Klick wird sofort gespeichert!</P>
	<br />

	<Table hoverable={true}>
		<TableHead>
			<TableHeadCell>Name</TableHeadCell>
			<TableHeadCell>Aktiv</TableHeadCell>
		</TableHead>
		<TableBody tableBodyClass="divide-y">
			{#each data.pins as pin, i}
				<TableBodyRow>
					{#if i > 0 && pin.name == data.pins[i - 1].name}
						{#if pin.manu != data.pins[i - 1].manu}
							<TableBodyCell>{pin.name} ({pin.manu})</TableBodyCell>
						{:else}
							<TableBodyCell>{pin.name} ({pin.owner})</TableBodyCell>
						{/if}
					{:else if i < data.pins.length - 1 && pin.name == data.pins[i + 1].name}
						{#if pin.manu != data.pins[i + 1].manu}
							<TableBodyCell>{pin.name} ({pin.manu})</TableBodyCell>
						{:else}
							<TableBodyCell>{pin.name} ({pin.owner})</TableBodyCell>
						{/if}
					{:else}
						<TableBodyCell>{pin.name}</TableBodyCell>
					{/if}
					<TableBodyCell>
						{#if pin.active == true}
							<Checkbox checked on:change={() => updatePin(pin.id, !pin.active)} />
						{:else}
							<Checkbox on:change={() => updatePin(pin.id, !pin.active)} />
						{/if}
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</div>
