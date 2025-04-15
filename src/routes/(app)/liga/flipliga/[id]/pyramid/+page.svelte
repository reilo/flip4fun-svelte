<script>
	import { Button } from 'flowbite-svelte';
	import { innerWidth } from 'svelte/reactivity/window';
	import { calcRanking as _calcRanking } from '$lib/MatchUtil';

	let { data } = $props();

	let hsize = $derived(innerWidth.current);
	let vsize = $derived(innerWidth.current * 0.9);

	const round = $state(data.round);
	const players = $state(data.players);
	const tournament = $state(data.tournament);

	const images = [];

	const drawPyramid = () => {
		let ranking = [];
		if (round) {
			if (round.status === 'Completed') {
				ranking = round.results.rankFinal;
			} else {
				ranking = _calcRanking(
					round.rid,
					round.settings.rankInit,
					round.matches,
					tournament.settings
				);
			}
		}

		const canvas = document.getElementById('myCanvas');
		const ctx = canvas.getContext('2d');

		let index = 0;
		index = hsize <= 640 ? 0 : hsize <= 800 ? 1 : hsize <= 1024 ? 2 : hsize <= 1280 ? 3 : 4;

		const imageBaseUrl = '/photos/';
		const imageExtension = '.jpg';
		const imageWidth = [36, 48, 60, 78, 96][index];
		const imageHeigth = imageWidth * 1.33;
		const imageHSpacing = [18, 24, 30, 39, 48][index];
		const imageVSpacing = [3, 5, 6, 8, 10][index];
		const totalRows = 8;
		const colorLightGray = '#eeeeee';
		const colorDarkGray = '#dddddd';
		const colorText = 'black';
		const delta = [2, 2, 3, 3, 3][index];

		let x = 0,
			y = 0;

		const interval = setInterval(() => {
			let row = 1;
			let rowIndex = 1;
			y = delta;

			while (images.length) {
				images.shift();
			}

			ctx.clearRect(0, 0, hsize, vsize);

			ctx.fillStyle = colorDarkGray;
			ctx.fillRect(0, y - delta, hsize, imageHeigth + 2 * delta);

			ctx.font = imageHeigth / 2 + 'px Georgia';

			ranking.forEach((rank) => {
				x = ((totalRows - row) / 2 + rowIndex) * (imageWidth + imageHSpacing);

				if (rowIndex === 1) {
					ctx.fillStyle = colorText;
					ctx.fillText((totalRows - row + 1).toString(), imageHSpacing, y + imageHeigth / 1.75);
				}

				let img = new Image();
				img.src = imageBaseUrl + rank.player + imageExtension;
				images.push(img);
				ctx.drawImage(images[images.length - 1], x, y, imageWidth, imageHeigth);

				if (rowIndex === row) {
					row++;
					rowIndex = 1;
					y += imageHeigth + imageVSpacing;
					ctx.fillStyle = row % 2 == 0 ? colorLightGray : colorDarkGray;
					ctx.fillRect(0, y - delta, 1240, imageHeigth + 2 * delta);
				} else {
					rowIndex++;
				}
			}, 1000);
		});
		setTimeout(() => {
			clearInterval(interval);
		}, 3000);
	};

	$effect(() => {
		drawPyramid();
	});
</script>

<div>
	<Button class="w-fit" on:click={() => drawPyramid()}>Neu laden</Button>
	<br /><br />
	<canvas id="myCanvas" width={hsize} height={vsize}></canvas>
</div>
