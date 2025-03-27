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

    const rsresponse = await fetch("/api/tournament/" + params.id + "/round", getParms);
    const rsData = await rsresponse.json();

    let rData;
    if (rsData.rounds.length > 0) {
        const rid = rsData.rounds[rsData.rounds.length - 1].rid;
        const rresponse = await fetch("/api/tournament/" + params.id + "/round/" + rid, getParms);
        rData = await rresponse.json();
    }

    const plResponse = await fetch("/api/player", getParms);
    const plData = await plResponse.json();

    const pResponse = await fetch("/api/pin?active=true", getParms);
    const pData = await pResponse.json();

    return { tournament: tData.tournament, round: rData ? rData.round : null, players: plData.players, pins: pData.pins };
}