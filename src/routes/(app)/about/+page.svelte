<script>
	import { Heading, P, A, Badge, Card } from 'flowbite-svelte';
	import {
		GithubSolid,
		ServerSolid,
		PaletteSolid,
		DatabaseSolid,
		CodeBranchSolid
	} from 'flowbite-svelte-icons';
	import { innerWidth, innerHeight } from 'svelte/reactivity/window';
	import { devicePixelRatio } from 'svelte/reactivity/window';
</script>

<svelte:head>
	<title>Über flip4fun</title>
</svelte:head>

<div class="flex max-w-3xl flex-col gap-8 m-0">

	<!-- Hero -->
	<div class="flex flex-col gap-3">
		<div>
			<Heading tag="h2">flip4fun</Heading>
			<P class="text-gray-500 dark:text-gray-400 mt-1">
				Turnierverwaltung für Flipper-Ligen &amp; Turniere
			</P>
		</div>
		<P>
			flip4fun unterstützt die Planung und Durchführung von Flipper-Ligen und TwinPin-Turnieren — 
			von der Flipper-Auslosung über die Ergebniserfassung bis hin zur
			automatischen Rangliste und Urkundengenerierung.
		</P>
		<div class="flex flex-wrap gap-2">
			<Badge color="blue">FLIP-Liga</Badge>
			<Badge color="green">FLIP-Finale</Badge>
			<Badge color="purple">Twin Pin</Badge>
			<Badge color="yellow">PDF-Export</Badge>
			<Badge color="dark">Open Source</Badge>
		</div>
	</div>

	<!-- Source -->
	<div class="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
		<GithubSolid class="w-6 h-6 shrink-0 text-gray-700 dark:text-gray-300" />
		<div>
			<p class="font-medium text-gray-900 dark:text-white">Quellcode auf GitHub</p>
			<A target="_blank" href="https://github.com/reilo/flip4fun-svelte" class="text-sm">
				github.com/reilo/flip4fun-svelte
			</A>
		</div>
	</div>

	<!-- Tech stack -->
	<div>
		<Heading tag="h5" class="mb-4">Technologien</Heading>
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

			<Card>
				<div class="flex items-start gap-3">
					<CodeBranchSolid class="w-6 h-6 shrink-0 text-orange-500 mt-0.5" />
					<div>
						<p class="font-semibold text-gray-900 dark:text-white mb-1">Svelte 5 &amp; SvelteKit</p>
						<P class="text-sm text-gray-500 dark:text-gray-400 mb-2">
							Modernes reaktives JavaScript-Framework für performante Web-Applikationen.
						</P>
						<div class="flex gap-2 flex-wrap">
							<A target="_blank" href="https://svelte.dev/" class="text-xs">svelte.dev</A>
							<A target="_blank" href="https://kit.svelte.dev/" class="text-xs">kit.svelte.dev</A>
						</div>
					</div>
				</div>
			</Card>

			<Card>
				<div class="flex items-start gap-3">
					<ServerSolid class="w-6 h-6 shrink-0 text-purple-500 mt-0.5" />
					<div>
						<p class="font-semibold text-gray-900 dark:text-white mb-1">Vite</p>
						<P class="text-sm text-gray-500 dark:text-gray-400 mb-2">
							Blitzschneller Development Server und Build-Toolchain für moderne Web-Projekte.
						</P>
						<A target="_blank" href="https://vitejs.dev/" class="text-xs">vitejs.dev</A>
					</div>
				</div>
			</Card>

			<Card>
				<div class="flex items-start gap-3">
					<PaletteSolid class="w-6 h-6 shrink-0 text-blue-500 mt-0.5" />
					<div>
						<p class="font-semibold text-gray-900 dark:text-white mb-1">Tailwind CSS &amp; Flowbite</p>
						<P class="text-sm text-gray-500 dark:text-gray-400 mb-2">
							Utility-first CSS-Framework mit fertiger Svelte-Komponentenbibliothek für responsives Design.
						</P>
						<div class="flex gap-2 flex-wrap">
							<A target="_blank" href="https://tailwindcss.com/" class="text-xs">tailwindcss.com</A>
							<A target="_blank" href="https://flowbite.com/" class="text-xs">flowbite.com</A>
						</div>
					</div>
				</div>
			</Card>

			<Card>
				<div class="flex items-start gap-3">
					<DatabaseSolid class="w-6 h-6 shrink-0 text-green-500 mt-0.5" />
					<div>
						<p class="font-semibold text-gray-900 dark:text-white mb-1">Prisma &amp; Neon PostgreSQL</p>
						<P class="text-sm text-gray-500 dark:text-gray-400 mb-2">
							Type-safe ORM mit serverlosem PostgreSQL-Hosting für zuverlässige Datenpersistenz.
						</P>
						<div class="flex gap-2 flex-wrap">
							<A target="_blank" href="https://www.prisma.io/" class="text-xs">prisma.io</A>
							<A target="_blank" href="https://neon.tech/" class="text-xs">neon.tech</A>
						</div>
					</div>
				</div>
			</Card>

		</div>
	</div>

	<!-- Device info -->
	<div>
		<Heading tag="h5" class="mb-4">Geräteinformationen</Heading>
		<div class="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
			{#each [
				{ label: 'Viewport Breite', value: innerWidth.current + ' px' },
				{ label: 'Viewport Höhe', value: innerHeight.current + ' px' },
				{ label: 'Pixelverhältnis (DPR)', value: devicePixelRatio.current + 'x' }
			] as row, i}
				<div class="flex justify-between px-4 py-2.5 text-sm
					{i % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}">
					<span class="text-gray-500 dark:text-gray-400">{row.label}</span>
					<span class="font-medium text-gray-900 dark:text-white tabular-nums">{row.value}</span>
				</div>
			{/each}
		</div>
	</div>

</div>
