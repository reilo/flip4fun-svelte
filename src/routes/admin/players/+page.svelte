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

	async function updatePlayer(id, active) {
		const url = '/api/player/' + id + '?active=' + active.toString();
		const response = await fetch(url, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
		const player = await response.json();
		return player;
	}
</script>

<div>
	<Heading tag="h5">Spieler aktiv oder inaktiv schalten</Heading>
	<P>Jeder Klick wird sofort gespeichert!</P>
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
							<Checkbox checked on:change={() => updatePlayer(player.id, !player.active)} />
						{:else}
							<Checkbox on:change={() => updatePlayer(player.id, !player.active)} />
						{/if}
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</div>
