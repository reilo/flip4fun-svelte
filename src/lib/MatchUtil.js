import { roundNumberForDB } from "./TypeUtil";

/**
 * Calculates match score depending on player strengths
 * @param {json} match - match record
 * @param {*} strength1 - player 1 strength
 * @param {*} strength2 - player 2 strength
 * @returns 
 */
export function calcPoints(match, strength1, strength2) {

    let result1, result2;

    if (match.score1 > match.score2) {
        result1 = strength2 * (1 - match.score2 / match.score1);
        result2 = -Math.min(strength2, Math.abs(strength1 - strength2)) * (1 - match.score2 / match.score1);
    } else {
        result1 = -Math.min(strength1, Math.abs(strength1 - strength2)) * (1 - match.score1 / match.score2);
        result2 = strength1 * (1 - match.score1 / match.score2);
    }

    return { player1: roundNumberForDB(result1), player2: roundNumberForDB(result2) }
}

/**
 * Calculates final ranking data for a completed round.
 * @param {int} roundNum - number of the completed round
 * @param {array} rankInit - initial ranking data at the beginning of the round. Array of
 *            -- player: player ID,
 *            -- matches: total count matches
 *            -- bonus: total match bonus
 *            -- points: total score
 *            -- mismatch: total missing matches
 *            -- penalty: total penalty points
 *            -- strength: player strength
 * @param {array} matches - all match records of the completed round
 * @param {json} settings - tournament settings
 * @returns   rankFinal - final ranking data after all matches of the round: Array of
 *            -- player: player ID
 *            -- matches: total count matches
 *            -- bonus: total match bonus
 *            -- points: total score
 *            -- mismatch: total missing matches
 *            -- penalty: total penalty points
 *            -- rankChange: difference of rank before and after round matches
 */
export function calcRanking(roundNum, rankInit, matches, settings) {

    function getStrength(id) {
        const player = rankInit.find((item) => item.player === id);
        return player.strength;
    };

    let ranking = [];

    // retrieve initial state before matches
    rankInit.forEach((item) => {
        ranking.push({
            player: item.player,
            matches: item.matches,
            points: item.points,
            bonus: item.bonus,
            mismatch: item.mismatch,
            penalty: item.penalty
        });
    });

    // calculate new scores from all matches of this round
    matches.forEach((match) => {
        const result = calcPoints(match, getStrength(match.player1), getStrength(match.player2));
        const index1 = ranking.findIndex((item) => item.player === match.player1);
        ranking[index1].points += result.player1 + settings.matchBonus;
        ranking[index1].matches += 1;
        ranking[index1].bonus += settings.matchBonus;
        const index2 = ranking.findIndex((item) => item.player === match.player2);
        ranking[index2].points += result.player2 + settings.matchBonus;
        ranking[index2].matches += 1;
        ranking[index2].bonus += settings.matchBonus;
    });

    // calculate additional penalty for missing matches
    if (settings.penaltyFirstRound - roundNum <= 0) {
        ranking.forEach((item, i) => {
            const currentMismatch = roundNum * settings.minMatchesRound - item.matches;
            if (currentMismatch > 0) {
                const mismatchDiff = currentMismatch - item.mismatch;
                if (mismatchDiff > 0) {
                    ranking[i].mismatch += mismatchDiff;
                    let penaltyFactor = settings.matchPenalty;
                    if (penaltyFactor < 0) { // use player strength instead of fix number
                        penaltyFactor = getStrength(item.player);
                    }
                    const penaltyDiff = mismatchDiff * penaltyFactor
                    ranking[i].penalty += penaltyDiff;
                    ranking[i].points -= penaltyDiff;
                }
            }
        });
    }

    ranking.sort((a, b) => (a.points < b.points ? 1 : b.points < a.points ? -1 : 0));

    let ranking2 = [];
    ranking.forEach((item, i) => {
        const j = rankInit.findIndex((item2) => item.player === item2.player);
        ranking2.push({
            player: item.player,
            matches: item.matches,
            points: roundNumberForDB(item.points),
            bonus: item.bonus,
            mismatch: item.mismatch,
            penalty: item.penalty,
            rankChange: j - i
        })
    });

    return ranking2;
}