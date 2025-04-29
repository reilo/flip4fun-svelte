import { PrismaClient } from "@prisma/client";
import { logInfo } from '$lib/LogUtil';

const prisma = new PrismaClient();

export const GET = async ({ url, params }) => {
    logInfo("GET " + url);
    try {
        const options = {
            where: {
                tid: params.tid
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
