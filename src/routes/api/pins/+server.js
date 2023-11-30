import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const GET = async () => {
    try {
        const pins = await prisma.pin.findMany({
            orderBy: [{ name: 'asc' }, { owner: 'asc' }]
        });
        return new Response(
            JSON.stringify(
                {
                    pins: pins
                }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }
    catch (e) {
        return new Response(
            JSON.stringify({
                message: "Flipperliste konnte nicht gelesen werden",
                error: e
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )
    }
}