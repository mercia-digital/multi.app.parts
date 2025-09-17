interface AppSettingsResponse {
    data: any;
}

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    
    try {
        const appSettings = await $fetch<AppSettingsResponse>(config.directus_url + "/items/application_settings", {
            headers: {
                Authorization: "Bearer " + config.directus_token,
            },
        });
        return appSettings.data;
    } catch (e) {
        console.error(e);
    }
})