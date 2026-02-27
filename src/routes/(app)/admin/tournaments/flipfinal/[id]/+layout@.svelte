<script>
	import Header from '$lib/components/Header.svelte';
	import { Spinner } from 'flowbite-svelte';
	import { mapTourStatus } from '$lib/TourUtil';
	import { access, ReadAccess, AdminAccess } from '/src/stores.js';
	import { page } from '$app/state';
	import { goto, afterNavigate } from '$app/navigation';

	let { data, children } = $props();

	let accessValue = $state(ReadAccess);
	access.subscribe((value) => {
		accessValue = value;
	});

	let tournament = data.tournament;
	let id = page.params.id;

	const links = [
		{ link: '/admin/tournaments/flipfinal/' + id + '/settings', name: 'Einstellungen' },
		{ link: '/admin/tournaments/flipfinal/' + id + '/players', name: 'Spielerverwaltung' },
		{ link: '/admin/tournaments/flipfinal/' + id + '/rounds', name: 'Rundenverwaltung' },
		{ link: '/admin/tournaments/flipfinal/' + id + '/export', name: 'Export' },
		{ link: '/liga/flipfinal/' + id + '/ranking', name: 'zum Turnier' }
	];

	let loading = $state('');

	const loadPage = (item) => {
		loading = item.link;
		if (!import.meta.env.VITE_KEEP_ADMIN && !item.link.startsWith('/admin')) {
			access.set(ReadAccess);
		}
		goto(item.link);
	};

	afterNavigate(async () => {
		loading = '';
	});
</script>

{#snippet headerLink(d)}
	{@const isActive = page.url.pathname.startsWith(d.link)}
	<li class="flex items-center">
		{#if loading === d.link}
			<span class="flex items-center gap-1.5 text-sm px-3 py-2 text-gray-400 dark:text-gray-500">
				<Spinner size="3" />Laden ...
			</span>
		{:else}
			<button
				class="text-sm font-medium px-3 py-2 border-b-2 transition-colors"
				class:border-blue-600={isActive}
				class:dark:border-blue-400={isActive}
				class:text-blue-600={isActive}
				class:dark:text-blue-400={isActive}
				class:border-transparent={!isActive}
				class:text-gray-500={!isActive}
				class:dark:text-gray-400={!isActive}
				class:hover:text-gray-800={!isActive}
				class:dark:hover:text-gray-100={!isActive}
				onclick={() => loadPage(d)}
			>{d.name}</button>
		{/if}
	</li>
{/snippet}

<div class="flex flex-col min-h-screen max-w-full md:max-w-7xl mx-auto">
	<Header headerLinks={links} {headerLink} />

	<main class="flex flex-1 flex-col md:flex-row p-4">
		<div>
			{#if accessValue >= AdminAccess}
				<div class="flex flex-col md:flex-row gap-3 mx-auto">
					{@render children?.()}
				</div>
			{:else}
				<p class="text-sm text-gray-500 dark:text-gray-400">Du hast keine Berechtigung. Logge dich bitte als Administrator ein.</p>
			{/if}
		</div>
	</main>

	<footer class="px-4 py-3 text-center text-xs text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-800">
		<span>&copy; 2023–{new Date().getFullYear()} reilo &mdash; MIT License</span>
	</footer>
</div>
