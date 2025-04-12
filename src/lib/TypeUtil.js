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
    let d = new Date(value);
    const year = d.getFullYear().toString();
    const month = (d.getMonth() < 9 ? "0" : "") + (d.getMonth() + 1).toString();
    const day = (d.getDate() < 10 ? "0" : "") + d.getDate().toString();
    return day + "." + month + "." + year;
}

/**
 * Round number for UI - 1 decimal place
 * @param {*} num The input float number, e.g. 2,666666666667
 * @returns The rounded number, e.g. 2,7
 */
export function roundNumberToStrg(num) {
    return (Math.round(num * 10) / 10).toFixed(1);
};

/**
 * Round number for storage in DB - 4 decimal places
 * @param {*} num The input float number, e.g. 2,666666666667
 * @returns The rounded number, e.g. 2,6667
 */
export function roundNumberForDB(num) {
    return Math.round(num * 10000) / 10000;
};

export function cleanString(strg) {
    let s = strg.toLowerCase().replaceAll(" ", "").replaceAll("-", "");
    s = s.replaceAll("ä", "ae").replaceAll("ö", "oe").replaceAll("ü", "ue").replaceAll("ß", "s");
    s = s.replaceAll("á", "a").replaceAll("é", "e").replaceAll("í", "i").replaceAll("ó", "o").replaceAll("ú", "u");
    s = s.replaceAll("sch", "s").replaceAll("ch", "c");
    s = s.replaceAll(/[^\x00-\x7F]/g, '');
    return s;
}