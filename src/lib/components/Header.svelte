<script>
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
	import { Modal, Button, Label, Input } from 'flowbite-svelte';
	import { HomeSolid, LockSolid, LockTimeSolid, LockOpenSolid } from 'flowbite-svelte-icons';
	import { DarkMode } from 'flowbite-svelte';
	import { tick } from 'svelte';

	import { page } from '$app/state';
	import { access, ReadAccess, AdminAccess } from '/src/stores.js';

	let { headerLinks, headerLink } = $props();

	let accessValue = $state(ReadAccess);
	access.subscribe((value) => {
		accessValue = value;
	});

	let formModal = $state(false);
	let password = $state('');
	let passwordRef;

	async function accessClicked() {
		if (accessValue === AdminAccess) {
			access.set(ReadAccess);
		} else {
			formModal = true;
			await tick();
			passwordRef?.focus();
		}
	}

	function adminClicked() {
		if (accessValue >= AdminAccess || password === import.meta.env.VITE_ADMIN_PASSWORD) {
			access.set(AdminAccess);
			password = '';
			formModal = false;
		} else {
			password = '';
			alert('Bitte gültiges Password eingeben!');
		}
	}

	function cancelClicked() {
		password = '';
		formModal = false;
	}

	let activeUrl = $derived(page.url.pathname);
</script>

<header class="p-2 w-full max-w-full md:max-w-7xl">
	<Navbar let:hidden let:toggle class="bg-gray-50 dark:bg-gray-800">
		<NavBrand href="/">
			<HomeSolid class="w-5 h-5 mb-1 text-gray-500 dark:text-gray-400" />
		</NavBrand>
		<NavHamburger on:click={toggle} />
		<NavUl {hidden} {activeUrl}>
			{#each headerLinks as h}
				{@render headerLink(h)}
			{/each}
		</NavUl>
		{#if import.meta.env.VITE_APP_FULL}
			<Button color="bg-gray-50 dark:bg-gray-800" class="!p-0" on:click={accessClicked}>
				{#if accessValue == ReadAccess}
					<LockSolid class="w-5 h-5 mb-1 text-gray-500 dark:text-gray-400" />
				{:else}
					<LockOpenSolid class="w-5 h-5 mb-1 text-gray-500 dark:text-gray-400" />
				{/if}
			</Button>
		{/if}
		<Modal
			title="Als Administrator anmelden"
			bind:open={formModal}
			autoclose={false}
			class="max-w-sm"
		>
			<form class="flex flex-col space-y-6" action="#">
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
				<Button color="alternative" on:click={adminClicked}>Ok</Button>
				<Button color="primary" on:click={cancelClicked}>Abbrechen</Button>
			</form>
		</Modal>
		<DarkMode />
		<img src="/pinlounge_trans.gif" width="128" alt="Logo" />
	</Navbar>
</header>
