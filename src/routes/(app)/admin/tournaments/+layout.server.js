export async function load({fetch}) {
    const tournamentsResponse = await fetch("/api/tournament", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    const tournaments = await tournamentsResponse.json();

    return tournaments;
}