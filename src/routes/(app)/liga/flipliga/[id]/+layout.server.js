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
    const burl = "/api/tournament/" + params.id + "/blob/" + tournament.tournament.results.currentRound;
    const blobResponse = await fetch(burl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    const blob = await blobResponse.json();

    return { tournament: tournament.tournament, players: players.players, pins: pins.pins, blob: blob.blob };
}