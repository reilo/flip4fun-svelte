<script>
	import Header from '$lib/components/Header.svelte';
	import "../../app.css";
	import { Footer, FooterCopyright } from 'flowbite-svelte';
</script>

<div class="flex flex-col min-h-screen">
	<Header />

	<main class="flex flex-1 flex-col p-4 w-full max-w-7xl mx-auto">
		<slot />
	</main>

	<Footer>
		<FooterCopyright href="/about" by="Reinhard Loch." year={'2023-2025'} />
	</Footer>
</div>

