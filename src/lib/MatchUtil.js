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