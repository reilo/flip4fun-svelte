<script>
	import { Heading, P } from 'flowbite-svelte';
	import { login } from '../../stores.js';
	let loginValue = 0;
	login.subscribe((value) => {
		loginValue = value;
	});
</script>

<Heading tag="h5">
	{#if loginValue == 2}
		Hier kommen irgendwann die Admin-Seiten hin: Flipperverwaltung, Spielerverwaltung, etc.
	{:else}
		Du hast hier keine Berechtigung. Logge dich bitte als Administrator ein.
	{/if}
</Heading>
