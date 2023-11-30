<script>
	export let data;

	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		TableSearch,
		Checkbox
	} from 'flowbite-svelte';

	let items;
	let searchTerm = '';
	let openRow;
	let details;

	const toggleRow = (i) => {
		openRow = openRow === i ? null : i;
	};

	$: {
		items = data.pins.filter(
			(pin) => pin.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
		);
	}
</script>

<TableSearch hoverable={true} placeholder="Suchen nach Name" bind:inputValue={searchTerm}>
	<TableHead>
		<TableHeadCell>Name</TableHeadCell>
		<TableHeadCell>Hersteller</TableHeadCell>
		<TableHeadCell>Jahr</TableHeadCell>
		<TableHeadCell>Typ</TableHeadCell>
		<TableHeadCell>Aktiv</TableHeadCell>
	</TableHead>
	<TableBody class="divide-y">
		{#each items as pin, i}
			<TableBodyRow on:click={() => toggleRow(i)}>
				<TableBodyCell>{pin.name}</TableBodyCell>
				<TableBodyCell>{pin.manu}</TableBodyCell>
				<TableBodyCell>{pin.year}</TableBodyCell>
				<TableBodyCell>{pin.type}</TableBodyCell>
				<TableBodyCell>
					{#if pin.active == true}
						<Checkbox checked disabled />
					{:else}
						<Checkbox disabled />
					{/if}
				</TableBodyCell>
			</TableBodyRow>
			{#if openRow === i}
				<TableBodyRow class="bg-sky-50" on:dblclick={() => (details = pin)}>
					<TableBodyCell colspan="5" class="italic indent-4 py-2">
						Eigentümer: {pin.owner}
					</TableBodyCell>
				</TableBodyRow>
			{/if}
		{/each}
	</TableBody>
</TableSearch>
