<script>
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
	import { HomeSolid } from 'flowbite-svelte-icons';
	import { DarkMode } from 'flowbite-svelte';
</script>

<header class="flex justify-between p-4 w-full max-w-5xl mx-auto">
	<Navbar let:hidden let:toggle class="bg-sky-50">
		<NavBrand href="/">
			<HomeSolid class="w-5 h-5 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-500" />
		</NavBrand>
		<NavHamburger on:click={toggle} />
		<NavUl {hidden}>
			<NavLi href="/pins">Flipperliste</NavLi>
			<NavLi href="/draw">Lostrommel</NavLi>
			<NavLi href="/liga">Liga</NavLi>
			<NavLi href="/admin">Administration</NavLi>
			<NavLi href="/about">Info</NavLi>
		</NavUl>
		<DarkMode />
	</Navbar>
</header>
