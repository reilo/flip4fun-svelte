export async function load({ fetch, params }) {

    const getParms = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    };

    const tresponse = await fetch("/api/tournament/" + params.id, getParms);
    const tData = await tresponse.json();

    const bsresponse = await fetch("/api/tournament/" + params.id + "/blob", getParms);
    const bsData = await bsresponse.json();

    let blData;
    if (bsData.blobs.length > 0) {
        const bid = bsData.blobs[bsData.blobs.length - 1].blobid;
        const bresponse = await fetch("/api/tournament/" + params.id + "/blob/" + bid, getParms);
        blData = await bresponse.json();
    }

    const plresponse = await fetch("/api/player?active=true", getParms);
    const plData = await plresponse.json();

    return { tournament: tData.tournament, blobs: bsData.blobs, blob: blData ? blData.blob : undefined, players: plData.players };
}