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

