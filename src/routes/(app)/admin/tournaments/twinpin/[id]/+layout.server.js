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
    const matchnsResponse = await fetch("/api/tournament/" + params.id + "/matchn", getParms);
    const matchnsData = await matchnsResponse.json();

    roundsData.rounds.forEach((round) => {
        round.matches = [];
    })
    matchnsData.matchns.forEach((match) => {
        const round = roundsData.rounds.find((round) => round.rid === match.rid);
        if (round) {
            round.matches.push(match);
        }
    })

    if (roundData) {
        roundData.round.matches = roundsData.rounds[roundsData.rounds.length - 1].matches;
    }

    return {
        tournament: tData.tournament,
        players: plData.players,
        pins: pinsData.pins,
        rounds: roundsData.rounds,
        round: roundData ? roundData.round : null
    };
}