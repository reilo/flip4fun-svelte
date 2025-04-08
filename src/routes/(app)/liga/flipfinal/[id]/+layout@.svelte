<script>
	import Header from '$lib/components/Header.svelte';
	import { Footer, FooterCopyright } from 'flowbite-svelte';
	import { Heading, Button, Spinner } from 'flowbite-svelte';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
	import { page } from '$app/state';
	import { goto, afterNavigate } from '$app/navigation';
	import { mapTourStatus } from '$lib/TourUtil';

	let { data, children } = $props();

	let tournament = data.tournament;
	let id = page.params.id;

	const links = import.meta.env.VITE_APP_FULL
		? [
				{ link: '/liga/flipfinal/' + id + '/ranking', name: 'Ranking' },
				{ link: '/liga/flipfinal/' + id + '/matches', name: 'Matches' },
				{ link: '/admin/tournaments/flipfinal/' + id + '/settings', name: 'Liga-Admin' }
			]
		: [
				{ link: '/liga/flipfinal/' + id + '/ranking', name: 'Ranking' },
				{ link: '/liga/flipfinal/' + id + '/matches', name: 'Matches' },
				{ link: '/liga/flipfinal/' + id + '/extended', name: 'Erweitert' }
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
			<Button color="alternative">
				<Spinner class="me-3" size="4" color="white" />Laden ...
			</Button>
		{:else}
			<Button color="alternative" on:click={() => loadPage(d)}>{d.name}</Button>
		{/if}
	</NavLi>
{/snippet}

<Header headerLinks={links} {headerLink} />

<main class="flex flex-1 flex-col p-4 w-full max-w-7xl mx-auto">
	{#if tournament.status === 'Active'}
		<Heading tag="h4">{tournament.name} / {data.round.rid}. Runde ({roundstatus})</Heading>
	{:else}
		<Heading tag="h4">{tournament.name} ({tournamentStatus})</Heading>
	{/if}
	<br />

	{@render children?.()}
</main>

<Footer>
	<FooterCopyright href="/about" by="Reinhard Loch." year={'2023-2025'} />
</Footer>
