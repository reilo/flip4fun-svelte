<script>
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
	import { Modal, Button, Label } from 'flowbite-svelte';
	import { LockSolid, LockOpenSolid, HomeSolid } from 'flowbite-svelte-icons';
	import { DarkMode } from 'flowbite-svelte';
	import { tick } from 'svelte';

	import { page } from '$app/state';
	import { accessState, ReadAccess, AdminAccess } from '/src/state.svelte.js';

	let { headerLinks, headerLink } = $props();


	let formModal = $state(false);
	let password = $state('');
	let passwordRef;

	async function accessClicked() {
		if (accessState.value === AdminAccess) {
			accessState.value = ReadAccess;
		} else {
			formModal = true;
			password = '';
			await tick();
			passwordRef?.focus();
		}
	}

	function adminClicked(event) {
		event?.preventDefault();
		if (accessState.value >= AdminAccess || password === import.meta.env.VITE_ADMIN_PASSWORD) {
			accessState.value = AdminAccess;
			formModal = false;
		} else {
			alert('Bitte gültiges Password eingeben!');
		}
	}

	function cancelClicked() {
		formModal = false;
	}

	let activeUrl = $derived(page.url.pathname);
</script>

<header class="w-full max-w-full md:max-w-7xl">
	<Navbar class="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-3">
		<NavBrand href="/">
			<HomeSolid class="w-5 h-5 text-gray-500 dark:text-gray-400" />
		</NavBrand>
		<div class="flex items-center gap-4 md:order-2">
			{#if import.meta.env.VITE_APP_FULL}
				<button
					class="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
					onclick={accessClicked}
					title={accessState.value === AdminAccess ? 'Admin-Zugang beenden' : 'Als Administrator anmelden'}
				>
					{#if accessState.value === AdminAccess}
						<LockOpenSolid class="w-5 h-5 text-green-500" />
					{:else}
						<LockSolid class="w-5 h-5" />
					{/if}
				</button>
			{/if}
			<DarkMode />
			<img src="/pinlounge_trans.gif" width="96" alt="Logo" class="dark:invert ml-2" />
			<NavHamburger />
		</div>
		<NavUl {activeUrl}>
			{#each headerLinks as h}
				{@render headerLink(h)}
			{/each}
		</NavUl>
	</Navbar>

	<Modal
		title="Als Administrator anmelden"
		bind:open={formModal}
		autoclose={false}
		class="max-w-sm"
	>
		<form class="flex flex-col space-y-6" action="#" method="POST" onsubmit={adminClicked}>
			<Label class="space-y-2">
				<span>Passwort:</span>
				<input
					class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
					type="password"
					name="password"
					bind:value={password}
					bind:this={passwordRef}
					placeholder=""
				/>
			</Label>
			<Button color="primary" onclick={adminClicked}>Ok</Button>
			<Button color="alternative" onclick={cancelClicked}>Abbrechen</Button>
		</form>
	</Modal>
</header>