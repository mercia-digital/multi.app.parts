interface PartResponse {
    data: any;
}

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const manufacturer_slug = getQuery(event).manufacturer_slug;
    const part_slug = getQuery(event).part_slug;

    //TODO: need to use deep to only relevant pricing based on customer

    try {
        const part = await $fetch<PartResponse>(config.directus_url + "/items/parts", {
            headers: {
                Authorization: "Bearer " + config.directus_token,
            },
            params: {
                filter: {
                    _and: [
                        {
                            _and: [
                                {
                                    manufacturer: {
                                        slug: {
                                            _eq: manufacturer_slug
                                        }
                                    }
                                },
                                {
                                    slug: {
                                        _eq: part_slug
                                    }
                                }
                            ]
                        },
                        {
                            status: {
                                _neq: 'archived'
                            }
                        }
                    ]
                },
                // Request specific fields needed for the details page
                fields: [
                    'id',
                    'slug',
                    'title',
                    'part_number',
                    'content',
                    'condition',
                    'warranty',
                    'returnable',
                    'attributes',
                    'manufacturer.slug',
                    'manufacturer.name',
                    'primary_image.id',
                    'primary_image.title',
                    'gallery.directus_files_id.id',
                    'gallery.directus_files_id.title',
                    'modalities.modalities_id.name',
                    'modalities.modalities_id.slug'
                ]
            },
        });
        return part.data[0];
    } catch (e) {
        console.error(e);
    }
})