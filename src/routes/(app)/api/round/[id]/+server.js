import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const PUT = async ({ request, params }) => {
    try {
        const body = await request.json();
        let data = {};
        if (body.name) {
            data.name = body.name;
        }
        if (body.players) {
            data.players = body.players;
        }
        if (body.settings) {
            data.settings = body.settings;
        }
        if (body.matches) {
            data.matches = body.matches;
        }
        if (body.results) {
            data.results = body.results;
        }
        if (body.cache) {
            data.cache = body.cache;
        }
        if (body.status) {
            data.status = body.status;
        }
        const updatedRound = await prisma.round.update({
            where: { id: params.id }, data: data
        });
        return new Response(
            JSON.stringify({ round: updatedRound }),
            {
                status: 200, headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    } catch (e) {
        return new Response(
            JSON.stringify({ message: "Runde konnte nicht aktualisiert werden", error: typeof e == 'string' ? e : e.message }),
            {
                status: 500, headers: { "Content-Type": "application/json" }
            }
        )
    }
}

export const DELETE = async ({ request, params }) => {
    try {
        const deletedRound = await prisma.round.delete({
            where: { id: params.id }
        });
        return new Response(
            JSON.stringify({ round: deletedRound }),
            {
                status: 200, headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }
    catch (e) {
        return new Response(
            JSON.stringify({ message: "Runde konnte nicht gelöscht werden", error: e.message }),
            {
                status: 500, headers: { "Content-Type": "application/json" }
            }
        )
    }
}