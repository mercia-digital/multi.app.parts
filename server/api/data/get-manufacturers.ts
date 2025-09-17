interface ManufacturersResponse {
    data: any;
}

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    
    try {
        const manufacturers = await $fetch<ManufacturersResponse>(config.directus_url + "/items/manufacturers", {
            params: {
                sort: 'sort',
            },
            headers: {
                Authorization: "Bearer " + config.directus_token,
            },
        });
        return manufacturers.data;
    } catch (e) {
        console.error(e);
    }
})