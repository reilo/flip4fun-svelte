Code kommentieren, insbes. Component Parameter
Strings lokalisieren
Tabellen IDs überarbeiten
Fehlerbehandlung

Essentiell:
- Liga/Turnier-Framework!!!

Nice to have:
- CRUD-Funktionen Pins/Spieler/Gäste!

ferner (falls Zeit ist):
- Gästeliste Historie
- Flipperliste mehr Funktionen
- Mehr Pin-Details: Auflage, Designer, Art Designer


##################################################

Passing props to dynamic components

<script>
	import Page1 from './Page1.svelte';
	import Page2 from './Page2.svelte';
	
	let component;
	let props;
	
	const page1 = () => {
		component = Page1;
		props = {page1Prop: 1};
	};
	
	const page2 = () => {
		component = Page2;
		props = {page2Prop: 2};
	};
	
	page1();
</script>

<button on:click={page1}>page1</button>
<button on:click={page2}>page2</button>
<svelte:component this={component} {...props}/>

--------------------------------------------------