<script>
	import { Heading, P, Card, Button } from 'flowbite-svelte';
	import { Modal, Label } from 'flowbite-svelte';
	import { ArrowRightOutline, QuestionCircleOutline } from 'flowbite-svelte-icons';
	import { ThumbsUpOutline } from 'flowbite-svelte-icons';
	import { invalidateAll } from '$app/navigation';

	let { data } = $props();

	let tournament = $derived(data.tournament);

	let startTourEnabled = $derived(tournament.status === 'Planned');
	let startTourForm = $state(false);
	let startTourSuccess = $state(false);

	async function startTour() {
		let settings = tournament.settings;
		settings.inactivePlayers = [];
		const response = await fetch('/api/tournament/' + tournament.id, {
			method: 'PUT',
			body: JSON.stringify({
				status: 'Active',
				settings: settings
			}),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
		const result = await response.json();
		if (response.status !== 200) {
			alert(JSON.stringify(result));
		}
		startTourForm = false;
		startTourSuccess = true;
		invalidateAll();
	}
</script>

<div>
	<Card>
		<Heading tag="h5" class="mb-3">Turnier starten</Heading>
		<P class="mb-3">
			Sobald das Final-Turnier gestartet wurde, müssen nicht teilnehmende Spieler deaktiviert
			werden.
		</P>
		<P class="mb-3">Anschließend kann die erste Runde gestartet werden.</P>
		<Button disabled={!startTourEnabled} on:click={() => (startTourForm = true)} class="w-fit">
			Starten<ArrowRightOutline />
		</Button>
	</Card>
</div>

<div>
	<Modal title="Turnier starten" bind:open={startTourForm} autoclose={false} class="max-w-sm">
		<div class="text-center">
			<QuestionCircleOutline class="mx-auto mb-4 text-red-700 w-12 h-12 dark:text-red-700" />
			<form class="flex flex-col space-y-6" action="#">
				<Label class="space-y-2">Soll das Finalturnier wirklich gestartet werden?</Label>
				<Button color="alternative" on:click={startTour}>Ja, starten</Button>
				<Button color="primary" on:click={() => (startTourForm = false)}>Nein, abbrechen</Button>
			</form>
		</div>
	</Modal>
</div>

<div>
	<Modal bind:open={startTourSuccess} size="xs" autoclose>
		<div class="text-center">
			<ThumbsUpOutline class="mx-auto mb-4 text-green-700 w-12 h-12 dark:green-red-700" />
			<Heading tag="h3" class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
				Das Start-Turnier wurde erfolgreich gestartet!
			</Heading>
			<Button color="alternative">Schließen</Button>
		</div>
	</Modal>
</div>
