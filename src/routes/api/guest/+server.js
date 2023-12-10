import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const GET = async () => {
    try {
        const guests = await prisma.guest.findMany({
            orderBy: [{ name: 'asc' }]
        });
        return new Response(
            JSON.stringify({ guests: guests }),
            {
                status: 200, headers: { "Content-Type": "application/json" }
            }
        );
    }
    catch (e) {
        return new Response(
            JSON.stringify({ message: "Gästeliste konnte nicht geladen werden", error: e }),
            {
                status: 500, headers: { "Content-Type": "application/json" }
            }
        )
    }
}