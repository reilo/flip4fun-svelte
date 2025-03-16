<script>
	import { P } from 'flowbite-svelte';
	import { access, ReadAccess, AdminAccess } from '../../../stores.js';
	/** @type {{children?: import('svelte').Snippet}} */
	let { children } = $props();
	let accessValue = $state(ReadAccess);
	access.subscribe((value) => {
		accessValue = value;
	});
</script>

{#if accessValue >= AdminAccess}
	{@render children?.()}
{:else}
	<P>Du hast keine Berechtigung. Logge dich bitte als Administrator ein.</P>
{/if}
