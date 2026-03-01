<script>
	import { Heading } from 'flowbite-svelte';
	import { Toggle, Button, Alert, Spinner } from 'flowbite-svelte';
	import { ArrowsRepeatOutline, InfoCircleSolid, CheckCircleOutline } from 'flowbite-svelte-icons';
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

<div class="max-w-xl mx-auto space-y-8">
	{#if showError}
		<Alert border color="red">
			{#snippet icon()}<InfoCircleSolid class="w-5 h-5" />{/snippet}
			<span class="font-bold">Interner Fehler!</span>
			<p>{data.message}</p>
			<p>{data.error}</p>
		</Alert>
	{/if}

	<!-- Hero -->
	<div class="text-center space-y-3">
		<Heading tag="h2" class="text-3xl font-extrabold text-gray-900 dark:text-white">
			Lostrommel
		</Heading>
		<p class="text-gray-500 dark:text-gray-400">
			Aktiviere deine gewünschten Flippertypen und lass das Schicksal entscheiden!
		</p>
	</div>

	<!-- Filter -->
	<div class="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6">
		<p class="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
			Flipper-Typen filtern
		</p>
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
			<div class="flex items-center gap-3 p-3 rounded-xl border-2 transition-all
				{em ? 'border-blue-400 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/30' : 'border-gray-200 dark:border-gray-700'}">
				<Toggle checked={em} onchange={() => (em = !em)} />
				<div class="min-w-0">
					<p class="text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">Elektromechanisch</p>
					<p class="text-xs text-gray-400">bis Ende 70er</p>
				</div>
			</div>
			<div class="flex items-center gap-3 p-3 rounded-xl border-2 transition-all
				{ee ? 'border-purple-400 bg-purple-50 dark:border-purple-500 dark:bg-purple-900/30' : 'border-gray-200 dark:border-gray-700'}">
				<Toggle checked={ee} onchange={() => (ee = !ee)} />
				<div class="min-w-0">
					<p class="text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">Early Electronic</p>
					<p class="text-xs text-gray-400">bis Ende 80er</p>
				</div>
			</div>
			<div class="flex items-center gap-3 p-3 rounded-xl border-2 transition-all
				{dmd ? 'border-amber-400 bg-amber-50 dark:border-amber-500 dark:bg-amber-900/30' : 'border-gray-200 dark:border-gray-700'}">
				<Toggle checked={dmd} onchange={() => (dmd = !dmd)} />
				<div class="min-w-0">
					<p class="text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">DMD-Flipper</p>
					<p class="text-xs text-gray-400">bis 2005, WPC</p>
				</div>
			</div>
			<div class="flex items-center gap-3 p-3 rounded-xl border-2 transition-all
				{lcd ? 'border-green-400 bg-green-50 dark:border-green-500 dark:bg-green-900/30' : 'border-gray-200 dark:border-gray-700'}">
				<Toggle checked={lcd} onchange={() => (lcd = !lcd)} />
				<div class="min-w-0">
					<p class="text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">Moderne Flipper</p>
					<p class="text-xs text-gray-400">SAM, Spike</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Button -->
	<div class="flex justify-center">
		<Button
			size="xl"
			disabled={showError}
			onclick={selectPin}
			class="px-12 text-lg font-bold shadow-lg hover:shadow-xl transition-all"
		>
			{#if progress}
				<Spinner class="mr-3" size="5" color="white" />
				Läuft...
			{:else}
				<ArrowsRepeatOutline class="w-5 h-5 mr-2" />
				Starten!
			{/if}
		</Button>
	</div>

	<!-- Result -->
	{#if progress || selectedPin}
		<div class="rounded-2xl overflow-hidden shadow-2xl bg-linear-to-br from-blue-600 to-purple-700 p-8 text-center select-none">
			<p class="text-white/60 text-xs font-semibold uppercase tracking-widest mb-3">
				{progress ? 'Auslosung läuft ...' : 'Dein Flipper'}
			</p>
			{#if progress}
				<p class="text-2xl font-bold text-white animate-reel-spin">{animName}</p>
			{:else if selectedPin}
				<div class="flex flex-col items-center gap-3">
					<CheckCircleOutline class="w-10 h-10 text-white/80" />
					<p class="text-3xl font-extrabold text-white">{selectedPin}</p>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.animate-reel-spin {
		transition: color 0.18s cubic-bezier(0.4, 0, 0.2, 1);
		will-change: color;
	}
</style>