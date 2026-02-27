<script>
	import Header from '$lib/components/Header.svelte';
	import { Heading, Button, Spinner } from 'flowbite-svelte';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
	import { page } from '$app/state';
	import { goto, afterNavigate } from '$app/navigation';
	import { innerWidth } from 'svelte/reactivity/window';
	import { mapTourStatus } from '$lib/TourUtil';

	let buttonSize = $derived(innerWidth.current <= 1024 ? 'xs' : 'sm');

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

	const roundstatus = data.round ? mapTourStatus(data.round.status) : null;
	const tournamentStatus = mapTourStatus(data.tournament.status);

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
	<NavLi>
		{#if loading === d.link}
			<Button size={buttonSize} class="rounded-full">
				<Spinner class="me-2" size="4" color="white" />Laden ...
			</Button>
		{:else}
			<Button
				size={buttonSize}
				color={page.url.pathname.startsWith(d.link) ? 'primary' : 'alternative'}
				class="rounded-full"
				on:click={() => loadPage(d)}
			>{d.name}</Button>
		{/if}
	</NavLi>
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
