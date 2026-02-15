import { PrismaClient } from "@prisma/client";
import { logInfo } from '$lib/LogUtil';

const prisma = new PrismaClient();

export const GET = async ({ url, params }) => {
    logInfo("GET " + url);
    try {
        const options = {
            where: { tid: params.tid },
            select: { id: true, created: true, tid: true, rid: true, name: true, status: true, settings: true },
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

export const POST = async ({ url, params, request }) => {
    logInfo("POST " + url);
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
        if (body.results) {
            data.results = body.results;
        }
        if (body.cache) {
            data.cache = body.cache;
        }

        let round;
        if (url.searchParams.has("updateTournamentStatus")) {
            // make sure that after the first round is started also the tournament is in status Active
            round = await prisma.$transaction(async (tx) => {
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
        } else if (url.searchParams.has("addFrames")) {
            // make sure that after creating the round all frames are created too
            round = await prisma.$transaction(async (tx) => {
                // create round
                const result = await tx.round.create({
                    data
                });
                // create frames
                for (let idx = 0; idx < body.frames.length; idx++) {
                    const frame = body.frames[idx];
                    data = { tid: params.tid, rid: body.rid, lid: frame.lid, mid: frame.mid, name: frame.name, players: frame.players, pin: frame.pin, scores: frame.scores }
                    await tx.frame.create({
                        data
                    });
                }
                return result;
            });
        } else if (url.searchParams.has("addMatches")) {
            // make sure that after creating the round all matchn are created too
            round = await prisma.$transaction(async (tx) => {
                // create round
                const result = await tx.round.create({
                    data
                });
                // create matchn
                for (let idx = 0; idx < body.matches.length; idx++) {
                    const match = body.matches[idx];
                    const matchData = { tid: params.tid, rid: body.rid, name: match.name, team1: match.team1, team2: match.team2, score1: match.score1, score2: match.score2, pin: match.pin }
                    await tx.matchn.create({
                        data: matchData
                    });
                }
                return result;
            });
        } else {
            round = await prisma.round.create({ data });
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
