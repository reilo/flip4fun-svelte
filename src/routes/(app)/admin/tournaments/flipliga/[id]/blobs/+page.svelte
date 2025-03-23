<script>
	import { Heading, Modal, Label } from 'flowbite-svelte';
	import { Card, Button } from 'flowbite-svelte';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';
	import { Increment } from '$lib/BlobUtil';
	import { CalcStrength } from '$lib/TourUtil';

	let { data } = $props();

	let startForm = $state(false);
	let endForm = $state(false);

	let startEnabled = $state(
		(!data.blob && data.tournament.status == 'Planned' && data.tournament.players.length >= 8) ||
			(data.blob && data.blob.status === 'Completed')
	);
	let endEnabled = $state(data.blob && data.blob.status === 'Active');

	const nextBlobID = data.blob ? Increment(data.blob.blobid) : '0001';
	const nextRound = parseInt(nextBlobID);
	const nextBlobName = data.tournament.name + ' - Runde ' + nextRound;
	const baseline = data.tournament.settings.baseline;

	async function startBlob() {
		// activate current blob (if Planned) or create next blob (if Completed)
		let rankInit = [];
		if (!data.blob) {
			data.tournament.players.forEach((item, i) => {
				const strength = CalcStrength(i + 1, data.tournament.players.length);
				rankInit.push({ player: item, strength: strength, points: baseline + strength });
			});
		} else {
		}
		const results = { rankInit: rankInit, matches: [], rankFinal: [] };
		createBlob(data.tournament.id, nextBlobName, nextBlobID, results);
		updateTournamentStatus(data.tournament.id);
		startForm = false;
		startEnabled = false;
	}

	async function endBlob() {
		// calculate final results and set status to Completed
	}

	async function createBlob(tid, name, bid, results) {
		const response = await fetch('/api/tournament', {
			method: 'POST',
			body: JSON.stringify({
				name: name,
				type: 'blob',
				id: tid + ':' + bid,
				status: 'Active',
				settings: {},
				results: results
			}),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
		const result = await response.json();
	}

	async function updateTournamentStatus(tid) {
		const response = await fetch('/api/tournament/' + tid, {
			method: 'PUT',
			body: JSON.stringify({
				status: 'Active'
			}),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
		const result = await response.json();
	}

	async function updateBlob(tid, blob, players) {}
	
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
			<Label class="space-y-2">Spieltag Nr. {nextRound} starten</Label>
			<Button color="alternative" on:click={startBlob}>Starten</Button>
			<Button color="primary" on:click={() => (startForm = false)}>Abbrechen</Button>
		</form>
	</Modal>
</div>

<div>
	<Modal title="Spieltag beenden" bind:open={endForm} autoclose={false} class="max-w-sm">
		<form class="flex flex-col space-y-6" action="#">
			<Label class="space-y-2">Spieltag x beenden</Label>
			<Button color="alternative" on:click={endBlob}>Beenden</Button>
			<Button color="primary" on:click={() => (endForm = false)}>Abbrechen</Button>
		</form>
	</Modal>
</div>
