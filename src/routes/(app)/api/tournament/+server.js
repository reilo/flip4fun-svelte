import { PrismaClient } from "@prisma/client";
import { Status } from "@prisma/client";
import { isValidTourType } from "$lib/TourUtil.js";
import { logInfo } from '$lib/LogUtil';

const prisma = new PrismaClient();

export const GET = async ({ url }) => {
    logInfo("GET " + url);
    try {
        let fields = {};
        url.searchParams.forEach((value, key) => {
            if (!["type", "status"].includes(key)) {
                throw key + " ist kein gültiger Suchparameter";
            }
            if (value === "true") {
                fields[key] = true;
            } else if (key === "type") {
                fields[key] = value;
            } else if (key === "status") {
                if (Object.values(Status).includes(value)) {
                    fields[key] = Status[value];
                } else {
                    throw value + " ist kein gültiger Wert für " + key;
                }
            }
        });
        const tournaments = await prisma.tourney.findMany({
            orderBy: [{ name: 'asc' }],
            where: fields
        });
        return new Response(
            JSON.stringify({ tournaments: tournaments }),
            {
                status: 200, headers: { "Content-Type": "application/json" }
            }
        );
    }
    catch (e) {
        return new Response(
            JSON.stringify({ message: "Turnierliste konnte nicht geladen werden", error: typeof e == 'string' ? e : e.message }),
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

        if (!body.name) {
            throw "name is undefined or empty";
        }
        if (!body.type) {
            throw "type is undefined or empty";
        } else if (!isValidTourType(body.type)) {
            throw "type " + body.type + " is unknown";
        }
        if (!body.settings) {
            throw "settings are undefined or empty";
        }

        let data = {
            name: body.name,
            type: body.type
        }
        if (body.id) {
            data.id = body.id;
        }
        if (body.status) {
            data.status = body.status;
        }
        if (body.players) {
            data.players = body.players;
        }
        if (body.settings) {
            data.settings = body.settings;
        }
        if (body.results) {
            data.results = body.results;
        }

        const tournament = await prisma.tourney.create({
            data
        });
        return new Response(
            JSON.stringify({ tournament: tournament }),
            {
                status: 200, headers: { "Content-Type": "application/json" }
            }
        );
    } catch (e) {

        return new Response(
            JSON.stringify({ message: "Turnier konnte nicht gespeichert werden", error: typeof e == 'string' ? e : e.message }),
            {
                status: 500, headers: { "Content-Type": "application/json" }
            }
        )
    }
}