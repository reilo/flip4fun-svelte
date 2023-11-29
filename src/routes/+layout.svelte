<script>
	import Header from './Header.svelte';
	import "../app.css";
	import { A } from 'flowbite-svelte';
</script>

<div class="flex flex-col min-h-screen">
	<Header />

	<main class="flex flex-1 flex-col p-4 w-full max-w-5xl my-0 mx-auto box-border">
		<slot />
	</main>

	<footer class="flex flex-col justify-center items-center p-12 md:py-4 md:px-0">
		<p>visit <A href="https://kit.svelte.dev">kit.svelte.dev</A> to learn SvelteKit</p>
	</footer>
</div>

