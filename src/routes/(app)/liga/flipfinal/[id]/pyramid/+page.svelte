<script>
	import { innerWidth, innerHeight } from 'svelte/reactivity/window';
	import { calcStrength, calcInitialLevels } from '$lib/TourUtil';

	let { data } = $props();

	let tournament = $derived(data.tournament);
	let round = $derived(data.round);

	let hsize = $derived(Math.min(1280, innerWidth.current));
	let vsize = $derived(innerHeight.current);

	const images = [];

	const drawPyramid = () => {
		const canvas = document.getElementById('myCanvas');
		const ctx = canvas.getContext('2d');

		const imageBaseUrl = '/photos/players/';
		const imageExtension = '.jpg';
		const totalRows = calcStrength(1, tournament.players.length);
		const hOffset = 3.0;
		const vOffset = 0.0;
		const imageVSpacing = 3.0;
		const imageHeigth = vsize / totalRows - (imageVSpacing + 1) - 2 * vOffset;
		const imageWidth = imageHeigth / 1.33;
		const imageHSpacing = (hsize - (totalRows + 1) * imageWidth - 2 * hOffset) / totalRows;
		const colorLightGray = '#eeeeee';
		const colorDarkGray = '#dddddd';
		const colorText = 'black';

		let x = 0,
			y = 0;

		const interval = setInterval(() => {
			let row = 1;
			let rowIndex = 1;
			y = vOffset;

			while (images.length) {
				images.shift();
			}

			ctx.clearRect(0, 0, hsize, vsize);

			ctx.fillStyle = colorDarkGray;
			ctx.fillRect(0, y, hsize, imageHeigth);

			ctx.font = imageHeigth / 2 + 'px Georgia';

			let rankInit = round
				? round.settings.rankInit
				: calcInitialLevels(tournament.players, tournament.settings.maxStartBonus);
			const activePlayers = round
				? round.players
				: tournament.players.filter(
						(player) => !tournament.settings.inactivePlayers.includes(player)
					);

			for (let idx = rankInit.length - 1; idx >= 0; idx--) {
				const level = rankInit[idx];
				level.players.forEach((player, i) => {
					rowIndex = i + 1;
					x = ((totalRows - level.players.length) / 2 + rowIndex) * (imageWidth + imageHSpacing);

					if (rowIndex === 1) {
						ctx.fillStyle = colorText;
						ctx.fillText((totalRows - row + 1).toString(), hOffset, y + imageHeigth / 1.75);
					}

					let img = new Image();
					img.src = imageBaseUrl + player.id + imageExtension;
					images.push(img);
					ctx.globalAlpha = activePlayers.includes(player.id) ? 1.0 : 0.2;
					ctx.drawImage(images[images.length - 1], x, y, imageWidth, imageHeigth);
					ctx.globalAlpha = 1.0;
				});
				row++;
				y += imageHeigth + imageVSpacing;
				ctx.fillStyle = row % 2 == 0 ? colorLightGray : colorDarkGray;
				ctx.fillRect(0, y, hsize, imageHeigth);
			}
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
