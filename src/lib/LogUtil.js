export function logError(message) {

    console.log("ERR " + getCurrentDate() + " " + message);
}

export function logWarning(message) {

    console.log("WRN " + getCurrentDate() + " " + message);
}

export function logInfo(message) {

    console.log("INF " + getCurrentDate() + " " + message);
}

const getCurrentDate = () => {
    const d = new Date();
    const year = d.getFullYear().toString();
    const month = (d.getMonth() < 10 ? "0" : "") + (d.getMonth() + 1).toString();
    const day = (d.getDate() < 10 ? "0" : "") +  d.getDate().toString();
    const hour = (d.getHours() < 10 ? "0" : "") +  d.getHours().toString();
    const minute = (d.getMinutes() < 10 ? "0" : "") +  d.getMinutes().toString();
    const second = (d.getSeconds() < 10 ? "0" : "") +  d.getSeconds().toString();
    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
}