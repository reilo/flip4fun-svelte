<script>
	import { Toggle } from 'flowbite-svelte';
	import { Button } from 'flowbite-svelte';

	let em = true;
	let ee = true;
	let dmd = true;
	let lcd = true;
</script>

<div class="grid grid-flow-row grid-cols-4 gap-3">
	<Toggle checked={em}>Elektromechanisch</Toggle>
	<Toggle checked={ee}>Early Electronic</Toggle>
	<Toggle checked={dmd}>DMD Flipper</Toggle>
	<Toggle checked={lcd}>Neue Stern-Flipper</Toggle>
</div>

<br />

<Button size="xl">Starten</Button>
