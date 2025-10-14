import { ref, type Ref, unref } from 'vue';

interface PartsResponse {
    data: any;
}

interface QueryParams {
    limit: Ref<number>;
    offset: Ref<number>;
    search: Ref<string>;
    manufacturer_slug: Ref<string>;
    modality_slug: Ref<string>;
    manufacturer_id?: Ref<number | null>;
    modality_id?: Ref<number | null>;
}

export const useParts = (queryParams: QueryParams) => {
    // Build watch sources from individual refs; fall back to no-op refs for optional IDs
    const watchSources = [
        () => unref(queryParams.limit),
        () => unref(queryParams.offset),
        () => unref(queryParams.search),
        () => unref(queryParams.manufacturer_slug),
        () => unref(queryParams.modality_slug),
        () => unref((queryParams as any).manufacturer_id ?? ref(null)),
        () => unref((queryParams as any).modality_id ?? ref(null)),
    ];

    // Build a dynamic key so route/filter changes create distinct cache entries and trigger refetches
    const buildKey = () => {
        const keyObj: Record<string, any> = {
            limit: unref(queryParams.limit),
            offset: unref(queryParams.offset),
            search: unref(queryParams.search) || '',
            manufacturer_slug: unref(queryParams.manufacturer_slug) || '',
            modality_slug: unref(queryParams.modality_slug) || '',
            manufacturer_id: unref((queryParams as any).manufacturer_id ?? ref(null)),
            modality_id: unref((queryParams as any).modality_id ?? ref(null)),
        };
        return 'parts:' + JSON.stringify(keyObj);
    };

    return useAsyncData(
        buildKey,
        () => {
            const params: Record<string, any> = {
                limit: unref(queryParams.limit),
                offset: unref(queryParams.offset),
                search: unref(queryParams.search),
                term: unref(queryParams.search),
                manufacturer_slug: unref(queryParams.manufacturer_slug),
                modality_slug: unref(queryParams.modality_slug),
            };
            const mid = unref((queryParams as any).manufacturer_id ?? ref(null));
            const moid = unref((queryParams as any).modality_id ?? ref(null));
            if (mid != null) params.manufacturer_id = mid;
            if (moid != null) params.modality_id = moid;
            return $fetch<PartsResponse>("/api/data/get-parts", { params });
        },
        {
            watch: watchSources
        }
    );
}

export const usePart = (part_slug: string, manufacturer_slug: string) => {
    return useAsyncData('part-' + part_slug + '-' + manufacturer_slug, () => $fetch("/api/data/find-part?part_slug=" + part_slug + "&manufacturer_slug=" + manufacturer_slug));
}