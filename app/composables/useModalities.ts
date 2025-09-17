interface ModalitiesResponse {
    data: any;
}

export const useModality = (slug: string) => {
    return useAsyncData('modality-' + slug, () => $fetch<ModalitiesResponse>('/api/data/find-modality?slug=' + slug));
}

export const useModalities = () => {
    return useAsyncData('modalities', () => $fetch<ModalitiesResponse>('/api/data/get-modalities'));    
}