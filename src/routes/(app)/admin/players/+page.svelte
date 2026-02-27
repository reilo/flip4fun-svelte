<script>
	import { Heading, P, Button, Badge } from 'flowbite-svelte';
	import { Modal, Label, Input } from 'flowbite-svelte';
	import { Checkbox, Alert } from 'flowbite-svelte';
	import { InfoCircleSolid, ExclamationCircleOutline } from 'flowbite-svelte-icons';
	import { CloseCircleOutline, FilePdfOutline } from 'flowbite-svelte-icons';
	import { invalidateAll } from '$app/navigation';
	import { formatPlayerName } from '$lib/PlayerUtil';
	import { cleanString } from '$lib/TypeUtil';
	import { generatePlayersPDF } from '$lib/PDFPlayerUtil';

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
			await createPlayer();
		} else {
			await updatePlayer();
		}
	}

	async function createPlayer() {
		const id = generatePlayerID();
		let player = {
			id: id,
			forename: formPlayerForename.trim(),
			surname: formPlayerSurname.trim()
		};
		if (formPlayerShortname) {
			player.shortname = formPlayerShortname.trim();
		}
		if (formPlayerEmail) {
			player.email = formPlayerEmail.trim();
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

<div class="space-y-4">
	{#if showError}
		<Alert border color="red">
			<InfoCircleSolid slot="icon" class="w-5 h-5" />
			<span class="font-bold">Interner Fehler!</span>
			<P>{data.message}</P>
			<P>{data.error}</P>
		</Alert>
	{/if}

	<div class="grid grid-cols-2 gap-3">
		<div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 flex items-center gap-3">
			<div class="w-3 h-3 rounded-full bg-gray-400 flex-shrink-0"></div>
			<div>
				<p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-semibold">Gesamt</p>
				<p class="text-2xl font-bold text-gray-900 dark:text-white">{allPlayers.length}</p>
			</div>
		</div>
		<div class="bg-white dark:bg-gray-800 border border-green-200 dark:border-green-700 rounded-lg p-3 flex items-center gap-3">
			<div class="w-3 h-3 rounded-full bg-green-500 flex-shrink-0"></div>
			<div>
				<p class="text-xs text-green-600 dark:text-green-400 uppercase tracking-wide font-semibold">Ligaspieler</p>
				<p class="text-2xl font-bold text-gray-900 dark:text-white">{allPlayers.filter(p => p.active).length}</p>
			</div>
		</div>
	</div>

	<div class="flex gap-2 flex-wrap">
		<Button on:click={() => prepareFormForNew()}>Neuer Spieler...</Button>
	<Button
		on:click={() =>
			generatePlayersPDF(
				'Gästeliste',
				allPlayers.map((item) => {
					return item.id;
				}),
				allPlayers
			)}
		class="w-fit"
	>
		PDF Export
	</Button>
	</div>

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
					{formPlayerForename + ' ' + formPlayerSurname}
				</Heading>
				<Heading tag="h3" class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
					{alertMessage}
				</Heading>
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
				<Heading tag="h3" class="mb-3 text-lg font-normal text-gray-500 dark:text-gray-400">
					{formPlayerForename + ' ' + formPlayerSurname}
				</Heading>
				<Heading tag="h3" class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
					{alertMessage}
				</Heading>
				<Button color="red" class="me-2" on:click={deletePlayer}>Ja, ich bin sicher</Button>
				<Button color="alternative">Nein, abbrechen</Button>
			</div>
		</Modal>
	</div>

	<p class="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">Spielerliste</p>
	<div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
		<div class="grid grid-cols-[1fr_12rem_4rem_5rem_7rem_6rem] bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
			<div class="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Name</div>
			<div class="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">E-Mail</div>
			<div class="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-center">Aktiv</div>
			<div class="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">ID</div>
			<div class="px-4 py-2"></div>
			<div class="px-4 py-2"></div>
		</div>
		{#each allPlayers as player, i}
			<div class="grid grid-cols-[1fr_12rem_4rem_5rem_7rem_6rem] items-center border-b border-gray-100 dark:border-gray-700 last:border-b-0 {i % 2 === 1 ? 'bg-gray-50 dark:bg-gray-700/50' : ''}">
				<div class="px-4 py-2 text-sm font-medium text-gray-900 dark:text-white">{formatPlayerName(player)}</div>
				<div class="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 truncate">{player.email ?? ''}</div>
				<div class="px-4 py-2 flex justify-center">
					<Checkbox checked={player.active == true} on:change={() => updatePlayerStatus(player.id, !player.active)} />
				</div>
				<div class="px-4 py-2 text-xs font-mono text-gray-500 dark:text-gray-400">{player.id}</div>
				<div class="px-4 py-2">
					<Button on:click={() => prepareFormForUpdate(player)} size="xs">Bearbeiten</Button>
				</div>
				<div class="px-4 py-2">
					<Button on:click={() => prepareFormForDelete(player)} size="xs" color="red">Löschen</Button>
				</div>
			</div>
		{/each}
	</div>
</div>
