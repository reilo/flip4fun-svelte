import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const GET = async ({ params }) => {
    try {
        const appointment = await prisma.appointment.findUniqueOrThrow({
            where: { id: params.id }
        });
        return new Response(
            JSON.stringify({ appointment: appointment }),
            {
                status: 200, headers: { "Content-Type": "application/json" }
            }
        );
    }
    catch (e) {
        return new Response(
            JSON.stringify({ message: "Termin konnte nicht geladen werden", error: e }),
            {
                status: 500, headers: { "Content-Type": "application/json" }
            }
        )
    }
}

export const PUT = async ({ params, url }) => {
    try {
        const aUrl = new URL(url);
        let data = {};

        const guestsParam = aUrl.searchParams.get("guests");
        if (guestsParam != null) {
            data.guests = guestsParam.split(",");
        }

        const countsParam = aUrl.searchParams.get("counts");
        if (countsParam != null) {
            const counts = countsParam.split(",");
            data.counts = [];
            counts.forEach(count => data.counts.push(Number(count)));
        }

        const updatedAppointment = await prisma.appointment.update({
            where: { id: params.id }, data: data
        });
        return new Response(
            JSON.stringify({ appointment: updatedAppointment }),
            {
                status: 200, headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }
    catch (e) {
        return new Response(
            JSON.stringify({ message: "Termin konnte nicht aktualisiert werden", error: e }),
            {
                status: 500, headers: { "Content-Type": "application/json" }
            }
        )
    }
}