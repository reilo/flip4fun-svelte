<script>
	import Header from '$lib/components/Header.svelte';
	import { Footer, FooterCopyright } from 'flowbite-svelte';
	import { Heading } from 'flowbite-svelte';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
	import { page } from '$app/stores';
	import { mapTourStatus } from '$lib/TourUtil';

	let { data, children } = $props();

	let tournament = data.tournament;
	let id = $page.params.id;

	const links = [
		{ link: '/liga/flipliga/' + id + '/ranking', name: 'Ranking' },
		{ link: '/liga/flipliga/' + id + '/matches', name: 'Matches' },
		{ link: '/liga/flipliga/' + id + '/draw', name: 'Flipper losen' },
		{ link: '/liga/flipliga/' + id + '/statistics', name: 'Statistik' },
		{ link: '/admin/tournaments/flipliga/' + id + '/settings', name: 'Liga-Admin' }
	];

	const roundstatus = (data.round) ? mapTourStatus(data.round.status) : null;
	const tournamentStatus = mapTourStatus(data.tournament.status);
</script>

{#snippet headerLink(d)}
	<NavLi href={d.link}>{d.name}</NavLi>
{/snippet}

<Header headerLinks={links} {headerLink} />

<main class="flex flex-1 flex-col p-4 w-full max-w-7xl mx-auto">
	{#if tournament.status === 'Active'}
		<Heading tag="h3">{tournament.name} / {data.round.rid}. Spieltag ({roundstatus})</Heading>
	{:else}
		<Heading tag="h3">{tournament.name} ({tournamentStatus})</Heading>
	{/if}
	<br />

	{@render children?.()}
</main>

<Footer>
	<FooterCopyright href="/about" by="Reinhard Loch." year={'2023-2025'} />
</Footer>
