<script>
	export let myData;

	import { Toggle, Button, P, Heading, Spinner } from 'flowbite-svelte';
	import { SearchSolid } from 'flowbite-svelte-icons';

	let em = true;
	let ee = true;
	let dmd = true;
	let lcd = true;

	let selectedPin = '';

	let progress = false;

	function selectPin() {
		progress = true;
		let newPin;
		let timeout = 1500;
		let items = myData.pins.filter(
			(pin) =>
				pin.active &&
				((em ? pin.type === 'EM' : false) ||
					(ee ? pin.type === 'EE' : false) ||
					(dmd ? pin.type === 'DMD' : false) ||
					(lcd ? pin.type === 'LCD' : false))
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
		<Button size="xl" on:click={selectPin}>
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
