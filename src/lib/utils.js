export function MapTourStatus(status) {
    let mapped;
    switch (status) {
        case "Planned":
            mapped = "In Planung";
            break;
        case "Ready":
            mapped = "Startbereit";
            break;
        case "Active":
            mapped = "Aktiv";
            break;
        case "Stopped":
            mapped = "Abgebrochen";
            break;
        case "Completed":
            mapped = "Beendet";
            break;
        default:
            mapped = "Unbekannt";
    }
    return mapped;
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
        default:
            "jein";
    }
    return mapped;
}

export function MapDate(value) {
    let date = new Date(value);
    return date.toLocaleDateString("de-DE");
}