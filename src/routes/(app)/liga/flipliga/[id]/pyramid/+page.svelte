<script>
	import { Card, Badge } from 'flowbite-svelte';
	import TourBreadcrumb from '$lib/components/TourBreadcrumb.svelte';
	import { innerWidth, innerHeight } from 'svelte/reactivity/window';
	import { goto } from '$app/navigation';
	import { calcRanking as _calcRanking } from '$lib/MatchUtil';
	import { calcStrength, mapTourStatus } from '$lib/TourUtil';
	import { getPyramidLayout } from '$lib/PlayerUtil';

	let { data } = $props();

	const hOffset = 120;

	let hsize = $derived(Math.min(1280, innerWidth.current));
	let vsize = $derived(innerHeight.current * 0.8);

	const round = $derived(data.round);
	const tournament = $derived(data.tournament);

	const clickAreas = [];

	let isDark = $state(document.documentElement.classList.contains('dark'));

	$effect(() => {
		const observer = new MutationObserver(() => {
			isDark = document.documentElement.classList.contains('dark');
		});
		observer.observe(document.documentElement, { attributeFilter: ['class'] });
		return () => observer.disconnect();
	});

	const drawPyramid = async (isDark) => {
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
		const colorLightGray = isDark ? '#374151' : '#eeeeee';
		const colorDarkGray  = isDark ? '#1f2937' : '#dddddd';
		const colorText      = isDark ? '#e5e7eb' : 'black';
		const colorRowNum    = isDark ? '#6b7280' : '#aaaaaa';

		let x = 0,
			y = 0;

		clickAreas.splice(0, clickAreas.length);

		const images = await Promise.all(
			ranking.map(
				(rank) =>
					new Promise((resolve) => {
						const img = new Image();
						img.onload = () => resolve({ rank, img, loaded: true });
						img.onerror = () => resolve({ rank, img, loaded: false });
						img.src = imageBaseUrl + rank.player + imageExtension;
					})
			)
		);

		ctx.clearRect(0, 0, hsize, vsize);
		let alternate = false;
		const rowNumFontSize = Math.round(imageHeight * 0.4);
		ctx.font = rowNumFontSize + 'px Georgia';

		for (let idx = 0; idx < totalRows; ++idx) {
			ctx.fillStyle = alternate ? colorDarkGray : colorLightGray;
			alternate = !alternate;
			ctx.fillRect(0, rpos[idx], hsize, imageHeight);
			ctx.fillStyle = colorRowNum;
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillText((totalRows - idx).toString(), hOffset / 2, rpos[idx] + imageHeight / 2);
			ctx.textAlign = 'left';
			ctx.textBaseline = 'alphabetic';
		}

		ctx.globalAlpha = 1.0;
		ctx.strokeStyle = isDark ? '#4b5563' : '#d1d5db';
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(hOffset, 0);
		ctx.lineTo(hOffset, vsize);
		ctx.stroke();

		const radius = Math.max(3, imageWidth * 0.08);
		const roundedClipPath = (x, y, w, h, r) => {
			ctx.beginPath();
			ctx.moveTo(x + r, y);
			ctx.lineTo(x + w - r, y);
			ctx.arcTo(x + w, y, x + w, y + r, r);
			ctx.lineTo(x + w, y + h - r);
			ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
			ctx.lineTo(x + r, y + h);
			ctx.arcTo(x, y + h, x, y + h - r, r);
			ctx.lineTo(x, y + r);
			ctx.arcTo(x, y, x + r, y, r);
			ctx.closePath();
			ctx.clip();
		};

		images.forEach(({ rank, img, loaded }, i) => {
			x = hOffset + xpos[i];
			y = ypos[i];
			ctx.save();
			roundedClipPath(x, y, imageWidth, imageHeight, radius);
			if (loaded) {
				ctx.drawImage(img, x, y, imageWidth, imageHeight);
			} else {
				ctx.fillStyle = isDark ? '#4b5563' : '#cccccc';
				ctx.fillRect(x, y, imageWidth, imageHeight);
				ctx.fillStyle = colorText;
				const fontSize = Math.max(8, imageWidth / 6);
				ctx.font = fontSize + 'px Georgia';
				const label = rank.player.toString();
				const textWidth = ctx.measureText(label).width;
				ctx.fillText(label, x + (imageWidth - textWidth) / 2, y + imageHeight / 2 + fontSize / 3);
				ctx.font = rowNumFontSize + 'px Georgia';
			}
			ctx.restore();
			ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.10)';
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(x + radius, y);
			ctx.lineTo(x + imageWidth - radius, y);
			ctx.arcTo(x + imageWidth, y, x + imageWidth, y + radius, radius);
			ctx.lineTo(x + imageWidth, y + imageHeight - radius);
			ctx.arcTo(x + imageWidth, y + imageHeight, x + imageWidth - radius, y + imageHeight, radius);
			ctx.lineTo(x + radius, y + imageHeight);
			ctx.arcTo(x, y + imageHeight, x, y + imageHeight - radius, radius);
			ctx.lineTo(x, y + radius);
			ctx.arcTo(x, y, x + radius, y, radius);
			ctx.closePath();
			ctx.stroke();
			clickAreas.push({ player: rank.player, x: x, y: y, w: imageWidth, h: imageHeight });
		});
	};

	const handleMouseMove = (e) => {
		const x = parseInt(e.offsetX);
		const y = parseInt(e.offsetY);
		const hit = clickAreas.some(
			(area) => x >= area.x && x <= area.x + area.w && y > area.y && y <= area.y + area.h
		);
		e.target.style.cursor = hit ? 'pointer' : 'default';
	};

	const handleClick = (e) => {
		const x = parseInt(e.offsetX);
		const y = parseInt(e.offsetY);
		clickAreas.forEach((area) => {
			if (x >= area.x && x <= area.x + area.w && y > area.y && y <= area.y + area.h) {
				goto(
					'/liga/' + tournament.type + '/' + tournament.id + '/statistics/player?player=' + area.player
				);
				return;
			}
		});
	};

	$effect(() => {
		drawPyramid(isDark);
	});
</script>

<div class="space-y-4">
	<TourBreadcrumb {tournament} {round} />

	<div>
		<p class="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">
			{round.status === 'Completed' ? 'Spielstärken am Ende des Spieltags' : 'Spielstärken zu Beginn des Spieltags'}
		</p>
		<p class="text-sm text-gray-500 dark:text-gray-400 mb-3">Spielerfoto anklicken für Statistiken.</p>

		<canvas id="myCanvas" width={hsize} height={vsize} onmousemove={handleMouseMove} onmousedown={handleClick}></canvas>
	</div>
</div>
