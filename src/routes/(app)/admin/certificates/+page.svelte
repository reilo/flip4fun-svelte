<script>
	import { Button } from 'flowbite-svelte';
    import { Heading } from 'flowbite-svelte';
    import { P } from 'flowbite-svelte';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';
	import { generateCertificatePDF } from '$lib/PDFUtil';

	let { data } = $props();

	const generateCertificates = () => {
		let playerIDs = [];

		const title = 'Liga Titel';
		const versions = ['Aktivster Spieler'];
		const playerNames = ['Max Mustermann'];
		const lines = ['Wir gratulieren zur hervorragenden Leistung', 'und überreichen die Urkunde an'];

		generateCertificatePDF(title, versions, lines, playerNames);
	};
</script>

<div>
	<Heading tag="h5">Urkunden-PDF generieren</Heading>

    <P class="mb-3">Gebe die notwendigen Daten ein und generiere die Urkunde.</P>
    
	<Button on:click={() => generateCertificates()}>
		Generiere PDF<ArrowRightOutline class="w-3.5 h-3.5 ml-2 text-white" />
	</Button>

</div>
