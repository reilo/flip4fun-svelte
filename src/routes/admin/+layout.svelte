<script>
	import { P } from 'flowbite-svelte';
	import Sidebar from './Sidebar.svelte';
	import { access, ReadAccess, AdminAccess } from '../../stores.js';
	let accessValue = ReadAccess;
	access.subscribe((value) => {
		accessValue = value;
	});
</script>

{#if accessValue >= AdminAccess}
	<div class="flex flex-col sm:flex-row gap-3">
		<Sidebar />
		<slot />
	</div>
{:else}
	<P>Du hast keine Berechtigung. Logge dich bitte als Administrator ein.</P>
{/if}
