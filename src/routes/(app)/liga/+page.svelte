<script>
	import { Heading } from 'flowbite-svelte';
	import { Button, Alert } from 'flowbite-svelte';
	import { Table, TableHead, TableHeadCell } from 'flowbite-svelte';
	import { TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
	import { InfoCircleSolid } from 'flowbite-svelte-icons';
	import { mapTourType } from '$lib/TourUtil';

	let { data } = $props();
	let showError = $derived(!data || !data.tournaments);
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
	<Heading tag="h5">Aktive Turniere</Heading>
	<br />

	<Table class="table-fixed" shadow hoverable={true}>
		<TableHead>
			<TableHeadCell>Name</TableHeadCell>
			<TableHeadCell>Typ</TableHeadCell>
			<TableHeadCell></TableHeadCell>
		</TableHead>
		<TableBody tableBodyClass="divide-y">
			{#each data.tournaments as tournament, i}
				{#if tournament.status == 'Active'}
					<TableBodyRow>
						<TableBodyCell>
							{tournament.name}
						</TableBodyCell>
						<TableBodyCell>
							{mapTourType(tournament.type)}
						</TableBodyCell>
						<TableBodyCell>
							<Button href="/liga/{tournament.type}/{tournament.id}/ranking">Öffnen</Button>
						</TableBodyCell>
					</TableBodyRow>
				{/if}
			{/each}
		</TableBody>
	</Table>
</div>

<br />

<div>
	<Heading tag="h5">Turnier-Historie</Heading>
	<br />

	<Table class="table-fixed" shadow hoverable={true}>
		<TableHead>
			<TableHeadCell>Name</TableHeadCell>
			<TableHeadCell>Typ</TableHeadCell>
			<TableHeadCell></TableHeadCell>
		</TableHead>
		<TableBody tableBodyClass="divide-y">
			{#each data.tournaments as tournament, i}
				{#if tournament.status == 'Completed'}
					<TableBodyRow>
						<TableBodyCell>
							{tournament.name}
						</TableBodyCell>
						<TableBodyCell>
							{mapTourType(tournament.type)}
						</TableBodyCell>
						<TableBodyCell>
							<Button href="/liga/{tournament.type}/{tournament.id}/ranking">Öffnen</Button>
						</TableBodyCell>
					</TableBodyRow>
				{/if}
			{/each}
		</TableBody>
	</Table>
</div>
