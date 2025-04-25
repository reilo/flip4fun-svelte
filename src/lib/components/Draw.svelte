<script>
	import { P, Heading } from 'flowbite-svelte';
	import { Toggle, Button, Alert, Spinner } from 'flowbite-svelte';
	import { SearchSolid, InfoCircleSolid } from 'flowbite-svelte-icons';
	import { logInfo } from '$lib/LogUtil';

	let { data } = $props();
	let showError = $derived(!data || !data.pins);

	let em = $state(true);
	let ee = $state(true);
	let dmd = $state(true);
	let lcd = $state(true);

	let selectedPin = $state('');

	let progress = $state(false);

	function selectPin() {
		progress = true;
		let newPin;
		let timeout = 1500;
		let items = data.pins.filter(
			(pin) =>
				pin.active &&
				((em ? ['EM'].includes(pin.type) : false) ||
					(ee ? ['EE', 'Sys11'].includes(pin.type) : false) ||
					(dmd
						? ['DataEast', 'Gottlieb', 'Pin2000', 'Whitestar', 'WPC', 'WPC95'].includes(pin.type)
						: false) ||
					(lcd ? ['SAM', 'Spike'].includes(pin.type) : false))
		);
		if (items.length > 0) {
			let num = Math.floor(Math.random() * items.length);
			newPin = items[num].name;
		} else {
			newPin = 'Kein Flipper verfügbar';
			timeout = 0;
		}
		setTimeout(() => {
			progress = false;
			selectedPin = newPin;
		}, timeout);
		logInfo('Lostrommel: ' + newPin);
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
			<Heading tag="h4" class={progress ? 'hidden' : ''}>
				{selectedPin}
			</Heading>
			<div class={progress ? '' : 'hidden'}>
				<Spinner color="blue" />
				<Spinner color="gray" />
				<Spinner color="green" />
				<Spinner color="purple" />
			</div>
		</div>
	</div>
</div>
