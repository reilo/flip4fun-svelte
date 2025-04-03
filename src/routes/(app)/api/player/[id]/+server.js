import { PrismaClient } from "@prisma/client";
import { logInfo } from '$lib/LogUtil';

const prisma = new PrismaClient();

export const PUT = async ({ url, params, request }) => {
    logInfo("PUT " + url);
    try {
        const body = await request.json();
        let data = {};
        if (body.active != null) {
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