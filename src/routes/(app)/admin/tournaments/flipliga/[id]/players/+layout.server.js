export async function load({ fetch, params, parent }) {
    const { tournament, players } = await parent();

    const getParms = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    };

    const plaresponse = await fetch("/api/player", getParms);
    const plaData = await plaresponse.json();

    return { allPlayers: plaData.players };
}