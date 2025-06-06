import { PrismaClient } from "@prisma/client";
import { logInfo } from '$lib/LogUtil';

const prisma = new PrismaClient();

export const GET = async ({ url, params }) => {
    logInfo("GET " + url);
    try {
        const tournament = await prisma.tourney.findUniqueOrThrow({
            where: { id: params.tid }
        });
        return new Response(
            JSON.stringify({ tournament: tournament }),
            {
                status: 200, headers: { "Content-Type": "application/json" }
            }
        );
    }
    catch (e) {
        return new Response(
            JSON.stringify({ message: "Turnier konnte nicht geladen werden", error: e.message }),
            {
                status: 500, headers: { "Content-Type": "application/json" }
            }
        )
    }
}

export const PUT = async ({ url, params, request }) => {
    logInfo("PUT " + url);
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
        if (body.results) {
            data.results = body.results;
        }
        if (body.status) {
            data.status = body.status;
        }
        const updatedTournament = await prisma.tourney.update({
            where: { id: params.tid }, data: data
        });
        return new Response(
            JSON.stringify({ tournament: updatedTournament }),
            {
                status: 200, headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    } catch (e) {
        return new Response(
            JSON.stringify({ message: "Turnier konnte nicht geändert werden", error: e.message }),
            {
                status: 500, headers: { "Content-Type": "application/json" }
            }
        )
    }
}

export const DELETE = async ({ url, params }) => {
    logInfo("DELETE " + url);
    try {
        let deletedTourney;
        if (!url.searchParams.has("deleteDependencies")) {
            deletedTourney = await prisma.tourney.delete({
                where: { id: params.tid }
            });
        } else {
            // make sure that after deleting the tournament, all dependent rounds and matches are also deleted
            deletedTourney = await prisma.$transaction(async (tx) => {
                const result = await tx.tourney.delete({
                    where: { id: params.tid }
                });
                // delete rounds of this tournament
                await tx.round.deleteMany({
                    where: { tid: params.tid },
                });
                // delete matches of this tournament
                await tx.match.deleteMany({
                    where: { tid: params.tid },
                });
                // delete frames of this tournament
                await tx.frame.deleteMany({
                    where: { tid: params.tid },
                });
                return result;
            });
        }
        return new Response(
            JSON.stringify({ tourney: deletedTourney }),
            {
                status: 200, headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }
    catch (e) {
        return new Response(
            JSON.stringify({ message: "Turnier konnte nicht gelöscht werden", error: e.message }),
            {
                status: 500, headers: { "Content-Type": "application/json" }
            }
        )
    }
}