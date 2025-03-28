export function sortPlayerIDs(playerIDs, allPlayers) {

    playerIDs.sort((p1, p2) => {
        const rec1 = allPlayers.find((item) => item.id === p1);
        const rec2 = allPlayers.find((item) => item.id === p2);
        const name1 = rec1 ? rec1.forename + ' ' + rec1.surname : `Unbekannt (${p1})`;
        const name2 = rec2 ? rec2.forename + ' ' + rec2.surname : `Unbekannt (${p2})`;
        return name1 < name2 ? -1 : name2 < name1 ? 1 : 0;
    });
}

export function getPlayerName(id, allPlayers) {
    const player = allPlayers.find((item) => item.id === id);
    return player != null ? `${player.forename} ${player.surname}` : `Unbekannt (${id})`;
}