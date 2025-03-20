<script>
	import { Input, NumberInput, Label } from 'flowbite-svelte';

	let baselineValue = $state(50);
	let challengeSameValue = $state(1);
	let matchBonusValue = $state(1);
	let minMatchesValue = $state(1);
	let minRoundValue = $state(1);
</script>

<form>
	<div>
		<Label>
			<span>Basispunkte für jeden Spieler zu Saisonbeginn</span>
			<NumberInput disabled min="30" max="60" bind:value={baselineValue} />
		</Label>
		<br />
		<Label>
			<span>Wie oft darf der gleiche Gegner je Saison gefordert werden</span>
			<NumberInput disabled min="1" max="3" bind:value={challengeSameValue} />
		</Label>
		<br />

		<Label>
			<span>Bonuspunkte für jedes absolvierte Match</span>
			<NumberInput disabled min="0" max="3" bind:value={matchBonusValue} />
		</Label>
		<br />

		<Label>
			<span>Wie viele Matches muss ein Spieler pro Spieltag spielen?</span>
			<NumberInput disabled min="1" max="3" bind:value={minMatchesValue} />
		</Label>
		<br />

		<Label>
			<span>Ab welcher Runde erfolgen Matchabzüge?</span>
			<NumberInput disabled min="3" max="8" bind:value={minRoundValue} />
		</Label>
	</div>
</form>
