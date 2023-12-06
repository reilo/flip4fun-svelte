<script>
	import { Heading, P } from 'flowbite-svelte';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Checkbox
	} from 'flowbite-svelte';

	export let data;

	async function updatePin(id, active) {
		const url = '/api/pins/' + id + '?active=' + active.toString();
		const response = await fetch(url, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
		const pin = await response.json();
		return pin;
	}
</script>

<div>
	<Heading tag="h5">Flipper aktiv oder inaktiv schalten</Heading>
	<P>Jede Änderung wird sofort gespeichert!</P>
	<br />

	<Table hoverable={true}>
		<TableHead>
			<TableHeadCell>Name</TableHeadCell>
			<TableHeadCell>Aktiv</TableHeadCell>
		</TableHead>
		<TableBody class="divide-y">
			{#each data.pins as pin, i}
				<TableBodyRow>
					{#if i > 0 && pin.name == data.pins[i - 1].name}
						<TableBodyCell>{pin.name} ({pin.owner})</TableBodyCell>
					{:else if i < data.pins.length - 1 && pin.name == data.pins[i + 1].name}
						<TableBodyCell>{pin.name} ({pin.owner})</TableBodyCell>
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
