import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const PUT = async ({ params, url }) => {
    try {
        const aUrl = new URL(url);
        const activeParam = aUrl.searchParams.get("active");
        if (activeParam == null) {
            throw "URL Parameter 'active' fehlt";
        }
        const active = (activeParam === 'true');

        const updatedPin = await prisma.pin.update({
            where: { id: params.id }, data: { active: active }
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