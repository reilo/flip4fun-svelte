import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const PUT = async ({ request, params }) => {
    try {
        const body = await request.json();
        let data = {};
        if (body.active) {
            data.active = body.active;
        }
        if (body.forename) {
            data.forename = body.forename;
        }
        if (body.surname) {
            data.surname = body.surname;
        }
        if (body.shortname) {
            data.shortname = body.shortname;
        }
        if (body.email) {
            data.email = body.email;
        }
        const updatedPlayer = await prisma.player.update({
            where: { id: params.id }, data: data
        });
        return new Response(
            JSON.stringify({ player: updatedPlayer }),
            {
                status: 200, headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }
    catch (e) {
        return new Response(
            JSON.stringify({ message: "Spieler konnte nicht aktualisiert werden", error: e.message }),
            {
                status: 500, headers: { "Content-Type": "application/json" }
            }
        )
    }
}