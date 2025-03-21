import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const GET = async ({ url }) => {
    try {
        let fields = {};
        url.searchParams.forEach((value, key) => {
            fields[key] = (value === "true" ? true : (value === "false" ? false : value));
        });
        const pins = await prisma.pin.findMany({
            orderBy: [{ name: 'asc' }],
            where: fields
        });
        return new Response(
            JSON.stringify({ pins: pins }),
            {
                status: 200, headers: { "Content-Type": "application/json" }
            }
        );
    }
    catch (e) {
        return new Response(
            JSON.stringify({ message: "Flipperliste konnte nicht geladen werden", error: e.message }),
            {
                status: 500, headers: { "Content-Type": "application/json" }
            }
        )
    }
}