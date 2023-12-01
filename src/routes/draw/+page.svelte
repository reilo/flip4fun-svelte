<script>
	import { Toggle, Button, P } from 'flowbite-svelte';

	let em = true;
	let ee = true;
	let dmd = true;
	let lcd = true;
</script>

<P>
	Klicke Start, um nach dem Zufallsprinzip einen Flipper auszulosen.
</P>
<P>
	Willst du deine Auswahl auf bestimmte Flippertypen einschränken, aktiviere bzw. deaktiviere die entsprechenden Optionen.
</P>

<br />

<div class="grid grid-flow-row grid-cols-1 gap-3">
	<Toggle checked={em}>Elektromechanisch</Toggle>
	<Toggle checked={ee}>Early Electronic</Toggle>
	<Toggle checked={dmd}>DMD Flipper</Toggle>
	<Toggle checked={lcd}>Neue Stern-Flipper</Toggle>
	<div>
		<Button size="xl">Starten</Button>
	</div>
</div>

