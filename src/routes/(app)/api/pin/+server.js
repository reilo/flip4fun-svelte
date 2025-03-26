import { PrismaClient } from "@prisma/client";
import { PinManu, PinType } from "@prisma/client";
const prisma = new PrismaClient();

export const GET = async ({ url }) => {
    try {
        let fields = {};
        url.searchParams.forEach((value, key) => {
            if (!["manu", "year", "type", "active"].includes(key)) {
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
                } else{
                    throw value + " ist kein gültiger Wert für " + key;
                }
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