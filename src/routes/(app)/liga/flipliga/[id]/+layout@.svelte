<script>
	import Header from '$lib/components/Header.svelte';
	import { Footer, FooterCopyright } from 'flowbite-svelte';
	import { Heading, Button, Spinner } from 'flowbite-svelte';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
	import { page } from '$app/state';
	import { goto, afterNavigate } from '$app/navigation';
	import { innerWidth, outerWidth } from 'svelte/reactivity/window';
	import { mapTourStatus } from '$lib/TourUtil';

	let buttonSize = $derived(innerWidth.current <= 1024 ? 'xs' : 'sm');
	let largeScreen = $derived(outerWidth.current >= 1920); // full hd
	let isMatches = $derived(page.url.pathname.endsWith('matches'));

	let { data, children } = $props();

	let tournament = data.tournament;
	let id = page.params.id;

	const roundStatus = data.round ? mapTourStatus(data.round.status) : null;
	const tournamentStatus = mapTourStatus(data.tournament.status);
	const roundStatusInternal = data.round ? data.round.status : null;

	const links = import.meta.env.VITE_APP_FULL
		? [
				{ link: '/liga/flipliga/' + id + '/ranking', name: 'Ranking' },
				{ link: '/liga/flipliga/' + id + '/matches', name: 'Matches' },
				{ link: '/liga/flipliga/' + id + '/pyramid', name: 'Spielstärken' },
				{ link: '/liga/flipliga/' + id + '/draw', name: 'Lostrommel' },
				{ link: '/liga/flipliga/' + id + '/statistics', name: 'Statistik' },
				{ link: '/admin/tournaments/flipliga/' + id + '/settings', name: 'Liga-Admin' }
			]
		: [
				{ link: '/liga/flipliga/' + id + '/ranking', name: 'Ranking' },
				{ link: '/liga/flipliga/' + id + '/matches', name: 'Matches' },
				{ link: '/liga/flipliga/' + id + '/pyramid', name: 'Spielstärken' },
				{ link: '/liga/flipliga/' + id + '/draw', name: 'Lostrommel' },
				{ link: '/liga/flipliga/' + id + '/statistics', name: 'Statistik' },
				{ link: '/liga/flipliga/' + id + '/extended', name: 'Export' }
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

<div
	class={largeScreen && isMatches
		? 'flex flex-col min-h-screen max-w-full mx-auto'
		: 'flex flex-col min-h-screen max-w-full md:max-w-7xl mx-auto'}
>
	<Header headerLinks={links} {headerLink} />

	<main class="flex flex-1 flex-col md:flex-row p-4">
		<div>
			{#if tournament.status === 'Active'}
				<Heading tag="h4" class="mb-3"
					>{tournament.name} / {data.round.rid}. Spieltag ({roundStatus})</Heading
				>
			{:else}
				<Heading tag="h4" class="mb-3">{tournament.name} ({tournamentStatus})</Heading>
			{/if}
			<div
				class={largeScreen && isMatches
					? 'grid grid-cols-2 max-w-full gap-3'
					: 'flex flex-1 flex-col max-w-7xl'}
			>
				{@render children?.()}
			</div>
		</div>
	</main>

	<Footer>
		<FooterCopyright href="/about" by="Reinhard Loch." year={'2023-2025'} />
	</Footer>
</div>
