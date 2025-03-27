export async function load({ fetch, params, parent }) {
    const { tournament, players } = await parent();

    const getParms = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    };

    const rsresponse = await fetch("/api/tournament/" + params.id + "/round?expand=true", getParms);
    const rsData = await rsresponse.json();

    let rData;
    if (rsData.rounds.length > 0) {
        const rid = rsData.rounds[rsData.rounds.length - 1].rid;
        const rresponse = await fetch("/api/tournament/" + params.id + "/round/" + rid, getParms);
        rData = await rresponse.json();
    }

    const presponse = await fetch("/api/pin", getParms);
    const pData = await presponse.json();

    return { rounds: rsData.rounds, round: rData ? rData.round : null, pins: pData.pins }
}