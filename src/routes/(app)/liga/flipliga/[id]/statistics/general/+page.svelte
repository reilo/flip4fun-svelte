<script>
	import { Heading } from 'flowbite-svelte';
	import { getPlayerName as _getPlayerName } from '$lib/PlayerUtil';

	let { data } = $props();

	const rounds = data.rounds;
	const allPlayers = data.players;

	const countMatches = rounds.reduce((s, r) => s + r.matches.length, 0);
	const countSets = rounds.reduce((s, r) => r.matches.reduce((s2, m) => s2 + m.score1 + m.score2, s), 0);

	// chronological chart data (all rounds, unsorted)
	const roundChartData = [...rounds]
		.sort((a, b) => a.rid - b.rid)
		.map((r) => ({ num: r.rid, count: r.matches.length }));
	const maxChartCount = Math.max(...roundChartData.map((r) => r.count), 1);
	const yMax = Math.ceil(maxChartCount / 10) * 10 || 10;

	// SVG layout for rounds chart
	const svgW = 1200, svgH = 420;
	const padL = 60, padR = 24, padT = 24, padB = 70;
	const chartW = svgW - padL - padR;
	const chartH = svgH - padT - padB;
	const slotW = roundChartData.length > 0 ? chartW / roundChartData.length : chartW;
	const barGap = Math.max(3, slotW * 0.15);
	const barW = slotW - barGap;
	const getBarX = (i) => padL + i * slotW + barGap / 2;
	const getBarH = (c) => (c / yMax) * chartH;
	const getBarY = (c) => padT + chartH - getBarH(c);
	const yTicks = Array.from({ length: yMax / 10 + 1 }, (_, i) => i * 10);

	// player chart data (all players, sorted by match count desc)
	const playerChartData = (() => {
		const map = {};
		data.tournament.players.forEach((p) => (map[p] = 0));
		rounds.forEach((round) => {
			round.matches.forEach((match) => {
				if (map[match.player1] !== undefined) map[match.player1]++;
				if (map[match.player2] !== undefined) map[match.player2]++;
			});
		});
		return Object.entries(map)
			.map(([id, count]) => ({ id, count, name: _getPlayerName(id, allPlayers, true) }))
			.sort((a, b) => b.count - a.count);
	})();
	const pxMax = Math.ceil(Math.max(...playerChartData.map((p) => p.count), 1) / 10) * 10 || 10;
	const pxTicks = Array.from({ length: pxMax / 10 + 1 }, (_, i) => i * 10);

	// SVG layout for player chart
	const psvgPadL = 150, psvgPadR = 60, psvgPadT = 24, psvgPadB = 40;
	const psvgW = 1200;
	const rowH = 38;
	const psvgH = psvgPadT + playerChartData.length * rowH + psvgPadB;
	const pchartW = psvgW - psvgPadL - psvgPadR;
	const getBarLen = (c) => (c / pxMax) * pchartW;
	const getRowY = (i) => psvgPadT + i * rowH;
</script>

<Heading tag="h5" class="mb-3"
	>Bisher wurden {countMatches} Matches in {countSets} Sätzen gespielt!</Heading
>

{#if roundChartData.length > 0}
	<div class="mt-2">
		<h5 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Matches pro Spieltag</h5>
		<svg viewBox="0 0 {svgW} {svgH}" class="w-full" style="min-height: 600px; height: auto;">
			<!-- grid + Y labels -->
			{#each yTicks as tick}
				{@const yp = padT + chartH - (tick / yMax) * chartH}
				<line x1={padL} y1={yp} x2={padL + chartW} y2={yp} stroke="currentColor" stroke-width="0.5" class="text-gray-300 dark:text-gray-600" />
				<text x={padL - 6} y={yp + 6} text-anchor="end" font-size="15" class="fill-gray-500 dark:fill-gray-400">{tick}</text>
			{/each}
			<!-- bars -->
			{#each roundChartData as rd, i}
				{@const bx = getBarX(i)}
				{@const bh = getBarH(rd.count)}
				{@const by = getBarY(rd.count)}
				<rect x={bx} y={by} width={barW} height={bh} rx="3" class="fill-blue-500 dark:fill-blue-400" />
				<text x={bx + barW / 2} y={padT + chartH + 26} text-anchor="middle" font-size="15" class="fill-gray-600 dark:fill-gray-400">{rd.num}</text>
				{#if bh > 24}
					<text x={bx + barW / 2} y={by + bh - 6} text-anchor="middle" font-size="15" class="fill-white">{rd.count}</text>
				{/if}
			{/each}
			<!-- axes -->
			<line x1={padL} y1={padT} x2={padL} y2={padT + chartH} stroke="currentColor" stroke-width="2" class="text-gray-400 dark:text-gray-500" />
			<line x1={padL} y1={padT + chartH} x2={padL + chartW} y2={padT + chartH} stroke="currentColor" stroke-width="2" class="text-gray-400 dark:text-gray-500" />
			<!-- X axis label -->
			<text x={padL + chartW / 2} y={svgH - 6} text-anchor="middle" font-size="17" class="fill-gray-500 dark:fill-gray-400">Spieltag</text>
		</svg>
	</div>
{/if}

{#if playerChartData.length > 0}
	<div class="mt-6">
		<h5 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Matches pro Spieler</h5>
		<svg viewBox="0 0 {psvgW} {psvgH}" class="w-full" style="min-height: 600px; height: auto;">
			<!-- grid + X labels -->
			{#each pxTicks as tick}
				{@const xp = psvgPadL + (tick / pxMax) * pchartW}
				<line x1={xp} y1={psvgPadT} x2={xp} y2={psvgPadT + playerChartData.length * rowH} stroke="currentColor" stroke-width="0.5" class="text-gray-300 dark:text-gray-600" />
				<text x={xp} y={psvgPadT + playerChartData.length * rowH + 24} text-anchor="middle" font-size="15" class="fill-gray-500 dark:fill-gray-400">{tick}</text>
			{/each}
			<!-- bars -->
			{#each playerChartData as pd, i}
				{@const ry = getRowY(i)}
				{@const bl = getBarLen(pd.count)}
				<text x={psvgPadL - 8} y={ry + rowH * 0.72} text-anchor="end" font-size="15" class="fill-gray-700 dark:fill-gray-300">{pd.name}</text>
				<rect x={psvgPadL} y={ry + 4} width={bl} height={rowH - 8} rx="3" class="fill-blue-500 dark:fill-blue-400" />
				{#if bl > 36}
					<text x={psvgPadL + bl - 6} y={ry + rowH * 0.72} text-anchor="end" font-size="15" class="fill-white">{pd.count}</text>
				{:else}
					<text x={psvgPadL + bl + 6} y={ry + rowH * 0.72} text-anchor="start" font-size="15" class="fill-gray-600 dark:fill-gray-400">{pd.count}</text>
				{/if}
			{/each}
			<!-- axes -->
			<line x1={psvgPadL} y1={psvgPadT} x2={psvgPadL} y2={psvgPadT + playerChartData.length * rowH} stroke="currentColor" stroke-width="2" class="text-gray-400 dark:text-gray-500" />
			<line x1={psvgPadL} y1={psvgPadT + playerChartData.length * rowH} x2={psvgPadL + pchartW} y2={psvgPadT + playerChartData.length * rowH} stroke="currentColor" stroke-width="2" class="text-gray-400 dark:text-gray-500" />
		</svg>
	</div>
{/if}
