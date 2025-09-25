interface CollectionResponse {
    data: any[];
}

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const query = getQuery(event);
    const collection = query.collection;

    if (!collection) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Collection not specified',
        });
    }

    let sort = '';
    switch (collection) {
        case 'manufacturers':
            sort = 'sort';
            break;
        case 'modalities':
            sort = 'sort';
            break;
        default:
            sort = 'name';
    }

    try {
        const response = await $fetch<CollectionResponse>(config.directus_url + "/items/" + collection, {
            params: {
                sort: sort,
                limit: -1, // Retrieve all items
            },
            headers: {
                Authorization: "Bearer " + config.directus_token,
            },
        });
        return response.data;
    } catch (e) {
        console.error(e);
        throw createError({
            statusCode: 500,
            statusMessage: 'Error fetching collection',
        });
    }
});
