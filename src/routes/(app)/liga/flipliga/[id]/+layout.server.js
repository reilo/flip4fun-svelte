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

    const burl = "/api/tournament/" + params.id + "/blob/" + tData.tournament.results.currentRound;
    const bResponse = await fetch(burl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    const bData = await bResponse.json();

    return { tournament: tData.tournament, players: plData.players, pins: pData.pins, blob: bData.blob };
}