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
        if (body.deleted != null) {
            data.deleted = body.deleted;
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
        if (body.owner) {
            data.owner = body.owner;
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