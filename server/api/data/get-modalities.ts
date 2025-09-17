interface ModalitiesResponse {
    data: any;
}

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    
    try {
        const modalities = await $fetch<ModalitiesResponse>(config.directus_url + "/items/modalities", {
            headers: {
                Authorization: "Bearer " + config.directus_token,
            },
        });
        return modalities.data;
    } catch (e) {
        console.error(e);
    }
})