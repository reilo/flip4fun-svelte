export async function load({ fetch, params }) {

    const getParms = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    };

    const tourResponse = await fetch("/api/tournament/" + params.id, getParms);
    const tourData = await tourResponse.json();

    return {
        tournament: tourData.tournament
    };
}