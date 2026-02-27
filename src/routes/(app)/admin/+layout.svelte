<script>
	import { access, ReadAccess, AdminAccess } from '/src/stores.js';
	let { children } = $props();
	let accessValue = $state(ReadAccess);
	access.subscribe((value) => {
		accessValue = value;
	});
</script>

{#if accessValue >= AdminAccess}
	<div class="flex flex-col md:flex-row gap-3">
		{@render children?.()}
	</div>
{:else}
	<p class="text-sm text-gray-500 dark:text-gray-400">Du hast keine Berechtigung. Logge dich bitte als Administrator ein.</p>
{/if}
