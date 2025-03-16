export async function load({fetch, params}) {

    const turl = "/api/tournament/" + params.id;
    const tournamentResponse = await fetch(turl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    const tournament = await tournamentResponse.json();

    const playersResponse = await fetch("/api/player", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    const players = await playersResponse.json();

    const pinsResponse = await fetch("/api/pin", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    const pins = await pinsResponse.json();

    return { tournament: tournament.tournament, players: players.players, pins: pins.pins };
}