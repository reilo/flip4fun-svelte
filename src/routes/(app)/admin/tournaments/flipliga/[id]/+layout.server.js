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

    const plresponse = await fetch("/api/player?active=true", getParms);
    const plData = await plresponse.json();

    return { tournament: tData.tournament, players: plData.players };
}