export function logError(message) {

    log("ERR", message);
}

export function logWarning(message) {

    log("WRN", message);
}

export function logInfo(message) {

    log("INF", message);
}

export function log(severity, message) {

    console.log(severity + " " + getCurrentDate() + " " + message);
}

const getCurrentDate = () => {

    const d = new Date();
    const year = d.getFullYear().toString();
    const month = (d.getMonth() < 10 ? "0" : "") + (d.getMonth() + 1).toString();
    const day = (d.getDate() < 10 ? "0" : "") + d.getDate().toString();
    const hour = (d.getHours() < 10 ? "0" : "") + d.getHours().toString();
    const minute = (d.getMinutes() < 10 ? "0" : "") + d.getMinutes().toString();
    const second = (d.getSeconds() < 10 ? "0" : "") + d.getSeconds().toString();
    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
}