<script>
	import { innerWidth, innerHeight } from 'svelte/reactivity/window';
	import { calcStrength, calcInitialLevels, calcFinalResults, mapTourStatus } from '$lib/TourUtil';
	import { getPyramidLayout, getPyramidLayoutEx } from '$lib/PlayerUtil';
	import { Card, Badge } from 'flowbite-svelte';
	import TourBreadcrumb from '$lib/components/TourBreadcrumb.svelte';

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
		const colorRowNum     = isDark ? '#6b7280' : '#aaaaaa';

		let x = 0,
			y = 0;

		const images = await Promise.all(
			usedPlayers.map(
				(player) =>
					new Promise((resolve) => {
						const img = new Image();
						img.onload = () => resolve({ player, img, loaded: true });
						img.onerror = () => resolve({ player, img, loaded: false });
						img.src = imageBaseUrl + player + imageExtension;
					})
			)
		);

		ctx.clearRect(0, 0, hsize, vsize);
		let alternate = false;
		const rowNumFontSize = Math.round(imageHeight * 0.4);
		ctx.font = rowNumFontSize + 'px Georgia';

		for (let idx = 0; idx < totalRows; ++idx) {
			ctx.globalAlpha = 1.0;
			if (playingLevels.includes(totalRows - idx)) {
				ctx.fillStyle = alternate ? colorDarkGreen : colorLightGreen;
			} else {
				ctx.fillStyle = alternate ? colorDarkGray : colorLightGray;
			}
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

		images.forEach(({ player, img, loaded }, i) => {
			x = hOffset + xpos[i];
			y = ypos[i];
			const delta = 6;
			ctx.globalAlpha = activePlayers.includes(player) ? 1.0 : 0.2;
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
				const label = player.toString();
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
			if (tournament.status === 'Active' && winners.includes(player)) {
				ctx.strokeStyle = colorFrame;
				ctx.lineWidth = delta;
				ctx.beginPath();
				ctx.moveTo(x + radius + delta / 2, y + delta / 2);
				ctx.lineTo(x + imageWidth - radius - delta / 2, y + delta / 2);
				ctx.arcTo(x + imageWidth - delta / 2, y + delta / 2, x + imageWidth - delta / 2, y + radius + delta / 2, radius);
				ctx.lineTo(x + imageWidth - delta / 2, y + imageHeight - radius - delta / 2);
				ctx.arcTo(x + imageWidth - delta / 2, y + imageHeight - delta / 2, x + imageWidth - radius - delta / 2, y + imageHeight - delta / 2, radius);
				ctx.lineTo(x + radius + delta / 2, y + imageHeight - delta / 2);
				ctx.arcTo(x + delta / 2, y + imageHeight - delta / 2, x + delta / 2, y + imageHeight - radius - delta / 2, radius);
				ctx.lineTo(x + delta / 2, y + radius + delta / 2);
				ctx.arcTo(x + delta / 2, y + delta / 2, x + radius + delta / 2, y + delta / 2, radius);
				ctx.closePath();
				ctx.stroke();
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
		<p class="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">Spielstärken</p>
		<canvas id="myCanvas" width={hsize} height={vsize}></canvas>
	</div>
</div>
