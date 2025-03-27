import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const GET = async ({ url, params }) => {
    try {
        let expandResults = false;
        url.searchParams.forEach((value, key) => {
            if (!["expand"].includes(key)) {
                throw key + " ist kein gültiger Suchparameter";
            }
            if (key === "expand") {
                if (value === "true") {
                    expandResults = true;
                } else {
                    throw value + " ist kein gültiger Wert für " + key;
                }
            }
        });

        const options = {
            where: { tid: params.tid },
            select: { tid: true, rid: true, name: true, status: true, matches: expandResults },
            orderBy: [{ rid: 'asc' }]
        };
        const rounds = await prisma.round.findMany(options);
        let rounds2 = [];
        rounds.forEach((round) => {
            let entry = { tid: round.tid, rid: round.rid, name: round.name, status: round.status };
            if (expandResults) {
                entry["matches"] = round.matches;
            }
            rounds2.push(entry)
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
            JSON.stringify({ message: "Runden konnten nicht geladen werden", error: typeof e == 'string' ? e : e.message }),
            {
                status: 500, headers: { "Content-Type": "application/json" }
            }
        )
    }
}

export const POST = async ({ request, params }) => {
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
            JSON.stringify({ message: "Runde konnte nicht gespeichert werden", error: typeof e == 'string' ? e : e.message }),
            {
                status: 500, headers: { "Content-Type": "application/json" }
            }
        )
    }
}
