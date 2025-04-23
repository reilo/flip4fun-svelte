<script>
	import { Heading, P, Button, Checkbox, Alert } from 'flowbite-svelte';
	import { Table, TableHead, TableHeadCell } from 'flowbite-svelte';
	import { TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
	import { Label, Input, Select, Modal } from 'flowbite-svelte';
	import { InfoCircleSolid, ExclamationCircleOutline } from 'flowbite-svelte-icons';
	import { CloseCircleOutline, FilePdfOutline } from 'flowbite-svelte-icons';
	import { invalidateAll } from '$app/navigation';
	import { getPinManuMap, getPinTypeMap } from '$lib/PinUtil';
	import { generatePinsPDF } from '$lib/PDFUtil';
	import { cleanString } from '$lib/TypeUtil';

	let { data } = $props();
	let showError = $derived(!data || !data.pins);

	let showForm = $state(false);
	let showAlert = $state(false);
	let alertMessage = $state(false);
	let showSure = $state(false);
	let showSureDelete = $state(false);

	let formPinName = $state('');
	let formPinShortcut = $state('');
	let formPinManu = $state('');
	let formPinType = $state('');
	let formPinYear = $state(null);
	let formPinOwner = $state('');

	let allPins = $derived(data.pins);

	let pinToUpdate = $state('');

	const verifyPin = () => {
		if (
			!formPinName ||
			!formPinManu ||
			!formPinType ||
			(!cleanString(formPinShortcut) && !pinToUpdate)
		) {
			alertMessage = 'Daten sind fehlerhaft oder unvollständig. Bitte korrigieren!';
			showAlert = true;
		} else if (!pinToUpdate && allPins.find((item) => item.name === formPinName)) {
			alertMessage = 'Der Flipper existiert schon!';
			showAlert = true;
		} else if (!pinToUpdate && allPins.find((item) => item.id === cleanString(formPinShortcut))) {
			alertMessage = 'Der Flipperkürzel existiert schon. Bitte einen anderen wählen!';
			showAlert = true;
		} else {
			alertMessage = pinToUpdate ? 'Diesen Flipper ändern?' : 'Diesen Flipper neu anlegen?';
			showSure = true;
		}
	};

	async function createOrUpdatePin() {
		if (!pinToUpdate) {
			await createPin();
		} else {
			await updatePin();
		}
	}

	async function createPin() {
		let pin = {
			id: cleanString(formPinShortcut),
			name: formPinName,
			manu: formPinManu,
			type: formPinType
		};
		if (formPinYear) {
			pin.year = formPinYear;
		}
		if (formPinOwner) {
			pin.owner = formPinOwner;
		}
		const response = await fetch('/api/pin/', {
			method: 'POST',
			body: JSON.stringify(pin),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
		const result = await response.json();
		if (response.status !== 200) {
			alert(JSON.stringify(result));
		}
		showSure = showForm = false;
		invalidateAll();
	}

	async function updatePin() {
		let pin = {
			name: formPinName
		};
		if (formPinManu) {
			pin.manu = formPinManu;
		}
		if (formPinType) {
			pin.type = formPinType;
		}
		if (formPinYear) {
			pin.year = formPinYear;
		}
		if (formPinOwner) {
			pin.owner = formPinOwner;
		}
		const url = '/api/pin/' + pinToUpdate;
		const response = await fetch(url, {
			method: 'PUT',
			body: JSON.stringify(pin),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
		const result = await response.json();
		if (response.status !== 200) {
			alert(JSON.stringify(result));
		}
		showSure = showForm = false;
		invalidateAll();
	}

	async function updatePinStatus(id, active) {
		const url = '/api/pin/' + id;
		let data = {
			active: active
		};
		const response = await fetch(url, {
			method: 'PUT',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
		const result = await response.json();
		if (response.status !== 200) {
			alert(JSON.stringify(result));
		}
		invalidateAll();
	}

	async function updatePinDeleted(id, deleted) {
		const url = '/api/pin/' + id;
		let data = {
			deleted: deleted
		};
		const response = await fetch(url, {
			method: 'PUT',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
		const result = await response.json();
		if (response.status !== 200) {
			alert(JSON.stringify(result));
		}
		invalidateAll();
	}

	async function deletePin() {
		const url = '/api/pin/' + pinToUpdate;
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
	}

	const cancelNewPin = () => {
		showForm = false;
	};

	const prepareFormForNew = () => {
		showForm = true;
		pinToUpdate = '';
		formPinName = '';
		formPinShortcut = '';
		formPinManu = '';
		formPinType = '';
		formPinYear = null;
		formPinOwner = '';
	};

	const prepareFormForUpdate = (pin) => {
		showForm = true;
		pinToUpdate = pin.id;
		formPinName = pin.name;
		formPinManu = pin.manu;
		formPinType = pin.type;
		formPinYear = pin.year;
		formPinOwner = pin.owner;
	};

	async function prepareFormForDelete(pin) {
		const response = await fetch('/api/match?pin=' + pin.id, {
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
		if (result.matches.length) {
			alertMessage =
				'Flipper kann nicht gelöscht werden, da er in ein oder mehreren Turnieren verwendet wird.';
			showAlert = true;
		} else {
			pinToUpdate = pin.id;
			formPinName = pin.name;
			alertMessage = 'Diesen Flipper löschen?';
			showSureDelete = true;
		}
	}
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
	<Heading tag="h5">Flipper hinzufügen oder aktiv/inaktiv schalten</Heading>
	<P class="mb-3">Jeder Klick auf eine Checkbox wird sofort gespeichert!</P>

	<Button on:click={() => prepareFormForNew()}>Neuer Flipper...</Button>

	<Button on:click={() => generatePinsPDF(data.pins)} class="w-fit">
		<FilePdfOutline class="w-3.5 h-3.5 mr-2" />PDF Export
	</Button>

	<Modal
		title={pinToUpdate ? 'Flipper bearbeiten' : 'Neuen Flipper anlegen'}
		bind:open={showForm}
		autoclose={false}
		class="max-w-sm"
	>
		<form class="flex flex-col space-y-6" action="#">
			<Label class="space-y-2">
				<span>Flippername</span>
				<Input bind:value={formPinName} placeholder="Flippername" />
			</Label>
			{#if !pinToUpdate}
				<Label class="space-y-2">
					<span>Flipperkürzel</span>
					<Input bind:value={formPinShortcut} placeholder="Flipperkürzel" />
				</Label>
			{/if}
			<Label>
				Hersteller
				<Select
					class="w-44 p-3 space-y-3 text-sm"
					items={getPinManuMap()}
					bind:value={formPinManu}
					placeholder="Hersteller"
				></Select>
			</Label>
			<Label class="space-y-2">
				<span>Erscheinungsjahr</span>
				<Input bind:value={formPinYear} placeholder="Erscheinungsjahr" />
			</Label>
			<Label>
				Plattform
				<Select
					class="w-44 p-3 space-y-3 text-sm"
					items={getPinTypeMap()}
					bind:value={formPinType}
					placeholder="Plattform"
				></Select>
			</Label>
			<Label class="space-y-2">
				<span>Besitzer</span>
				<Input bind:value={formPinOwner} placeholder="Besitzer" />
			</Label>
			<Button color="alternative" on:click={verifyPin}
				>{!pinToUpdate ? 'Anlegen' : 'Speichern'}</Button
			>
			<Button color="primary" on:click={cancelNewPin}>Abbrechen</Button>
		</form>
	</Modal>

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
				<Heading tag="h3" class="mb-3 text-lg font-normal text-gray-500 dark:text-gray-400">
					{formPinName}
				</Heading>
				<Heading tag="h3" class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
					{alertMessage}
				</Heading>
				<Button color="red" class="me-2" on:click={createOrUpdatePin}>Ja, ich bin sicher</Button>
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
				<Heading tag="h3" class="mb-3 text-lg font-normal text-gray-500 dark:text-gray-400">
					{formPinName}
				</Heading>
				<Heading tag="h3" class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
					{alertMessage}
				</Heading>
				<Button color="red" class="me-2" on:click={deletePin}>Ja, ich bin sicher</Button>
				<Button color="alternative">Nein, abbrechen</Button>
			</div>
		</Modal>
	</div>

	<Table class="mt-5" shadow hoverable={true}>
		<TableHead>
			<TableHeadCell>Name</TableHeadCell>
			<TableHeadCell>Spiel<br />bereit</TableHeadCell>
			<TableHeadCell>In der<br />Lounge</TableHeadCell>
			<TableHeadCell>Besitzer</TableHeadCell>
			<TableHeadCell></TableHeadCell>
			<TableHeadCell></TableHeadCell>
		</TableHead>
		<TableBody tableBodyClass="divide-y">
			{#each data.pins as pin, i}
				<TableBodyRow>
					{#if i > 0 && pin.name == data.pins[i - 1].name}
						{#if pin.manu != data.pins[i - 1].manu}
							<TableBodyCell class="py-0">{pin.name} ({pin.manu})</TableBodyCell>
						{:else}
							<TableBodyCell class="py-0">{pin.name} ({pin.owner})</TableBodyCell>
						{/if}
					{:else if i < data.pins.length - 1 && pin.name == data.pins[i + 1].name}
						{#if pin.manu != data.pins[i + 1].manu}
							<TableBodyCell class="py-0">{pin.name} ({pin.manu})</TableBodyCell>
						{:else}
							<TableBodyCell class="py-0">{pin.name} ({pin.owner})</TableBodyCell>
						{/if}
					{:else}
						<TableBodyCell class="py-0">
							{#if pin.active}
								<P class={pin.deleted ? 'line-through' : ''}>{pin.name}</P>
							{:else}
								<P italic class={pin.deleted ? 'line-through' : ''}>{pin.name}</P>
							{/if}
						</TableBodyCell>
					{/if}
					<TableBodyCell>
						{#if pin.active == true}
							<Checkbox checked on:change={() => updatePinStatus(pin.id, !pin.active)} />
						{:else}
							<Checkbox on:change={() => updatePinStatus(pin.id, !pin.active)} />
						{/if}
					</TableBodyCell>
					<TableBodyCell>
						{#if pin.deleted == false}
							<Checkbox checked on:change={() => updatePinDeleted(pin.id, !pin.deleted)} />
						{:else}
							<Checkbox on:change={() => updatePinDeleted(pin.id, !pin.deleted)} />
						{/if}
					</TableBodyCell>
					<TableBodyCell>
						{pin.owner}
					</TableBodyCell>
					<TableBodyCell class="py-0">
						<Button on:click={() => prepareFormForUpdate(pin)} size="xs">Bearbeiten</Button>
					</TableBodyCell>
					<TableBodyCell class="py-0">
						<Button on:click={() => prepareFormForDelete(pin)} size="xs">Löschen</Button>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</div>
