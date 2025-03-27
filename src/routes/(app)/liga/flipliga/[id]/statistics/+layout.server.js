export async function load({ fetch, params, parent }) {
    const { tournament, players, pins } = await parent();

    const getParms = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    };

    const rsresponse = await fetch("/api/tournament/" + params.id + "/round?expand=true", getParms);
    const rsData = await rsresponse.json();

    return { rounds: rsData.rounds }
}