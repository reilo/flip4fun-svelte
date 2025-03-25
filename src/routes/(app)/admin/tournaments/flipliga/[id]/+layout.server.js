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

    const rsresponse = await fetch("/api/tournament/" + params.id + "/round", getParms);
    const rsData = await rsresponse.json();

    let rData;
    if (rsData.rounds.length > 0) {
        const rid = rsData.rounds[rsData.rounds.length - 1].rid;
        const rresponse = await fetch("/api/tournament/" + params.id + "/round/" + rid, getParms);
        rData = await rresponse.json();
    }

    const plresponse = await fetch("/api/player?active=true", getParms);
    const plData = await plresponse.json();

    return { tournament: tData.tournament, rounds: rsData.rounds, round: rData ? rData.round : null, players: plData.players };
}