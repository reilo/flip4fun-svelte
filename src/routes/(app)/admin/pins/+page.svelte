<script>
	import { Heading, P, Button, Checkbox, Alert } from 'flowbite-svelte';
	import { Table, TableHead, TableHeadCell } from 'flowbite-svelte';
	import { TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
	import { Label, Input, Select, Modal } from 'flowbite-svelte';
	import {
		InfoCircleSolid,
		CloseCircleOutline,
		ExclamationCircleOutline
	} from 'flowbite-svelte-icons';
	import { invalidateAll } from '$app/navigation';
	import { getPinManuMap, getPinTypeMap } from '$lib/PinUtil';

	let { data } = $props();
	let showError = $derived(!data || !data.pins);

	let pinForm = $state(false);
	let pinAlert1 = $state(false);
	let pinAlert2 = $state(false);
	let pinAlert3 = $state(false);
	let pinSure = $state(false);

	let formPinName = $state('');
	let formPinShortcut = $state('');
	let formPinManu = $state('');
	let formPinType = $state('');
	let formPinYear = $state(null);

	let allPins = $derived(data.pins);

	let pinToUpdate = $state('');

	const verifyPin = () => {
		if (
			!formPinName ||
			!formPinManu ||
			!formPinType ||
			(!formPinShortcut.toLowerCase() && !pinToUpdate)
		) {
			pinAlert1 = true;
		} else if (!pinToUpdate && allPins.find((item) => item.name === formPinName)) {
			pinAlert2 = true;
		} else if (!pinToUpdate && allPins.find((item) => item.id === formPinShortcut.toLowerCase())) {
			pinAlert3 = true;
		} else {
			pinSure = true;
		}
	};

	async function createOrUpdatePin() {
		if (!pinToUpdate) {
			createPin();
		} else {
			updatePin();
		}
	}

	async function createPin() {
		let pin = {
			id: formPinShortcut.toLowerCase(),
			name: formPinName,
			manu: formPinManu,
			type: formPinType
		};
		if (formPinYear) {
			pin.year = formPinYear;
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
		pinSure = pinForm = false;
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
		pinSure = pinForm = false;
		invalidateAll();
	}

	async function updatePinStatus(id, active) {
		const url = '/api/pin/' + id;
		const response = await fetch(url, {
			method: 'PUT',
			body: JSON.stringify({
				active: active
			}),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
		const result = await response.json();
		if (response.status !== 200) {
			alert(JSON.stringify(result));
		}
	}

	const cancelNewPin = () => {
		pinForm = false;
	};

	const prepareFormForNew = () => {
		pinForm = true;
		pinToUpdate = '';
		formPinName = '';
		formPinShortcut = '';
		formPinManu = '';
		formPinType = '';
		formPinYear = null;
	};

	const prepareFormForUpdate = (pin) => {
		pinForm = true;
		pinToUpdate = pin.id;
		formPinName = pin.name;
		formPinManu = pin.manu;
		formPinType = pin.type;
		formPinYear = pin.year;
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
	<Heading tag="h5">Flipper hinzufügen oder aktiv/inaktiv schalten</Heading>
	<P>Jeder Klick auf eine Checkbox wird sofort gespeichert!</P>
	<br />

	<Button on:click={() => prepareFormForNew()}>Neuer Flipper...</Button>

	<Modal
		title={pinToUpdate ? 'Flipper bearbeiten' : 'Neuen Flipper anlegen'}
		bind:open={pinForm}
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
			<Select
				class="w-44 p-3 space-y-3 text-sm"
				items={getPinManuMap()}
				bind:value={formPinManu}
				placeholder="Hersteller"
			></Select>
			<Label class="space-y-2">
				<span>Erscheinungsjahr</span>
				<Input bind:value={formPinYear} placeholder="Erscheinungsjahr" />
			</Label>
			<Select
				class="w-44 p-3 space-y-3 text-sm"
				items={getPinTypeMap()}
				bind:value={formPinType}
				placeholder="Plattform"
			></Select>
			<Button color="alternative" on:click={verifyPin}
				>{!pinToUpdate ? 'Anlegen' : 'Speichern'}</Button
			>
			<Button color="primary" on:click={cancelNewPin}>Abbrechen</Button>
		</form>
	</Modal>

	<div>
		<Modal bind:open={pinAlert1} size="xs" autoclose>
			<div class="text-center">
				<CloseCircleOutline class="mx-auto mb-4 text-red-700 w-12 h-12 dark:text-red-700" />
				<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
					Daten sind fehlerhaft oder unvollständig. Bitte korrigieren!
				</h3>
				<Button color="alternative">Schließen</Button>
			</div>
		</Modal>
	</div>

	<div>
		<Modal bind:open={pinAlert2} size="xs" autoclose>
			<div class="text-center">
				<CloseCircleOutline class="mx-auto mb-4 text-red-700 w-12 h-12 dark:text-red-700" />
				<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
					Der Flipper existiert schon!
				</h3>
				<Button color="alternative">Schließen</Button>
			</div>
		</Modal>
	</div>

	<div>
		<Modal bind:open={pinAlert3} size="xs" autoclose>
			<div class="text-center">
				<CloseCircleOutline class="mx-auto mb-4 text-red-700 w-12 h-12 dark:text-red-700" />
				<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
					Der Flipperkürzel existiert schon. Bitte einen anderen wählen!
				</h3>
				<Button color="alternative">Schließen</Button>
			</div>
		</Modal>
	</div>

	<div>
		<Modal bind:open={pinSure} size="xs" autoclose>
			<div class="text-center">
				<ExclamationCircleOutline
					class="mx-auto mb-4 text-green-700 w-12 h-12 dark:text-green-700"
				/>
				<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
					{formPinName}
				</h3>
				<Button color="red" class="me-2" on:click={createOrUpdatePin}>Ja, ich bin sicher</Button>
				<Button color="alternative">Nein, abbrechen</Button>
			</div>
		</Modal>
	</div>

	<br />
	<br />

	<Table shadow hoverable={true}>
		<TableHead>
			<TableHeadCell>Name</TableHeadCell>
			<TableHeadCell>Aktiv</TableHeadCell>
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
						<TableBodyCell class="py-0">{pin.name}</TableBodyCell>
					{/if}
					<TableBodyCell>
						{#if pin.active == true}
							<Checkbox checked on:change={() => updatePinStatus(pin.id, !pin.active)} />
						{:else}
							<Checkbox on:change={() => updatePinStatus(pin.id, !pin.active)} />
						{/if}
					</TableBodyCell>
					<TableBodyCell class="py-0">
						<Button on:click={() => prepareFormForUpdate(pin)} size="xs">Bearbeiten</Button>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</div>
