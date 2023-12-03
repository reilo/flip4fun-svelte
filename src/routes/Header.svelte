<script>
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
	import { Modal, Button, Label, Input } from 'flowbite-svelte';
	import { HomeSolid, LockSolid, LockTimeSolid, LockOpenSolid } from 'flowbite-svelte-icons';
	import { DarkMode } from 'flowbite-svelte';

	import login from "./login"

	let formModal = false;
	let password = '';

	function adminClicked() {
		
		if (login.state >= 2 || password === import.meta.env.VITE_ADMIN_PASSWORD) {
			login.state = 2;
			password = '';
			formModal = false;
		} else {
			alert('Bitte gültiges Password eingeben!');
		}
	}

	function ligaClicked() {
		if (login.state >= 1 || password === import.meta.env.VITE_ADMIN_PASSWORD) {
			login.state = 1;
			password = '';
			formModal = false;
		} else {
			alert('Bitte gültiges Password eingeben!');
		}
	}

	function guestClicked() {
		login.state = 0;
		password = '';
		formModal = false;
	}
</script>

<header class="flex justify-between p-4 w-full max-w-5xl mx-auto">
	<Navbar let:hidden let:toggle class="bg-sky-50">
		<NavBrand href="/">
			<HomeSolid
				class="w-5 h-5 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-500"
			/>
		</NavBrand>
		<NavHamburger on:click={toggle} />
		<NavUl {hidden}>
			<NavLi href="/pins">Flipperliste</NavLi>
			<NavLi href="/draw">Lostrommel</NavLi>
			<NavLi href="/liga">Liga</NavLi>
			<NavLi href="/admin">Administration</NavLi>
			<NavLi href="/about">Info</NavLi>
		</NavUl>
		<Button color="bg-sky-50" class="!p-0" on:click={() => (formModal = true)}>
			{#if login.state == 0}
				<LockSolid class="w-5 h-5 mb-1 text-gray-500 dark:text-gray-400" />
			{:else if login.state == 1}
				<LockTimeSolid class="w-5 h-5 mb-1 text-gray-500 dark:text-gray-400" />
			{:else}
				<LockOpenSolid class="w-5 h-5 mb-1 text-gray-500 dark:text-gray-400" />
			{/if}
		</Button>
		<Modal title="Berechtigung wählen" bind:open={formModal} autoclose={false} class="max-w-sm">
			<form class="flex flex-col space-y-6" action="#">
				<Label class="space-y-2">
					<span>Passwort</span>
					<Input type="password" name="password" bind:value={password} placeholder="•••••" />
				</Label>
				<Button color={login.state == 2 ? 'primary' : 'alternative'} on:click={adminClicked}
					>Administrator</Button
				>
				<Button color={login.state == 1 ? 'primary' : 'alternative'} on:click={ligaClicked}
					>Liga-Eingabe</Button
				>
				<Button color={login.state == 0 ? 'primary' : 'alternative'} on:click={guestClicked}
					>Nur lesen</Button
				>
			</form>
		</Modal>
		<DarkMode />
	</Navbar>
</header>
