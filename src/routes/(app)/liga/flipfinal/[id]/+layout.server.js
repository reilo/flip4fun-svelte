export async function load({ fetch, params }) {

    const getParms = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    };

    const tourResponse = await fetch("/api/tournament/" + params.id, getParms);
    const tourData = await tourResponse.json();

    const playersResponse = await fetch("/api/player", getParms);
    const playersData = await playersResponse.json();

    const pinsResponse = await fetch("/api/pin", getParms);
    const pinsData = await pinsResponse.json();

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
        const framesResponse = await fetch("/api/frame?tid=" + tourData.tournament.id + "&rid=" + roundData.round.rid.toString());
        framesData = await framesResponse.json();
    }

    return {
        tournament: tourData.tournament,
        players: playersData.players,
        pins: pinsData.pins,
        round: roundData ? roundData.round : null,
        frames: framesData ? framesData.frames : []
    };
}