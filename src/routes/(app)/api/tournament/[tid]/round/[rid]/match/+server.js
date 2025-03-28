import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const GET = async ({ url, params }) => {
    try {
        const options = {
            where: {
                tid: params.tid,
                rid: parseInt(params.rid)
            },
            select: {
                createdAt: true,
                tid: true,
                rid: true,
                player1: true,
                player2: true,
                score1: true,
                score2: true,
                pin: true
            },
            orderBy: [
                { createdAt: 'asc' }
            ]
        };
        const matches = await prisma.match.findMany(options);
        return new Response(
            JSON.stringify({ matches: matches }),
            {
                status: 200, headers: { "Content-Type": "application/json" }
            }
        );
    }
    catch (e) {
        return new Response(
            JSON.stringify({ message: "Matches konnten nicht geladen werden", error: typeof e == 'string' ? e : e.message }),
            {
                status: 500, headers: { "Content-Type": "application/json" }
            }
        )
    }
}

export const POST = async ({ request, params }) => {
    try {
        const body = await request.json();
        if (!body.name) {
            throw "name is undefined or empty";
        }
        if (!body.player1) {
            throw "player1 is undefined or empty";
        }
        if (!body.player2) {
            throw "player2 is undefined or empty";
        }
        if (body.score1 === null) {
            throw "score1 is undefined or empty";
        }
        if (!body.score2 === null) {
            throw "score2 is undefined or empty";
        }
        if (!body.pin) {
            throw "pin is undefined or empty";
        }

        let data = {
            tid: params.tid,
            rid: parseInt(params.rid),
            name: body.name,
            player1: body.player1,
            player2: body.player2,
            score1: parseInt(body.score1),
            score2: parseInt(body.score2),
            pin: body.pin
        }

        const match = await prisma.match.create({
            data
        });
        return new Response(
            JSON.stringify({ match: match }),
            {
                status: 200, headers: { "Content-Type": "application/json" }
            }
        );
    } catch (e) {

        return new Response(
            JSON.stringify({ message: "Match konnte nicht gespeichert werden", error: typeof e == 'string' ? e : e.message }),
            {
                status: 500, headers: { "Content-Type": "application/json" }
            }
        )
    }
}
