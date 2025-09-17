interface CustomerResponse {
    data: any;
}

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const user_id = getQuery(event).user_id;

    try {
        const customer = await $fetch<CustomerResponse>(config.directus_url + "/items/customers", {
            headers: {
                Authorization: "Bearer " + config.directus_token,
            },
            params: {
                filter: {
                    users: {
                        'item:directus_users': {
                            id: {
                                _eq: user_id
                            }
                        }
                    },
                    status: {
                        _neq: 'archived'
                    }
                }
            },
        });
        return customer.data[0];
    } catch (e) {
        console.error(e);
    }
})