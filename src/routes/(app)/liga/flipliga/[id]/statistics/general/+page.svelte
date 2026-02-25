<script>
	import { Heading } from 'flowbite-svelte';
	import { Card, Listgroup, Avatar } from 'flowbite-svelte';
	import { mapDate } from '$lib/TypeUtil';
	import { getPinName } from '$lib/PinUtil';
	import { sortPlayerIDs } from '$lib/PlayerUtil';
	import { getPlayerName as _getPlayerName } from '$lib/PlayerUtil';

	let { data } = $props();

	const rounds = data.rounds;
	const allPlayers = data.players;
	const tourPlayers = data.tournament.players;
	sortPlayerIDs(tourPlayers, allPlayers);

	let countMatches = $state(0);
	let countSets = $state(0);
	let pinActivity = $state([]);
	let roundActivity = $state([]);
	let playerActivity = $state([]);

	const initData = () => {
		countMatches = 0;
		countSets = 0;
		pinActivity = [];
		data.pins.forEach((pin) => {
			pinActivity.push({ id: pin.id, manu: pin.manu.toLowerCase(), count: 0 });
		});
		roundActivity = [];
		playerActivity = [];
		data.tournament.players.forEach((player) => {
			playerActivity.push({ id: player, count: 0 });
		});

		rounds.forEach((round, i) => {
			countMatches += round.matches.length;
			roundActivity.push({ num: i + 1, date: round.created, count: round.matches.length });
			round.matches.forEach((match) => {
				countSets += match.score1 + match.score2;
				pinActivity[pinActivity.findIndex((pin) => pin.id === match.pin)].count++;
				playerActivity[playerActivity.findIndex((player) => player.id === match.player1)].count++;
				playerActivity[playerActivity.findIndex((player) => player.id === match.player2)].count++;
			});
		});
		pinActivity.sort((a, b) => (a.count < b.count ? 1 : b.count < a.count ? -1 : 0));
		playerActivity.sort((a, b) => (a.count < b.count ? 1 : b.count < a.count ? -1 : 0));
		roundActivity.sort((a, b) => (a.count < b.count ? 1 : b.count < a.count ? -1 : 0));

		if (pinActivity.length > 5) {
			pinActivity.splice(5);
		}
		if (playerActivity.length > 5) {
			playerActivity.splice(5);
		}
		if (roundActivity.length > 5) {
			roundActivity.splice(5);
		}
	};

	const getPlayerName = (player, short) => {
		return _getPlayerName(player, allPlayers, short);
	};

	initData();
</script>

<Heading tag="h5" class="mb-3"
	>Bisher wurden {countMatches} Matches in {countSets} Sätzen gespielt!</Heading
>

<div class="flex flex-1 flex-col md:flex-row justify-center content-center gap-3">

	<div>
		<Card padding="xl" size="md" class="mb-3">
			<div class="flex justify-between items-center mb-4">
				<h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">
					Aktivste Spieler
				</h5>
			</div>
			<Listgroup items={playerActivity} let:item class="border-0 dark:bg-transparent!">
				<div class="flex items-center space-x-4 rtl:space-x-reverse">
					<Avatar src={'/photos/players/' + item.id + '.jpg'} />
					<div class="flex-1 min-w-0">
						<p class="text-sm font-medium text-gray-900 truncate dark:text-white">
							{getPlayerName(item.id)}
						</p>
					</div>
					<div
						class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white"
					>
						{item.count} Matches
					</div>
				</div>
			</Listgroup>
		</Card>
	</div>

	<div>
		<Card padding="xl" size="md" class="mb-3">
			<div class="flex justify-between items-center mb-4">
				<h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">
					Aktivste Spieltage
				</h5>
			</div>
			<Listgroup items={roundActivity} let:item class="border-0 dark:bg-transparent!">
				<div class="flex items-center space-x-4 rtl:space-x-reverse">
					<Avatar src={'/photos/bumper.jpg'} />
					<div class="flex-1 min-w-0">
						<p class="text-sm font-medium text-gray-900 truncate dark:text-white">
							Spieltag {item.num} ({mapDate(item.date)})
						</p>
					</div>
					<div
						class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white"
					>
						{item.count} Matches
					</div>
				</div>
			</Listgroup>
		</Card>
	</div>
</div>
