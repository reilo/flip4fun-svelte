<script>
	import { Badge, Button, Alert, Spinner, P } from 'flowbite-svelte';
	import { InfoCircleSolid, AwardOutline, ChevronRightOutline } from 'flowbite-svelte-icons';
	import { goto } from '$app/navigation';
	import { mapTourType } from '$lib/TourUtil';

	let { data } = $props();
	let showError = $derived(!data || !data.tournaments);

	let loadingTournamentID = $state('');

	const visible = (t) =>
		import.meta.env.VITE_INCLUDE_TEST || !t.name.includes('Test');

	const activeTournaments = $derived(
		(data.tournaments ?? []).filter(t => visible(t) && t.status === 'Active')
	);
	const completedTournaments = $derived(
		(data.tournaments ?? []).filter(t => visible(t) && t.status === 'Completed')
	);

	const typeColor = (type) => {
		switch (type) {
			case 'twinpin':   return 'blue';
			case 'flipliga':  return 'purple';
			case 'flipfinal': return 'green';
			default:          return 'dark';
		}
	};

	const loadTournament = (tournament) => {
		loadingTournamentID = tournament.id;
		goto('/liga/' + tournament.type + '/' + tournament.id + '/ranking');
	};
</script>

<div class="space-y-5">
	{#if showError}
		<Alert border color="red">
			{#snippet icon()}<InfoCircleSolid class="w-5 h-5" />{/snippet}
			<span class="font-bold">Interner Fehler!</span>
			<P>{data.message}</P>
			<P>{data.error}</P>
		</Alert>
	{/if}

	<!-- Summary bar -->
	<div class="grid grid-cols-2 gap-3">
		<div class="bg-white dark:bg-gray-800 border border-green-200 dark:border-green-700 rounded-lg p-3 flex items-center gap-3">
			<div class="w-3 h-3 rounded-full bg-green-500 shrink-0"></div>
			<div>
				<p class="text-xs text-green-600 dark:text-green-400 uppercase tracking-wide font-semibold">Aktiv</p>
				<p class="text-2xl font-bold text-gray-900 dark:text-white">{activeTournaments.length}</p>
			</div>
		</div>
		<div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 flex items-center gap-3">
			<div class="w-3 h-3 rounded-full bg-gray-400 shrink-0"></div>
			<div>
				<p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-semibold">Beendet</p>
				<p class="text-2xl font-bold text-gray-900 dark:text-white">{completedTournaments.length}</p>
			</div>
		</div>
	</div>

	<!-- Active tournaments -->
	{#if activeTournaments.length > 0}
		<div class="space-y-2">
			<p class="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">Aktive Turniere</p>
			{#each activeTournaments as tournament}
				<div class="bg-white dark:bg-gray-800 border border-green-200 dark:border-green-700 rounded-lg p-4 flex items-center gap-3 shadow-sm">
					<AwardOutline class="w-5 h-5 text-green-500 shrink-0" />
					<div class="flex-1 min-w-0">
						<p class="text-sm font-semibold text-gray-900 dark:text-white truncate">{tournament.name}</p>
						{#if import.meta.env.VITE_APP_FULL}
							<Badge color={typeColor(tournament.type)} class="text-xs mt-1">{mapTourType(tournament.type)}</Badge>
						{/if}
					</div>
					{#if loadingTournamentID === tournament.id}
						<Button size="sm" class="shrink-0">
							<Spinner class="me-2" size="4" color="white" />Laden ...
						</Button>
					{:else}
						<Button size="sm" color="green" class="shrink-0" onclick={() => loadTournament(tournament)}>
							Öffnen <ChevronRightOutline class="w-4 h-4 ml-1" />
						</Button>
					{/if}
				</div>
			{/each}
		</div>
	{/if}

	<!-- History -->
	{#if completedTournaments.length > 0}
		<div class="space-y-2">
			<p class="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">Turnier-Historie</p>
			<div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
				<!-- Header -->
				<div class="grid grid-cols-[1fr_auto_auto] bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
					<div class="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Name</div>
					{#if import.meta.env.VITE_APP_FULL}
						<div class="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Typ</div>
					{/if}
					<div class="px-4 py-2"></div>
				</div>
				<!-- Rows -->
				{#each completedTournaments as tournament, i}
					<div
						class="grid grid-cols-[1fr_auto_auto] items-center border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors hover:bg-blue-50 dark:hover:bg-blue-950"
						class:bg-gray-100={i % 2 === 1}
						class:dark:bg-gray-700={i % 2 === 1}
					>
						<div class="px-4 py-2 text-sm font-medium text-gray-900 dark:text-white truncate">{tournament.name}</div>
						{#if import.meta.env.VITE_APP_FULL}
							<div class="px-4 py-2">
								<Badge color={typeColor(tournament.type)} class="text-xs">{mapTourType(tournament.type)}</Badge>
							</div>
						{/if}
						<div class="px-4 py-2">
							{#if loadingTournamentID === tournament.id}
								<Button size="sm" class="w-fit">
									<Spinner class="me-2" size="4" color="white" />Laden ...
								</Button>
							{:else}
								<Button size="sm" color="light" onclick={() => loadTournament(tournament)}>Öffnen</Button>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
