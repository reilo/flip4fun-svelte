<script>
	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
	<title>flip4fun</title>
</svelte:head>

{@render children?.()}