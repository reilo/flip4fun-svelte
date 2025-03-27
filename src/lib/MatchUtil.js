export function CalcPoints(match, strength1, strength2) {

    let result1, result2;

    if (match.score1 > match.score2) {
        result1 = strength2 * (1 - match.score2 / match.score1);
        result2 = -Math.min(strength2, Math.abs(strength1 - strength2)) * (1 - match.score2 / match.score1);
    } else {
        result1 = -Math.min(strength1, Math.abs(strength1 - strength2)) * (1 - match.score1 / match.score2);
        result2 = strength1 * (1 - match.score1 / match.score2);
    }

    return { player1: result1, player2: result2 }
}

export function CalcRanking(rankInit, matches, matchBonus) {

    function getStrength(id) {
        const player = rankInit.find((item) => item.player === id);
        return player.strength;
    };

    let ranking = [];

    rankInit.forEach((item) => {
        ranking.push({ player: item.player, points: item.points });
    });
    matches.forEach((match) => {
        const result = CalcPoints(match, getStrength(match.player1), getStrength(match.player2));
        const index1 = ranking.findIndex((item) => item.player === match.player1);
        ranking[index1].points += result.player1 + matchBonus;
        const index2 = ranking.findIndex((item) => item.player === match.player2);
        ranking[index2].points += result.player2 + matchBonus;
    });

    ranking.sort((a, b) => (a.points < b.points ? 1 : b.points < a.points ? -1 : 0));

    let ranking2 = [];
    ranking.forEach((item, i) => {
        const j = rankInit.findIndex((item2) => item.player === item2.player);
        ranking2.push({ player: item.player, points: item.points, rankChange: j - i })
    });
    return ranking2;
}