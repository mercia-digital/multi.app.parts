interface PartsResponse {
    data: any;
    meta: any;
}

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const query = getQuery(event);

    // Build Directus filter object
    const filter: any = {};
    
    if (query.manufacturer_id) {
        filter.manufacturer = { _eq: query.manufacturer_id };
    }
    
    if (query.modality_id) {
        filter.modality = { _eq: query.modality_id };
    }    
    
    const directusParams = {
        search: query.search || '',
        sort: '-sort',
        filter: filter,
        limit: query.limit || 25,
        offset: query.offset || 0,
        fields: ['id', 'part_number', 'title', 'list_price', 'manufacturer.slug', 'manufacturer.name', 'prices.*', 'primary_image.id', 'slug'],
        aggregate: {},
        deep: {
            "prices": {
                "_filter": {
                    "customer": {
                        "Customer_Name": { _eq: query.customer_name }
                    }
                }
            }
        }
    };

    if (query.search) {
        directusParams.search = query.search;
    }

    try {
        const parts = await $fetch<PartsResponse>(config.directus_url + "/items/parts", {
            params: directusParams,
            headers: {
                Authorization: "Bearer " + config.directus_token,
            },
        });
        
        directusParams.aggregate = { countDistinct: ['id'] };
        directusParams.offset = 0;
        const meta = await $fetch<PartsResponse>(config.directus_url + "/items/parts", {
            params: directusParams,
            headers: {
                Authorization: "Bearer " + config.directus_token,
            },
        });

        const count = meta.data[0]?.countDistinct.id;
        return { parts: parts.data, meta: { filter_count: count } };
    } catch (e) {
        console.error(e);
    }
})
