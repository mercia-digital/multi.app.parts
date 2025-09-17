interface PartsResponse {
    data: any;
}

export const useParts = (query = {}) => {
    return useAsyncData('parts', () => $fetch<PartsResponse>("/api/data/get-parts", { params: unref(query) }), {
        watch: [query]
    });        
}

export const usePart = (part_slug: string, manufacturer_slug: string) => {
    return useAsyncData('part-' + part_slug + '-' + manufacturer_slug, () => $fetch("/api/data/find-part?part_slug=" + part_slug + "&manufacturer_slug=" + manufacturer_slug));
}