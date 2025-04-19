<script>
	import Header from '$lib/components/Header.svelte';
	import '../../app.css';
	import { Footer, FooterCopyright, Button, Spinner } from 'flowbite-svelte';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
	import { goto, afterNavigate } from '$app/navigation';
	import { innerWidth } from 'svelte/reactivity/window';

	let buttonSize = $derived(innerWidth.current <= 1024 ? 'xs' : 'sm');

	let { children } = $props();

	const links = import.meta.env.VITE_APP_FULL
		? [
				{ link: '/pins', name: 'Flipperliste' },
				{ link: '/draw', name: 'Lostrommel' },
				{ link: '/liga', name: 'Liga' },
				{ link: '/admin', name: 'Administration' },
				{ link: '/about', name: 'Info' }
			]
		: [
				{ link: '/pins', name: 'Flipperliste' },
				{ link: '/draw', name: 'Lostrommel' },
				{ link: '/liga', name: 'Liga' },
				{ link: '/about', name: 'Info' }
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

<div class="flex flex-col min-h-screen">
	<Header headerLinks={links} {headerLink} />

	<main class="flex flex-1 flex-col p-4 w-full max-w-7xl mx-auto">
		{@render children?.()}
	</main>

	<Footer>
		<FooterCopyright href="/about" by="Reinhard Loch." year={'2023-2025'} />
	</Footer>
</div>
