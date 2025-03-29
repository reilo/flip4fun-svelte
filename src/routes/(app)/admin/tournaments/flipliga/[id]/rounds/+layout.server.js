export async function load({ fetch, params, parent }) {
    const { tournament, players } = await parent();

    const getParms = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    };

    const roundsResponse = await fetch("/api/tournament/" + params.id + "/round", getParms);
    const roundsData = await roundsResponse.json();

    let roundData;
    if (roundsData.rounds.length > 0) {
        // rounds are sorted by date - this should be the newest one:
        const rid = roundsData.rounds[roundsData.rounds.length - 1].rid; 
        const roundsResponse = await fetch("/api/tournament/" + params.id + "/round/" + rid, getParms);
        roundData = await roundsResponse.json();
    }
    const matchesResponse = await fetch("/api/tournament/" + params.id + "/match", getParms);
    const matchesData = await matchesResponse.json();

    roundsData.rounds.forEach((round) => {
        round.matches = [];
    })
    matchesData.matches.forEach((match) => {
        const round = roundsData.rounds.find((round) => round.rid === match.rid);
        if (round) {
            round.matches.push(match);
        }
    })

    if (roundData) {
        roundData.round.matches = roundsData.rounds[roundsData.rounds.length - 1].matches;
    }

    const pinsResponse = await fetch("/api/pin", getParms);
    const pinsData = await pinsResponse.json();

    return { rounds: roundsData.rounds, round: roundData ? roundData.round : null, pins: pinsData.pins }
}