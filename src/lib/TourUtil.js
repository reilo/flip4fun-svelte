import { roundNumberForDB } from "./TypeUtil";
import { calcFrameResult, hasFrameResult } from "./FrameUtil";

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
        case "twinpin":
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
        { 'name': 'TwinPin', 'value': 'twinpin' },
        { 'name': 'FLIP-Liga', 'value': 'flipliga' },
        { 'name': 'FLIP-Finale', 'value': 'flipfinal' },
    ]
}

export function isValidTourType(type) {
    return ["twinpin", "flipliga", "flipfinal"].includes(type);
}

export function getDefaultSettings(type) {
    switch (type) {
        case "twinpin":
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
                fine: (count === 1 ? 1 : roundNumberForDB((count - j) / (count))) * maxStartBonus
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
 * @returns {object}
 *          levelResults - all playing levels with accumulated results of played frames.
 *                      Array of
 *                      -- level: level/strength value
 *                      -- matches: count of completed frames
 *                      -- players: the active players within a level, sorted by accumulated position:
 *                        Array of:
 *                        --- id: player ID
 *                        --- score: accumulated position from completed frames
 *                        --- fineNew: fine score newly gained from completed frames
 *          rankFinal - final results based on rankInit, all frame results added, levels update and sorted.
 *                      Array of
 *                      -- level: level/strength value
 *                      -- players: the players within a level, sorted by ranking: Array of
 *                        --- id: player ID
 *                        --- fine: fine score updated from round results
 */
export function calcFinalResults(round, frames) {
    const rankInit = round.settings.rankInit;
    const playingLevels = round.settings.playingLevels;
    const activePlayers = round.players;
    // set up initial level results for all playing levels with score = 0 for each player.
    const levelResults = [];
    playingLevels.forEach((level) => {
        const index = rankInit.findIndex((rank) => rank.level === level);
        if (index >= 0) {
            const players = [];
            rankInit[index].players.forEach((player) => {
                if (activePlayers.includes(player.id)) {
                    players.push({ id: player.id, score: 0, fineNew: 0 });
                }
            });
            levelResults.push({ level: level, players: players, matches: 0 });
        }
    });
    // evaluate all played matches and add scores to level results.
    frames.forEach((frame) => {
        if (hasFrameResult(frame)) {
            const level = frame.lid;
            const levelResult = levelResults.find((item) => item.level === level);
            if (levelResult) {
                levelResult.matches += 1;
                const playerScores = calcFrameResult(frame);
                playerScores.forEach((playerScore) => {
                    const player = levelResult.players.find((item) => item.id === playerScore.player);
                    if (player) {
                        player.score += playerScore.pos;
                        player.fineNew += playerScore.fine;
                    }
                })
                if (levelResult.matches === 2) {
                    levelResult.players.sort((a, b) => (a.score - b.score));
                }
            }
        }
    });
    // calculate new ranking
    const rankFinal = JSON.parse(JSON.stringify(rankInit));
    rankFinal.forEach((item, i) => {
        if (playingLevels.includes(item.level)) {
            const nextItem = rankFinal[i + 1];
            const levelResult = levelResults.find((levelResult) => levelResult.level === item.level);
            if (levelResult) {
                const winner = levelResult.players[0];
                nextItem.players.push({ id: winner.id, fine: 0 });
                const index = item.players.findIndex((player) => player.id === winner.id);
                if (index >= 0) {
                    item.players.splice(index, 1);
                }
                item.players.forEach((player) => {
                    const playerResult = levelResult.players.find((playerResult) => playerResult.id === player.id);
                    if (playerResult) {
                        player.fine += playerResult.fineNew;
                    }
                })
                item.players.sort((a, b) => (b.fine - a.fine))
            }
        }
    });
    return { levelResults, rankFinal };
}

export function calcTwinpinRanking(players, rounds) {
		const playerScores = {};
		players.forEach((player) => {
			playerScores[player] = 0;
		});

		// Sum up scores from all rounds and their matches
		rounds.forEach((r) => {
			if (r.matches) {
				r.matches.forEach((match) => {
					// Add scores for team1 players
					if (match.team1) {
						match.team1.forEach((player) => {
							if (playerScores.hasOwnProperty(player)) {
								playerScores[player] += match.score1 || 0;
							}
						});
					}
					// Add scores for team2 players
					if (match.team2) {
						match.team2.forEach((player) => {
							if (playerScores.hasOwnProperty(player)) {
								playerScores[player] += match.score2 || 0;
							}
						});
					}
				});
			}
		});

		// Convert to array and sort by score descending
		return Object.keys(playerScores)
			.map((player) => ({
				player: player,
				score: playerScores[player]
			}))
			.sort((a, b) => b.score - a.score);
}