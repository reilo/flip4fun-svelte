<script>
	import { Heading } from 'flowbite-svelte';
	import { Button } from 'flowbite-svelte';
	import { Table, TableHead, TableHeadCell } from 'flowbite-svelte';
	import { TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';
	import { EditOutline, RocketOutline, ForwardStepSolid } from 'flowbite-svelte-icons';
	import { MapBoolean, MapTourStatus } from '$lib/utils';

	export let data;
</script>

<div>
	<Heading tag="h5">Turniere bearbeiten, starten oder beenden</Heading>
	<br />

	<Table hoverable={true}>
		<TableHead>
			<TableHeadCell>Name</TableHeadCell>
			<TableHeadCell>Typ</TableHeadCell>
			<TableHeadCell>Status</TableHeadCell>
			<TableHeadCell>Test</TableHeadCell>
			<TableHeadCell>Bearbeiten</TableHeadCell>
			<TableHeadCell>Starten</TableHeadCell>
			<TableHeadCell>Beenden</TableHeadCell>
		</TableHead>
		<TableBody tableBodyClass="divide-y">
			{#each data.tournaments as tournament, i}
				<TableBodyRow>
					<TableBodyCell>
						{tournament.name}
					</TableBodyCell>
					<TableBodyCell>
						{tournament.type}
					</TableBodyCell>
					<TableBodyCell>
						{MapTourStatus(tournament.status)}
					</TableBodyCell>
					<TableBodyCell>
						{MapBoolean(tournament.testMode)}
					</TableBodyCell>
					<TableBodyCell>
						{#if tournament.status == 'Planned' || tournament.status == 'Ready' || tournament.status == 'Active'}
							<Button outline class="!p-2" size="lg">
								<EditOutline class="w-3.5 h-3.5 ms-2" />
							</Button>
						{:else}
							<Button disabled outline class="!p-2" size="lg">
								<EditOutline class="w-3.5 h-3.5 ms-2" />
							</Button>
						{/if}
					</TableBodyCell>
					<TableBodyCell>
						{#if tournament.status == 'Ready'}
							<Button outline color="green" class="!p-2" size="lg">
								<RocketOutline class="w-3.5 h-3.5 ms-2" />
							</Button>
						{:else}
							<Button disabled outline color="green" class="!p-2" size="lg">
								<RocketOutline class="w-3.5 h-3.5 ms-2" />
							</Button>
						{/if}
					</TableBodyCell>
					<TableBodyCell>
						{#if tournament.status == 'Planned' || tournament.status == 'Ready' || tournament.status == 'Active'}
							<Button outline color="red" class="!p-2" size="lg">
								<ForwardStepSolid class="w-3.5 h-3.5 ms-2" />
							</Button>
						{:else}
							<Button disabled outline color="red" class="!p-2" size="lg">
								<ForwardStepSolid class="w-3.5 h-3.5 ms-2" />
							</Button>
						{/if}
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</div>
