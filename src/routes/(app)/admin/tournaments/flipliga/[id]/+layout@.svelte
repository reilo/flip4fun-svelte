<script>
	import Header from '$lib/components/Header.svelte';
	import { Footer, FooterCopyright } from 'flowbite-svelte';
	import { P, Heading } from 'flowbite-svelte';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
	import * as TourUtil from '$lib/TourUtil';
	import { access, ReadAccess, AdminAccess } from '../../../../../../stores.js';
	import { page } from '$app/stores';

	let { data, children } = $props();

	let accessValue = $state(ReadAccess);
	access.subscribe((value) => {
		accessValue = value;
	});

	let tournament = data.tournament;
	let id = $page.params.id;

	const links = [
		{ link: '/admin/tournaments/flipliga/' + id + '/settings', name: 'Einstellungen' },
		{ link: '/admin/tournaments/flipliga/' + id + '/players', name: 'Spieler' },
		{ link: '/admin/tournaments/flipliga/' + id + '/blobs', name: 'Spieltag' }
	];
</script>

{#snippet headerLink(d)}
	<NavLi href={d.link}>{d.name}</NavLi>
{/snippet}

<Header headerLinks={links} {headerLink} />

<main class="flex flex-1 flex-col p-4 w-full max-w-7xl mx-auto">
	<Heading tag="h3">{tournament.name + " (" + TourUtil.MapStatus(tournament.status) + ")"}</Heading>
	<br />

	{#if accessValue >= AdminAccess}
		<div class="flex flex-col sm:flex-row gap-3">
			{@render children?.()}
		</div>
	{:else}
		<P>Du hast keine Berechtigung. Logge dich bitte als Administrator ein.</P>
	{/if}
</main>

<Footer>
	<FooterCopyright href="/about" by="Reinhard Loch." year={'2023-2025'} />
</Footer>
