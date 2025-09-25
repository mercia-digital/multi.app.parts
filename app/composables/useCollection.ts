interface CollectionResponse {
    data: any;
}

export const useCollectionItem = (collection: string, slug: string) => {
    return useAsyncData(collection + '-' + slug, () => $fetch<CollectionResponse>('/api/data/find-item?collection=' + collection + '&slug=' + slug));
}

export const useCollection = (collection: string) => {
    return useAsyncData(collection, () => $fetch<CollectionResponse>('/api/data/get-collection?collection=' + collection));
}
