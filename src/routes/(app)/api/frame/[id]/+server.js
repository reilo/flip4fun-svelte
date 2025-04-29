import { PrismaClient } from "@prisma/client";
import { logInfo } from '$lib/LogUtil';

const prisma = new PrismaClient();

export const PUT = async ({ url, params, request }) => {
    logInfo("PUT " + url);
    try {
        const body = await request.json();
        let data = {};
        Object.keys(body).forEach((key) => {
        if (["players", "scores", "pin"].includes(key)) {
                data[key] = body[key];
            }
        })
        const updatedFrame = await prisma.frame.update({
            where: { id: params.id }, data: data
        });
        return new Response(
            JSON.stringify({ frame: updatedFrame }),
            {
                status: 200, headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }
    catch (e) {
        return new Response(
            JSON.stringify({ message: "Frame konnte nicht aktualisiert werden", error: e.message }),
            {
                status: 500, headers: { "Content-Type": "application/json" }
            }
        )
    }
}

export const DELETE = async ({ url, params }) => {
    logInfo("DELETE " + url);
    try {
        const frame = await prisma.frame.delete({
            where: { id: params.id }
        });
        return new Response(
            JSON.stringify({ frame: frame }),
            {
                status: 200, headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }
    catch (e) {
        return new Response(
            JSON.stringify({ message: "Frame konnte nicht gelöscht werden", error: e.message }),
            {
                status: 500, headers: { "Content-Type": "application/json" }
            }
        )
    }
}