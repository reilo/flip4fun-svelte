<script>
	import { TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
	import { TableHead, TableHeadCell, TableSearch } from 'flowbite-svelte';
	import { Checkbox } from 'flowbite-svelte';

	import Device from 'svelte-device-info';
	let { data } = $props();

	let searchTerm = $state('');
	let openRow = $state();
	let details = $state();

	let sortKey = $state('name');
	let sortDirection = $state(1); // ascending
	let items = $state(data.pins.slice());

	const toggleRow = (i) => {
		openRow = openRow === i ? null : i;
	};

	const sortTable = (key) => {
		if (sortKey === key) {
			sortDirection *= -1;
		} else {
			sortKey = key;
			sortDirection = 1;
		}
	};

	const getTextStyle = (value) => {
		return value ? '' : 'text-decoration: line-through;';
	};

	$effect.pre(() => {
		items = data.pins.slice();
		const filtered = items.filter(
			(pin) => pin.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
		);
		const sorted = filtered.sort((a, b) => {
			const aVal = a[sortKey];
			const bVal = b[sortKey];
			if (aVal < bVal) {
				return -sortDirection;
			} else if (aVal > bVal) {
				return sortDirection;
			}
			return 0;
		});
		items = sorted;
	});
</script>

<TableSearch hoverable={true} placeholder="Suchen nach Name" bind:inputValue={searchTerm}>
	<caption
		class="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800"
	>
		Flipperliste
		<p class="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
			Durchgestrichene Geräte sind derzeit nicht spielbereit.
			<br />
			Benutze das Suchfeld oben, um die Liste nach Flippernamen zu filtern.
			{#if Device.isPhone}
				<br />
				Klicke auf eine Zeile, um mehr Informationen über einen Flipper zu erhalten.
			{/if}
		</p>
	</caption>
	<TableHead>
		<TableHeadCell on:click={() => sortTable('name')}>Name</TableHeadCell>
		{#if !Device.isPhone}
			<TableHeadCell on:click={() => sortTable('manu')}>Hersteller</TableHeadCell>
			<TableHeadCell on:click={() => sortTable('year')}>Jahr</TableHeadCell>
			<TableHeadCell on:click={() => sortTable('type')}>Typ</TableHeadCell>
		{/if}
	</TableHead>
	<TableBody tableBodyClass="divide-y">
		{#each items as pin, i}
			<TableBodyRow on:click={() => toggleRow(i)}>
				<TableBodyCell>
					<div style={getTextStyle(pin.active)}>
						{pin.name}
					</div>
				</TableBodyCell>
				{#if !Device.isPhone}
					<TableBodyCell>
						<div style={getTextStyle(pin.active)}>
							{pin.manu}
						</div>
					</TableBodyCell>
					<TableBodyCell>
						<div style={getTextStyle(pin.active)}>
							{pin.year}
						</div>
					</TableBodyCell>

					<TableBodyCell>
						<div style={getTextStyle(pin.active)}>
							{pin.type}
						</div>
					</TableBodyCell>
				{/if}
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
