import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const GET = async ({ url, params }) => {
    try {
        const options = {
            where: {
                tid: params.tid
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
