export async function load({ fetch }) {

    const[guestsResponse, appointmentsResponse] = 
    await Promise.all([
        fetch("api/player", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        }),
        fetch("api/appointment", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        })
    ])

    const guestData = await guestsResponse.json();
    const appointmentData = await appointmentsResponse.json();

    const guests = guestData.players;
    const appointments = appointmentData.appointments;

    let guestMap = [];
    guests.map((item) => guestMap.push({ name: item.forename + " " + item.surname, value: item.id }));

    return {guests, appointments, guestMap};
  
}