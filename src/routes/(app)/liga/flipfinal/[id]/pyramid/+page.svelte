<script>
	import { innerWidth, innerHeight } from 'svelte/reactivity/window';
	import { calcStrength, calcInitialLevels, calcFinalResults, mapTourStatus } from '$lib/TourUtil';
	import { getPyramidLayout, getPyramidLayoutEx } from '$lib/PlayerUtil';
	import { Card, Badge } from 'flowbite-svelte';

	let { data } = $props();

	let tournament = $derived(data.tournament);
	let round = $derived(data.round);
	let frames = $derived(data.frames);

	const hOffset = 120;

	let hsize = $derived(Math.min(1280, innerWidth.current));
	let vsize = $derived(innerHeight.current * 0.8);

	let isDark = $state(document.documentElement.classList.contains('dark'));

	$effect(() => {
		const observer = new MutationObserver(() => {
			isDark = document.documentElement.classList.contains('dark');
		});
		observer.observe(document.documentElement, { attributeFilter: ['class'] });
		return () => observer.disconnect();
	});

	const drawPyramid = async (isDark) => {
		const canvas = document.getElementById('myCanvas');
		const ctx = canvas.getContext('2d');

		const imageBaseUrl = '/photos/players/';
		const imageExtension = '.jpg';

		const totalRows = calcStrength(1, tournament.players.length);
		const rows = [];
		let ranking;
		if (round) {
			ranking = round.status === 'Completed' ? round.results.rankFinal : round.settings.rankInit;
			ranking.forEach((rank) => {
				rows.unshift(rank.players.length);
			});
		}

		const layout = round
			? getPyramidLayoutEx(rows, hsize - hOffset, vsize, 1.33)
			: getPyramidLayout(totalRows, hsize - hOffset, vsize, 1.33);
		const imageHeight = layout.imageHeight;
		const imageWidth = layout.imageWidth;
		const xpos = layout.xpos;
		const ypos = layout.ypos;
		const rpos = layout.rpos;

		const usedPlayers = [];
		if (round) {
			for (let idx = ranking.length - 1; idx >= 0; --idx) {
				ranking[idx].players.forEach((player) => {
					usedPlayers.push(player.id);
				});
			}
		} else {
			usedPlayers.push(...tournament.players);
		}

		const activePlayers = round
			? round.players
			: tournament.players.filter(
					(player) => !tournament.settings.inactivePlayers.includes(player)
				);

		const playingLevels = round && round.status !== 'Completed' ? round.settings.playingLevels : [];

		const winners = [];
		if (round) {
			const results = calcFinalResults(round, frames);
			results.levelResults.forEach((levelResult) => {
				if (levelResult.matches == 2) {
					winners.push(levelResult.players[0].id);
				}
			});
		}

		const colorLightGray  = isDark ? '#374151' : '#eeeeee';
		const colorDarkGray   = isDark ? '#1f2937' : '#dddddd';
		const colorLightGreen = isDark ? '#14532d' : '#ddeedd';
		const colorDarkGreen  = isDark ? '#166534' : '#ccddcc';
		const colorText       = isDark ? '#e5e7eb' : 'black';
		const colorFrame      = isDark ? '#4ade80' : '#0a4f29';

		let x = 0,
			y = 0;

		const images = await Promise.all(
			usedPlayers.map(
				(player) =>
					new Promise((resolve) => {
						const img = new Image();
						img.onload = () => resolve({ player, img });
						img.onerror = () => resolve({ player, img });
						img.src = imageBaseUrl + player + imageExtension;
					})
			)
		);

		ctx.clearRect(0, 0, hsize, vsize);
		let alternate = false;
		ctx.font = imageHeight / 1.5 + 'px Georgia';

		for (let idx = 0; idx < totalRows; ++idx) {
			ctx.globalAlpha = 1.0;
			if (playingLevels.includes(totalRows - idx)) {
				ctx.fillStyle = alternate ? colorDarkGreen : colorLightGreen;
			} else {
				ctx.fillStyle = alternate ? colorDarkGray : colorLightGray;
			}
			alternate = !alternate;
			ctx.fillRect(0, rpos[idx], hsize, imageHeight);
			ctx.fillStyle = colorText;
			ctx.fillText((totalRows - idx).toString(), 3, rpos[idx] + imageHeight - 20);
		}

		images.forEach(({ player, img }, i) => {
			x = hOffset + xpos[i];
			y = ypos[i];
			const delta = 6;
			ctx.globalAlpha = activePlayers.includes(player) ? 1.0 : 0.2;
			ctx.drawImage(img, x, y, imageWidth, imageHeight);
			if (tournament.status === 'Active' && winners.includes(player)) {
				ctx.strokeStyle = colorFrame;
				ctx.lineWidth = delta;
				ctx.beginPath();
				ctx.rect(x + delta / 2, y + delta / 2, imageWidth - delta, imageHeight - delta);
				ctx.stroke();
			}
		});
	};

	$effect(() => {
		drawPyramid(isDark);
	});
</script>

<div class="space-y-4">
	<Card class="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 border-blue-200 dark:border-blue-700 w-full !p-3">
		<div class="space-y-2">
			<div class="flex items-center gap-3">
				<span class="text-lg font-bold text-gray-800 dark:text-white">{tournament.name}</span>
				<Badge color={tournament.status === 'Planned' ? 'yellow' : tournament.status === 'Active' ? 'green' : 'blue'}>{mapTourStatus(tournament.status)}</Badge>
			</div>
			{#if round}
				<hr class="border-blue-200 dark:border-blue-700" />
				<div class="flex items-center gap-3">
					<span class="text-sm text-gray-600 dark:text-gray-300"><span class="font-semibold">Runde</span> {round.rid}</span>
					<Badge color={round.status === 'Active' ? 'green' : 'blue'}>{mapTourStatus(round.status)}</Badge>
				</div>
			{/if}
		</div>
	</Card>

	<div>
		<canvas id="myCanvas" width={hsize} height={vsize}></canvas>
	</div>
</div>
