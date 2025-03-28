export function calcPoints(match, strength1, strength2) {

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

export function calcRanking(roundNum, rankInit, matches, settings) {

    function getStrength(id) {
        const player = rankInit.find((item) => item.player === id);
        return player.strength;
    };

    let ranking = [];

    rankInit.forEach((item) => {
        ranking.push({ player: item.player, matches: item.matches, points: item.points, bonus: item.bonus, penalty: item.penalty });
    });

    matches.forEach((match) => {
        const result = calcPoints(match, getStrength(match.player1), getStrength(match.player2));
        const index1 = ranking.findIndex((item) => item.player === match.player1);
        ranking[index1].points += result.player1 + settings.matchBonus;
        ranking[index1].matches += 1;
        ranking[index1].bonus += 1;
        const index2 = ranking.findIndex((item) => item.player === match.player2);
        ranking[index2].points += result.player2 + settings.matchBonus;
        ranking[index2].matches += 1;
        ranking[index2].bonus += 1;
    });

    if (roundNum >= settings.minRound) {
        ranking.forEach((item, i) => {
            if (item.matches < settings.minMatches * roundNum) {
                ranking[i].points -= 1;
                ranking[i].penalty += 1;
            }
        })
    };

    ranking.sort((a, b) => (a.points < b.points ? 1 : b.points < a.points ? -1 : 0));

    let ranking2 = [];
    ranking.forEach((item, i) => {
        const j = rankInit.findIndex((item2) => item.player === item2.player);
        ranking2.push({ player: item.player, matches: item.matches, points: item.points, bonus: item.bonus, penalty: item.penalty, rankChange: j - i })
    });
    return ranking2;
}