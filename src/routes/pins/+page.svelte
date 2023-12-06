<script>
	export let data;

	import {
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		TableSearch,
		Checkbox
	} from 'flowbite-svelte';

	import Device from 'svelte-device-info';

	let searchTerm = '';
	let openRow;
	let details;

	const toggleRow = (i) => {
		openRow = openRow === i ? null : i;
	};

	$: items = data.pins.filter(
		(pin) => pin.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
	);
</script>

<TableSearch hoverable={true} placeholder="Suchen nach Name" bind:inputValue={searchTerm}>
	<caption
		class="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800"
	>
		Flipperliste
		<p class="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
			Nur die als "Aktiv" markierten Geräte sind derzeit spielbar.
			<br />
			Benutze das Suchfeld oben, um die Liste nach Flippernamen zu filtern.
			{#if Device.isPhone}
			<br />
			Klicke auf eine Zeile, um mehr Informationen über einen Flipper zu erhalten.
			{/if}
		</p>
	</caption>
	<TableHead>
		<TableHeadCell>Name</TableHeadCell>
		{#if !Device.isPhone}
			<TableHeadCell>Hersteller</TableHeadCell>
			<TableHeadCell>Jahr</TableHeadCell>
			<TableHeadCell>Typ</TableHeadCell>
		{/if}
		<TableHeadCell>Aktiv</TableHeadCell>
	</TableHead>
	<TableBody tableBodyClass="divide-y">
		{#each items as pin, i}
			<TableBodyRow on:click={() => toggleRow(i)}>
				<TableBodyCell>{pin.name}</TableBodyCell>
				{#if !Device.isPhone}
					<TableBodyCell>{pin.manu}</TableBodyCell>
					<TableBodyCell>{pin.year}</TableBodyCell>
					<TableBodyCell>{pin.type}</TableBodyCell>
				{/if}
				<TableBodyCell>
					{#if pin.active == true}
						<Checkbox checked disabled />
					{:else}
						<Checkbox disabled />
					{/if}
				</TableBodyCell>
			</TableBodyRow>
			{#if openRow === i && Device.isPhone}
				<TableBodyRow class="bg-gray-50" on:click={() => (details = pin)}>
					<TableBodyCell colspan="2" class="italic indent-4 py-2">
						Hersteller: {pin.manu}
					</TableBodyCell>
				</TableBodyRow>
				<TableBodyRow class="bg-gray-50" on:click={() => (details = pin)}>
					<TableBodyCell colspan="2" class="italic indent-4 py-2">
						Jahr: {pin.year}
					</TableBodyCell>
				</TableBodyRow>
				<TableBodyRow class="bg-gray-50" on:click={() => (details = pin)}>
					<TableBodyCell colspan="2" class="italic indent-4 py-2">
						Typ: {pin.type}
					</TableBodyCell>
				</TableBodyRow>
			{/if}
		{/each}
	</TableBody>
</TableSearch>
