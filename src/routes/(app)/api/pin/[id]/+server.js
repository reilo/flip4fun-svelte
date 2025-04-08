import { PrismaClient } from "@prisma/client";
import { logInfo } from '$lib/LogUtil';

const prisma = new PrismaClient();

export const PUT = async ({ url, params, request }) => {
    logInfo("PUT " + url);
    try {
        const body = await request.json();
        let data = {};
        Object.keys(body).forEach((key) => {
            if (key === "year") {
                data.year = parseInt(body.year);
            } else if (["active", "deleted"].includes(key) && body[key] != null) {
                data[key] = body[key];
            } else if (["name", "code", "manu", "type", "owner"].includes(key)) {
                data[key] = body[key];
            }
        });
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

export const DELETE = async ({ url, params }) => {
    logInfo("DELETE " + url);
    try {
        const deletedPin = await prisma.pin.delete({
            where: { id: params.id }
        });
        return new Response(
            JSON.stringify({ pin: deletedPin }),
            {
                status: 200, headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }
    catch (e) {
        return new Response(
            JSON.stringify({ message: "Flipper konnte nicht gelöscht werden", error: e.message }),
            {
                status: 500, headers: { "Content-Type": "application/json" }
            }
        )
    }
}