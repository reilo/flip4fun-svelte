<script>
	import { Heading, P, Button, Avatar } from 'flowbite-svelte';
	import { Modal, Label, Input } from 'flowbite-svelte';
	import { Table, TableHead, TableHeadCell } from 'flowbite-svelte';
	import { TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
	import { Checkbox, Alert } from 'flowbite-svelte';
	import { InfoCircleSolid, ExclamationCircleOutline } from 'flowbite-svelte-icons';
	import { CloseCircleOutline, FilePdfOutline } from 'flowbite-svelte-icons';
	import { invalidateAll } from '$app/navigation';
	import { formatPlayerName } from '$lib/PlayerUtil';
	import { cleanString } from '$lib/TypeUtil';
	import { generatePlayersPDF } from '$lib/PDFUtil';

	let { data } = $props();
	let showError = $derived(!data || !data.players);

	let showForm = $state(false);
	let showAlert = $state(false);
	let alertMessage = $state('');
	let showSure = $state(false);
	let showSureDelete = $state(false);

	let formPlayerID = $state('');
	let formPlayerForename = $state('');
	let formPlayerSurname = $state('');
	let formPlayerShortname = $state('');
	let formPlayerEmail = $state('');

	let allPlayers = $derived(data.players);

	let playerToUpdate = $state('');

	const verifyPlayer = () => {
		if (!formPlayerForename || !formPlayerSurname) {
			alertMessage = 'Daten sind fehlerhaft oder unvollständig. Bitte korrigieren!';
			showAlert = true;
		} else if (
			!playerToUpdate &&
			allPlayers.find(
				(item) => item.forename === formPlayerForename && item.surname === formPlayerSurname
			)
		) {
			alertMessage = 'Der Spieler existiert schon. Bitte einen anderen Namen wählen!';
			showAlert = true;
		} else if (
			cleanString(formPlayerForename).length < 2 ||
			cleanString(formPlayerSurname).length < 2
		) {
			alertMessage = 'Daten sind fehlerhaft oder unvollständig. Bitte korrigieren!';
			showAlert = true;
		} else {
			showSure = true;
			alertMessage = playerToUpdate ? 'Diesen Spieler ändern?' : 'Diesen Spieler neu anlegen?';
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
		showSure = showForm = false;
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
		showSure = showForm = false;
		invalidateAll();
	}

	async function deletePlayer() {
		const url = '/api/player/' + playerToUpdate;
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

	const cancelNewPlayer = () => {
		showForm = false;
	};

	const prepareFormForNew = () => {
		showForm = true;
		playerToUpdate = '';
		formPlayerID = '';
		formPlayerForename = '';
		formPlayerSurname = '';
		formPlayerShortname = '';
		formPlayerEmail = '';
	};

	const prepareFormForUpdate = (player) => {
		showForm = true;
		playerToUpdate = player.id;
		formPlayerID = player.id;
		formPlayerForename = player.forename;
		formPlayerSurname = player.surname;
		formPlayerShortname = player.shortname;
		formPlayerEmail = player.email;
	};

	async function prepareFormForDelete(player) {
		const response = await fetch('/api/tournament', {
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
		let playerUsed = false;
		result.tournaments.forEach((tournament) => {
			if (tournament.players.includes(player.id)) {
				playerUsed = true;
			}
		});
		if (playerUsed) {
			alertMessage =
				'Spieler kann nicht gelöscht werden, da er in ein oder mehreren Turnieren verwendet wird.';
			showAlert = true;
		} else {
			playerToUpdate = player.id;
			formPlayerForename = player.forename;
			formPlayerSurname = player.surname;
			alertMessage = 'Diesen Spieler löschen?';
			showSureDelete = true;
		}
	}

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
	<Button
		on:click={generatePlayersPDF(
			'Gästeliste',
			allPlayers.map((item) => {
				return item.id;
			}),
			allPlayers
		)}
		class="w-fit"
		>PDF Export
		<FilePdfOutline class="w-3.5 h-3.5 mr-2" />
	</Button>

	<Modal
		title={playerToUpdate ? 'Spieler bearbeiten' : 'Neuen Spieler anlegen'}
		bind:open={showForm}
		autoclose={false}
		class="max-w-sm"
	>
		<form class="flex flex-col space-y-6" action="#">
			<Label class="space-y-2">
				<span>Vorname</span>
				<Input bind:value={formPlayerForename} placeholder="Vorname" />
			</Label>
			<Label class="space-y-2">
				<span>Nachname</span>
				<Input bind:value={formPlayerSurname} placeholder="Nachname" />
			</Label>
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
					{formPlayerForename + ' ' + formPlayerSurname}<br />
					{alertMessage}
				</h3>
				<Button color="red" class="me-2" on:click={createOrUpdatePlayer}>Ja, ich bin sicher</Button>
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
					{formPlayerForename + ' ' + formPlayerSurname}<br />
					{alertMessage}
				</h3>
				<Button color="red" class="me-2" on:click={deletePlayer}>Ja, ich bin sicher</Button>
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
					<TableBodyCell class="py-0">
						<Button on:click={() => prepareFormForDelete(player)} size="xs">Löschen</Button>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</div>
