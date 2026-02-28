<script>
	import { accessState, ReadAccess, AdminAccess } from '/src/state.svelte.js';
	let { children } = $props();
</script>

{#if accessState.value >= AdminAccess}
	<div class="flex flex-col md:flex-row gap-3">
		{@render children?.()}
	</div>
{:else}
	<p class="text-sm text-gray-500 dark:text-gray-400">Du hast keine Berechtigung. Logge dich bitte als Administrator ein.</p>
{/if}
