import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const GET = async ({ params }) => {
    try {
        const options = {
            where: { tid: params.tid },
            select: { rid: true, status: true },
            orderBy: [{ rid: 'asc' }]
        };
        const rounds = await prisma.round.findMany(options);
        let rounds2 = [];
        rounds.forEach((round) => {
            rounds2.push({ rid: round.rid, status: round.status })
        })
        return new Response(
            JSON.stringify({ rounds: rounds2 }),
            {
                status: 200, headers: { "Content-Type": "application/json" }
            }
        );
    }
    catch (e) {
        return new Response(
            JSON.stringify({ message: "Runden konnten nicht geladen werden", error: e.message }),
            {
                status: 500, headers: { "Content-Type": "application/json" }
            }
        )
    }
}

export const POST = async ({ request, params }) => {
    try {
        const body = await request.json();

        if (body.rid === undefined) {
            throw "round id is undefined";
        } else if (body.rid === "") {
            throw "round id is empty";
        }

        if (body.name === undefined) {
            throw "name is undefined";
        } else if (body.name === "") {
            throw "name is empty";
        }

        let data = {
            rid: body.rid,
            tid: params.tid,
            name: body.name,
            status: body.status ? body.status : "Planned",
            players: body.players ? body.players : [],
            settings: body.settings ? body.settings : {},
            matches: body.matches ? body.matches : [],
            results: body.results ? body.results : {},
            tempData: body.tempData ? body.tempData : {}
        }

        const round = await prisma.round.create({
            data
        });
        return new Response(
            JSON.stringify({ round: round }),
            {
                status: 200, headers: { "Content-Type": "application/json" }
            }
        );
    } catch (e) {

        return new Response(
            JSON.stringify({ message: "Runde konnte nicht gespeichert werden", error: e.message }),
            {
                status: 500, headers: { "Content-Type": "application/json" }
            }
        )
    }
}
