interface ModalityResponse {
    data: any;
}

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const slug = getQuery(event).slug;
    
    try {
        const modality = await $fetch<ModalityResponse>(config.directus_url + "/items/modalities", {
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
        return modality.data[0];
    } catch (e) {
        console.error(e);
    }
})