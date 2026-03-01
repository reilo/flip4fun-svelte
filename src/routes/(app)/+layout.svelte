<script>
	import Header from '$lib/components/Header.svelte';
	import '../../app.css';
	import { goto, afterNavigate } from '$app/navigation';
	import { page } from '$app/state';

	let { children } = $props();

	const links = import.meta.env.VITE_APP_FULL
		? [
				{ link: '/pins', name: 'Flipperliste' },
				{ link: '/draw', name: 'Lostrommel' },
				{ link: '/liga', name: 'Liga' },
				{ link: '/admin', name: 'Administration' },
				{ link: '/about', name: 'Info' }
			]
		: [
				{ link: '/pins', name: 'Flipperliste' },
				{ link: '/draw', name: 'Lostrommel' },
				{ link: '/liga', name: 'Liga' },
				{ link: '/about', name: 'Info' }
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
	{@const isActive = page.url.pathname.startsWith(d.link === '/' ? '/__never__' : d.link)}
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
		{@render children?.()}
	</main>

	<footer class="px-4 py-3 text-center text-xs text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-800">
		<span>&copy; 2023–{new Date().getFullYear()} reilo &mdash; MIT License</span>
	</footer>
</div>
