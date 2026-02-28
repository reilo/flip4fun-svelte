<script>
	import { Heading, Modal, P, Badge } from 'flowbite-svelte';
	import { Button, Label, Input, Select, Alert } from 'flowbite-svelte';
	import { InfoCircleSolid, ExclamationCircleOutline } from 'flowbite-svelte-icons';
	import { CloseCircleOutline } from 'flowbite-svelte-icons';
	import { invalidateAll } from '$app/navigation';
	import { mapDate } from '$lib/TypeUtil';
	import { mapTourStatus, mapTourType, getTourTypeMap, getDefaultSettings } from '$lib/TourUtil';
	import { cleanString } from '$lib/TypeUtil';
	import Success from '$lib/components/dialogs/Success.svelte';

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
		if (!newTourName || !newTourType) {
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

<div class="space-y-4">
	{#if showError}
		<Alert border color="red">
			<InfoCircleSolid slot="icon" class="w-5 h-5" />
			<span class="font-bold">Interner Fehler!</span>
			<P>{data.message}</P>
			<P>{data.error}</P>
		</Alert>
	{/if}

	<div class="grid grid-cols-3 gap-3">
		<div class="bg-white dark:bg-gray-800 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3 flex items-center gap-3">
			<div class="w-3 h-3 rounded-full bg-yellow-400 flex-shrink-0"></div>
			<div>
				<p class="text-xs text-yellow-600 dark:text-yellow-400 uppercase tracking-wide font-semibold">In Planung</p>
				<p class="text-2xl font-bold text-gray-900 dark:text-white">{tournaments.filter(t => t.status === 'Planned').length}</p>
			</div>
		</div>
		<div class="bg-white dark:bg-gray-800 border border-green-200 dark:border-green-700 rounded-lg p-3 flex items-center gap-3">
			<div class="w-3 h-3 rounded-full bg-green-500 flex-shrink-0"></div>
			<div>
				<p class="text-xs text-green-600 dark:text-green-400 uppercase tracking-wide font-semibold">Aktiv</p>
				<p class="text-2xl font-bold text-gray-900 dark:text-white">{tournaments.filter(t => t.status === 'Active').length}</p>
			</div>
		</div>
		<div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 flex items-center gap-3">
			<div class="w-3 h-3 rounded-full bg-gray-400 flex-shrink-0"></div>
			<div>
				<p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-semibold">Beendet</p>
				<p class="text-2xl font-bold text-gray-900 dark:text-white">{tournaments.filter(t => t.status === 'Completed').length}</p>
			</div>
		</div>
	</div>

	<div>
		<Button class="mb-3" on:click={() => prepareFormForNew()}>Neues Turnier...</Button>
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

	<div>
		<Modal bind:open={showAlert} size="xs" autoclose>
			<div class="text-center">
				<CloseCircleOutline class="mx-auto mb-4 text-red-700 w-12 h-12 dark:text-red-700" />
				<Heading tag="h3" class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
					{alertMessage}
				</Heading>
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
				<Heading tag="h3" class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
					{newTourName + ' (' + mapTourType(newTourType) + ')'}
				</Heading>
				<Button color="red" class="me-2" on:click={createTour}>Ja, ich bin sicher</Button>
				<Button color="alternative">Nein, abbrechen</Button>
			</div>
		</Modal>
	</div>

	<Success
		show={createSuccess}
		message={'Das Turnier wurde erfolgreich angelegt!'}
		onClose={() => (createSuccess = false)}
	/>

	<div>
		<Modal bind:open={showSureDelete} size="xs" autoclose>
			<div class="text-center">
				<ExclamationCircleOutline
					class="mx-auto mb-4 text-green-700 w-12 h-12 dark:text-green-700"
				/>
				<Heading tag="h3" class="mb-3 text-lg font-normal text-gray-500 dark:text-gray-400">
					{alertMessage}
				</Heading>
				<Heading tag="h3" class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
					{alertMessage2}
				</Heading>
				<Button color="red" class="me-2" on:click={deleteTour}>Ja, ich bin sicher</Button>
				<Button color="alternative">Nein, abbrechen</Button>
			</div>
		</Modal>
	</div>

	<Success
		show={deleteSuccess}
		message={'Das Turnier wurde erfolgreich gelöscht!'}
		onClose={() => (deleteSuccess = false)}
	/>

	<p class="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">Alle Turniere</p>
	<div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
		<div class="grid grid-cols-[1fr_8rem_8rem_8rem_6rem_6rem] bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
			<div class="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Name</div>
			<div class="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Typ</div>
			<div class="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</div>
			<div class="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Datum</div>
			<div class="px-4 py-2"></div>
			<div class="px-4 py-2"></div>
		</div>
		{#each tournaments as tournament, i}
			<div
				class="grid grid-cols-[1fr_8rem_8rem_8rem_6rem_6rem] items-center border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors hover:bg-blue-50 dark:hover:bg-blue-950"
				class:bg-gray-100={i % 2 === 1}
				class:dark:bg-gray-700={i % 2 === 1}
			>
				<div class="px-4 py-2 text-sm font-medium text-gray-900 dark:text-white truncate">{tournament.name}</div>
				<div class="px-4 py-2">
					<Badge color={tournament.type === 'twinpin' ? 'blue' : tournament.type === 'flipliga' ? 'purple' : 'green'} class="text-xs">{mapTourType(tournament.type)}</Badge>
				</div>
				<div class="px-4 py-2">
					<Badge color={tournament.status === 'Active' ? 'green' : tournament.status === 'Planned' ? 'yellow' : 'dark'} class="text-xs">{mapTourStatus(tournament.status)}</Badge>
				</div>
				<div class="px-4 py-2 text-sm text-gray-600 dark:text-gray-300">{mapDate(tournament.created)}</div>
				<div class="px-4 py-2">
					<Button size="xs" href="/admin/tournaments/{tournament.type}/{tournament.id}/settings">Öffnen</Button>
				</div>
				<div class="px-4 py-2">
					{#if tournament.name.toLowerCase().includes('test')}
						<Button size="xs" color="red" on:click={() => prepareTourForDelete(tournament)}>Löschen</Button>
					{:else}
						<Button size="xs" disabled>Löschen</Button>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>
