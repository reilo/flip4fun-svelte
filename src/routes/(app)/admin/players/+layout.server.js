export async function load({fetch}) {
    const response = await fetch("/api/player", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    const responseData = await response.json();

    return responseData;
}