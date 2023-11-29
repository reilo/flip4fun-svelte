<script>
	import { page } from '$app/stores';
	import logo from '$lib/images/svelte-logo.svg';
	import github from '$lib/images/github.svg';
</script>

<header class="flex justify-between">

	<div class="box-content h-6 w-6">
		<a href="https://kit.svelte.dev" class="flex">
			<img src={logo} alt="SvelteKit" />
		</a>
	</div>

	<nav class="flex justify-center">
		<ul class="flex justify-center relative h-12 bg-white bg-opacity-70">
			<li class="relative hover:sky-700" aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
				<a href="/" class="flex items-center py-0 px-2 uppercase text-black-700 text-opacity-70 hover:text-rose-700">Home</a>
			</li>
			<li class="relative" aria-current={$page.url.pathname === '/pins' ? 'page' : undefined}>
				<a href="/pins" class="flex items-center py-0 px-2 uppercase text-black-700 text-opacity-70 hover:text-rose-700">Flipperliste</a>
			</li>
			<li class="relative" aria-current={$page.url.pathname === '/about' ? 'page' : undefined}>
				<a href="/about" class="flex items-center py-0 px-2 uppercase text-black-700 text-opacity-70 hover:text-rose-700">About</a>
			</li>
		</ul>
	</nav>

	<div class="box-content h-6 w-6">
		<a href="https://github.com/sveltejs/kit" class="flex">
			<img src={github} alt="GitHub" />
		</a>
	</div>
	
</header>

<style>


	li[aria-current='page']::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--color-theme-1);
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 0.5rem;
		color: var(--color-text);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;
	}
</style>
