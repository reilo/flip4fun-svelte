export function MapTourStatus(status) {
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

export function MapTourType(ttype) {
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

export function GetTourTypeMap() {
    return [
        { 'name': 'TwinPin', 'value': 'fliptwin' },
        { 'name': 'FLIP-Liga', 'value': 'flipliga' },
        { 'name': 'FLIP-Finale', 'value': 'flipfinal' },
    ]
}

export function MapBoolean(value) {
    let mapped;
    switch (value) {
        case true:
        case "true":
            mapped = "ja";
            break;
        case false:
        case "false":
            mapped = "nein";
            break;
        default:
            mapped = "jein";
    }
    return mapped;
}

export function MapDate(value) {
    let date = new Date(value);
    return date.toLocaleDateString("de-DE");
}