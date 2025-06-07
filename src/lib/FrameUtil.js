import { roundNumberForDB } from "./TypeUtil";

export function hasFrameResult(frame) {
    return (
        frame.scores.length === frame.players.length &&
        frame.scores.every((score) => {
            return score > 0;
        })
    );
}

export function calcFrameResult(frame) {
    const playerScores = [];
    frame.players.forEach((player, i) => {
        playerScores.push({ player: player, score: frame.scores[i] });
    });
    playerScores.sort((a, b) => (a.score < b.score ? 1 : a.score > b.score ? -1 : 0));
    let prevScore = 0;
    let prevPos = 0;
    const maxScore = playerScores[0].score;
    playerScores.forEach((ps, i) => {
        const pos = ps.score !== prevScore ? i + 1 : prevPos;
        prevScore = ps.score;
        prevPos = pos;
        playerScores[i].pos = pos;
        playerScores[i].fine = roundNumberForDB(ps.score / maxScore);
    });
    return playerScores;
}