<script>
	import { P, Heading } from 'flowbite-svelte';
	import { innerWidth, innerHeight } from 'svelte/reactivity/window';
	import { goto } from '$app/navigation';
	import { calcRanking as _calcRanking } from '$lib/MatchUtil';
	import { calcStrength } from '$lib/TourUtil';
	import { getPyramidLayout } from '$lib/PlayerUtil';

	let { data } = $props();

	const hOffset = 120;

	let hsize = $derived(Math.min(1280, innerWidth.current));
	let vsize = $derived(innerHeight.current * 0.8);

	const round = $state(data.round);
	const tournament = $state(data.tournament);

	const clickAreas = [];

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
		const layout = getPyramidLayout(totalRows, hsize - hOffset, vsize, 1.33);
		const imageHeight = layout.imageHeight;
		const imageWidth = layout.imageWidth;
		const xpos = layout.xpos;
		const ypos = layout.ypos;
		const rpos = layout.rpos;
		const colorLightGray = '#eeeeee';
		const colorDarkGray = '#dddddd';
		const colorText = 'black';

		let x = 0,
			y = 0;

		const interval = setInterval(() => {
			ctx.clearRect(0, 0, hsize, vsize);
			let alternate = false;
			ctx.font = imageHeight / 1.5 + 'px Georgia';

			for (let idx = 0; idx < totalRows; ++idx) {
				ctx.fillStyle = alternate ? colorDarkGray : colorLightGray;
				alternate = !alternate;
				ctx.fillRect(0, rpos[idx], hsize, imageHeight);
				ctx.fillStyle = colorText;
				ctx.fillText((totalRows - idx).toString(), 3, rpos[idx] + imageHeight - 20);
			}

			clickAreas.splice(0, clickAreas.length);

			ranking.forEach((rank, i) => {
				x = hOffset + xpos[i];
				y = ypos[i];

				let img = new Image();
				img.src = imageBaseUrl + rank.player + imageExtension;
				ctx.drawImage(img, x, y, imageWidth, imageHeight);

				clickAreas.push({ player: rank.player, x: x, y: y, w: imageWidth, h: imageHeight });
			});
		}, 500);
		setTimeout(() => {
			clearInterval(interval);
		}, 1500);
	};

	const handleClick = (e) => {
		const x = parseInt(e.offsetX);
		const y = parseInt(e.offsetY);
		clickAreas.forEach((area) => {
			if (x >= area.x && x <= area.x + area.w && y > area.y && y <= area.y + area.h) {
				goto(
					'/liga/' + tournament.type + '/' + tournament.id + '/statistics?player=' + area.player
				);
				return;
			}
		});
	};

	$effect(() => {
		drawPyramid();
	});
</script>

<div>
	{#if round.status === 'Completed'}
		<Heading tag="h5">Spielstärken am Ende des Spieltags.</Heading>
	{:else}
		<Heading tag="h5">Spielstärken zu Beginn des Spieltags.</Heading>
	{/if}
	<P class="mb-3">Spielerfoto anklicken für Statistiken.</P>

	<canvas id="myCanvas" width={hsize} height={vsize} onmousedown={handleClick}></canvas>
</div>
