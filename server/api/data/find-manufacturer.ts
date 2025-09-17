interface ManufacturerResponse {
    data: any;
}

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const slug = getQuery(event).slug;
    
    try {
        const manufacturer = await $fetch<ManufacturerResponse>(config.directus_url + "/items/manufacturers", {
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
        return manufacturer.data[0];
    } catch (e) {
        console.error(e);
    }
})