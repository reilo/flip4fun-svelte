export async function load({ fetch, parent }) {
    const { tournament, players } = await parent();

    const getParms = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    };

    const response = await fetch("/api/tournament", getParms);
    const responseData = await response.json();

    return { tournaments: responseData.tournaments };
}