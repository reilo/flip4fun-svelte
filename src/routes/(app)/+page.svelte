<script>
	import { Heading, Card, Button, Spinner } from 'flowbite-svelte';
	import { ArrowsRepeatOutline, ListOutline, AwardOutline, ArrowRightOutline } from 'flowbite-svelte-icons';
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

<div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
	<Card class="hover:shadow-lg transition-shadow">
		<div class="flex flex-col">
			<div class="flex items-center gap-3 mb-3">
				<div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
					<ArrowsRepeatOutline class="w-5 h-5 text-blue-600 dark:text-blue-300" />
				</div>
				<Heading tag="h5" class="text-xl font-bold text-gray-900 dark:text-white">
					Lostrommel 2.0
				</Heading>
			</div>
			<p class="text-base text-gray-600 dark:text-gray-400 mb-4">
				Hier kannst du nach dem Zufallsprinzip einen Flipper auslosen.
			</p>
			<Button on:click={loadDraw} disabled={loadingDraw} class="w-full text-base">
				{#if loadingDraw}
					<Spinner class="me-3" size="4" color="white" />Laden ...
				{:else}
					Weiter<ArrowRightOutline class="w-4 h-4 ml-2" />
				{/if}
			</Button>
		</div>
	</Card>

	<Card class="hover:shadow-lg transition-shadow">
		<div class="flex flex-col">
			<div class="flex items-center gap-3 mb-3">
				<div class="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
					<ListOutline class="w-5 h-5 text-green-600 dark:text-green-300" />
				</div>
				<Heading tag="h5" class="text-xl font-bold text-gray-900 dark:text-white">
					Flipperliste
				</Heading>
			</div>
			<p class="text-base text-gray-600 dark:text-gray-400 mb-4">
				Hier findest du die Liste aller Flipper, die zum Spiel bereitstehen.
			</p>
			<Button on:click={loadPins} disabled={loadingPins} class="w-full text-base">
				{#if loadingPins}
					<Spinner class="me-3" size="4" color="white" />Laden ...
				{:else}
					Weiter<ArrowRightOutline class="w-4 h-4 ml-2" />
				{/if}
			</Button>
		</div>
	</Card>

	<Card class="hover:shadow-lg transition-shadow">
		<div class="flex flex-col">
			<div class="flex items-center gap-3 mb-3">
				<div class="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
					<AwardOutline class="w-5 h-5 text-amber-600 dark:text-amber-300" />
				</div>
				<Heading tag="h5" class="text-xl font-bold text-gray-900 dark:text-white">
					Flipperliga
				</Heading>
			</div>
			<p class="text-base text-gray-600 dark:text-gray-400 mb-4">
				Hier kommst du zur aktuellen Liga bzw. zum aktiven Turnier.
			</p>
			<Button on:click={loadTournaments} disabled={loadingTournaments} class="w-full text-base">
				{#if loadingTournaments}
					<Spinner class="me-3" size="4" color="white" />Laden ...
				{:else}
					Weiter<ArrowRightOutline class="w-4 h-4 ml-2" />
				{/if}
			</Button>
		</div>
	</Card>
</div>
