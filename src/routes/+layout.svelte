<script>
	import Header from './Header.svelte';
	import "../app.css";
	import { A, Footer, FooterCopyright, FooterLinkGroup, FooterLink } from 'flowbite-svelte';
</script>

<div class="flex flex-col min-h-screen">
	<Header />

	<main class="flex flex-1 flex-col p-4 w-full max-w-5xl my-0 mx-auto box-border">
		<slot />
	</main>

	<Footer>
		<FooterCopyright href="/" by="Reinhard Loch." year={2023} />
		<FooterLinkGroup class="flex flex-wrap justify-center text-sm text-gray-500 dark:text-gray-400">
			<FooterLink href="/info">Info</FooterLink>
			<FooterLink href="/">Lizenz</FooterLink>
			<FooterLink href="/">Komtakt</FooterLink>
		  </FooterLinkGroup>
	</Footer>
</div>

