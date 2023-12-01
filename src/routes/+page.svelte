<script>
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcome_fallback from '$lib/images/svelte-welcome.png';
	import { Card, Button } from 'flowbite-svelte';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<div class="flex flex-col justify-center content-center">

	<div class="grid grid-flow-row grid-cols-2 gap-3">

		<Card>
			<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
				Lostrommel 2.0
			</h5>
			<p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
				Hier kannst du nach dem Zufallsprinzip einen Flipper auslosen.
			</p>
			<Button href="/draw" class="w-fit">
				Weiter<ArrowRightOutline class="w-3.5 h-3.5 ml-2 text-white" />
			</Button>
		</Card>

		<Card>
			<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
				Flipperliste
			</h5>
			<p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
				Hier findest du die Liste aller Flipper, die zum Spiel bereitstehen.
			</p>
			<Button href="/pins" class="w-fit">
				Weiter<ArrowRightOutline class="w-3.5 h-3.5 ml-2 text-white" />
			</Button>
		</Card>
		
	</div>
</div>
