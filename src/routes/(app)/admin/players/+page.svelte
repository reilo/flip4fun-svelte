<script>
	import { Heading, P, Button, Avatar } from 'flowbite-svelte';
	import { Modal, Label, Input } from 'flowbite-svelte';
	import { Table, TableHead, TableHeadCell } from 'flowbite-svelte';
	import { TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
	import { Checkbox, Alert } from 'flowbite-svelte';
	import {
		InfoCircleSolid,
		CloseCircleOutline,
		ExclamationCircleOutline
	} from 'flowbite-svelte-icons';
	import { invalidateAll } from '$app/navigation';
	import { formatPlayerName } from '$lib/PlayerUtil';
	import { cleanString } from '$lib/TypeUtil';

	let { data } = $props();
	let showError = $derived(!data || !data.players);

	let playerForm = $state(false);
	let playerAlert1 = $state(false);
	let playerAlert2 = $state(false);
	let playerSure = $state(false);

	let formPlayerID = $state('');
	let formPlayerForename = $state('');
	let formPlayerSurname = $state('');
	let formPlayerShortname = $state('');
	let formPlayerEmail = $state('');

	let allPlayers = $derived(data.players);

	let playerToUpdate = $state('');

	const verifyPlayer = () => {
		if (!formPlayerForename || !formPlayerSurname) {
			playerAlert1 = true;
		} else if (
			!playerToUpdate &&
			allPlayers.find(
				(item) => item.forename === formPlayerForename && item.surname === formPlayerSurname
			)
		) {
			playerAlert2 = true;
		} else if (cleanString(formPlayerForename).length < 2) {
			playerAlert1 = true;
		} else if (cleanString(formPlayerSurname).length < 2) {
			playerAlert1 = true;
		} else {
			playerSure = true;
		}
	};

	async function createOrUpdatePlayer() {
		if (!playerToUpdate) {
			createPlayer();
		} else {
			updatePlayer();
		}
	}

	async function createPlayer() {
		const id = generatePlayerID();
		let player = {
			id: id,
			forename: formPlayerForename,
			surname: formPlayerSurname
		};
		if (formPlayerShortname) {
			player.shortname = formPlayerShortname;
		}
		if (formPlayerEmail) {
			player.email = formPlayerEmail;
		}
		const response = await fetch('/api/player/', {
			method: 'POST',
			body: JSON.stringify(player),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
		const result = await response.json();
		if (response.status !== 200) {
			alert(JSON.stringify(result));
		}
		playerSure = playerForm = false;
		invalidateAll();
	}

	async function updatePlayer() {
		let player = {
			forename: formPlayerForename,
			surname: formPlayerSurname
		};
		if (formPlayerShortname) {
			player.shortname = formPlayerShortname;
		} else if (formPlayerShortname === '') {
			player.shortname = null;
		}
		if (formPlayerEmail != null) {
			player.email = formPlayerEmail;
		}
		const url = '/api/player/' + playerToUpdate;
		const response = await fetch(url, {
			method: 'PUT',
			body: JSON.stringify(player),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
		const result = await response.json();
		if (response.status !== 200) {
			alert(JSON.stringify(result));
		}
		playerSure = playerForm = false;
		invalidateAll();
	}

	const cancelNewPlayer = () => {
		playerForm = false;
	};

	const prepareFormForNew = () => {
		playerForm = true;
		playerToUpdate = '';
		formPlayerID = '';
		formPlayerForename = '';
		formPlayerSurname = '';
		formPlayerShortname = '';
		formPlayerEmail = '';
	};

	const prepareFormForUpdate = (player) => {
		playerForm = true;
		playerToUpdate = player.id;
		formPlayerID = player.id;
		formPlayerForename = player.forename;
		formPlayerSurname = player.surname;
		formPlayerShortname = player.shortname;
		formPlayerEmail = player.email;
	};

	async function updatePlayerStatus(id, active) {
		const url = '/api/player/' + id;
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

	const generatePlayerID = () => {
		const newOrigID =
			cleanString(formPlayerForename).substring(0, 2) +
			cleanString(formPlayerSurname).substring(0, 2);
		let newID = newOrigID;
		let i = 2;
		while (allPlayers.find((item) => item.id === newID)) {
			newID = newOrigID + i.toString();
			++i;
		}
		return newID;
	};

	const updatePlayerID = () => {
		/*
		let id;
		if (formPlayerForename) {
			id = formPlayerForename
				.substring(0, 1)
				.toLowerCase()
				.replace(/[^\x00-\x7F]/g, '');
		}
		if (formPlayerSurname) {
			id += formPlayerSurname.toLowerCase().replace(/[^\x00-\x7F]/g, '');
		}
		formPlayerID = id;
		*/
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
	<Heading tag="h5">Spieler hinzufügen oder aktiv/inaktiv schalten</Heading>
	<P>Jeder Klick auf eine Checkbox wird sofort gespeichert!</P>
	<br />

	<Button on:click={() => prepareFormForNew()}>Neuer Spieler...</Button>

	<Modal
		title={playerToUpdate ? 'Spieler bearbeiten' : 'Neuen Spieler anlegen'}
		bind:open={playerForm}
		autoclose={false}
		class="max-w-sm"
	>
		<form class="flex flex-col space-y-6" action="#">
			<Label class="space-y-2">
				<span>Vorname</span>
				<Input
					on:change={() => updatePlayerID()}
					bind:value={formPlayerForename}
					placeholder="Vorname"
				/>
			</Label>
			<Label class="space-y-2">
				<span>Nachname</span>
				<Input
					on:change={() => updatePlayerID()}
					bind:value={formPlayerSurname}
					placeholder="Nachname"
				/>
			</Label>
			<!--{#if !playerToUpdate}
				<Label class="space-y-2">
					<span>ID (für die Datenbank, muss eindeutig sein)</span>
					<Input bind:value={formPlayerID} placeholder="ID" />
				</Label>
			{/if}-->
			<Label class="space-y-2">
				<span>Kurzname</span>
				<Input bind:value={formPlayerShortname} placeholder="Kurzname (optional)" />
			</Label>
			<Label class="space-y-2">
				<span>E-Mail-Adresse</span>
				<Input bind:value={formPlayerEmail} placeholder="E-Mail-Adresse (optional)" />
			</Label>
			<Button color="alternative" on:click={verifyPlayer}
				>{!playerToUpdate ? 'Anlegen' : 'Speichern'}</Button
			>
			<Button color="primary" on:click={cancelNewPlayer}>Abbrechen</Button>
		</form>
	</Modal>

	<div>
		<Modal bind:open={playerAlert1} size="xs" autoclose>
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
		<Modal bind:open={playerAlert2} size="xs" autoclose>
			<div class="text-center">
				<CloseCircleOutline class="mx-auto mb-4 text-red-700 w-12 h-12 dark:text-red-700" />
				<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
					Der Spieler existiert schon. Bitte einen anderen Namen wählen!
				</h3>
				<Button color="alternative">Schließen</Button>
			</div>
		</Modal>
	</div>

	<div>
		<Modal bind:open={playerSure} size="xs" autoclose>
			<div class="text-center">
				<ExclamationCircleOutline
					class="mx-auto mb-4 text-green-700 w-12 h-12 dark:text-green-700"
				/>
				<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
					{formPlayerForename + ' ' + formPlayerSurname}
				</h3>
				<Button color="red" class="me-2" on:click={createOrUpdatePlayer}>Ja, ich bin sicher</Button>
				<Button color="alternative">Nein, abbrechen</Button>
			</div>
		</Modal>
	</div>

	<br />
	<br />

	<Table shadow hoverable={true}>
		<TableHead>
			<TableHeadCell></TableHeadCell>
			<TableHeadCell>Name</TableHeadCell>
			<TableHeadCell>E-Mail</TableHeadCell>
			<TableHeadCell>Aktiv</TableHeadCell>
			<TableHeadCell></TableHeadCell>
		</TableHead>
		<TableBody tableBodyClass="divide-y">
			{#each allPlayers as player, i}
				<TableBodyRow>
					<TableBodyCell class="py-0"
						><Avatar src={import.meta.env.VITE_IMAGE_DIR + player.id + '.jpg'} /></TableBodyCell
					>
					<TableBodyCell>{formatPlayerName(player)}</TableBodyCell>
					<TableBodyCell>{player.email}</TableBodyCell>
					<TableBodyCell>
						{#if player.active == true}
							<Checkbox checked on:change={() => updatePlayerStatus(player.id, !player.active)} />
						{:else}
							<Checkbox on:change={() => updatePlayerStatus(player.id, !player.active)} />
						{/if}
					</TableBodyCell>
					<TableBodyCell class="py-0">
						<Button on:click={() => prepareFormForUpdate(player)} size="xs">Bearbeiten</Button>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</div>
