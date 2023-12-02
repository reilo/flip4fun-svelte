<script>
	import { Toggle, Button, P, Heading, Spinner } from 'flowbite-svelte';
	import { SearchSolid } from 'flowbite-svelte-icons';

	export let data;

	let em = true;
	let ee = true;
	let dmd = true;
	let lcd = true;

	let selectedPin = '?';

	let progressHidden = true;

	function selectPin() {
		progressHidden = false;
		let newPin;
		let items = data.pins.filter(
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
			newPin = '?';
		}
		setTimeout(() => {
			progressHidden = true;
			selectedPin = newPin;
		}, 1500);
	}
</script>

<Heading tag="h5">
	Flipper losen
</Heading>

<P>Klicke auf Start, um einen Flipper auszulosen.</P>
<P>
	Um deine Auswahl auf bestimmte Flippertypen einzuschränken, aktiviere bzw. deaktiviere die
	entsprechenden Optionen.
</P>

<br />

<div class="grid grid-flow-row gap-1 sm:gap-3">
	<Toggle checked={em} on:change={() => (em = !em)}>Elektromechanisch</Toggle>
	<Toggle checked={ee} on:change={() => (ee = !ee)}>Early Electronic</Toggle>
	<Toggle checked={dmd} on:change={() => (dmd = !dmd)}>DMD Flipper</Toggle>
	<Toggle checked={lcd} on:change={() => (lcd = !lcd)}>Spike2-Flipper</Toggle>
	<div>
		<br />
		<Button size="xl" on:click={selectPin}>
			<Spinner class="mr-3 {progressHidden ? 'hidden' : ''}" size="4" />
			<SearchSolid class="w-3.5 h-3.5 mr-2 {progressHidden ? '' : 'hidden'}" />
			Starten
		</Button>
	</div>
	<div>
		<br />
		<Heading tag="h4">
			{selectedPin}
		</Heading>
	</div>
</div>
