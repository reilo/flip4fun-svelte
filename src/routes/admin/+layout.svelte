<script>
	import { P } from 'flowbite-svelte';
	import Sidebar from './Sidebar.svelte';
	import { login } from '../../stores.js';
	let loginValue = 0;
	login.subscribe((value) => {
		loginValue = value;
	});
</script>

{#if loginValue == 2}
	<div class="flex flex-col sm:flex-row gap-3">
		<Sidebar />
		<slot />
	</div>
{:else}
	<P>Du hast keine Berechtigung. Logge dich bitte als Administrator ein.</P>
{/if}
