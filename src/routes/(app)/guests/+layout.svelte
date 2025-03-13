<script>
	import { P } from 'flowbite-svelte';
	import { access, ReadAccess, AdminAccess } from '../../../stores.js';
	let accessValue = ReadAccess;
	access.subscribe((value) => {
		accessValue = value;
	});
</script>

{#if accessValue >= AdminAccess}
	<slot />
{:else}
	<P>Du hast keine Berechtigung. Logge dich bitte als Administrator ein.</P>
{/if}
