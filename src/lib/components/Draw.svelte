<script>
	import { P, Heading } from 'flowbite-svelte';
	import { Toggle, Button, Alert, Spinner } from 'flowbite-svelte';
	import { SearchSolid, InfoCircleSolid } from 'flowbite-svelte-icons';

	let { myData } = $props();
	let showError = $derived(!myData || !myData.pins);

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
		let items = myData.pins.filter(
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
	}
</script>

{#if showError}
	<Alert border color="red">
		<InfoCircleSolid slot="icon" class="w-5 h-5" />
		<span class="font-medium">Interner Fehler!</span>
		<br />
		{myData.message}
		<br />
		{myData.error}
	</Alert>
{/if}
<br />

<Heading tag="h5">Flipper losen</Heading>

<P>Klicke auf Start, um einen Flipper auszulosen.</P>
<P>
	Um deine Auswahl auf bestimmte Flippertypen einzuschränken, aktiviere bzw. deaktiviere die
	entsprechenden Optionen.
</P>

<br />

<div class="grid grid-flow-row gap-2 sm:gap-3">
	<Toggle checked={em} on:change={() => (em = !em)}>Electromechanical (bis Ende 70er)</Toggle>
	<Toggle checked={ee} on:change={() => (ee = !ee)}>Early Electronic (bis Ende 80er)</Toggle>
	<Toggle checked={dmd} on:change={() => (dmd = !dmd)}>DMD-Flipper (bis 2005, WPC)</Toggle>
	<Toggle checked={lcd} on:change={() => (lcd = !lcd)}>Moderne Flipper (SAM, Spike)</Toggle>
	<div>
		<br />
		<Button disabled={showError} size="xl" on:click={selectPin}>
			<Spinner class="mr-3 {progress ? '' : 'hidden'}" size="4" />
			<SearchSolid class="w-3.5 h-3.5 mr-2 {progress ? 'hidden' : ''}" />
			Starten
		</Button>
	</div>
	<div>
		<br />
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
