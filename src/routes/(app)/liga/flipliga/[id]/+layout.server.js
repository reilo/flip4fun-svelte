export async function load({ fetch, params }) {

    const getParms = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    };

    const tResponse = await fetch("/api/tournament/" + params.id, getParms);
    const tData = await tResponse.json();

    const bsresponse = await fetch("/api/tournament/" + params.id + "/blob", getParms);
    const bsData = await bsresponse.json();

    let bData;
    if (bsData.blobs.length > 0) {
        const bid = bsData.blobs[bsData.blobs.length - 1].blobid;
        const bresponse = await fetch("/api/tournament/" + params.id + "/blob/" + bid, getParms);
        bData = await bresponse.json();
    }

    const plResponse = await fetch("/api/player", getParms);
    const plData = await plResponse.json();

    const pResponse = await fetch("/api/pin?active=true", getParms);
    const pData = await pResponse.json();

    return { tournament: tData.tournament, blobs: bsData.blobs, blob: bData ? bData.blob : undefined, players: plData.players, pins: pData.pins };
}