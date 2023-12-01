<script>
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
	import { DarkMode } from 'flowbite-svelte';
</script>

<header class="flex justify-between p-4 w-full max-w-5xl mx-auto">
	<Navbar let:hidden let:toggle class="bg-sky-50">
		<NavBrand href="/">
			<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
				Start
			</span>
		</NavBrand>
		<NavHamburger on:click={toggle} />
		<NavUl {hidden}>
			<NavLi href="/liga">Liga</NavLi>
			<NavLi href="/pins">Flipperliste</NavLi>
			<NavLi href="/draw">Lostrommel</NavLi>
			<NavLi href="/admin">Administration</NavLi>
			<NavLi href="/about">Info</NavLi>
		</NavUl>
		<DarkMode />
	</Navbar>
</header>
