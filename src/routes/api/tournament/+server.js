import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const GET = async () => {
    try {
        const tournaments = await prisma.tournament.findMany({
            orderBy: [{ name: 'asc' }],
            select: {
                id: true,
                name: true,
                type: true,
                status: true,
                testMode: true,
                startDate: true,
                endDate: true
            }
        });
        return new Response(
            JSON.stringify({ tournaments: tournaments }),
            {
                status: 200, headers: { "Content-Type": "application/json" }
            }
        );
    }
    catch (e) {
        return new Response(
            JSON.stringify({ message: "Turnierliste konnte nicht geladen werden", error: e }),
            {
                status: 500, headers: { "Content-Type": "application/json" }
            }
        )
    }
}