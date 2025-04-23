<script>
	import { Heading, Button, Alert, Spinner, P } from 'flowbite-svelte';
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
	<Alert border color="red" class="mb-3">
		<InfoCircleSolid slot="icon" class="w-5 h-5" />
		<span class="font-bold">Interner Fehler!</span>
		<P>
			{data.message}
		</P>
		<P>
			{data.error}
		</P>
	</Alert>
{/if}

<div>
	<Heading tag="h5" class="mb-3">Aktive Turniere</Heading>

	<Table class="mb-3" shadow hoverable={true}>
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

<div>
	<Heading tag="h5" class="mb-3">Turnier-Historie</Heading>

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
