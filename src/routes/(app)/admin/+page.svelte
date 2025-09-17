<script>
	import { Heading, Card, Button, Spinner } from 'flowbite-svelte';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';
	import { goto } from '$app/navigation';

	let loadingTournaments = $state(false);
	let loadingPins = $state(false);
	let loadingPlayers = $state(false);
	let loadingCertificates = $state(false);

	const loadTournaments = () => {
		loadingTournaments = true;
		goto('/admin/tournaments');
	};

	const loadPins = () => {
		loadingPins = true;
		goto('/admin/pins');
	};

	const loadPlayers = () => {
		loadingPlayers = true;
		goto('/admin/players');
	};

	const loadCertificates = () => {
		loadingCertificates = true;
		goto('/admin/certificates');
	};
</script>

<div>
	<Card>
		<Heading tag="h5" class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
			Flipperverwaltung
		</Heading>
		<p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
			Flipper aktiv oder inaktiv schalten.
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
		<Heading tag="h5" class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
			Spielerverwaltung
		</Heading>
		<p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
			Spieler aktiv oder inaktiv schalten.
		</p>
		{#if loadingPlayers}
			<Button class="w-fit">
				<Spinner class="me-3" size="4" color="white" />Laden ...
			</Button>
		{:else}
			<Button on:click={loadPlayers} class="w-fit">
				Weiter<ArrowRightOutline class="w-3.5 h-3.5 ml-2 text-white" />
			</Button>
		{/if}
	</Card>
</div>
<div>
	<Card>
		<Heading tag="h5" class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
			Turnierverwaltung
		</Heading>
		<p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
			Turniere bearbeiten, starten oder beenden.
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
<div>
	<Card>
		<Heading tag="h5" class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
			Urkundengenerator
		</Heading>
		<p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
			Urkunden-PDFs generieren.
		</p>
		{#if loadingCertificates}
			<Button class="w-fit">
				<Spinner class="me-3" size="4" color="white" />Laden ...
			</Button>
		{:else}
			<Button on:click={loadCertificates} class="w-fit">
				Weiter<ArrowRightOutline class="w-3.5 h-3.5 ml-2 text-white" />
			</Button>
		{/if}
	</Card>
</div>
