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