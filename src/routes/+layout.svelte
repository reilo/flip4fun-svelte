<script>
	import "../app.css";
	let { children } = $props();
</script>

<div class="flex flex-col min-h-screen">

	{@render children?.()}

</div>
