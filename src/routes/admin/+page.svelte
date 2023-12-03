<script>
	import { Heading, P } from 'flowbite-svelte';
	import login from '../login';
</script>

<Heading tag="h5">
	{#if login.state == 2}
		Hier kommen irgendwann die Admin-Seiten hin: Flipperverwaltung, Spielerverwaltung, etc.
	{:else}
		Du hast hier keine Berechtigung. Logge dich bitte als Administrator ein.
	{/if}
</Heading>
