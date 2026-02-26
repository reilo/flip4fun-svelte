<script>
	import Header from '$lib/components/Header.svelte';
	import { P, Heading, Button, Spinner } from 'flowbite-svelte';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
	import { mapTourStatus } from '$lib/TourUtil';
	import { access, ReadAccess, AdminAccess } from '/src/stores.js';
	import { page } from '$app/state';
	import { goto, afterNavigate } from '$app/navigation';
	import { innerWidth } from 'svelte/reactivity/window';

	let buttonSize = $derived(innerWidth.current <= 1024 ? 'xs' : 'sm');

	let { data, children } = $props();

	let accessValue = $state(ReadAccess);
	access.subscribe((value) => {
		accessValue = value;
	});

	let tournament = data.tournament;
	let id = page.params.id;

	const links = [
		{ link: '/admin/tournaments/flipliga/' + id + '/settings', name: 'Einstellungen' },
		{ link: '/admin/tournaments/flipliga/' + id + '/players', name: 'Spieler' },
		{ link: '/admin/tournaments/flipliga/' + id + '/rounds', name: 'Spieltag' },
		{ link: '/admin/tournaments/flipliga/' + id + '/export', name: 'Export' },
		{ link: '/liga/flipliga/' + id + '/ranking', name: 'zur Liga' }
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
			<Heading tag="h3" class="mb-3"
				>{tournament.name + ' (' + mapTourStatus(tournament.status) + ')'}</Heading
			>
			{#if accessValue >= AdminAccess}
				<div class="flex flex-col md:flex-row gap-3 mx-auto">
					{@render children?.()}
				</div>
			{:else}
				<P>Du hast keine Berechtigung. Logge dich bitte als Administrator ein.</P>
			{/if}
		</div>
	</main>

	<footer class="px-4 py-3 text-center text-xs text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-800">
		<span>&copy; 2023–{new Date().getFullYear()} reilo &mdash; MIT License</span>
	</footer>
</div>
