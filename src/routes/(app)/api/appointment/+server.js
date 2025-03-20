import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const GET = async () => {
    try {
        const appointments = await prisma.appointment.findMany({
            orderBy: [{ date: 'asc' }]
        });
        return new Response(
            JSON.stringify({ appointments: appointments }),
            {
                status: 200, headers: { "Content-Type": "application/json" }
            }
        );
    }
    catch (e) {
        return new Response(
            JSON.stringify({ message: "Terminliste konnte nicht geladen werden", error: e.message }),
            {
                status: 500, headers: { "Content-Type": "application/json" }
            }
        )
    }
}

export const POST = async ({ request }) => {
    try {
        const body = await request.json();
        let data = {};

        if (body.date === undefined) {
            throw "date is undefined";
        } else {
            data.date = body.date;
        }

        if (body.guests === undefined || body.guests == []) {
            data.guests = [];
        } else {
            data.guests = body.guests;
        }

        if (body.counts === undefined || body.counts == []) {
            data.counts = [];
        } else {
            data.counts = body.counts;
        }

        const appointment = await prisma.appointment.create({
            data
        });
        return new Response(
            JSON.stringify({ appointment: appointment }),
            {
                status: 200, headers: { "Content-Type": "application/json" }
            }
        );
    } catch (e) {

        return new Response(
            JSON.stringify({ message: "Termin konnte nicht angelegt werden", error: e.message }),
            {
                status: 500, headers: { "Content-Type": "application/json" }
            }
        )
    }
}