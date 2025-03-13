import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const GET = async () => {
    try {
        const players = await prisma.player.findMany({
            orderBy: [{ forename: 'asc' }, { surname: 'asc' }]
        });
        return new Response(
            JSON.stringify({ players: players }),
            {
                status: 200, headers: { "Content-Type": "application/json" }
            }
        );
    }
    catch (e) {
        return new Response(
            JSON.stringify({ message: "Spielerliste konnte nicht geladen werden", error: e }),
            {
                status: 500, headers: { "Content-Type": "application/json" }
            }
        )
    }
}