<script>
	export let data;

	import { MapDate } from '$lib/utils';
	import { Table, TableHead, TableHeadCell } from 'flowbite-svelte';
	import { TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
	import { Modal, Select, Button } from 'flowbite-svelte';
	import { NumberInput } from 'flowbite-svelte';
	import { ArrowRightSolid, CheckSolid, RedoOutline } from 'flowbite-svelte-icons';

	function addGuest() {
		guests = [...guests, selectedGuest];
		counts = [...counts, 1];
		formModal = false;
		saveEnabled = true;
	}

	function removeGuest(i) {
		guests.splice(i, 1);
		guests = guests;
		counts.splice(i, 1);
		counts = counts;
	}

	let formModal = false;
	let appointment = data.appointments[0];
	let guests = appointment.guests.slice();
	let counts = appointment.counts.slice();
	let selectedGuest;
	let saveEnabled = false;

	$: {
		appointment.guests = guests.slice();
		appointment.counts = counts.slice();
	}
</script>

<Table hoverable={true}>
	<caption
		class="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800"
	>
		Gästeliste
		<p class="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
			für den Loungeabend am {MapDate(appointment.date)}.
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
				<TableBodyCell>{data.guests.find((guest) => guest.id == guestID).name}</TableBodyCell>
				<TableBodyCell>
					<NumberInput value={appointment.counts[i]} min="1" max="10" />
				</TableBodyCell>
				<TableBodyCell>
					<Button outline on:click={() => removeGuest('i')}>Löschen</Button>
				</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>
<br />
<div class="flex flex-col sm:flex-row content-center gap-3">
	<div>
		<Button on:click={() => (formModal = true)}
			><ArrowRightSolid class="w-3.5 h-3.5 me-2" />Gast hinzufügen</Button
		>
		<Modal title="Gast hinzufügen" bind:open={formModal} autoclose={false} class="max-w-sm">
			<form class="flex flex-col space-y-6" action="#">
				<Select
					class="w-44 p-3 space-y-3 text-sm"
					items={data.guestMap}
					bind:value={selectedGuest}
					placeholder="Auswählen..."
				></Select>

				<Button color="alternative" on:click={addGuest}>Bestätigen</Button>
				<Button color="primary" on:click={() => (formModal = false)}>Abbrechen</Button>
			</form>
		</Modal>
	</div>
	<div>
		<Button disabled={!saveEnabled}>
			<CheckSolid class="w-3.5 h-3.5 me-2" />Speichern
		</Button>
	</div>
	<div>
		<Button>
			<RedoOutline class="w-3.5 h-3.5 me-2" />Zurücksetzen
		</Button>
	</div>
</div>
