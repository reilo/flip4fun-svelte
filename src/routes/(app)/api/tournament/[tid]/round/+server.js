import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const GET = async ({ url, params }) => {
    try {
        const options = {
            where: { tid: params.tid },
            select: { id: true, tid: true, rid: true, name: true, status: true, created: true },
            orderBy: [{ created: 'asc' }]
        };
        const rounds = await prisma.round.findMany(options);
        return new Response(
            JSON.stringify({ rounds: rounds }),
            {
                status: 200, headers: { "Content-Type": "application/json" }
            }
        );
    }
    catch (e) {
        return new Response(
            JSON.stringify({ message: "Runden konnten nicht geladen werden", error: typeof e == 'string' ? e : e.message }),
            {
                status: 500, headers: { "Content-Type": "application/json" }
            }
        )
    }
}

export const POST = async ({ url, request, params }) => {
    try {
        const body = await request.json();

        if (!body.rid) {
            throw "round id is undefined or empty";
        }
        if (!body.name) {
            throw "name is undefined or empty";
        }

        let data = {
            rid: body.rid,
            tid: params.tid,
            name: body.name
        }
        if (body.status) {
            data.status = body.status;
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

        let round;
        if (!url.searchParams.has("updateTournamentStatus")) {
            round = await prisma.round.create({ data });
        } else {
            // make sure that after the first round is started also the tournament is in status Active
            round = prisma.$transaction(async (tx) => {
                // create round
                const result = await tx.round.create({
                    data
                });
                // update tournament status
                await tx.tourney.update({
                    where: { id: params.tid }, data: { status: "Active" }
                });
                return result;
            });
        }
        return new Response(
            JSON.stringify({ round: round }),
            {
                status: 200, headers: { "Content-Type": "application/json" }
            }
        );
    } catch (e) {

        return new Response(
            JSON.stringify({ message: "Runde konnte nicht gespeichert werden", error: typeof e == 'string' ? e : e.message }),
            {
                status: 500, headers: { "Content-Type": "application/json" }
            }
        )
    }
}
