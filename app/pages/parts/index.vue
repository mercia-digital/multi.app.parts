<template>
    <div>
        <div class="flex gap-6">
            <!-- Sidebar filters -->
            <PartsSidebarFilters
                :initial-search-term="search"
                :initial-manufacturer="manufacturer"
                :initial-modality="modality"
                @search="handleSearch"
            />

            <!-- Main table content -->
            <div class="flex-1">
                <PartsTable
                    :parts="parts"
                    :meta="meta"
                    :currentPage="page"
                    :perPage="perPage"
                    @update:currentPage="page = $event"
                    @update:perPage="perPage = $event"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
const route = useRoute();
const router = useRouter();

const page = ref(Number(route.query.page) || 1);
const perPage = ref(Number(route.query.perPage) || 25);
const manufacturer = ref(route.query.manufacturer || '');
const modality = ref(route.query.modality || '');
const search = ref(route.query.search || '');

const handleSearch = (filters) => {
    search.value = filters.term;
    manufacturer.value = filters.manufacturer;
    modality.value = filters.modality;
    page.value = 1; // Reset to first page on new search
};

const offset = computed(() => (page.value - 1) * perPage.value);

const { data: partsData } = await useParts({
    limit: perPage,
    offset: offset,
    search: search,
    manufacturer_slug: manufacturer,
    modality_slug: modality,
});

const parts = computed(() => partsData.value.parts);
const meta = computed(() => partsData.value.meta);

watch([page, perPage, manufacturer, modality, search], () => {
    updateQuery();
});

function updateQuery() {
    const query = {};
    if (page.value !== 1) query.page = page.value;
    if (perPage.value !== 25) query.perPage = perPage.value;
    if (manufacturer.value) query.manufacturer = manufacturer.value;
    if (modality.value) query.modality = modality.value;
    if (search.value) query.search = search.value;

    router.push({ query });
}
</script>
