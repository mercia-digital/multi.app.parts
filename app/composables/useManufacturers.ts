interface ManufacturersResponse {
    data: any;
}

export const useManufacturer = (slug: string) => {
    return useAsyncData('manufacturer-' + slug, () => $fetch<ManufacturersResponse>('/api/data/find-manufacturer?slug=' + slug));
}

export const useManufacturers = () => {
    return useAsyncData('manufacturers', () => $fetch<ManufacturersResponse>('/api/data/get-manufacturers'));
}