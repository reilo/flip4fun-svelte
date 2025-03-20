export async function load({fetch}) {
    const response = await fetch("/api/pin", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    const responseData = await response.json();

    return responseData;
}