export async function load({ fetch, parent }) {
    const { tournament, players, round } = await parent();

    const getParms = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    };

    const pinsResponse = await fetch("/api/pin", getParms);
    const pinsData = await pinsResponse.json();

    return { pins: pinsData.pins }
}