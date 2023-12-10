<script>
	export let data;

	import { MapDate } from '$lib/utils';
	import { Table, TableHead, TableHeadCell } from 'flowbite-svelte';
	import { TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
	import { P, Modal, Select, Button } from 'flowbite-svelte';
	import { NumberInput } from 'flowbite-svelte';
	import { ArrowRightSolid, CheckSolid, RedoOutline } from 'flowbite-svelte-icons';

	import { access, ReadAccess, AdminAccess } from '../../stores.js';
	let accessValue = ReadAccess;
	access.subscribe((value) => {
		accessValue = value;
	});

	async function updateAppointment(a) {
		const url =
			'/api/appointment/' + a.id + '?guests=' + a.guests.join() + '&counts=' + a.counts.join();
		const response = await fetch(url, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
		const appointment = await response.json();
		saveEnabled = false;
		return appointment;
	}

	function addGuest() {
		guests = [...guests, selectedGuest];
		counts = [...counts, 1];
		formModal = false;
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

	let formModal = false;
	let appointment = data.appointments[0];
	let guests = appointment.guests.slice();
	let allGuests = data.guests;
	let counts = appointment.counts.slice();
	let selectedGuest;
	let saveEnabled = false;
	let totalCount = 0;

	$: {
		let objs = [];
		for (let i = 0; i < guests.length; i++) {
			objs.push({
				id: guests[i],
				cnt: counts[i],
				name: allGuests.find((guest) => guest.id == guests[i]).name
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
		{#if accessValue >= AdminAccess}
			<TableHeadCell></TableHeadCell>
		{/if}
	</TableHead>
	<TableBody tableBodyClass="divide-y">
		{#each appointment.guests as guestID, i}
			<TableBodyRow>
				<TableBodyCell tdClass="py-2 px-2"
					>{allGuests.find((guest) => guest.id == guestID).name}</TableBodyCell
				>
				<TableBodyCell tdClass="py-2 px-2">
					<NumberInput
						disabled={accessValue < AdminAccess}
						size="sm"
						id={'numberInput_' + i}
						value={appointment.counts[i]}
						min="1"
						max="10"
						on:input={() => countChanged(i)}
					/>
				</TableBodyCell>
				{#if accessValue >= AdminAccess}
					<TableBodyCell tdClass="py-2 px-2">
						<Button outline size="sm" on:click={() => removeGuest(guestID)}>Löschen</Button>
					</TableBodyCell>
				{/if}
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>
<br />
{#if accessValue >= AdminAccess}
	<div class="flex flex-col sm:flex-row content-center gap-3">
		<div>
			<Button on:click={() => (formModal = true)}
				><ArrowRightSolid class="w-3.5 h-3.5 me-2" />Gast hinzufügen</Button
			>
			<Modal title="Gast hinzufügen" bind:open={formModal} autoclose={false} class="max-w-sm">
				<form class="flex flex-col space-y-6" action="#">
					<Select
						class="w-44 p-3 space-y-3 text-sm"
						items={data.guestMap.filter((item) => !appointment.guests.includes(item.value))}
						bind:value={selectedGuest}
						placeholder="Auswählen..."
					></Select>
					<Button color="alternative" on:click={addGuest}>Bestätigen</Button>
					<Button color="primary" on:click={() => (formModal = false)}>Abbrechen</Button>
				</form>
			</Modal>
		</div>
		<div>
			<Button disabled={!saveEnabled} on:click={() => updateAppointment(appointment)}>
				<CheckSolid class="w-3.5 h-3.5 me-2" />Speichern
			</Button>
		</div>
		<div>
			<Button>
				<RedoOutline class="w-3.5 h-3.5 me-2" />Zurücksetzen
			</Button>
		</div>
	</div>
{/if}
