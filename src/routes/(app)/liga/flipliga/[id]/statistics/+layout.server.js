export async function load({ fetch, params, parent }) {
    const { tournament, players, pins } = await parent();

    const getParms = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    };

    const roundsResponse = await fetch("/api/tournament/" + params.id + "/round", getParms);
    const roundsData = await roundsResponse.json();

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

    return { rounds: roundsData.rounds }
}