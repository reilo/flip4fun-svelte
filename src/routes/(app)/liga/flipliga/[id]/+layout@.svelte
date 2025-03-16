<script>
	import Header from './Header.svelte';
	import { Footer, FooterCopyright } from 'flowbite-svelte';
    import { Heading } from 'flowbite-svelte';

	export let data;
    let tournament = data.tournament;
</script>

<Header />

<main class="flex flex-1 flex-col p-4 w-full max-w-7xl mx-auto">
	<Heading tag="h3">{tournament.name}</Heading>
	<br />
	
		<slot />
</main>

<Footer>
	<FooterCopyright href="/about" by="Reinhard Loch." year={'2023-2025'} />
</Footer>
