<script>
	import { Heading, Modal } from 'flowbite-svelte';
	import { Table, TableHead, TableHeadCell } from 'flowbite-svelte';
	import { TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
	import { Button, Label, Input, Select, Alert } from 'flowbite-svelte';
	import {
		InfoCircleSolid,
		CloseCircleOutline,
		ExclamationCircleOutline
	} from 'flowbite-svelte-icons';
	import { invalidateAll } from '$app/navigation';
	import { mapTourStatus, mapTourType, getTourTypeMap } from '$lib/TourUtil';
	import { cleanString } from '$lib/TypeUtil';

	let { data } = $props();
	let showError = $derived(!data || !data.tournaments);
	let tournaments = $derived(data.tournaments);

	let newForm = $state(false);
	let showAlert = $state(false);
	let alertMessage = $state("");
	let showSure = $state(false);

	let newTourName = $state('');
	let newTourType = $state('');

	const verifyTour = () => {
		if (newTourType === 'fliptwin' || newTourType === 'flipfinal') {
			alertMessage = "Dieser Turniertyp wird zur Zeit nicht unterstützt. Bitte ändern!";
			showAlert = true;
		} else if (!newTourName || !newTourType) {
			alertMessage="Daten sind fehlerhaft oder unvollständig. Bitte korrigieren!";
			showAlert = true;
		} else if (tournaments.find((tour) => tour.name === newTourName)) {
			alertMessage="Ein Turnier mit dem Namen existiert schon. Bitte einen anderen Namen wählen!";
			showAlert = true;
		} else {
			showSure = true;
		}
	};

	async function createTour() {
		let id = generateTournamentID(newTourName);
		let defaultSettings;
		switch (newTourType) {
			case 'flipliga':
				defaultSettings = {
					baseline: 50,
					minRound: 5,
					matchBonus: 1,
					minMatches: 1,
					challengeSame: 1
				};
				break;
			default:
				defaultSettings = {};
		}
		const response = await fetch('/api/tournament', {
			method: 'POST',
			body: JSON.stringify({
				id: id,
				name: newTourName,
				type: newTourType,
				settings: defaultSettings
			}),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
		let result = await response.json();
		if (response.status === 200) {
			newForm = false;
			invalidateAll();
		} else {
			alert(JSON.stringify(result));
		}
	}

	const prepareFormForNew = () => {
		newTourName = '';
		newTourType = '';
		newForm = true;
	};

	const generateTournamentID = (name) => {
		let newOrigID = cleanString(name);
		let newID = newOrigID;
		let i = 2;
		while (tournaments.find((item) => item.id === newID)) {
			newID = newOrigID + i.toString();
			++i;
		}
		return newID;
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
	<Heading tag="h5">Turniere bearbeiten, starten oder beenden</Heading>
	<br />

	<div>
		<Button on:click={() => prepareFormForNew()}>Neues Turnier...</Button>
		<Modal title="Neues Turnier anlegen" bind:open={newForm} autoclose={false} class="max-w-sm">
			<form class="flex flex-col space-y-6" action="#">
				<Label class="space-y-2">
					<span></span>
					<Input bind:value={newTourName} placeholder="Turnier-Name" />
				</Label>
				<Select
					class="w-44 p-3 space-y-3 text-sm"
					items={getTourTypeMap()}
					bind:value={newTourType}
					placeholder="Turnier-Typ"
				></Select>
				<Button color="alternative" on:click={verifyTour}>Anlegen</Button>
				<Button color="primary" on:click={() => (newForm = false)}>Abbrechen</Button>
			</form>
		</Modal>
	</div>
	<br />

	<div>
		<Modal bind:open={showAlert} size="xs" autoclose>
			<div class="text-center">
				<CloseCircleOutline class="mx-auto mb-4 text-red-700 w-12 h-12 dark:text-red-700" />
				<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
					{alertMessage}
				</h3>
				<Button color="alternative">Schließen</Button>
			</div>
		</Modal>
	</div>

	<div>
		<Modal bind:open={showSure} size="xs" autoclose>
			<div class="text-center">
				<ExclamationCircleOutline
					class="mx-auto mb-4 text-green-700 w-12 h-12 dark:text-green-700"
				/>
				<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
					{newTourName + ' (' + mapTourType(newTourType) + ')'}
				</h3>
				<Button color="red" class="me-2" on:click={createTour}>Ja, ich bin sicher</Button>
				<Button color="alternative">Nein, abbrechen</Button>
			</div>
		</Modal>
	</div>

	<Table hoverable={true}>
		<TableHead>
			<TableHeadCell>Name</TableHeadCell>
			<TableHeadCell>Typ</TableHeadCell>
			<TableHeadCell>Status</TableHeadCell>
			<TableHeadCell></TableHeadCell>
		</TableHead>

		<TableBody tableBodyClass="divide-y">
			{#each tournaments as tournament, i}
				{#if tournament.status !== 'Completed'}
					<TableBodyRow>
						<TableBodyCell>
							{tournament.name}
						</TableBodyCell>
						<TableBodyCell>
							{mapTourType(tournament.type)}
						</TableBodyCell>
						<TableBodyCell>
							{mapTourStatus(tournament.status)}
						</TableBodyCell>
						<TableBodyCell>
							{#if tournament.status == 'Planned' || tournament.status == 'Active'}
								<Button href="/admin/tournaments/{tournament.type}/{tournament.id}/settings"
									>Bearbeiten</Button
								>
							{:else}
								<Button disabled>Bearbeiten</Button>
							{/if}
						</TableBodyCell>
					</TableBodyRow>
				{/if}
			{/each}
		</TableBody>
	</Table>
</div>
