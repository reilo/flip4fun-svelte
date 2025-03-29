export async function load({ fetch }) {

    const getParms = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    };

    const response = await fetch("/api/pin", getParms);
    const responseData = await response.json();

    return responseData;
}