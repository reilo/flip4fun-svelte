<script>
	import { Heading, Modal } from 'flowbite-svelte';
	import { Button, Label, Input, Select } from 'flowbite-svelte';
	import { Table, TableHead, TableHeadCell } from 'flowbite-svelte';
	import { TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
	import { MapTourStatus, MapTourType, GetTourTypeMap } from '$lib/utils';
	import { DateInput } from 'date-picker-svelte';

	export let data;

	async function createTour() {
		const url = '/api/tournament';
		const response = await fetch(url, {
			method: 'POST',
			body: JSON.stringify({
				name: newTourName,
				type: newTourType,
				startDate: newTourStartDate.toISOString(),
				endDate: newTourEndDate.toISOString()
			}),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
		let result = await response.json();
		data.tournaments = [...data.tournaments, result.tournament];
		newForm = false;
	}

	let newForm = false;
	let newTourName = '';
	let newTourType = '';
	let newTourStartDate = new Date();
	let newTourEndDate = new Date();
</script>

<div>
	<Heading tag="h5">Turniere bearbeiten, starten oder beenden</Heading>
	<br />

	<Table hoverable={true}>
		<TableHead>
			<TableHeadCell>Name</TableHeadCell>
			<TableHeadCell>Typ</TableHeadCell>
			<TableHeadCell>Status</TableHeadCell>
			<TableHeadCell>Test</TableHeadCell>
			<TableHeadCell></TableHeadCell>
			<TableHeadCell></TableHeadCell>
			<TableHeadCell></TableHeadCell>
		</TableHead>
		<TableBody tableBodyClass="divide-y">
			{#each data.tournaments as tournament, i}
				<TableBodyRow>
					<TableBodyCell>
						{tournament.name}
					</TableBodyCell>
					<TableBodyCell>
						{MapTourType(tournament.type)}
					</TableBodyCell>
					<TableBodyCell>
						{MapTourStatus(tournament.status)}
					</TableBodyCell>
					<TableBodyCell>
						{#if tournament.status == 'Planned' || tournament.status == 'Ready' || tournament.status == 'Active'}
							<Button href="/admin/tournaments/{tournament.type}/{tournament.id}">Bearbeiten</Button
							>
						{:else}
							<Button disabled>Bearbeiten</Button>
						{/if}
					</TableBodyCell>
					<TableBodyCell>
						{#if tournament.status == 'Ready'}
							<Button>Starten</Button>
						{:else}
							<Button disabled>Starten</Button>
						{/if}
					</TableBodyCell>
					<TableBodyCell>
						{#if tournament.status == 'Planned' || tournament.status == 'Ready' || tournament.status == 'Active'}
							<Button>Beenden</Button>
						{:else}
							<Button disabled>Beenden</Button>
						{/if}
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</div>

<div>
	<Button on:click={() => (newForm = true)}>Neues Turnier...</Button>
	<Modal title="Neues Turnier anlegen" bind:open={newForm} autoclose={false} class="max-w-sm">
		<form class="flex flex-col space-y-6" action="#">
			<Label class="space-y-2">
				<span></span>
				<Input bind:value={newTourName} placeholder="Turnier-Name" />
			</Label>
			<Select
				class="w-44 p-3 space-y-3 text-sm"
				items={GetTourTypeMap()}
				bind:value={newTourType}
				placeholder="Turnier-Typ"
			></Select>
			<Label class="space-y-2">
				<span>Turnier-Beginn</span>
				<DateInput
					bind:value={newTourStartDate}
					format="dd.MM.yyyy"
					placeholder={new Date().toLocaleDateString()}
				/>
			</Label>
			<Label class="space-y-2">
				<span>Turnier-Ende</span>
				<DateInput
					bind:value={newTourEndDate}
					format="dd.MM.yyyy"
					placeholder={new Date().toLocaleDateString()}
				/>
			</Label>
			<Button color="alternative" on:click={createTour}>Anlegen</Button>
			<Button color="primary" on:click={() => (newForm = false)}>Abbrechen</Button>
		</form>
	</Modal>
</div>
