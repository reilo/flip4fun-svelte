<script>
	import { Input, Badge } from 'flowbite-svelte';
	import { Alert, P } from 'flowbite-svelte';
	import { InfoCircleSolid, SearchOutline, ChevronUpOutline, ChevronDownOutline } from 'flowbite-svelte-icons';
	import { innerWidth } from 'svelte/reactivity/window';

	let { data } = $props();
	let showError = $derived(!data || !data.pins);

	let searchTerm = $state('');
	let sortKey = $state('name');
	let sortDirection = $state(1);
	let isPhone = $derived(innerWidth.current <= 480);

	const visiblePins = $derived((data.pins ?? []).filter(p => !p.deleted && p.id !== 'muma'));
	const totalCount = $derived(visiblePins.length);
	const activeCount = $derived(visiblePins.filter(p => p.active).length);

	const sortTable = (key) => {
		if (sortKey === key) sortDirection *= -1;
		else { sortKey = key; sortDirection = 1; }
	};

	const typeColor = (type) => {
		switch (type) {
			case 'EM':        return 'blue';
			case 'EE':        return 'purple';
			case 'Sys11':     return 'yellow';
			case 'DataEast':  return 'pink';
			case 'Gottlieb':  return 'green';
			case 'WPC':       return 'indigo';
			case 'WPC95':     return 'indigo';
			case 'Pin2000':   return 'red';
			case 'Whitestar': return 'dark';
			case 'SAM':       return 'green';
			case 'Spike':     return 'red';
			default:          return 'dark';
		}
	};

	const manuColor = (manu) => {
		switch (manu) {
			case 'Williams':  return 'blue';
			case 'Bally':     return 'purple';
			case 'Stern':     return 'red';
			case 'DataEast':  return 'pink';
			case 'Gottlieb':  return 'green';
			case 'Sega':      return 'yellow';
			case 'Zaccaria':  return 'indigo';
			default:          return 'dark';
		}
	};

	let items = $derived((() => {
		const filtered = visiblePins.filter(
			p => p.name.toLowerCase().includes(searchTerm.toLowerCase())
		);
		return filtered.sort((a, b) => {
			const aVal = a[sortKey] ?? '';
			const bVal = b[sortKey] ?? '';
			if (aVal < bVal) return -sortDirection;
			if (aVal > bVal) return sortDirection;
			return 0;
		});
	})());
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

	<!-- Summary bar -->
	<div class="grid grid-cols-2 gap-3">
		<div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 flex items-center gap-3">
			<div class="w-3 h-3 rounded-full bg-gray-400 flex-shrink-0"></div>
			<div>
				<p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-semibold">Gesamt</p>
				<p class="text-2xl font-bold text-gray-900 dark:text-white">{totalCount}</p>
			</div>
		</div>
		<div class="bg-white dark:bg-gray-800 border border-green-200 dark:border-green-700 rounded-lg p-3 flex items-center gap-3">
			<div class="w-3 h-3 rounded-full bg-green-500 flex-shrink-0"></div>
			<div>
				<p class="text-xs text-green-600 dark:text-green-400 uppercase tracking-wide font-semibold">Spielbereit</p>
				<p class="text-2xl font-bold text-gray-900 dark:text-white">{activeCount}</p>
			</div>
		</div>
	</div>

	<!-- Search -->
	<div class="relative">
		<SearchOutline class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
		<Input
			placeholder="Nach Name suchen …"
			bind:value={searchTerm}
			class="pl-9"
		/>
	</div>

	<!-- Table -->
	<div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
		<!-- Header -->
		<div class="grid {isPhone ? 'grid-cols-[1fr_9rem]' : 'grid-cols-[1fr_12rem_4.5rem_5rem]'} bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
			{#each (isPhone ? [['name','Name'],['manu','Hersteller']] : [['name','Name'],['manu','Hersteller'],['year','Jahr'],['type','Typ']]) as [key, label]}
				<button
					class="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1 transition-colors"
					onclick={() => sortTable(key)}
				>
					{label}
					{#if sortKey === key}
						{#if sortDirection === 1}
							<ChevronUpOutline class="w-3 h-3" />
						{:else}
							<ChevronDownOutline class="w-3 h-3" />
						{/if}
					{/if}
				</button>
			{/each}
		</div>

		<!-- Rows -->
		{#each items as pin, i}
			<div
				class="grid {isPhone ? 'grid-cols-[1fr_9rem]' : 'grid-cols-[1fr_12rem_4.5rem_5rem]'} items-center border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors hover:bg-blue-50 dark:hover:bg-blue-950"
				class:bg-gray-50={i % 2 === 1}
				class:dark:bg-gray-700={i % 2 === 1}
			>
				<!-- Name -->
				<div class="px-4 py-2 flex items-center gap-2 min-w-0">
					<div class="w-2 h-2 rounded-full flex-shrink-0 {pin.active ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}"></div>
					<span class="text-sm font-medium text-gray-900 dark:text-white truncate {pin.active ? '' : 'line-through text-gray-400 dark:text-gray-500'}">{pin.name}</span>
				</div>
				<!-- Manufacturer -->
				<div class="px-4 py-2">
					<Badge color={pin.active ? manuColor(pin.manu) : 'dark'} class="text-xs max-w-full truncate {pin.active ? '' : 'opacity-40'}">{pin.manu}</Badge>
				</div>
				{#if !isPhone}
					<!-- Year -->
					<div class="px-4 py-2 text-sm text-center text-gray-600 dark:text-gray-300 {pin.active ? '' : 'opacity-40'}">{pin.year}</div>
					<!-- Type -->
					<div class="px-4 py-2 flex justify-center">
						<Badge color={pin.active ? typeColor(pin.type) : 'dark'} class="text-xs {pin.active ? '' : 'opacity-40'}">{pin.type}</Badge>
					</div>
				{/if}
			</div>
		{/each}

		{#if items.length === 0}
			<div class="px-4 py-8 text-center text-gray-400 dark:text-gray-500 text-sm">Keine Einträge gefunden.</div>
		{/if}
	</div>
</div>
