<script>
	import { Heading, Modal, Label } from 'flowbite-svelte';
	import { Card, Button } from 'flowbite-svelte';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';

	let { data } = $props();

	let startForm = $state(false);
	let endForm = $state(false);

	let startEnabled = (data.blob.status === "Planned" || data.blob.status === "Completed");
	let endEnabled = (data.blob.status === "Active");

	async function startBlob() {
		// activate current blob (if Planned) or create next blob (if Completed)
	}

	async function endBlob() {
		// calculate final results and set status to Completed
	}

</script>

<div>
	<Card>
		<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
			Spieltag starten
		</h5>
		<p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
			Sobald der Spieltag gestartet wurde, können im laufenden Spieltag keine neuen Spieler
			hinzugefügt werden.
		</p>
		<Button disabled={!startEnabled} on:click={() => (startForm = true)} class="w-fit">
			Starten<ArrowRightOutline class="w-3.5 h-3.5 ml-2 text-white" />
		</Button>
	</Card>
</div>

<div>
	<Card>
		<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
			Spieltag beenden
		</h5>
		<p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
			Sobald der Spieltag beendet wurde, können keine Matches mehr nachgetragen oder korrigiert
			werden.
		</p>
		<Button disabled={!endEnabled} on:click={() => (endForm = true)} class="w-fit">
			Beenden<ArrowRightOutline class="w-3.5 h-3.5 ml-2 text-white" />
		</Button>
	</Card>
</div>

<div>
	<Modal title="Spieltag starten" bind:open={startForm} autoclose={false} class="max-w-sm">
		<form class="flex flex-col space-y-6" action="#">
			<Label class="space-y-2">
				Spieltag x starten
			</Label>
			<Button color="alternative" on:click={startBlob}>Starten</Button>
			<Button color="primary" on:click={() => (startForm = false)}>Abbrechen</Button>
		</form>
	</Modal>

</div>

<div>
	<Modal title="Spieltag beenden" bind:open={endForm} autoclose={false} class="max-w-sm">
		<form class="flex flex-col space-y-6" action="#">
			<Label class="space-y-2">
				Spieltag x beenden
			</Label>
			<Button color="alternative" on:click={endBlob}>Beenden</Button>
			<Button color="primary" on:click={() => (endForm = false)}>Abbrechen</Button>
		</form>
	</Modal>

</div>