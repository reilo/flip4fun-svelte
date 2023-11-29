<script>
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
	import { DarkMode } from 'flowbite-svelte';
</script>

<header class="flex justify-between">
	<Navbar let:hidden let:toggle>
		<NavBrand href="/">
			<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
				Pinball Lounge
			</span>
		</NavBrand>
		<NavHamburger on:click={toggle} />
		<NavUl {hidden}>
			<NavLi href="/pins">Flipperliste</NavLi>
			<NavLi href="/draw">Lostrommel</NavLi>
			<NavLi href="/about">Info</NavLi>
		</NavUl>
		<DarkMode />
	</Navbar>
</header>
