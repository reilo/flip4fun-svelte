<script>
	import { P, Heading } from 'flowbite-svelte';
	import { Toggle, Button, Alert, Spinner } from 'flowbite-svelte';
	import { SearchSolid, InfoCircleSolid } from 'flowbite-svelte-icons';
	import { randomPin } from '$lib/PinUtil';
	import { logInfo } from '$lib/LogUtil';

	let { data } = $props();
	let showError = $derived(!data || !data.pins);

	let em = $state(true);
	let ee = $state(true);
	let dmd = $state(true);
	let lcd = $state(true);

	let selectedPin = $state('');

	let progress = $state(false);

	// slot-machine reels state
	let reels = $state([ { text: '' }, { text: '' }, { text: '' } ]);
	let _intervals = [];

	function selectPin() {
		const pinObj = randomPin(data.pins, em, ee, dmd, lcd, []);
		const finalName = pinObj ? pinObj.name : 'Kein Flipper verfügbar';

		progress = true;
		selectedPin = '';

		// clear any existing intervals
		_intervals.forEach(id => clearInterval(id));
		_intervals = [];

		// helper to pick random name
		const randName = () => {
			if (!data.pins || data.pins.length === 0) return '—';
			const idx = Math.floor(Math.random() * data.pins.length);
			return data.pins[idx].name;
		};

		// initialize reels
		reels = reels.map(() => ({ text: randName() }));

		// animate each reel with recursive timeouts that gradually slow down
		const stopped = [false, false, false];
		_intervals = [];

		const startDelays = [60, 80, 100];
		function tick(i, delay) {
			_intervals[i] = setTimeout(() => {
				reels[i].text = randName();
				if (!stopped[i]) {
					// increase delay to slow down over time but cap it
					const next = Math.min(Math.floor(delay * 1.18), 520);
					tick(i, next);
				}
			}, delay);
		}

		for (let i = 0; i < 3; i++) {
			tick(i, startDelays[i]);
		}

		// stop reels sequentially, leaving the middle reel showing the final selection
		const total = 1800; // slightly longer so slowdown is noticeable
		const stopDelays = [ total * 0.62, total * 0.84, total * 1.0 ];
		stopDelays.forEach((d, i) => {
			setTimeout(() => {
				stopped[i] = true;
				clearTimeout(_intervals[i]);
				if (i === 1) {
					reels[i].text = finalName;
				} else {
					reels[i].text = randName();
				}
			}, d);
		});

		// finish animation
		setTimeout(() => {
			progress = false;
			selectedPin = finalName;
			_intervals.forEach(id => clearTimeout(id));
			_intervals = [];
			logInfo('Lostrommel: ' + finalName);
		}, total + 200);
	}
</script>

<div>
	{#if showError}
		<Alert border color="red" class="mb-3">
			<InfoCircleSolid slot="icon" class="w-5 h-5" />
			<span class="font-bold">Interner Fehler!</span>
			<P>
				{data.message}
			</P>
			<P>
				{data.error}
			</P>
		</Alert>
	{/if}

	<Heading tag="h5" class="mb-3">Flipper losen</Heading>

	<P class="mb-1">Klicke auf Start, um einen Flipper auszulosen.</P>
	<P class="mb-3">
		Um deine Auswahl auf bestimmte Flippertypen einzuschränken, aktiviere bzw. deaktiviere die
		entsprechenden Optionen.
	</P>

	<div class="grid grid-flow-row gap-2 sm:gap-3">
		<Toggle id="emToggle" checked={em} on:change={() => (em = !em)}
			>Elektromechanisch (bis Ende 70er)</Toggle
		>
		<Toggle id="eeToggle" checked={ee} on:change={() => (ee = !ee)}
			>Early Electronic (bis Ende 80er)</Toggle
		>
		<Toggle id="dmdToggle" checked={dmd} on:change={() => (dmd = !dmd)}
			>DMD-Flipper (bis 2005, WPC)</Toggle
		>
		<Toggle id="lcdToggle" checked={lcd} on:change={() => (lcd = !lcd)}
			>Moderne Flipper (SAM, Spike)</Toggle
		>
		<div>
			<Button class="mb-3 mt-3" disabled={showError} size="xl" on:click={selectPin}>
				<Spinner class="mr-3 {progress ? '' : 'hidden'}" size="4" />
				<SearchSolid class="w-3.5 h-3.5 mr-2 {progress ? 'hidden' : ''}" />
				Starten
			</Button>
		</div>
		<div>
				<div class="flex gap-3 items-center justify-start mt-3 pl-3">
				{#each reels as r, i}
					<div
						class="reel w-40 h-14 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-md shadow-inner text-lg text-gray-900 dark:text-gray-100"
						class:font-extrabold={!progress && i === 1}
						class:font-semibold={progress || i !== 1}
						class:dimmed={!progress && i !== 1}
					>
						{#if progress}
							{r.text}
						{:else}
							{#if i === 1}
								{selectedPin}
							{:else}
								{r.text}
							{/if}
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	.reel.dimmed {
		opacity: 0.38;
		filter: grayscale(78%);
		transition: opacity 220ms ease, filter 220ms ease, transform 220ms ease;
	}

	/* Dark mode adjustment */
	:global(.dark) .reel.dimmed {
		opacity: 0.5;
		filter: grayscale(70%);
	}
</style>
