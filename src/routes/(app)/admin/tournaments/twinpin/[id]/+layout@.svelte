<script>
	import Header from '$lib/components/Header.svelte';
	import { accessState, ReadAccess, AdminAccess } from '/src/state.svelte.js';
	import { page } from '$app/state';
	import { goto, afterNavigate } from '$app/navigation';

	let { data, children } = $props();

	let tournament = $derived(data.tournament);
	let id = page.params.id;

	const links = [
		{ link: '/admin/tournaments/twinpin/' + id + '/settings', name: 'Einstellungen' },
		{ link: '/admin/tournaments/twinpin/' + id + '/players', name: 'Spieler' },
		{ link: '/admin/tournaments/twinpin/' + id + '/rounds', name: 'Runde' },
		{ link: '/admin/tournaments/twinpin/' + id + '/export', name: 'Export' },
		{ link: '/liga/twinpin/' + id + '/ranking', name: 'zum Turnier' }
	];

	let loading = $state('');

	const loadPage = (item) => {
		loading = item.link;
		if (!import.meta.env.VITE_KEEP_ADMIN && !item.link.startsWith('/admin')) {
			accessState.value = ReadAccess;
		}
		goto(item.link);
	};

	afterNavigate(async () => {
		loading = '';
	});
</script>

{#snippet headerLink(d)}
	{@const isActive = page.url.pathname.startsWith(d.link)}
	{@const isLoading = loading === d.link}
	<li class="flex items-center">
		<button
			class="text-sm font-medium px-3 py-2 border-b-2 transition-colors"
			class:border-blue-600={isActive && !isLoading}
			class:dark:border-blue-400={isActive && !isLoading}
			class:text-blue-600={isActive && !isLoading}
			class:dark:text-blue-400={isActive && !isLoading}
			class:border-transparent={!isActive || isLoading}
			class:text-gray-400={isLoading}
			class:dark:text-gray-500={isLoading}
			class:text-gray-500={!isLoading && !isActive}
			class:dark:text-gray-400={!isLoading && !isActive}
			class:hover:text-gray-800={!isLoading && !isActive}
			class:dark:hover:text-gray-100={!isLoading && !isActive}
			disabled={isLoading}
			onclick={() => loadPage(d)}
		>{d.name}</button>
	</li>
{/snippet}

<div class="flex flex-col min-h-screen max-w-full md:max-w-7xl mx-auto">
	<Header headerLinks={links} {headerLink} />

	<main class="flex flex-1 flex-col md:flex-row p-4">
		<div>
			{#if accessState.value >= AdminAccess}
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
