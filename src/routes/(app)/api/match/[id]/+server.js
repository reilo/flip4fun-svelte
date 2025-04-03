import { PrismaClient } from "@prisma/client";
import { logInfo } from '$lib/LogUtil';

const prisma = new PrismaClient();

// PUT not implemented as not needed

export const DELETE = async ({ url, params }) => {
    logInfo("DELETE " + url);
    try {
        let match;
        if (!url.searchParams.has("updateCache")) {

            match = await prisma.match.delete({
                where: { id: params.id }
            });
        } else {
            // make sure that after deleting the match, the cache for the current round is updated
            match = prisma.$transaction(async (tx) => {
                // create match
                const result = await tx.match.delete({
                    where: { id: params.id }
                });
                // update round cache
                await tx.round.update({
                    where: { id: body.roundId }, data: { cache: body.cache }
                });
                return result;
            })
        }
        return new Response(
            JSON.stringify({ match: match }),
            {
                status: 200, headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }
    catch (e) {
        return new Response(
            JSON.stringify({ message: "Match konnte nicht gelöscht werden", error: e.message }),
            {
                status: 500, headers: { "Content-Type": "application/json" }
            }
        )
    }
}