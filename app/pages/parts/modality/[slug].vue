<template>
    <div>
        <div class="flex gap-6 flex-wrap lg:flex-nowrap">
            <!-- Sidebar filters -->
            <div class="flex-1">
                <PartsSidebarFilters
                    :search="search"
                    :manufacturer="manufacturer"
                    :modality="modality"
                    @submit="onSubmitFilters"
                    @update:manufacturer="onUpdateManufacturer"
                    @update:modality="onUpdateModality"
                    @clear="onClearFilters"
                />
            </div>

            <!-- Main table content -->
            <div class="flex-3">
                <div class="relative">
                    <PartsTable
                        :parts="parts"
                        :meta="meta"
                        :currentPage="page"
                        :perPage="perPage"
                        @update:currentPage="page = $event"
                        @update:perPage="perPage = $event"
                    />
                    <div v-if="pending" class="absolute inset-0 grid place-items-center bg-white/50 z-10">
                        <div class="h-8 w-8 border-4 border-[#2275b5] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
const route = useRoute();
const router = useRouter();

// modality is represented by the path slug; change path when it changes
const modality = computed({
    get: () => route.params.slug || '',
    set: (v) => {
        const path = v ? `/parts/modality/${v}` : '/parts';
        const query = { ...route.query, page: undefined };
        router.push({ path, query });
    }
});

// query-based filters
const search = computed({
    get: () => route.query.search || '',
    set: (v) => router.replace({ query: { ...route.query, search: v || undefined, page: undefined } })
});

const manufacturer = computed({
    get: () => route.query.manufacturer || '',
    set: (v) => router.replace({ query: { ...route.query, manufacturer: v || undefined, page: undefined } })
});

const page = computed({
    get: () => Number(route.query.page) || 1,
    set: (v) => router.push({ query: { ...route.query, page: v !== 1 ? v : undefined } })
});

const perPage = computed({
    get: () => Number(route.query.perPage) || 25,
    set: (v) => router.replace({ query: { ...route.query, perPage: v !== 25 ? v : undefined, page: undefined } })
});

function onSubmitFilters(payload) {
    search.value = payload.search || '';
    manufacturer.value = payload.manufacturer || '';
}

function onUpdateManufacturer(slug) {
    manufacturer.value = slug || '';
}

function onUpdateModality(slug) {
    modality.value = slug || '';
}

function onClearFilters() {
    router.push({ path: '/parts' });
}

const offset = computed(() => (page.value - 1) * perPage.value);

const { data: partsData, pending } = await useParts({
    limit: perPage,
    offset: offset,
    search: search,
    manufacturer_slug: manufacturer,
    modality_slug: modality,
});

const parts = computed(() => partsData.value.parts);
const meta = computed(() => partsData.value.meta);
</script>