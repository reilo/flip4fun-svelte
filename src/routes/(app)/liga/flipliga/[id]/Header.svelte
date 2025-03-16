<script>
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
	import { Modal, Button, Label, Input } from 'flowbite-svelte';
	import { HomeSolid, LockSolid, LockTimeSolid, LockOpenSolid } from 'flowbite-svelte-icons';
	import { DarkMode } from 'flowbite-svelte';

	import { page } from '$app/stores';
	import { access, ReadAccess, AdminAccess } from '../../../../../stores.js';

	let accessValue = $state(ReadAccess);
	access.subscribe((value) => {
		accessValue = value;
	});

	let formModal = $state(false);
	let password = $state('');

	function adminClicked() {
		if (accessValue >= AdminAccess || password === import.meta.env.VITE_ADMIN_PASSWORD) {
			access.set(AdminAccess);
			password = '';
			formModal = false;
		} else {
			alert('Bitte gültiges Password eingeben!');
		}
	}

	function guestClicked() {
		access.set(ReadAccess);
		password = '';
		formModal = false;
	}

	let activeUrl = $derived($page.url.pathname);

	const parts = $page.url.pathname.split("/");
	let id = parts[parts.length - 2];
	
</script>

<header class="flex justify-between p-4 w-full max-w-full sm:max-w-7xl mx-auto">
	<Navbar   class="bg-gray-50 dark:bg-gray-800">
		{#snippet children({ hidden, toggle })}
				<NavBrand href="/">
				<HomeSolid class="w-5 h-5 mb-1 text-gray-500 dark:text-gray-400" />
			</NavBrand>
			<NavHamburger on:click={toggle} />
			<NavUl {hidden} {activeUrl}>
				<NavLi href="/liga/flipliga/{id}/ranking">Ranking</NavLi>
				<NavLi href="/liga/flipliga/{id}/matches">Matches</NavLi>
				<NavLi href="/liga/flipliga/{id}/draw">Flipper losen</NavLi>
			</NavUl>
			<Modal title="Berechtigung wählen" bind:open={formModal} autoclose={false} class="max-w-sm">
				<form class="flex flex-col space-y-6" action="#">
					<Label class="space-y-2">
						<span>Passwort</span>
						<Input type="password" name="password" bind:value={password} placeholder="•••••" />
					</Label>
					<Button
						color={accessValue == AdminAccess ? 'primary' : 'alternative'}
						on:click={adminClicked}>Administrator</Button
					>
					<Button
						color={accessValue == ReadAccess ? 'primary' : 'alternative'}
						on:click={guestClicked}>Nur lesen</Button
					>
				</form>
			</Modal>
			<DarkMode />
					{/snippet}
		</Navbar>
</header>
