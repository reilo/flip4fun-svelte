import { roundNumberForDB } from "./TypeUtil";

export function sortPlayerIDs(playerIDs, allPlayers) {

    playerIDs.sort((p1, p2) => {
        const rec1 = allPlayers.find((item) => item.id === p1);
        const rec2 = allPlayers.find((item) => item.id === p2);
        const name1 = rec1 ? rec1.forename + ' ' + rec1.surname : `Unbekannt (${p1})`;
        const name2 = rec2 ? rec2.forename + ' ' + rec2.surname : `Unbekannt (${p2})`;
        return name1 < name2 ? -1 : name2 < name1 ? 1 : 0;
    });
}

export function getPlayerName(id, allPlayers, short = false) {
    const player = allPlayers.find((item) => item.id === id);
    return formatPlayerName(player, id, short);
}

export function formatPlayerName(player, id, short = false) {
    const lastName = short ? player.surname[0] + "." : player.surname;
    return player ? `${player.forename} ${lastName}` : `Unbekannt (${id})`;
}

export function formatPlayerNameExt(player, id) {
    if (player) {
        return `${player.forename} ${player.surname}` + (player.shortname ? ` (${player.shortname})` : "");
    } else {
        return `Unbekannt (${id})`;
    }
}

export function getPyramidLayout(rows, width, height, aspectRatio) {
    const vSpacing = 3;
    const imageHeight = (height - (rows - 1) * vSpacing) / rows;
    const imageWidth = imageHeight / aspectRatio;
    const hSpacing = (width - rows * imageWidth) / (rows - 1);
    const xpos = [];
    const ypos = [];
    const rpos = [];
    for (let row = 1; row <= rows; ++row) {
        const left = width / 2 - row * imageWidth / 2 - (row - 1) * hSpacing / 2;
        const top = (row - 1) * (imageHeight + vSpacing);
        for (let idx = 1; idx <= row; ++idx) {
            xpos.push(roundNumberForDB(left + (idx - 1) * (imageWidth + hSpacing)));
            ypos.push(roundNumberForDB(top));
        }
        rpos.push(roundNumberForDB(top));
    }
    const valid = imageHeight > 0 && imageWidth > 0;
    return {
        valid: valid,
        imageHeight: roundNumberForDB(imageHeight),
        imageWidth: roundNumberForDB(imageWidth),
        hSpacing: roundNumberForDB(hSpacing),
        vSpacing: roundNumberForDB(vSpacing),
        xpos: xpos,
        ypos: ypos,
        rpos: rpos
    }
}