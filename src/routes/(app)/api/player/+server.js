import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const GET = async ({ url }) => {
    try {
        let fields = {};
        url.searchParams.forEach((value, key) => {
            if (!["forename", "surname", "", "active"].includes(key)) {
                throw key + " ist kein gültiger Suchparameter";
            }
            if (value === "true") {
                fields[key] = true;
            } else {
                fields[key] = value;
            }
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
            JSON.stringify({ message: "Spielerliste konnte nicht geladen werden", error: typeof e == 'string' ? e : e.message }),
            {
                status: 500, headers: { "Content-Type": "application/json" }
            }
        )
    }
}