import { PrismaClient } from "@prisma/client";
import { logInfo } from '$lib/LogUtil';

const prisma = new PrismaClient();

export const GET = async ({ url, params }) => {
    logInfo("GET " + url);
    try {
        const rounds = await prisma.round.findMany({
            where: { tid: params.tid, rid: parseInt(params.rid) }
        });
        if (rounds.length > 1) {
            throw "mehr als eine Runde für tid = " + tid + "rid = " + rid.toString() + " gefunden";
        }
        return new Response(
            JSON.stringify({ round: rounds[0] }),
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