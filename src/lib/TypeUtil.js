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