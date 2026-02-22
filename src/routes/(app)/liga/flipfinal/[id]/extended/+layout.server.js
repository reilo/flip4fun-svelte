export async function load({ fetch, params, parent }) {
    const { tournament, players, pins, round } = await parent();

    const getParms = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    };

    const roundsResponse = await fetch("/api/tournament/" + params.id + "/round", getParms);
    const roundsData = await roundsResponse.json();

    // Load frames for every round
    for (const r of roundsData.rounds) {
        const framesResponse = await fetch("/api/frame?tid=" + params.id + "&rid=" + r.rid, getParms);
        const framesData = await framesResponse.json();
        r.frames = framesData.frames || [];
    }

    return { rounds: roundsData.rounds }
}