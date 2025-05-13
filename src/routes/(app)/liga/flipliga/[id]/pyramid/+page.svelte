<script>
	import { P } from 'flowbite-svelte';
	import { innerWidth, innerHeight } from 'svelte/reactivity/window';
	import { calcRanking as _calcRanking } from '$lib/MatchUtil';
	import { calcStrength } from '$lib/TourUtil';

	let { data } = $props();

	let hsize = $derived(Math.min(1280, innerWidth.current));
	let vsize = $derived(innerHeight.current);

	const round = $state(data.round);
	const tournament = $state(data.tournament);

	const drawPyramid = () => {
		let ranking = [];
		if (round) {
			if (round.status === 'Completed') {
				ranking = round.results.rankFinal;
			} else {
				ranking = round.settings.rankInit;
			}
		}

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

			ctx.clearRect(0, 0, hsize, vsize);

			ctx.fillStyle = colorDarkGray;
			ctx.fillRect(0, y, hsize, imageHeigth);

			ctx.font = imageHeigth / 2 + 'px Georgia';

			ranking.forEach((rank) => {
				x = ((totalRows - row) / 2 + rowIndex) * (imageWidth + imageHSpacing);

				if (rowIndex === 1) {
					ctx.fillStyle = colorText;
					ctx.fillText((totalRows - row + 1).toString(), hOffset, y + imageHeigth / 1.75);
				}

				let img = new Image();
				img.src = imageBaseUrl + rank.player + imageExtension;
				ctx.drawImage(img, x, y, imageWidth, imageHeigth);

				if (rowIndex === row) {
					row++;
					rowIndex = 1;
					y += imageHeigth + imageVSpacing;
					ctx.fillStyle = row % 2 == 0 ? colorLightGray : colorDarkGray;
					ctx.fillRect(0, y, hsize, imageHeigth);
				} else {
					rowIndex++;
				}
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
	{#if round.status === 'Completed'}
		<P class="mb-3">Spielstärken am Ende des Spieltags.</P>
	{:else}
		<P class="mb-3">Spielstärken zu Beginn des Spieltags.</P>
	{/if}

	<canvas id="myCanvas" width={hsize} height={vsize}></canvas>
</div>
