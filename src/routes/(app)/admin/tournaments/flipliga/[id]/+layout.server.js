export async function load({fetch, params}) {

    const turl = "/api/tournament/" + params.id;
    const tresponse = await fetch(turl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    const tData = await tresponse.json();

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
        const bid = bsData.blobs[bsData.blobs.length - 1].id.split(":")[1];
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

    const purl = "/api/player?active=true";
    const presponse = await fetch(purl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    const pData = await presponse.json();

    return { tournament: tData.tournament, blobs: bsData.blobs, blob: bData ? bData.blob : undefined, players: pData.players };
}