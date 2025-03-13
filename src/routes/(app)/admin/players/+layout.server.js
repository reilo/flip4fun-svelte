export async function load({fetch}) {
    const playersResponse = await fetch("/api/player", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    const players = await playersResponse.json();

    return players;
}