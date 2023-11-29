export async function load({fetch}) {
    const pinsResponse = await fetch("/api/pins", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    const pins = await pinsResponse.json();

    return pins;
}