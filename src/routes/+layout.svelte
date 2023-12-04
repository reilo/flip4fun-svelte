<script>
	import Header from './Header.svelte';
	import "../app.css";
	import { Footer, FooterCopyright, FooterLinkGroup, FooterLink } from 'flowbite-svelte';
</script>

<div class="flex flex-col min-h-screen">
	<Header />

	<main class="flex flex-1 flex-col p-4 w-full max-w-7xl mx-auto">
		<slot />
	</main>

	<Footer>
		<FooterCopyright href="/" by="Reinhard Loch." year={2023} />
		<!--FooterLinkGroup class="flex flex-wrap justify-center text-sm text-gray-500 dark:text-gray-400">
			<FooterLink href="/about">Info</FooterLink>
			<FooterLink href="/about">Lizenz</FooterLink>
			<FooterLink href="/about">Kontakt</FooterLink>
		  </FooterLinkGroup-->
	</Footer>
</div>

