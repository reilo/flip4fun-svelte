<script>
	import { Heading, P, A } from 'flowbite-svelte';
	import { Table, TableHead, TableHeadCell } from 'flowbite-svelte';
	import { TableBody, TableBodyRow, TableBodyCell } from 'flowbite-svelte';
	import { Timeline, TimelineItem, Button } from 'flowbite-svelte';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';
	import { innerWidth, innerHeight } from 'svelte/reactivity/window';
	import { outerWidth, outerHeight } from 'svelte/reactivity/window';
	import { devicePixelRatio } from 'svelte/reactivity/window';
</script>

<div class="flex max-w-3xl flex-col justify-center m-0">
	<Heading tag="h4" class="mb-3">Info über diese App</Heading>

	<P class="mb-3"
		>Diese App wurde mit modernsten JavaScript-Technologien erstellt und ist unter <A
			target="_blank"
			href="https://github.com/reilo/flip4fun-svelte">Github</A
		> veröffentlicht.</P
	>

	<Timeline>
		<TimelineItem title="Svelte & Svelte Kit">
			<P class="mb-3 text-base font-normal text-gray-500 dark:text-gray-400">
				Das innovative JavaScript-Framework zur Erstellung von modernen Web- und
				Cross-Platform-Oberflächen.
			</P>
			<Button color="alternative"
				><A target="_blank" href="https://svelte.dev/">Mehr über Svelte</A><ArrowRightOutline
					class="ml-2 w-3 h-3"
				/></Button
			>
			<Button color="alternative"
				><A target="_blank" href="https://kit.svelte.dev/">Mehr über SvelteKit</A><ArrowRightOutline
					class="ml-2 w-3 h-3"
				/></Button
			>
		</TimelineItem>
		<TimelineItem title="Vite">
			<P class="mb-3 text-base font-normal text-gray-500 dark:text-gray-400">
				Development Server und schnelles Build Tool für alle gängigen JavaScript-Frameworks.
			</P>
			<Button color="alternative"
				><A target="_blank" href="https://vitejs.dev/">Mehr erfahren</A><ArrowRightOutline
					class="ml-2 w-3 h-3"
				/></Button
			>
		</TimelineItem>
		<TimelineItem title="Tailwind CSS & Flowbite">
			<P class="mb-3 text-base font-normal text-gray-500 dark:text-gray-400">
				CSS-Framework mit Komponenten-Bibiliothek für ein Responsives Webdesign.
			</P>
			<Button color="alternative"
				><A target="_blank" href="https://tailwindcss.com/">Mehr über Tailwind</A><ArrowRightOutline
					class="ml-2 w-3 h-3"
				/></Button
			>
			<Button color="alternative"
				><A target="_blank" href="https://flowbite.com/">Mehr über Flowbite</A><ArrowRightOutline
					class="ml-2 w-3 h-3"
				/></Button
			>
		</TimelineItem>
		<TimelineItem title="Prisma & Neon PostgreSQL">
			<P class="mb-3 text-base font-normal text-gray-500 dark:text-gray-400">
				Werkzeug zum Erstellen von Datenbank-Schemata und Anbindung an PostgreSQL Datenbanken.
			</P>
			<Button color="alternative"
				><A target="_blank" href="https://www.prisma.io/">Mehr über Prisma</A><ArrowRightOutline
					class="ml-2 w-3 h-3"
				/></Button
			>
			<Button color="alternative"
				><A target="_blank" href="https://neon.tech/">Mehr über Neon</A><ArrowRightOutline
					class="ml-2 w-3 h-3"
				/></Button
			>
		</TimelineItem>
	</Timeline>

	<Heading tag="h4" class="mb-3">Geräteeigenschaften</Heading>

	<Table shadow hoverable={true}>
		<TableHead>
			<TableHeadCell>Parameter</TableHeadCell>
			<TableHeadCell>Aktueller Wert</TableHeadCell>
		</TableHead>
		<TableBody tableBodyClass="divide-y">
			<TableBodyRow>
				<TableBodyCell>innerWidth</TableBodyCell>
				<TableBodyCell>{innerWidth.current}</TableBodyCell>
			</TableBodyRow>
			<TableBodyRow>
				<TableBodyCell>innerHeight</TableBodyCell>
				<TableBodyCell>{innerHeight.current}</TableBodyCell>
			</TableBodyRow>
			<TableBodyRow>
				<TableBodyCell>outerWidth</TableBodyCell>
				<TableBodyCell>{outerWidth.current}</TableBodyCell>
			</TableBodyRow>
			<TableBodyRow>
				<TableBodyCell>outerHeight</TableBodyCell>
				<TableBodyCell>{outerHeight.current}</TableBodyCell>
			</TableBodyRow>
			<TableBodyRow>
				<TableBodyCell>devicePixelRatio</TableBodyCell>
				<TableBodyCell>{devicePixelRatio.current}</TableBodyCell>
			</TableBodyRow>
		</TableBody>
	</Table>
</div>
