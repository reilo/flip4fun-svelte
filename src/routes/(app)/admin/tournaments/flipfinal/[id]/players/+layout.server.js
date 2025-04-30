export async function load({ fetch, parent }) {
    const { tournament, players } = await parent();

    const getParms = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    };

    // We need the list of all tournaments to select one for players import
    const response = await fetch("/api/tournament", getParms);
    const responseData = await response.json();

    return { tournaments: responseData.tournaments };
}