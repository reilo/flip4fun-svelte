<script>
	import Header from './Header.svelte';
	import { Footer, FooterCopyright } from 'flowbite-svelte';
    import { Heading } from 'flowbite-svelte';

	/** @type {{data: any, children?: import('svelte').Snippet}} */
	let { data, children } = $props();
    let tournament = data.tournament;
</script>

<Header />

<main class="flex flex-1 flex-col p-4 w-full max-w-7xl mx-auto">
	<Heading tag="h3">{tournament.name}</Heading>
	<br />
	
		{@render children?.()}
</main>

<Footer>
	<FooterCopyright href="/about" by="Reinhard Loch." year={'2023-2025'} />
</Footer>
