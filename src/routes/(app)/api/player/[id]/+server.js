import { PrismaClient } from "@prisma/client";
import { logInfo } from '$lib/LogUtil';

const prisma = new PrismaClient();

export const PUT = async ({ url, params, request }) => {
    logInfo("PUT " + url);
    try {
        const body = await request.json();
        let data = {};
        Object.keys(body).forEach((key) => {
            if (["active"].includes(key) && body[key] != null) {
                data[key] = body[key];
            } else if (["forename", "surname", "shortname", "email"].includes(key)) {
                data[key] = body[key];
            }
        })
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

export const DELETE = async ({ url, params }) => {
    logInfo("DELETE " + url);
    try {
        const deletedPlayer = await prisma.player.delete({
            where: { id: params.id }
        });
        return new Response(
            JSON.stringify({ player: deletedPlayer }),
            {
                status: 200, headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }
    catch (e) {
        return new Response(
            JSON.stringify({ message: "Spieler konnte nicht gelöscht werden", error: e.message }),
            {
                status: 500, headers: { "Content-Type": "application/json" }
            }
        )
    }
}