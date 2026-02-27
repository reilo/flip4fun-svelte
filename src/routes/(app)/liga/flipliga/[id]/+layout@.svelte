<script>
	import Header from '$lib/components/Header.svelte';
	import { Spinner, Dropdown, DropdownItem } from 'flowbite-svelte';
	import { page } from '$app/state';
	import { goto, afterNavigate } from '$app/navigation';
	import { innerWidth, outerWidth } from 'svelte/reactivity/window';
	import { mapTourStatus } from '$lib/TourUtil';

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
				{
					link: '/liga/flipliga/' + id + '/statistics',
					name: 'Statistik',
					dropdown: [
						{ link: '/liga/flipliga/' + id + '/statistics/general', name: 'Allgemein' },
						{ link: '/liga/flipliga/' + id + '/statistics/player', name: 'Spieler' }
					]
				},
				{ link: '/admin/tournaments/flipliga/' + id + '/settings', name: 'Liga-Admin' }
			]
		: [
				{ link: '/liga/flipliga/' + id + '/ranking', name: 'Ranking' },
				{ link: '/liga/flipliga/' + id + '/matches', name: 'Matches' },
				{ link: '/liga/flipliga/' + id + '/draw', name: 'Lostrommel' },
			{
				link: '/liga/flipliga/' + id + '/statistics',
				name: 'Statistik',
				dropdown: [
					{ link: '/liga/flipliga/' + id + '/statistics/general', name: 'Allgemein' },
					{ link: '/liga/flipliga/' + id + '/statistics/player', name: 'Spieler' }
				]
			},
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
	{@const isActive = d.dropdown
		? d.dropdown.some((sub) => page.url.pathname.startsWith(sub.link))
		: page.url.pathname.startsWith(d.link)}
	{@const isLoading = d.dropdown
		? d.dropdown.some((sub) => sub.link === loading)
		: loading === d.link}
	<li class="flex items-center">
		{#if isLoading}
			<span class="flex items-center gap-1.5 text-sm px-3 py-2 text-gray-400 dark:text-gray-500">
				<Spinner size="3" />Laden ...
			</span>
		{:else if d.dropdown}
			<button
				id="dd-{d.name}"
				class="text-sm font-medium px-3 py-2 border-b-2 transition-colors"
				class:border-blue-600={isActive}
				class:dark:border-blue-400={isActive}
				class:text-blue-600={isActive}
				class:dark:text-blue-400={isActive}
				class:border-transparent={!isActive}
				class:text-gray-500={!isActive}
				class:dark:text-gray-400={!isActive}
				class:hover:text-gray-800={!isActive}
				class:dark:hover:text-gray-100={!isActive}
			>{d.name} ▾</button>
			<Dropdown triggeredBy="#dd-{d.name}">
				{#each d.dropdown as sub}
					<DropdownItem onclick={() => loadPage(sub)}>{sub.name}</DropdownItem>
				{/each}
			</Dropdown>
		{:else}
			<button
				class="text-sm font-medium px-3 py-2 border-b-2 transition-colors"
				class:border-blue-600={isActive}
				class:dark:border-blue-400={isActive}
				class:text-blue-600={isActive}
				class:dark:text-blue-400={isActive}
				class:border-transparent={!isActive}
				class:text-gray-500={!isActive}
				class:dark:text-gray-400={!isActive}
				class:hover:text-gray-800={!isActive}
				class:dark:hover:text-gray-100={!isActive}
				onclick={() => loadPage(d)}
			>{d.name}</button>
		{/if}
	</li>
{/snippet}

<div
	class={largeScreen && isMatches
		? 'flex flex-col min-h-screen max-w-full mx-auto'
		: 'flex flex-col min-h-screen max-w-full md:max-w-7xl mx-auto'}
>
	<Header headerLinks={links} {headerLink} />

	<main class="flex flex-1 flex-col md:flex-row p-4">
		<div>
			<div
				class={largeScreen && isMatches
					? 'grid grid-cols-2 max-w-full gap-3'
					: 'flex flex-1 flex-col max-w-7xl'}
			>
				{@render children?.()}
			</div>
		</div>
	</main>

	<footer class="px-4 py-3 text-center text-xs text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-800">
		<span>&copy; 2023–{new Date().getFullYear()} reilo &mdash; MIT License</span>
	</footer>
</div>
