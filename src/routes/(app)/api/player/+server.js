import { PrismaClient } from "@prisma/client";
import { logInfo } from '$lib/LogUtil';

const prisma = new PrismaClient();

export const GET = async ({ url }) => {
    logInfo("GET " + url);
    try {
        let fields = {};
        url.searchParams.forEach((value, key) => {
            if (!["forename", "surname", "", "active"].includes(key)) {
                throw key + " ist kein gültiger Suchparameter";
            }
            if (value === "true") {
                fields[key] = true;
            } else {
                fields[key] = value;
            }
        });
        const players = await prisma.player.findMany({
            orderBy: [{ forename: 'asc' }, { surname: 'asc' }],
            where: fields
        });
        return new Response(
            JSON.stringify({ players: players }),
            {
                status: 200, headers: { "Content-Type": "application/json" }
            }
        );
    }
    catch (e) {
        return new Response(
            JSON.stringify({ message: "Spielerliste konnte nicht geladen werden", error: typeof e == 'string' ? e : e.message }),
            {
                status: 500, headers: { "Content-Type": "application/json" }
            }
        )
    }
}

export const POST = async ({ url, request }) => {
    logInfo("POST " + url);
    try {
        const body = await request.json();

        if (!body.id) {
            throw "id is undefined or empty";
        }
        if (!body.forename) {
            throw "forename is undefined or empty";
        }
        if (!body.surname) {
            throw "surname are undefined or empty";
        }

        let data = {};
        Object.keys(body).forEach((key) => {
            if (["id", "forename", "surname", "shortname", "email"].includes(key)) {
                data[key] = body[key];
            }
        })

        const player = await prisma.player.create({
            data
        });
        return new Response(
            JSON.stringify({ player: player }),
            {
                status: 200, headers: { "Content-Type": "application/json" }
            }
        );
    } catch (e) {

        return new Response(
            JSON.stringify({ message: "Spieler konnte nicht gespeichert werden", error: typeof e == 'string' ? e : e.message }),
            {
                status: 500, headers: { "Content-Type": "application/json" }
            }
        )
    }
}