<script>
	import { Heading, P, Avatar } from 'flowbite-svelte';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Checkbox
	} from 'flowbite-svelte';

	export let data;
</script>

<div>
	<Heading tag="h5">Spieler aktiv oder inaktiv schalten</Heading>
	<P>Jede Änderung wird sofort gespeichert!</P>
	<br />

	<Table hoverable={true}>
		<TableHead>
			<TableHeadCell></TableHeadCell>
			<TableHeadCell>Name</TableHeadCell>
			<TableHeadCell>Aktiv</TableHeadCell>
		</TableHead>
		<TableBody tableBodyClass="divide-y">
			{#each data.players as player, i}
				<TableBodyRow>
					<TableBodyCell><Avatar src={player.photo} /></TableBodyCell>
					<TableBodyCell
						>{player.forename +
							' ' +
							player.surname +
							(player.shortname ? ' (' + player.shortname + ')' : '')}</TableBodyCell
					>
					<TableBodyCell>
						{#if player.active == true}
							<Checkbox checked />
						{:else}
							<Checkbox />
						{/if}
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</div>
