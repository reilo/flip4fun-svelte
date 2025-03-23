export function MapStatus(status) {
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

export function MapType(ttype) {
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

export function GetTypeMap() {
    return [
        { 'name': 'TwinPin', 'value': 'fliptwin' },
        { 'name': 'FLIP-Liga', 'value': 'flipliga' },
        { 'name': 'FLIP-Finale', 'value': 'flipfinal' },
    ]
}

export function IsValidType(type) {
    return (type === "flipfinal" || type === "flipliga" || type === "fliptwin" || type === "blob");
}

export function CalcStrength(pos, total) {
    let sum = 0;
    let rowCount = 0;
    while (sum <= total) sum += ++rowCount;
    let curPos = 1;
    let i = 1;
    while (curPos < pos) {
        curPos += ++i;
        --rowCount;
    }
    return rowCount;
}