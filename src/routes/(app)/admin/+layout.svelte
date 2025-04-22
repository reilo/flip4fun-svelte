<script>
	import { P } from 'flowbite-svelte';
	import { access, ReadAccess, AdminAccess } from '/src/stores.js';
	let { children } = $props();
	let accessValue = $state(ReadAccess);
	access.subscribe((value) => {
		accessValue = value;
	});
</script>

{#if accessValue >= AdminAccess}
	<div class="flex flex-col md:flex-row gap-3 mx-auto">
		{@render children?.()}
	</div>
{:else}
	<P>Du hast keine Berechtigung. Logge dich bitte als Administrator ein.</P>
{/if}
