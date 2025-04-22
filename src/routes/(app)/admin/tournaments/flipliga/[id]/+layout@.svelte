<script>
	import Header from '$lib/components/Header.svelte';
	import { Footer, FooterCopyright } from 'flowbite-svelte';
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
			<Button size={buttonSize} outline>
				<Spinner class="me-3" size="4" color="white" />Laden ...
			</Button>
		{:else}
			<Button size={buttonSize} outline on:click={() => loadPage(d)}>{d.name}</Button>
		{/if}
	</NavLi>
{/snippet}

<div class="flex flex-col min-h-screen">
	<Header headerLinks={links} {headerLink} />

	<main class="flex flex-1 flex-col p-4 max-w-7xl mx-auto">
		<Heading tag="h3">{tournament.name + ' (' + mapTourStatus(tournament.status) + ')'}</Heading>
		<br />
		{#if accessValue >= AdminAccess}
			<div class="flex flex-col md:flex-row gap-3 mx-auto">
				{@render children?.()}
			</div>
		{:else}
			<P>Du hast keine Berechtigung. Logge dich bitte als Administrator ein.</P>
		{/if}
	</main>

	<Footer>
		<FooterCopyright href="/about" by="Reinhard Loch." year={'2023-2025'} />
	</Footer>
</div>
