<script>
	import { Heading, Modal } from 'flowbite-svelte';
	import { Button, Label, Input, Select } from 'flowbite-svelte';
	import { Table, TableHead, TableHeadCell } from 'flowbite-svelte';
	import { TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
	import * as TourUtil from '$lib/TourUtil';

	let { data } = $props();
</script>

<div>
	<Heading tag="h5">Aktive Turniere</Heading>
	<br />

	<Table hoverable={true}>
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
							{TourUtil.MapType(tournament.type)}
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

	<Table hoverable={true}>
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
							{MapType(tournament.type)}
						</TableBodyCell>
						<TableBodyCell>
							<Button href="/liga/{tournament.type}/{tournament.id}">Öffnen</Button>
						</TableBodyCell>
					</TableBodyRow>
				{/if}
			{/each}
		</TableBody>
	</Table>
</div>
