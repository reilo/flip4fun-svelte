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

export const POST = async ({ request }) => {
    try {
        const body = await request.json();
        const data = {
            name: body.name,
            type: body.type,
            startDate: body.startDate,
            endDate: body.endDate,
            players: [],
            arenas: [],
            settings: {},
            results: {}
        }
        const tournament = await prisma.tournament.create({
            data
        });
        return new Response(
            JSON.stringify({ tournament: tournament }),
            {
                status: 200, headers: { "Content-Type": "application/json" }
            }
        );
    } catch (e) {

        return new Response(
            JSON.stringify({ message: "Turnier konnte nicht gespeichert werden", error: e }),
            {
                status: 500, headers: { "Content-Type": "application/json" }
            }
        )
    }
}