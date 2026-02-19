<script>
	import { P, Heading } from 'flowbite-svelte';
	import { Toggle, Button, Alert, Spinner } from 'flowbite-svelte';
	import { SearchSolid, InfoCircleSolid } from 'flowbite-svelte-icons';
	import { filterPins, randomPin } from '$lib/PinUtil';
	import { logInfo } from '$lib/LogUtil';

	let { data } = $props();
	let showError = $derived(!data || !data.pins);

	let em = $state(true);
	let ee = $state(true);
	let dmd = $state(true);
	let lcd = $state(true);

	let selectedPin = $state('');

	let progress = $state(false);

	// Wheel animation state
	let animName = $state("");
	let animTimeout = null;

	function selectPin() {
		if (!data.pins || data.pins.length === 0) {
			selectedPin = "Kein Flipper verfügbar";
			progress = false;
			return;
		}
		// Filter only active pins
		const activePins = data.pins.filter(p => p.active === true);
		if (activePins.length === 0) {
			selectedPin = "Kein Flipper verfügbar";
			progress = false;
			return;
		}
		// Pick winner from active pins
		const winner = randomPin(activePins, em, ee, dmd, lcd, []);
		if (!winner) {
			selectedPin = "Kein Flipper verfügbar";
			progress = false;
			return;
		}
		// Use all pin names for wheel animation
		let names = filterPins(activePins, em, ee, dmd, lcd).map(p => p.name);
		// Shuffle names (Fisher-Yates)
		for (let i = names.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[names[i], names[j]] = [names[j], names[i]];
		}
		selectedPin = "";
		progress = true;
		let idx = Math.floor(Math.random() * names.length);
		let start = performance.now();
		let duration = 5000; // ms
		if (animTimeout) clearTimeout(animTimeout);
		function easeOut(t) {
			// easeOutCubic
			return 1 - Math.pow(1 - t, 3);
		}
		function animate(now) {
			let elapsed = now - start;
			let t = Math.min(elapsed / duration, 1);
			// interval: fast at t=0, slow at t=1
			let minInterval = 32, maxInterval = 420;
			let interval = minInterval + (maxInterval - minInterval) * easeOut(t);
			if (elapsed < duration) {
				idx = (idx + 1) % names.length;
				animName = names[idx];
				animTimeout = setTimeout(() => requestAnimationFrame(animate), interval);
			} else {
				animName = winner.name;
				selectedPin = winner.name;
				progress = false;
				logInfo("Lostrommel: " + winner.name);
			}
		}
		animName = names[idx];
		requestAnimationFrame(animate);
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
		<div class="flex flex-col items-start mt-2">
			<div class="wheel-single w-full flex items-center justify-start h-16 select-none">
				{#if progress}
					<span class="text-2xl font-semibold animate-reel-spin">{animName}</span>
				{:else if selectedPin}
					<span class="text-3xl font-extrabold text-blue-900 dark:text-blue-200">{selectedPin}</span>
				{/if}
			</div>
		</div>
	</div>
<style>
.wheel-single {
	min-height: 3.5rem;
	background: linear-gradient(90deg, #f3f4f6 0%, #fff 50%, #f3f4f6 100%);
	border-radius: 0.5rem;
	box-shadow: 0 2px 12px 0 rgba(0,0,0,0.07);
	font-family: inherit;
	letter-spacing: 0.01em;
	padding: 0.5rem 1.5rem 0.5rem 1rem;
}
.animate-reel-spin {
	transition: color 0.18s cubic-bezier(.4,0,.2,1);
	will-change: text-shadow, color;
}
</style>
</div>