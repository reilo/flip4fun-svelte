<script>
	import { Heading, Button, Alert, Spinner } from 'flowbite-svelte';
	import { Table, TableHead, TableHeadCell } from 'flowbite-svelte';
	import { TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
	import { InfoCircleSolid } from 'flowbite-svelte-icons';
	import { goto } from '$app/navigation';
	import { mapTourType } from '$lib/TourUtil';

	let { data } = $props();
	let showError = $derived(!data || !data.tournaments);

	let loadingTournamentID = $state('');

	const loadTournament = (tournament) => {
		loadingTournamentID = tournament.id;
		goto('/liga/' + tournament.type + '/' + tournament.id + '/ranking');
	};
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

	<Table shadow hoverable={true}>
		<TableHead>
			<TableHeadCell>Name</TableHeadCell>
			{#if import.meta.env.VITE_APP_FULL}
				<TableHeadCell>Typ</TableHeadCell>
			{/if}
			<TableHeadCell></TableHeadCell>
		</TableHead>
		<TableBody tableBodyClass="divide-y">
			{#each data.tournaments as tournament, i}
				{#if import.meta.env.VITE_APP_FULL || !tournament.name.includes('Test')}
					{#if tournament.status == 'Active'}
						<TableBodyRow>
							<TableBodyCell>
								{tournament.name}
							</TableBodyCell>
							{#if import.meta.env.VITE_APP_FULL}
								<TableBodyCell>
									{mapTourType(tournament.type)}
								</TableBodyCell>
							{/if}
							<TableBodyCell>
								{#if loadingTournamentID === tournament.id}
									<Button class="w-fit">
										<Spinner class="me-3" size="4" color="white" />Laden ...
									</Button>
								{:else}
									<Button on:click={() => loadTournament(tournament)}>Öffnen</Button>
								{/if}
							</TableBodyCell>
						</TableBodyRow>
					{/if}
				{/if}
			{/each}
		</TableBody>
	</Table>
</div>

<br />

<div>
	<Heading tag="h5">Turnier-Historie</Heading>
	<br />

	<Table shadow hoverable={true}>
		<TableHead>
			<TableHeadCell>Name</TableHeadCell>
			{#if import.meta.env.VITE_APP_FULL}
				<TableHeadCell>Typ</TableHeadCell>
			{/if}
			<TableHeadCell></TableHeadCell>
		</TableHead>
		<TableBody tableBodyClass="divide-y">
			{#each data.tournaments as tournament, i}
				{#if import.meta.env.VITE_APP_FULL || !tournament.name.includes('Test')}
					{#if tournament.status == 'Completed'}
						<TableBodyRow>
							<TableBodyCell>
								{tournament.name}
							</TableBodyCell>
							{#if import.meta.env.VITE_APP_FULL}
								<TableBodyCell>
									{mapTourType(tournament.type)}
								</TableBodyCell>
							{/if}
							<TableBodyCell>
								{#if loadingTournamentID === tournament.id}
									<Button class="w-fit">
										<Spinner class="me-3" size="4" color="white" />Laden ...
									</Button>
								{:else}
									<Button on:click={() => loadTournament(tournament)}>Öffnen</Button>
								{/if}
							</TableBodyCell>
						</TableBodyRow>
					{/if}
				{/if}
			{/each}
		</TableBody>
	</Table>
</div>
