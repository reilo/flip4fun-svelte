import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const GET = async ({ params }) => {
    try {
        let round = await prisma.round.findUniqueOrThrow({
            where: { tid_rid: { tid: params.tid, rid: parseInt(params.rid) } }
        });
        return new Response(
            JSON.stringify({ round: round }),
            {
                status: 200, headers: { "Content-Type": "application/json" }
            }
        );
    }
    catch (e) {
        return new Response(
            JSON.stringify({ message: "Runde konnte nicht geladen werden", error: e.message }),
            {
                status: 500, headers: { "Content-Type": "application/json" }
            }
        )
    }
}

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
        if (body.tempData) {
            data.tempData = body.tempData;
        }
        if (body.status) {
            data.status = body.status;
        }
        const updatedRound = await prisma.round.update({
            where: { tid_rid: { tid: params.tid, rid: parseInt(params.rid) } }, data: data
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
            JSON.stringify({ message: "Runde konnte nicht geändert werden", error: e.message }),
            {
                status: 500, headers: { "Content-Type": "application/json" }
            }
        )
    }
}