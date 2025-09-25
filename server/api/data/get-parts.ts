interface PartsResponse {
    data: any;
    meta: any;
}

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const query = getQuery(event);

    // Build Directus filter object
    const filter: any = {};
    
    // Prefer slug-based filtering if provided; fall back to ID-based
    if (query.manufacturer_slug) {
        filter.manufacturer = { slug: { _eq: query.manufacturer_slug } };
    } else if (query.manufacturer_id) {
        filter.manufacturer = { _eq: query.manufacturer_id };
    }
    
    // Modalities is a many-to-many relation on parts (field: `modalities`).
    // To filter by modality slug/id, we must target the junction field `modalities.modalities_id`.
    if (query.modality_slug) {
        filter.modalities = { modalities_id: { slug: { _eq: query.modality_slug } } };
    } else if (query.modality_id) {
        filter.modalities = { modalities_id: { _eq: query.modality_id } };
    }    
    
    const directusParams: any = {
        search: query.search || '',
        sort: '-sort',
        filter: filter,
        limit: query.limit || 25,
        offset: query.offset || 0,
        // Removed pricing-related fields (list_price, prices.*)
        fields: ['id', 'part_number', 'title', 'manufacturer.slug', 'manufacturer.name', 'primary_image.id', 'slug'],
        aggregate: {}
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

