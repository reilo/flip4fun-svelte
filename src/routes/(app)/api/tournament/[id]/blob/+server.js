import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const GET = async ({ params }) => {
    try {
        const options = {
            where: {
                id: params.id,
                type: 'blob'
            }
        };
        const blobs = await prisma.tournament.findMany(options);
        return new Response(
            JSON.stringify({ blobs: blobs }),
            {
                status: 200, headers: { "Content-Type": "application/json" }
            }
        );
    }
    catch (e) {
        return new Response(
            JSON.stringify({ message: "Blobs konnten nicht geladen werden", error: e.message }),
            {
                status: 500, headers: { "Content-Type": "application/json" }
            }
        )
    }
}