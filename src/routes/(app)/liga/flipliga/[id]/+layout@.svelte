<script>
	import Header from '$lib/components/Header.svelte';
	import { Footer, FooterCopyright } from 'flowbite-svelte';
	import { Heading } from 'flowbite-svelte';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
	import { page } from '$app/stores';
	import * as TourUtil from '$lib/TourUtil';

	let { data, children } = $props();

	let tournament = data.tournament;
	let id = $page.params.id;

	const links = [
		{ link: '/liga/flipliga/' + id + '/ranking', name: 'Ranking' },
		{ link: '/liga/flipliga/' + id + '/matches', name: 'Matches' },
		{ link: '/liga/flipliga/' + id + '/draw', name: 'Flipper losen' },
		{ link: '/admin/tournaments/flipliga/' + id + '/settings', name: 'Admin' }
	];

	const roundstatus = TourUtil.MapStatus(data.round.status);
</script>

{#snippet headerLink(d)}
	<NavLi href={d.link}>{d.name}</NavLi>
{/snippet}

<Header headerLinks={links} {headerLink} />

<main class="flex flex-1 flex-col p-4 w-full max-w-7xl mx-auto">
	<Heading tag="h3">{tournament.name}</Heading>
	<br />
	<Heading tag="h5">Aktuelle Runde {data.round.rid} ({roundstatus})</Heading>
	<br />

	{@render children?.()}
</main>

<Footer>
	<FooterCopyright href="/about" by="Reinhard Loch." year={'2023-2025'} />
</Footer>
