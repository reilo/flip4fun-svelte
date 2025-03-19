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

    return { tournament: tournament.tournament };
}