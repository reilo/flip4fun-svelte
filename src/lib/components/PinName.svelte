<script>
	let { name } = $props();
	let isMulti = $derived(name.startsWith('*'));
	let displayName = $derived(isMulti ? name.slice(1) : name);
</script>

{#if isMulti}<svg class="inline-block w-3.5 h-3.5 mr-0.5 -mt-0.5 opacity-60" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="1" width="9" height="9" rx="1.5" /><rect x="6" y="6" width="9" height="9" rx="1.5" /></svg>{/if}{displayName}
