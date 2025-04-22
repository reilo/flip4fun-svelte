<script>
	let { children } = $props();
</script>

<div class="flex flex-col md:flex-row gap-3">
	{@render children?.()}
</div>
