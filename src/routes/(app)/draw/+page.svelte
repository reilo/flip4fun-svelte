<script>
	import Draw from '$lib/components/Draw.svelte';
	/** @type {{data: any}} */
	let { data } = $props();
</script>

<Draw myData={data} />
