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

    const plresponse = await fetch("/api/player", getParms);
    const plData = await plresponse.json();

    const roundsResponse = await fetch("/api/tournament/" + params.id + "/round", getParms);
    const roundsData = await roundsResponse.json();

    let roundData;
    if (roundsData.rounds.length > 0) {
        // rounds are sorted by date - this should be the newest one:
        const rid = roundsData.rounds[roundsData.rounds.length - 1].rid;
        const roundsResponse = await fetch("/api/tournament/" + params.id + "/round/" + rid, getParms);
        roundData = await roundsResponse.json();
    }

    let framesData;
    if (roundData) {
        const framesResponse = await fetch("/api/frame?tid=" + tData.tournament.id + "&rid=" + roundData.round.rid.toString());
        framesData = await framesResponse.json();
    }

    return {
        tournament: tData.tournament,
        players: plData.players,
        round: roundData ? roundData.round : null,
        frames: framesData ? framesData.frames : []
    };
}