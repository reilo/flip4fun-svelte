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

    const burl = "/api/tournament/" + params.id + "/blob/" + tData.tournament.results.currentRound;
    const bresponse = await fetch(burl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    const bData = await bresponse.json();

    const purl = "/api/player?active=true";
    const presponse = await fetch(purl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    const pData = await presponse.json();

    return { tournament: tData.tournament, blob: bData.blob, players: pData.players };
}