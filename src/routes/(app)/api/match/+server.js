import { PrismaClient } from "@prisma/client";
import { logInfo } from '$lib/LogUtil';

const prisma = new PrismaClient();

export const GET = async ({ url }) => {
    logInfo("GET " + url);
    try {
        let fields = {};
        url.searchParams.forEach((value, key) => {
            if (!["pin", "tid", "rid"].includes(key)) {
                throw key + " ist kein gültiger Suchparameter";
            } else {
                fields[key] = value;
            }
        });
        const matches = await prisma.match.findMany({
            orderBy: [{ name: 'asc' }],
            where: fields
        });
        return new Response(
            JSON.stringify({ matches: matches }),
            {
                status: 200, headers: { "Content-Type": "application/json" }
            }
        );
    }
    catch (e) {
        return new Response(
            JSON.stringify({ message: "Matches konnten nicht geladen werden", error: typeof e == 'string' ? e : e.message }),
            {
                status: 500, headers: { "Content-Type": "application/json" }
            }
        )
    }
}

