<script>
	import { Heading, Card, Button, Spinner } from 'flowbite-svelte';
	import { CogOutline, UsersOutline, FlagOutline, FilePdfOutline, ArrowRightOutline } from 'flowbite-svelte-icons';
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

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
	<Card class="p-6 hover:shadow-lg transition-shadow">
		<div class="flex flex-col">
			<div class="flex items-center gap-3 mb-3">
				<div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
					<CogOutline class="w-5 h-5 text-blue-600 dark:text-blue-300" />
				</div>
				<Heading tag="h5" class="text-xl font-bold text-gray-900 dark:text-white">
					Flipperverwaltung
				</Heading>
			</div>
			<p class="text-base text-gray-600 dark:text-gray-400 mb-4">
				Flipper hinzufügen oder aktiv bzw. inaktiv schalten.
			</p>
			<Button onclick={loadPins} disabled={loadingPins} class="w-full text-base">
				{#if loadingPins}
					<Spinner class="me-3" size="4" color="white" />Laden ...
				{:else}
					Weiter<ArrowRightOutline class="w-4 h-4 ml-2" />
				{/if}
			</Button>
		</div>
	</Card>

	<Card class="p-6 hover:shadow-lg transition-shadow">
		<div class="flex flex-col">
			<div class="flex items-center gap-3 mb-3">
				<div class="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
					<UsersOutline class="w-5 h-5 text-green-600 dark:text-green-300" />
				</div>
				<Heading tag="h5" class="text-xl font-bold text-gray-900 dark:text-white">
					Spielerverwaltung
				</Heading>
			</div>
			<p class="text-base text-gray-600 dark:text-gray-400 mb-4">
				Spieler hinzufügen oder aktiv bzw. inaktiv schalten.
			</p>
			<Button onclick={loadPlayers} disabled={loadingPlayers} class="w-full text-base">
				{#if loadingPlayers}
					<Spinner class="me-3" size="4" color="white" />Laden ...
				{:else}
					Weiter<ArrowRightOutline class="w-4 h-4 ml-2" />
				{/if}
			</Button>
		</div>
	</Card>

	<Card class="p-6 hover:shadow-lg transition-shadow">
		<div class="flex flex-col">
			<div class="flex items-center gap-3 mb-3">
				<div class="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
					<FlagOutline class="w-5 h-5 text-amber-600 dark:text-amber-300" />
				</div>
				<Heading tag="h5" class="text-xl font-bold text-gray-900 dark:text-white">
					Turnierverwaltung
				</Heading>
			</div>
			<p class="text-base text-gray-600 dark:text-gray-400 mb-4">
				Turniere bearbeiten, starten oder beenden.
			</p>
			<Button onclick={loadTournaments} disabled={loadingTournaments} class="w-full text-base">
				{#if loadingTournaments}
					<Spinner class="me-3" size="4" color="white" />Laden ...
				{:else}
					Weiter<ArrowRightOutline class="w-4 h-4 ml-2" />
				{/if}
			</Button>
		</div>
	</Card>

	<Card class="p-6 hover:shadow-lg transition-shadow">
		<div class="flex flex-col">
			<div class="flex items-center gap-3 mb-3">
				<div class="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
					<FilePdfOutline class="w-5 h-5 text-red-600 dark:text-red-300" />
				</div>
				<Heading tag="h5" class="text-xl font-bold text-gray-900 dark:text-white">
					Urkundengenerator
				</Heading>
			</div>
			<p class="text-base text-gray-600 dark:text-gray-400 mb-4">
				Urkunden-PDFs generieren.
			</p>
			<Button onclick={loadCertificates} disabled={loadingCertificates} class="w-full text-base">
				{#if loadingCertificates}
					<Spinner class="me-3" size="4" color="white" />Laden ...
				{:else}
					Weiter<ArrowRightOutline class="w-4 h-4 ml-2" />
				{/if}
			</Button>
		</div>
	</Card>
</div>
