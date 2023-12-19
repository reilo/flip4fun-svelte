<script>
	export let data;

	import { MapDate } from '$lib/utils';
	import { Table, TableHead, TableHeadCell } from 'flowbite-svelte';
	import { TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
	import { P, Modal, Select, Button, Checkbox } from 'flowbite-svelte';
	import { NumberInput } from 'flowbite-svelte';
	import { DatePicker } from 'date-picker-svelte';
	import { ArrowRightSolid, CheckSolid, RedoOutline } from 'flowbite-svelte-icons';

	const allGuests = data.guests;

	async function updateAppointment(appointment) {
		const url =
			'/api/appointment/' +
			appointment.id +
			'?guests=' +
			appointment.guests.join() +
			'&counts=' +
			appointment.counts.join() +
			'&date=' +
			appointment.date;
		const response = await fetch(url, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
		let result = await response.json();
		if (response.status === 200) {
			saveEnabled = false;
		} else {
			alert(JSON.stringify(result));
		}
	}

	function addGuest() {
		guests = [...guests, selectedGuest];
		counts = [...counts, 1];
		addModal = false;
		saveEnabled = true;
	}

	function removeGuest(id) {
		const i = guests.indexOf(id);
		guests.splice(i, 1);
		guests = guests;
		counts.splice(i, 1);
		counts = counts;
		saveEnabled = true;
	}

	function countChanged(i) {
		const input = document.getElementById('numberInput_' + i).value;
		counts[i] = parseInt(input);
		saveEnabled = true;
	}

	function resetList() {
		let newGuests = [];
		let newCounts = [];
		if (vip) {
			allGuests.forEach((guest) => {
				if (guest.vip) {
					newGuests.push(guest.id);
					newCounts.push(1);
				}
			});
		}
		guests = newGuests;
		counts = newCounts;
		saveEnabled = true;
		resetModal = false;
	}

	function getGuestNameFromId(id) {
		let guest = allGuests.find((guest) => guest.id == id);
		return guest.forename + ' ' + guest.surname;
	}

	let addModal = false;
	let resetModal = false;
	let appointment = data.appointments[0];
	let guests = appointment.guests.slice();
	let counts = appointment.counts.slice();
	if (guests.length == 1 && guests[0] == '') {
		guests = [];
		counts = [];
	}
	let selectedGuest;
	let saveEnabled = false;
	let totalCount = 0;
	let newDate = new Date(appointment.date);
	let vip = true;

	$: {
		let objs = [];
		for (let i = 0; i < guests.length; i++) {
			objs.push({
				id: guests[i],
				cnt: counts[i],
				name: getGuestNameFromId(guests[i])
			});
		}
		objs.sort((a, b) => {
			return a.name > b.name ? 1 : a.name < b.name ? -1 : 0;
		});
		guests = [];
		counts = [];
		objs.forEach((obj) => {
			guests.push(obj.id);
			counts.push(obj.cnt);
		});
		appointment.guests = guests.slice();
		appointment.counts = counts.slice();
		appointment.date = newDate.toISOString();
		totalCount = counts.reduce((partialSum, a) => partialSum + a, 0);
	}
</script>

<Table hoverable={true}>
	<caption
		class="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800"
	>
		Gästeliste
		<p class="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
			für {MapDate(appointment.date)}, insgesamt {totalCount} Gäste.
		</p>
	</caption>
	<TableHead>
		<TableHeadCell>Name</TableHeadCell>
		<TableHeadCell>Anzahl</TableHeadCell>
		<TableHeadCell></TableHeadCell>
	</TableHead>
	<TableBody tableBodyClass="divide-y">
		{#each appointment.guests as guestID, i}
			<TableBodyRow>
				<TableBodyCell tdClass="py-2 px-2">{getGuestNameFromId(guestID)}</TableBodyCell>
				<TableBodyCell tdClass="py-2 px-2">
					<NumberInput
						size="sm"
						id={'numberInput_' + i}
						value={appointment.counts[i]}
						min="1"
						max="10"
						on:input={() => countChanged(i)}
					/>
				</TableBodyCell>
				<TableBodyCell tdClass="py-2 px-2">
					<Button outline size="sm" on:click={() => removeGuest(guestID)}>Löschen</Button>
				</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>
<br />
<div class="flex flex-col sm:flex-row content-center gap-3">
	<div>
		<Button on:click={() => (addModal = true)}
			><ArrowRightSolid class="w-3.5 h-3.5 me-2" />Gast hinzufügen</Button
		>
		<Modal title="Gast hinzufügen" bind:open={addModal} autoclose={false} class="max-w-sm">
			<form class="flex flex-col space-y-6" action="#">
				<Select
					class="w-44 p-3 space-y-3 text-sm"
					items={data.guestMap.filter((item) => !appointment.guests.includes(item.value))}
					bind:value={selectedGuest}
					placeholder="Auswählen..."
				></Select>
				<Button color="alternative" on:click={addGuest}>Bestätigen</Button>
				<Button color="primary" on:click={() => (addModal = false)}>Abbrechen</Button>
			</form>
		</Modal>
	</div>
	<div>
		<Button disabled={!saveEnabled} on:click={() => updateAppointment(appointment)}>
			<CheckSolid class="w-3.5 h-3.5 me-2" />Speichern
		</Button>
	</div>
	<div>
		<Button on:click={() => (resetModal = true)}>
			<RedoOutline class="w-3.5 h-3.5 me-2" />Zurücksetzen
		</Button>
		<Modal title="Liste zurücksetzen" bind:open={resetModal} autoclose={false} class="max-w-sm">
			<form class="flex flex-col space-y-6" action="#">
				<P>Nächster Termin:</P>
				<DatePicker bind:value={newDate} />
				<Checkbox bind:checked={vip}>VIPs sofort hinzufügen</Checkbox>
				<Button color="alternative" on:click={resetList}>Bestätigen</Button>
				<Button color="primary" on:click={() => (resetModal = false)}>Abbrechen</Button>
			</form>
		</Modal>
	</div>
</div>
