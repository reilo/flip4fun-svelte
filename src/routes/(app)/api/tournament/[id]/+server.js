import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const GET = async ({ params }) => {
    try {
        const tournament = await prisma.tournament.findUniqueOrThrow({
            where: { id: params.id }
        });
        return new Response(
            JSON.stringify({ tournament: tournament }),
            {
                status: 200, headers: { "Content-Type": "application/json" }
            }
        );
    }
    catch (e) {
        return new Response(
            JSON.stringify({ message: "Turnier konnte nicht geladen werden", error: e }),
            {
                status: 500, headers: { "Content-Type": "application/json" }
            }
        )
    }
}

export const PUT = async ({ request }) => {
    try {
        const body = await request.json();
        let data = {};
        if (body.name !== undefined && body.name !== "") {
            data.name = body.name;
        }
        if (body.startDate !== undefined) {
            data.startDate = body.startDate;
        }
        if (body.endDate !== undefined) {
            data.endDate = body.endDate;
        }
        if (body.players !== undefined && body.players != []) {
            data.players = body.players;
        }
        if (body.arenas !== undefined && body.arenas != []) {
            data.arenas = body.arenas;
        }
        if (body.settings !== undefined && body.settings != {}) {
            data.settings = body.settings;
        }
        if (body.results !== undefined && body.results != {}) {
            data.results = body.results;
        }
        const updatedTournament = await prisma.tournament.update({
            where: { id: params.id }, data: data
        });
        return new Response(
            JSON.stringify({ tournament: updatedTournament }),
            {
                status: 200, headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    } catch (e) {
        return new Response(
            JSON.stringify({ message: "Turnier konnte nicht geändert werden", error: e }),
            {
                status: 500, headers: { "Content-Type": "application/json" }
            }
        )
    }
}