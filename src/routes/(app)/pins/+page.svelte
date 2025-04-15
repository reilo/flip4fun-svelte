<script>
	import { TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
	import { TableHead, TableHeadCell, TableSearch } from 'flowbite-svelte';
	import { Heading, Alert } from 'flowbite-svelte';
	import { InfoCircleSolid } from 'flowbite-svelte-icons';
	import { innerWidth, devicePixelRatio } from 'svelte/reactivity/window';

	let { data } = $props();
	let showError = $derived(!data || !data.pins);

	let searchTerm = $state('');

	let sortKey = $state('name');
	let sortDirection = $state(1); // ascending
	let items = $state(data.pins ? data.pins.slice() : []);

	let isPhone = $derived(innerWidth.current / devicePixelRatio.current <= 480);

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
		let items2 = data.pins ? data.pins.slice() : [];
		const filtered = items2.filter(
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

{#if showError}
	<Alert border color="red">
		<InfoCircleSolid slot="icon" class="w-5 h-5" />
		<span class="font-medium">Interner Fehler!</span>
		<br />
		{data.message}
		<br />
		{data.error}
	</Alert>
	<br />
{/if}

<Heading tag="h5"
	>Flipperliste - insgesamt {data.pins.reduce((sum, pin) => {
		return sum + (!pin.deleted && pin.id !== 'muma' ? 1 : 0);
	}, 0)}, spielbereit {data.pins.reduce((sum, pin) => {
		return sum + (pin.active && !pin.deleted && pin.id !== 'muma' ? 1 : 0);
	}, 0)}</Heading
>

<TableSearch hoverable={true} placeholder="Suchen nach Name" bind:inputValue={searchTerm}>
	<caption
		class="px-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800"
	>
		<p class="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
			Durchgestrichene Geräte sind derzeit nicht spielbereit.
			<br />
			Klicke die Spaltentitel an zum Sortieren.
		</p>
		<br />
	</caption>
	<TableHead>
		<TableHeadCell on:click={() => sortTable('name')}>Name</TableHeadCell>
		<TableHeadCell on:click={() => sortTable('manu')}>Hersteller</TableHeadCell>
		{#if !isPhone}
			<TableHeadCell on:click={() => sortTable('year')}>Jahr</TableHeadCell>
			<TableHeadCell on:click={() => sortTable('type')}>Plattform</TableHeadCell>
		{/if}
	</TableHead>
	<TableBody tableBodyClass="divide-y">
		{#each items as pin, i}
			{#if !pin.deleted && pin.id !== 'muma'}
				<TableBodyRow>
					<TableBodyCell class="py-2">
						<div style={getTextStyle(pin.active)}>
							{pin.name}
						</div>
					</TableBodyCell>
					<TableBodyCell class="py-0">
						<div style={getTextStyle(pin.active)}>
							{pin.manu}
						</div>
					</TableBodyCell>
					{#if !isPhone}
						<TableBodyCell class="py-0">
							<div style={getTextStyle(pin.active)}>
								{pin.year}
							</div>
						</TableBodyCell>
						<TableBodyCell class="py-0">
							<div style={getTextStyle(pin.active)}>
								{pin.type}
							</div>
						</TableBodyCell>
					{/if}
				</TableBodyRow>
			{/if}
		{/each}
	</TableBody>
</TableSearch>
