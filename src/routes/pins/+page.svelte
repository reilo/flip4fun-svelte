<script>
    export let data;
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
        Checkbox
	} from 'flowbite-svelte';
</script>

<Table hoverable={true}>
	<TableHead>
		<TableHeadCell>Name</TableHeadCell>
		<TableHeadCell>Hersteller</TableHeadCell>
		<TableHeadCell>Jahr</TableHeadCell>
		<TableHeadCell>Typ</TableHeadCell>
        <TableHeadCell>Aktiv</TableHeadCell>
          </TableHead>
	<TableBody class="divide-y">
        {#each data.pins as pin}
		<TableBodyRow>
			<TableBodyCell>{pin.name}</TableBodyCell>
			<TableBodyCell>{pin.manu}</TableBodyCell>
			<TableBodyCell>{pin.year}</TableBodyCell>
			<TableBodyCell>{pin.type}</TableBodyCell>
			<TableBodyCell>
                {#if pin.active == true}
                <Checkbox checked disabled/>
                {:else}
                <Checkbox disabled/>
                {/if}
			</TableBodyCell>
		</TableBodyRow>
        {/each}
	</TableBody>
</Table>
