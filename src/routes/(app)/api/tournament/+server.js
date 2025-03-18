import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const GET = async (data) => {
    try {
        const includeBlobs = data.url.searchParams.get("includeBlobs");
        let params = {
            orderBy: [{ name: 'asc' }],
            select: {
                id: true,
                name: true,
                type: true,
                status: true,
            }
        };
        if (includeBlobs === null) {
            params.where =  {
                NOT: {
                    type: 'blob'
                }
            };
        }
        const tournaments = await prisma.tournament.findMany(params);
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

        if (body.name === undefined) {
            throw "name is undefined";
        } else if (body.name === "") {
            throw "name is empty";
        }

        if (body.type === undefined) {
            throw "type is undefined";
        } else if (body.type === "") {
            throw "type is empty";
        } else if (body.type !== "flipfinal" && body.type !== "flipliga" && body.type !== "fliptwin") {
            throw "type " + body.type + " is unknown";
        }

        let startDate, endDate;
//        if (body.startDate !== undefined) {
//            startDate = body.startDate;
//        } else {
            startDate = (new Date()).toISOString();
//        }
//        if (body.endDate !== undefined) {
//            endDate = body.endDate;
//        } else {
            endDate = (new Date()).toISOString();
//        }

        const data = {
            name: body.name,
            type: body.type,
            //startDate: startDate,
            //endDate: endDate,
            players: [],
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