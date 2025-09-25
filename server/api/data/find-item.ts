interface ItemResponse {
    data: any;
}

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const { slug, collection } = getQuery(event);
    
    if (!collection) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Collection not specified',
        });
    }

    try {
        const item = await $fetch<ItemResponse>(config.directus_url + "/items/" + collection, {
            headers: {
                Authorization: "Bearer " + config.directus_token,
            },
            params: {
                filter: {
                    _and: [
                      {
                        _and: [
                          {
                            slug: {
                              _eq: slug
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
                }
            },
        });
        return item.data[0];
    } catch (e) {
        console.error(e);
    }
})
