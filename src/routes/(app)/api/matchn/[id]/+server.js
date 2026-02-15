import { PrismaClient } from "@prisma/client";
import { logInfo } from '$lib/LogUtil';

const prisma = new PrismaClient();

export const PUT = async ({ url, params, request }) => {
    logInfo("PUT " + url);
    try {
        const body = await request.json();
        let data = {};
        Object.keys(body).forEach((key) => {
            if (["name", "team1", "team2", "score1", "score2", "pin"].includes(key)) {
                data[key] = body[key];
            }
        })
        // Validate scores if provided
        if (data.score1 !== undefined || data.score2 !== undefined) {
            if (data.score1 === undefined || data.score2 === undefined) {
                throw "both score1 and score2 must be provided";
            }
            if (!((data.score1 === 1 && data.score2 === 0) || (data.score1 === 0 && data.score2 === 1))) {
                throw "score must be 1:0 or 0:1";
            }
        }
        const updatedMatchn = await prisma.matchn.update({
            where: { id: params.id }, data: data
        });
        return new Response(
            JSON.stringify({ matchn: updatedMatchn }),
            {
                status: 200, headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }
    catch (e) {
        return new Response(
            JSON.stringify({ message: "Matchn konnte nicht aktualisiert werden", error: e.message }),
            {
                status: 500, headers: { "Content-Type": "application/json" }
            }
        )
    }
}

export const DELETE = async ({ url, params }) => {
    logInfo("DELETE " + url);
    try {
        const matchn = await prisma.matchn.delete({
            where: { id: params.id }
        });
        return new Response(
            JSON.stringify({ matchn: matchn }),
            {
                status: 200, headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }
    catch (e) {
        return new Response(
            JSON.stringify({ message: "Matchn konnte nicht gelöscht werden", error: e.message }),
            {
                status: 500, headers: { "Content-Type": "application/json" }
            }
        )
    }
}