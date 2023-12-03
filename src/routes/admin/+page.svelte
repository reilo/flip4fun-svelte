<script>
	import { P } from 'flowbite-svelte';
    import login from "../login"
</script>

<P >
    {#if login.state == 2}
    Hier kommen irgendwann die Admin-Seiten hin: Flipperverwaltung, Spielerverwaltung, etc.
    {:else}
    Keine Admin-Berechtigung.
    {/if}
</P>