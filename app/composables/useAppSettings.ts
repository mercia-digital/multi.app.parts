interface AppSettingsResponse {
    data: any;
}

export const useAppSettings = () => {
    return useAsyncData('app-settings', () => $fetch<AppSettingsResponse>('/api/admin/app-settings'));
}