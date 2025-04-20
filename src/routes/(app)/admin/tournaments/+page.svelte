<script>
	import { Heading, Modal } from 'flowbite-svelte';
	import { Table, TableHead, TableHeadCell } from 'flowbite-svelte';
	import { TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
	import { Button, Label, Input, Select, Alert } from 'flowbite-svelte';
	import { InfoCircleSolid, ExclamationCircleOutline } from 'flowbite-svelte-icons';
	import { CloseCircleOutline, ThumbsUpOutline } from 'flowbite-svelte-icons';
	import { invalidateAll } from '$app/navigation';
	import { mapDate } from '$lib/TypeUtil';
	import { mapTourStatus, mapTourType, getTourTypeMap, getDefaultSettings } from '$lib/TourUtil';
	import { cleanString } from '$lib/TypeUtil';

	let { data } = $props();
	let showError = $derived(!data || !data.tournaments);
	let tournaments = $derived(data.tournaments);

	let newForm = $state(false);
	let showAlert = $state(false);
	let alertMessage = $state('');
	let alertMessage2 = $state('');
	let showSure = $state(false);
	let showSureDelete = $state(false);
	let deleteSuccess = $state(false);
	let createSuccess = $state(false);

	let newTourName = $state('');
	let newTourType = $state('');
	let tourToDelete = $state('');

	const verifyTour = () => {
		if (newTourType === 'fliptwin') {
			alertMessage = 'Dieser Turniertyp wird zur Zeit nicht unterstützt. Bitte ändern!';
			showAlert = true;
		} else if (!newTourName || !newTourType) {
			alertMessage = 'Daten sind fehlerhaft oder unvollständig. Bitte korrigieren!';
			showAlert = true;
		} else if (tournaments.find((tour) => tour.name === newTourName)) {
			alertMessage = 'Ein Turnier mit dem Namen existiert schon. Bitte einen anderen Namen wählen!';
			showAlert = true;
		} else {
			showSure = true;
		}
	};

	async function createTour() {
		let id = generateTournamentID(newTourName);
		const response = await fetch('/api/tournament', {
			method: 'POST',
			body: JSON.stringify({
				id: id,
				name: newTourName,
				type: newTourType,
				settings: getDefaultSettings(newTourType)
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
			createSuccess = true;
		} else {
			alert(JSON.stringify(result));
		}
	}

	async function deleteTour() {
		const url = '/api/tournament/' + tourToDelete + '?deleteDependencies';
		const response = await fetch(url, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
		const result = await response.json();
		if (response.status !== 200) {
			alert(JSON.stringify(result));
		}
		showSureDelete = false;
		invalidateAll();
		deleteSuccess = true;
	}

	const prepareFormForNew = () => {
		newTourName = '';
		newTourType = '';
		newForm = true;
	};

	async function prepareTourForDelete(tournament) {
		const response = await fetch('/api/match?tid=' + tournament.id, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
		const result = await response.json();
		if (response.status !== 200) {
			alert(JSON.stringify(result));
		}
		tourToDelete = tournament.id;
		alertMessage = 'Turnier ' + tournament.name + ' wirklich löschen?';
		if (result.matches.length) {
			alertMessage2 =
				'Vorsicht! Es wurden bereits ' +
				result.matches.length +
				' Match(es) für dieses Turnier eingetragen!';
		} else {
			alertMessage2 = '';
		}
		tourToDelete = tournament.id;
		showSureDelete = true;
	}

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

	<div>
		<Modal bind:open={showSureDelete} size="xs" autoclose>
			<div class="text-center">
				<ExclamationCircleOutline
					class="mx-auto mb-4 text-green-700 w-12 h-12 dark:text-green-700"
				/>
				<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
					{alertMessage}<br />{alertMessage2}
				</h3>
				<Button color="red" class="me-2" on:click={deleteTour}>Ja, ich bin sicher</Button>
				<Button color="alternative">Nein, abbrechen</Button>
			</div>
		</Modal>
	</div>

	<div>
		<Modal bind:open={deleteSuccess} size="xs" autoclose>
			<div class="text-center">
				<ThumbsUpOutline class="mx-auto mb-4 text-green-700 w-12 h-12 dark:green-red-700" />
				<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
					Das Turnier wurde erfolgreich gelöscht!
				</h3>
				<Button color="alternative">Schließen</Button>
			</div>
		</Modal>
	</div>

	<div>
		<Modal bind:open={createSuccess} size="xs" autoclose>
			<div class="text-center">
				<ThumbsUpOutline class="mx-auto mb-4 text-green-700 w-12 h-12 dark:green-red-700" />
				<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
					Das Turnier wurde erfolgreich angelegt!
				</h3>
				<Button color="alternative">Schließen</Button>
			</div>
		</Modal>
	</div>

	<Table shadow hoverable={true}>
		<TableHead>
			<TableHeadCell>Name</TableHeadCell>
			<TableHeadCell>Typ</TableHeadCell>
			<TableHeadCell>Status</TableHeadCell>
			<TableHeadCell>Datum</TableHeadCell>
			<TableHeadCell></TableHeadCell>
			<TableHeadCell></TableHeadCell>
		</TableHead>

		<TableBody tableBodyClass="divide-y">
			{#each tournaments as tournament, i}
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
						{mapDate(tournament.created)}
					</TableBodyCell>
					<TableBodyCell>
						<Button href="/admin/tournaments/{tournament.type}/{tournament.id}/settings"
							>Öffnen</Button
						>
					</TableBodyCell>
					<TableBodyCell>
						{#if tournament.name.toLowerCase().includes('test')}
							<Button on:click={() => prepareTourForDelete(tournament)}>Löschen</Button>
						{:else}
							<Button disabled>Löschen</Button>
						{/if}
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</div>
