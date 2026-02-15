import { PrismaClient } from "@prisma/client";
import { logInfo } from '$lib/LogUtil';

const prisma = new PrismaClient();

export const GET = async ({ url, params }) => {
    logInfo("GET " + url);
    try {
        const options = {
            where: {
                tid: params.tid,
                rid: parseInt(params.rid)
            },
            orderBy: [
                { created: 'asc' }
            ]
        };
        const matchns = await prisma.matchn.findMany(options);
        return new Response(
            JSON.stringify({ matchns: matchns }),
            {
                status: 200, headers: { "Content-Type": "application/json" }
            }
        );
    }
    catch (e) {
        return new Response(
            JSON.stringify({ message: "Matchns konnten nicht geladen werden", error: typeof e == 'string' ? e : e.message }),
            {
                status: 500, headers: { "Content-Type": "application/json" }
            }
        )
    }
}

export const POST = async ({ url, params, request }) => {
    logInfo("POST " + url);
    try {
        const body = await request.json();
        if (!body.name) {
            throw "name is undefined or empty";
        }
        if (!body.team1) {
            throw "team1 is undefined or empty";
        }
        if (!body.team2) {
            throw "team2 is undefined or empty";
        }
        if (body.score1 === null) {
            throw "score1 is undefined or empty";
        }
        if (body.score2 === null) {
            throw "score2 is undefined or empty";
        }
        if (!((body.score1 === 1 && body.score2 === 0) || (body.score1 === 0 && body.score2 === 1))) {
            throw "score must be 1:0 or 0:1";
        }
        if (!body.pin) {
            throw "pin is undefined or empty";
        }

        let data = {
            tid: params.tid,
            rid: parseInt(params.rid),
            name: body.name,
            team1: body.team1,
            team2: body.team2,
            score1: parseInt(body.score1),
            score2: parseInt(body.score2),
            pin: body.pin
        }
        const matchn = await prisma.matchn.create({ data });
        return new Response(
            JSON.stringify({ matchn: matchn }),
            {
                status: 200, headers: { "Content-Type": "application/json" }
            }
        );
    } catch (e) {

        return new Response(
            JSON.stringify({ message: "Matchn konnte nicht gespeichert werden", error: typeof e == 'string' ? e : e.message }),
            {
                status: 500, headers: { "Content-Type": "application/json" }
            }
        )
    }
}