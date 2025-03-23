export function Increment(blobID) {
    if (blobID) {
        const strg = "0000" + (parseInt(blobID) + 1);
        return strg.substring(strg.length - 4);
    } else {
        return "0001";
    }
}