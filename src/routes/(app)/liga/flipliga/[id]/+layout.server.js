export async function load({ fetch, params }) {

    const turl = "/api/tournament/" + params.id;
    const tResponse = await fetch(turl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    const tData = await tResponse.json();

    const bsurl = "/api/tournament/" + params.id + "/blob";
    const bsresponse = await fetch(bsurl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    const bsData = await bsresponse.json();

    let bData;

    if (bsData.blobs.length > 0) {
        const bid = bsData.blobs[bsData.blobs.length - 1].blobid;
        const burl = "/api/tournament/" + params.id + "/blob/" + bid;
        const bresponse = await fetch(burl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });

        bData = await bresponse.json();
    }

    const plResponse = await fetch("/api/player", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    const plData = await plResponse.json();

    const pResponse = await fetch("/api/pin", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    const pData = await pResponse.json();

    return { tournament: tData.tournament, blobs: bsData.blobs, blob: bData ? bData.blob : undefined, players: plData.players, pins: pData.pins };
}