export function mapBoolean(value) {
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

export function mapDate(value) {
    let date = new Date(value);
    return date.toLocaleDateString("de-DE");
}