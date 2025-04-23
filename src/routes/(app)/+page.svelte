<script>
	import { Heading, Card, Button, Spinner } from 'flowbite-svelte';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';
	import { goto } from '$app/navigation';

	let loadingTournaments = $state(false);
	let loadingPins = $state(false);
	let loadingDraw = $state(false);

	const loadTournaments = () => {
		loadingTournaments = true;
		goto('/liga');
	};

	const loadPins = () => {
		loadingPins = true;
		goto('/pins');
	};

	const loadDraw = () => {
		loadingDraw = true;
		goto('/draw');
	};
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Flipper-App" />
</svelte:head>

<!--Heading tag="h1" class="mb-3">Willkommen in der Pinball Lounge</Heading -->
<div class="flex flex-col md:flex-row justify-center content-center gap-3">
	<div>
		<Card>
			<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
				Lostrommel 2.0
			</h5>
			<p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
				Hier kannst du nach dem Zufallsprinzip einen Flipper auslosen.
			</p>
			{#if loadingDraw}
				<Button class="w-fit">
					<Spinner class="me-3" size="4" color="white" />Laden ...
				</Button>
			{:else}
				<Button on:click={loadDraw} class="w-fit">
					Weiter<ArrowRightOutline class="w-3.5 h-3.5 ml-2 text-white" />
				</Button>
			{/if}
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
			{#if loadingPins}
				<Button class="w-fit">
					<Spinner class="me-3" size="4" color="white" />Laden ...
				</Button>
			{:else}
				<Button on:click={loadPins} class="w-fit">
					Weiter<ArrowRightOutline class="w-3.5 h-3.5 ml-2 text-white" />
				</Button>
			{/if}
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
			{#if loadingTournaments}
				<Button class="w-fit">
					<Spinner class="me-3" size="4" color="white" />Laden ...
				</Button>
			{:else}
				<Button on:click={loadTournaments} class="w-fit">
					Weiter<ArrowRightOutline class="w-3.5 h-3.5 ml-2 text-white" />
				</Button>
			{/if}
		</Card>
	</div>
</div>
