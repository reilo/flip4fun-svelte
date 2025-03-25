import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { IsValidType } from "$lib/TourUtil.js";

export const GET = async ({ url }) => {
    try {
        let fields = {};
        url.searchParams.forEach((value, key) => {
            fields[key] = (value === "true" ? true : (value === "false" ? false : value));
        });
        const tournaments = await prisma.tournament.findMany({
            orderBy: [{ name: 'asc' }],
            select: { id: true, name: true, type: true, status: true },
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
            JSON.stringify({ message: "Turnierliste konnte nicht geladen werden", error: e.message }),
            {
                status: 500, headers: { "Content-Type": "application/json" }
            }
        )
    }
}

export const POST = async ({ request }) => {
    try {
        const body = await request.json();

        if (body.name === undefined) {
            throw "name is undefined";
        } else if (body.name === "") {
            throw "name is empty";
        }

        if (body.type === undefined) {
            throw "type is undefined";
        } else if (body.type === "") {
            throw "type is empty";
        } else if (!IsValidType(body.type)) {
            throw "type " + body.type + " is unknown";
        }

        if (body.settings === undefined) {
            throw "settings are undefined";
        } else if (body.settings === "") {
            throw "settings are empty";
        }

        let data = {
            name: body.name,
            type: body.type,
            status: body.status ? body.status : "Planned",
            players: body.players ? body.players : [],
            settings: body.settings ? body.settings : {},
            results: body.results ? body.results : {}
        }
        if (body.id) {
            data["id"] = body.id;
        }

        const tournament = await prisma.tournament.create({
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
            JSON.stringify({ message: "Turnier konnte nicht gespeichert werden", error: e.message }),
            {
                status: 500, headers: { "Content-Type": "application/json" }
            }
        )
    }
}