import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const PUT = async ({ request, params }) => {
    try {
        const body = await request.json();
        let data = {};
        if (body.active != null) {
            data.active = body.active;
        }
        if (body.name) {
            data.name = body.name;
        }
        if (body.code) {
            data.code = body.code;
        }
        if (body.manu) {
            data.manu = body.manu;
        }
        if (body.year) {
            data.year = parseInt(body.year);
        }
        if (body.type) {
            data.type = body.type;
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