import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const GET = async ({ url }) => {
    try {
        let fields = {};
        url.searchParams.forEach((value, key) => {
            fields[key] = (value === "true" ? true : (value === "false" ? false : value));
        });
        const players = await prisma.player.findMany({
            orderBy: [{ forename: 'asc' }, { surname: 'asc' }],
            where: fields
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
            JSON.stringify({ message: "Spielerliste konnte nicht geladen werden", error: e.message }),
            {
                status: 500, headers: { "Content-Type": "application/json" }
            }
        )
    }
}