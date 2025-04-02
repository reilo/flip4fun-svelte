// PUT not implemented as not needed

export const DELETE = async ({ request, params }) => {
    try {
        const deletedMatch = await prisma.match.delete({
            where: { id: params.id }
        });
        return new Response(
            JSON.stringify({ match: deletedMatch }),
            {
                status: 200, headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }
    catch (e) {
        return new Response(
            JSON.stringify({ message: "Match konnte nicht gelöscht werden", error: e.message }),
            {
                status: 500, headers: { "Content-Type": "application/json" }
            }
        )
    }
}