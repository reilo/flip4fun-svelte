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

export function cleanString(strg) {
    let s = strg.toLowerCase().replaceAll(" ", "").replaceAll("-", "");
    s = s.replaceAll("ä", "ae").replaceAll("ö", "oe").replaceAll("ü", "ue").replaceAll("ß", "s");
    s = s.replaceAll("á", "a").replaceAll("é", "e").replaceAll("í", "i").replaceAll("ó", "o").replaceAll("ú", "u");
    s = s.replaceAll("sch", "s").replaceAll("ch", "c");
    s = s.replaceAll(/[^\x00-\x7F]/g, '');
    return s;
}