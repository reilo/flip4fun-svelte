<script>
	let { children } = $props();
</script>

<div class="flex flex-col sm:flex-row gap-3">
	{@render children?.()}
</div>
