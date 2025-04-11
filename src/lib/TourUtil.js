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
                pinTypes: 0
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