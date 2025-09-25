import type { Ref } from 'vue';

interface PartsResponse {
    data: any;
}

interface QueryParams {
    limit: Ref<number>;
    offset: Ref<number>;
    search: Ref<string>;
    manufacturer_slug: Ref<string>;
    modality_slug: Ref<string>;
    manufacturer_id: Ref<number | null>;
    modality_id: Ref<number | null>;
}

export const useParts = (queryParams: QueryParams) => {
    return useAsyncData(
        'parts',
        () => $fetch<PartsResponse>("/api/data/get-parts", {
            params: {
                limit: unref(queryParams.limit),
                offset: unref(queryParams.offset),
                search: unref(queryParams.search),
                manufacturer_slug: unref(queryParams.manufacturer_slug),
                modality_slug: unref(queryParams.modality_slug),
                manufacturer_id: unref(queryParams.manufacturer_id),
                modality_id: unref(queryParams.modality_id),
            }
        }),
        {
            watch: [() => queryParams]
        }
    );
}

export const usePart = (part_slug: string, manufacturer_slug: string) => {
    return useAsyncData('part-' + part_slug + '-' + manufacturer_slug, () => $fetch("/api/data/find-part?part_slug=" + part_slug + "&manufacturer_slug=" + manufacturer_slug));
}