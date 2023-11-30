<script>
	import { Heading, P, A } from 'flowbite-svelte';
  </script>
  
<div class="flex max-w-3xl flex-col justify-center m-0">
	<Heading tag="h2" class="mb-4">About this app</Heading>

	<P>
		This is a <A href="https://kit.svelte.dev">SvelteKit</A> app. You can make your own by typing the
		following into your command line and following the prompts:
	</P>

	<pre>npm create svelte@latest</pre>

	<P>
		The page you're looking at is purely static HTML, with no client-side interactivity needed.
		Because of that, we don't need to load any JavaScript. Try viewing the page's source, or opening
		the devtools network panel and reloading.
	</P>

</div>
