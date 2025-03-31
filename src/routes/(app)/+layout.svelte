<script>
	import Header from '$lib/components/Header.svelte';
	import '../../app.css';
	import { Footer, FooterCopyright } from 'flowbite-svelte';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';

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
</script>

{#snippet headerLink(d)}
	<NavLi href={d.link}>{d.name}</NavLi>
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
