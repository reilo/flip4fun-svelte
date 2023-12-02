<script>
	import { Toggle, Button, P } from 'flowbite-svelte';

	export let data;

	let em = true;
	let ee = true;
	let dmd = true;
	let lcd = true;

	let selectedPin = '?';

	function selectPin() {
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
			selectedPin = items[num].name;
		} else {
			selectedPin = '?';
		}
	}
</script>

<P>Klicke Start, um nach dem Zufallsprinzip einen Flipper auszulosen.</P>
<P>
	Willst du deine Auswahl auf bestimmte Flippertypen einschränken, aktiviere bzw. deaktiviere die
	entsprechenden Optionen.
</P>

<br />

<div class="grid grid-flow-row grid-cols-1 gap-3">
	<Toggle checked={em} on:change={() => (em = !em)}>Elektromechanisch</Toggle>
	<Toggle checked={ee} on:change={() => (ee = !ee)}>Early Electronic</Toggle>
	<Toggle checked={dmd} on:change={() => (dmd = !dmd)}>DMD Flipper</Toggle>
	<Toggle checked={lcd} on:change={() => (lcd = !lcd)}>Spike2-Flipper</Toggle>
	<div>
		<Button size="xl" on:click={selectPin}>Starten</Button>
	</div>
	<P>
		{selectedPin}
	</P>
</div>
