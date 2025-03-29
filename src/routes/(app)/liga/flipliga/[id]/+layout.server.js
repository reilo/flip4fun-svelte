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

    const roundsResponse = await fetch("/api/tournament/" + params.id + "/round", getParms);
    const roundsData = await roundsResponse.json();

    let roundData;
    let rid;
    if (roundsData.rounds.length > 0) {
        // rounds are sorted by date - this should be the newest one:
        rid = roundsData.rounds[roundsData.rounds.length - 1].rid;
        const roundResponse = await fetch("/api/tournament/" + params.id + "/round/" + rid, getParms);
        roundData = await roundResponse.json();
    }

    let matchesData;
    if (roundData) {
        const matchesResponse = await fetch("/api/tournament/" + params.id + "/round/" + rid + "/match")
        matchesData = await matchesResponse.json();
        roundData.round.matches = matchesData.matches;
    }
 
    const playersResponse = await fetch("/api/player", getParms);
    const playersData = await playersResponse.json();

    const pinsResponse = await fetch("/api/pin?active=true", getParms);
    const pinsData = await pinsResponse.json();

    return {
        tournament: tourData.tournament,
        round: roundData ? roundData.round : null,
        players: playersData.players,
        pins: pinsData.pins
    };
}