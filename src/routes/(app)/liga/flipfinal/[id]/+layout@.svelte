<script>
	import Header from '$lib/components/Header.svelte';
	import { Spinner } from 'flowbite-svelte';
	import { page } from '$app/state';
	import { goto, afterNavigate } from '$app/navigation';

	let { data, children } = $props();

	let tournament = data.tournament;
	let id = page.params.id;

	const links = import.meta.env.VITE_APP_FULL
		? [
				{ link: '/liga/flipfinal/' + id + '/ranking', name: 'Tabelle' },
				{ link: '/liga/flipfinal/' + id + '/pyramid', name: 'Ebenen' },
				{ link: '/liga/flipfinal/' + id + '/matches', name: 'Matches' },
				{ link: '/liga/flipfinal/' + id + '/draw', name: 'Lostrommel' },
				{ link: '/admin/tournaments/flipfinal/' + id + '/settings', name: 'Liga-Admin' }
			]
		: [
				{ link: '/liga/flipfinal/' + id + '/ranking', name: 'Tabelle' },
				{ link: '/liga/flipfinal/' + id + '/matches', name: 'Matches' },
				{ link: '/liga/flipfinal/' + id + '/draw', name: 'Lostrommel' },
				{ link: '/liga/flipfinal/' + id + '/extended', name: 'Export' }
			];

	let loading = $state('');

	const loadPage = (item) => {
		loading = item.link;
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
			{@render children?.()}
		</div>
	</main>

	<footer class="px-4 py-3 text-center text-xs text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-800">
		<span>&copy; 2023–{new Date().getFullYear()} reilo &mdash; MIT License</span>
	</footer>
</div>
