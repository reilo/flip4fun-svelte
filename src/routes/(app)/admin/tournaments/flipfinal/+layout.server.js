export async function load({ fetch, params, parent }) {
    const { tournaments } = await parent();

    return { tournaments: tournaments };
}