<script>
	import { calcRanking as _calcRanking } from '$lib/MatchUtil';

	let { data } = $props();

	const round = $state(data.round);
	const players = $state(data.players);
	const tournament = $state(data.tournament);

	const images = [];

	$effect(() => {
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

		const imageBaseUrl = import.meta.env.VITE_IMAGE_DIR;
		const imageExtension = '.jpg';
		const imageWidth = 92;
		const imageHeigth = imageWidth * 1.33;
		const imageHSpacing = 48;
		const imageVSpacing = 10;
		const totalRows = 8;
		const colorLightGray = '#eeeeee';
		const colorDarkGray = '#dddddd';
		const colorText = 'black';
		const delta = 3;

		let x = 0,
			y = 0;

		setTimeout(() => {
			let row = 1;
			let rowIndex = 1;
            y = delta;

			while (images.length) {
				images.shift();
			}

			ctx.clearRect(0, 0, 1240, 1200);

			ctx.fillStyle = colorDarkGray;
			ctx.fillRect(0, y - delta, 1240, imageHeigth + 2 * delta);

			ctx.font = imageHeigth/2 + 'px Georgia';

			ranking.forEach((rank) => {
				x = ((totalRows - row) / 2 + rowIndex) * (imageWidth + imageHSpacing);

				if (rowIndex === 1) {
					ctx.fillStyle = colorText;
					ctx.fillText((totalRows -row + 1).toString(), imageHSpacing, y + imageHeigth/1.75);
				}

				let img = new Image();
				img.src = imageBaseUrl + rank.player + imageExtension;
				console.log(img.src);
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
			});
		});
	});
</script>

<div>
	<canvas id="myCanvas" width="1240" height="1200"></canvas>
</div>
