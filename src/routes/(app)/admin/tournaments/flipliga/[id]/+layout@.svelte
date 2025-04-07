<script>
	import Header from '$lib/components/Header.svelte';
	import { Footer, FooterCopyright } from 'flowbite-svelte';
	import { P, Heading } from 'flowbite-svelte';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
	import { mapTourStatus } from '$lib/TourUtil';
	import { access, ReadAccess, AdminAccess } from '/src/stores.js';
	import { page } from '$app/state';

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
</script>

{#snippet headerLink(d)}
	<NavLi href={d.link}>{d.name}</NavLi>
{/snippet}

<Header headerLinks={links} {headerLink} />

<main class="flex flex-1 flex-col p-4 w-full max-w-7xl mx-auto">
	<Heading tag="h3">{tournament.name + ' (' + mapTourStatus(tournament.status) + ')'}</Heading>
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
