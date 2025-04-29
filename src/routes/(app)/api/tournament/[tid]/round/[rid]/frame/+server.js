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
        const frames = await prisma.frame.findMany(options);
        return new Response(
            JSON.stringify({ frames: frames }),
            {
                status: 200, headers: { "Content-Type": "application/json" }
            }
        );
    }
    catch (e) {
        return new Response(
            JSON.stringify({ message: "Frames konnten nicht geladen werden", error: typeof e == 'string' ? e : e.message }),
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
        if (!body.players) {
            throw "players is undefined or empty";
        }
        if (!body.pin) {
            throw "pin is undefined or empty";
        }

        let data = {
            tid: params.tid,
            rid: parseInt(params.rid),
            name: body.name,
            players: body.players,
            scores: body.scores,
            pin: body.pin
        }
        const frame = await prisma.frame.create({ data });
        return new Response(
            JSON.stringify({ frame: frame }),
            {
                status: 200, headers: { "Content-Type": "application/json" }
            }
        );
    } catch (e) {

        return new Response(
            JSON.stringify({ message: "Frame konnte nicht gespeichert werden", error: typeof e == 'string' ? e : e.message }),
            {
                status: 500, headers: { "Content-Type": "application/json" }
            }
        )
    }
}
