import { roundNumberForDB } from "./TypeUtil";
import { calcFrameResult } from "./FrameUtil";

export function mapTourStatus(status) {
    let mapped;
    switch (status) {
        case "Planned":
            mapped = "In Planung";
            break;
        case "Active":
            mapped = "Aktiv";
            break;
        case "Completed":
            mapped = "Beendet";
            break;
        default:
            mapped = "Unbekannt";
    }
    return mapped;
}

export function mapTourType(ttype) {
    let mapped;
    switch (ttype) {
        case "fliptwin":
            mapped = "TwinPin";
            break;
        case "flipliga":
            mapped = "FLIP-Liga";
            break;
        case "flipfinal":
            mapped = "FLIP-Finale";
            break;
        default:
            mapped = "Unbekannt";
    }
    return mapped;
}

export function getTourTypeMap() {
    return [
        { 'name': 'TwinPin', 'value': 'fliptwin' },
        { 'name': 'FLIP-Liga', 'value': 'flipliga' },
        { 'name': 'FLIP-Finale', 'value': 'flipfinal' },
    ]
}

export function isValidTourType(type) {
    return ["fliptwin", "flipliga", "flipfinal"].includes(type);
}

export function getDefaultSettings(type) {
    switch (type) {
        case "fliptwin":
            return {};
        case "flipliga":
            return {
                baseline: 50,
                penaltyFirstRound: 5,
                matchBonus: 1,
                matchPenalty: 1,
                minMatchesRound: 1,
                challengeSame: 1
            };
        case "flipfinal":
            return {
                numFinalists: 4,
                pinTypes: 0,
                maxStartBonus: 2
            };
        default:
            return {};
    }
}

export function calcStrength(pos, total) {
    let sum = 0;
    let rowCount = 0;
    while (sum < total) sum += ++rowCount;
    let curPos = 1;
    let i = 1;
    while (curPos < pos) {
        curPos += ++i;
        --rowCount;
    }
    return rowCount;
}

/**
 * Calculate the initial FLIP levels from a flat list of players.
 * @param {array} players     Flat list of player IDs reflecting the overall ranking
 * @param {int} maxStartBonus Maximum start bonus
 * @returns rankInit - initial ranking by levels (ascending) including a first fine score. Array of
 *                     -- level: level/strength value
 *                     -- players: the players within a level sorted by ranking: Array of
 *                        --- id: player ID
 *                        --- fine: fine score depending on ranking within level
 */
export function calcInitialLevels(players, maxStartBonus) {

    function setNewPlayers(currentPlayers) {
        const newPlayers = [];
        const count = currentPlayers.length;
        currentPlayers.forEach((player, j) => {
            newPlayers.push({
                id: player,
                fine: (count === 1 ? 1 : roundNumberForDB((count - j - 1) / (count - 1))) * maxStartBonus
            });
        });
        return newPlayers;
    }

    const rankInit = [];
    const pcount = players.length;
    let previousStrength = calcStrength(1, pcount);
    const currentPlayers = [];

    players.forEach((player, i) => {
        const strength = calcStrength(++i, pcount);
        if (strength === previousStrength) {
            currentPlayers.push(player);
        } else {
            rankInit.unshift({ level: previousStrength, players: setNewPlayers(currentPlayers) });
            previousStrength = strength;
            currentPlayers.splice(0, currentPlayers.length);
            currentPlayers.push(player);
        }
        if (i === pcount && currentPlayers.length) {
            rankInit.unshift({ level: previousStrength, players: setNewPlayers(currentPlayers) });
        }
    });
    return rankInit;
}

/**
 * Determines the level numbers which are active for upcoming round.
 * Only levels with at least one active player are used.
 * Top level is never included.
 * @param {array} rankInit - initial ranking for the round. Array of
 *                           -- level: level/strength value
 *                           -- players: the players within a level sorted by ranking: Array of
 *                              --- id: player ID
 *                              --- fine: fine score depending on ranking within level
 * @param {array} activePlayers - IDs of active players
 * @param {array} previousLevels - level numbers of previous round
 * @returns playingLevels - level number for upcoming round
 */
export function calcPlayingLevels(rankInit, activePlayers, previousLevels) {
    const playingLevels = [];
    if (previousLevels.length) {
        // add next playing level to existing ones
        playingLevels.push(...previousLevels);
        let startAdd = false;
        rankInit.every((row, i) => {
            if (playingLevels.includes(row.level)) {
                startAdd = true;
                let hasPlayers = false;
                row.players.every((player) => {
                    if (activePlayers.includes(player.id)) {
                        hasPlayers = true;
                        return false;
                    }
                    return true;
                });
                // remove playing level if no more active players left
                if (!hasPlayers) {
                    playingLevels.splice(playingLevels.indexOf(row.level), 1);
                }
            } else {
                if (startAdd) {
                    if (i < rankInit.length - 1) {
                        // stop adding playing levels when top level reached
                        playingLevels.push(row.level);
                    }
                    return false;
                }
            }
            return true;
        });
    } else {
        // add first playing level
        rankInit.every((row) => {
            row.players.every((player) => {
                if (activePlayers.includes(player.id)) {
                    playingLevels.push(row.level);
                    // stop when first playing level was determined
                    return false;
                }
                // continue if current level has no active players
                return true;
            });
            return playingLevels.length ? false : true;
        });
    }
    return playingLevels;
}

/**
 * Calculate the final results based on previous ranking using played frames.
 * @param {array} rankInit - initial ranking for the round. Array of
 *                           -- level: level/strength value
 *                           -- players: the players within a level sorted by ranking: Array of
 *                              --- id: player ID
 *                              --- fine: fine score depending on ranking within level 
 * @param {array} playingLevels - level numbers of current round
 * @param {array} frames - all played frames
 * @returns rankFinal - final results based on rankInit, not yet sorted, winner indicated. Array of
 *                      -- level: level/strength value
 *                      -- winner: winner of the level
 *                      -- players: the players within a level, not yet sorted by ranking: Array of
 *                        --- id: player ID
 *                        --- fine: fine score updated from round results
 *                        --- position: accumulated position from round frames
 */
export function calcFinalResults(rankInit, playingLevels, frames) {
    const playerResults = [];
    // evaluate all played matches
    frames.forEach((frame) => {
        const playerScores = calcFrameResult(frame);
        playerScores.forEach((ps) => {
            const idx = playerResults.findIndex((pr) => pr.player === ps.player);
            if (idx === -1) {
                playerResults.push({ player: ps.player, position: ps.pos, fine: ps.fine });
            } else {
                playerResults[idx].position += ps.pos;
                playerResults[idx].fine += ps.fine;
            }
        });
    });
    // calculate new ranking
    const rankFinal = JSON.parse(JSON.stringify(rankInit));
    rankFinal.forEach((item, i) => {
        if (playingLevels.includes(item.level)) {
            let winner = null;
            let bestPosition = 0;
            item.players.forEach((player, j) => {
                const result = playerResults.find((pr) => pr.player === player.id);
                if (result) {
                    rankFinal[i].players[j].fine += result.fine;
                    rankFinal[i].players[j].position = result.position;
                    if (!winner || result.position < bestPosition) {
                        winner = player.id;
                        bestPosition = result.position;
                    }
                }
            });
            rankFinal[i].winner = winner;
        }
    });
    return rankFinal;
}

/**
 * Calculate initial levels for next round from final ranking of previous round.
 * @param {array} rankFinal - final ranking from previous round. Array of:
 *                            -- level: level/strength value
 *                            -- winner: winner of the level
 *                            -- players: the players within a level, not yet sorted by ranking: Array of
 *                               --- id: player ID
 *                               --- fine: fine score updated from round results
 *                               --- position: accumulated position from round frames
 * @param {array} playingLevels - level numbers of previous round
 * @retuns rankInit - initial levels for next round
 *                    -- level: level/strength value
 *                     -- players: the players within a level sorted by ranking: Array of
 *                        --- id: player ID
 *                        --- fine: fine score depending on ranking within level
 */
export function calcNextLevels(rankFinal, playingLevels) {
    const rankInit = [];
    let winnerId = null;
    let previousWinnerId = null;
    let nextEntry = null;
    // generate initial ranking levels for next round
    rankFinal.forEach((item) => {
        if (playingLevels.includes(item.level)) {
            nextEntry = { level: item.level, players: [] };
            item.players.forEach((player) => {
                if (player.id !== item.winner) {
                    nextEntry.players.push({ id: player.id, fine: player.fine });
                } else {
                    winnerId = player.id;
                }
            });
        } else {
            nextEntry = JSON.parse(JSON.stringify(item));
        }
        if (previousWinnerId) {
            nextEntry.players.push({ id: previousWinnerId, fine: 0 });
            previousWinnerId = null;
        }
        if (winnerId) {
            previousWinnerId = winnerId;
            winnerId = null;
        }
        nextEntry.players.sort((a, b) => (a.fine < b.fine ? 1 : b.fine < a.fine ? -1 : 0));
        rankInit.push(nextEntry);
    });
    return rankInit;
}