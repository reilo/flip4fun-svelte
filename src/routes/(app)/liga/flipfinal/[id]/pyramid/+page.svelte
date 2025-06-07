<script>
	import { innerWidth, innerHeight } from 'svelte/reactivity/window';
	import { calcStrength, calcInitialLevels, calcFinalResults } from '$lib/TourUtil';
	import { getPyramidLayout, getPyramidLayoutEx } from '$lib/PlayerUtil';

	let { data } = $props();

	let tournament = $derived(data.tournament);
	let round = $derived(data.round);
	let frames = $derived(data.frames);

	const clickAreas = [];

	const hOffset = 120;

	let hsize = $derived(Math.min(1280, innerWidth.current));
	let vsize = $derived(innerHeight.current * 0.8);

	const drawPyramid = () => {
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

		const colorLightGray = '#eeeeee';
		const colorDarkGray = '#dddddd';
		const colorLightGreen = '#ddeedd';
		const colorDarkGreen = '#ccddcc';
		const colorText = 'black';

		let x = 0,
			y = 0;

		const interval = setInterval(() => {
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

			clickAreas.splice(0, clickAreas.length);

			usedPlayers.forEach((player, i) => {
				x = hOffset + xpos[i];
				y = ypos[i];
				let img = new Image();
				img.src = imageBaseUrl + player + imageExtension;
				ctx.globalAlpha = activePlayers.includes(player) ? 1.0 : 0.2;
				ctx.drawImage(img, x, y, imageWidth, imageHeight);
				clickAreas.push({ player: player, x: x, y: y, w: imageWidth, h: imageHeight });
			});
		}, 500);
		setTimeout(() => {
			clearInterval(interval);
		}, 1500);
	};

	$effect(() => {
		drawPyramid();
	});
</script>

<div>
	<canvas id="myCanvas" width={hsize} height={vsize}></canvas>
</div>
