<script>
	import Sidebar from './Sidebar.svelte';
</script>

<div class="flex flex-col sm:flex-row gap-3">
	<div class="flex-none">
		<Sidebar />
	</div>
	<div class="grow">
		<slot />
	</div>
</div>
