<script>
	import "../app.css";
	/** @type {{children?: import('svelte').Snippet}} */
	let { children } = $props();
</script>

<div class="flex flex-col min-h-screen">

	{@render children?.()}

</div>
