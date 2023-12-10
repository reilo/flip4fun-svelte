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
            JSON.stringify({ message: "Terminliste konnte nicht geladen werden", error: e }),
            {
                status: 500, headers: { "Content-Type": "application/json" }
            }
        )
    }
}