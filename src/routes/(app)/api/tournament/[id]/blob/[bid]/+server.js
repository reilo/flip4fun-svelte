import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const GET = async ({ params }) => {
    try {
        let blob = await prisma.tournament.findUniqueOrThrow({
            where: {
                id: params.id + ":" + params.bid
            },
            select: { id: true, status: true, results: true }
        });
        blob["blobid"] = params.bid;
        return new Response(
            JSON.stringify({ blob: blob }),
            {
                status: 200, headers: { "Content-Type": "application/json" }
            }
        );
    }
    catch (e) {
        return new Response(
            JSON.stringify({ message: "Blob konnte nicht geladen werden", error: e.message }),
            {
                status: 500, headers: { "Content-Type": "application/json" }
            }
        )
    }
}
