import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const PUT = async ({ request, params }) => {
    try {
        const body = await request.json();
        console.log(body);
        let data = {};
        if (body.active !== undefined) {
            data.active = body.active;
        }
        const updatedPin = await prisma.pin.update({
            where: { id: params.id }, data: data
        });
        return new Response(
            JSON.stringify({ pin: updatedPin }),
            {
                status: 200, headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }
    catch (e) {
        return new Response(
            JSON.stringify({ message: "Flipper konnte nicht aktualisiert werden", error: e.message }),
            {
                status: 500, headers: { "Content-Type": "application/json" }
            }
        )
    }
}