<script>
	import { Heading, Card, Button } from 'flowbite-svelte';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Flipper-App" />
</svelte:head>

<!--Heading tag="h1">Willkommen in der Pinball Lounge</Heading>
<br /-->
<div class="flex flex-col sm:flex-row justify-center content-center gap-3">
	<div>
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
	</div>
	<div>
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
	<div>
		<Card>
			<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
				Flipperliga
			</h5>
			<p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
				Hier kommst du zur aktuellen Liga bzw. zum aktiven Turnier.
			</p>
			<Button href="/liga" class="w-fit">
				Weiter<ArrowRightOutline class="w-3.5 h-3.5 ml-2 text-white" />
			</Button>
		</Card>
	</div>
</div>
