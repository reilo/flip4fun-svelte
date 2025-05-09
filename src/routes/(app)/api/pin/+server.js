import { PrismaClient } from "@prisma/client";
import { PinManu, PinType } from "@prisma/client";
import { logInfo } from '$lib/LogUtil';

const prisma = new PrismaClient();

export const GET = async ({ url }) => {
    logInfo("GET " + url);
    try {
        let fields = {};
        url.searchParams.forEach((value, key) => {
            if (!["manu", "year", "type", "active", "owner"].includes(key)) {
                throw key + " ist kein gültiger Suchparameter";
            }
            if (value === "true") {
                fields[key] = true;
            } else if (parseInt(value)) {
                fields[key] = parseInt(value);
            } else if (key === "manu") {
                if (Object.values(PinManu).includes(value)) {
                    fields[key] = PinManu[value];
                } else {
                    throw value + " ist kein gültiger Wert für " + key;
                }
            } else if (key === "type") {
                if (Object.values(PinType).includes(value)) {
                    fields[key] = PinType[value];
                } else {
                    throw value + " ist kein gültiger Wert für " + key;
                }
            } else {
                fields[key] = value;
            }
        });
        const pins = await prisma.pin.findMany({
            orderBy: [{ name: 'asc' }],
            where: fields
        });
        return new Response(
            JSON.stringify({ pins: pins }),
            {
                status: 200, headers: { "Content-Type": "application/json" }
            }
        );
    }
    catch (e) {
        return new Response(
            JSON.stringify({ message: "Flipperliste konnte nicht geladen werden", error: typeof e == 'string' ? e : e.message }),
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
        if (!body.name) {
            throw "name is undefined or empty";
        }

        let data = {};
        Object.keys(body).forEach((key)=> {
            if (key === "year") {
                data.year = parseInt(body.year);    
            } else if (["id", "name", "code", "manu", "type", "owner"].includes(key)) {
                data[key] = body[key];
            }
        })

        const pin = await prisma.pin.create({
            data
        });
        return new Response(
            JSON.stringify({ pin: pin }),
            {
                status: 200, headers: { "Content-Type": "application/json" }
            }
        );
    } catch (e) {

        return new Response(
            JSON.stringify({ message: "Flipper konnte nicht gespeichert werden", error: typeof e == 'string' ? e : e.message }),
            {
                status: 500, headers: { "Content-Type": "application/json" }
            }
        )
    }
}