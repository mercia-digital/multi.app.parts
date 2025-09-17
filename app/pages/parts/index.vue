<template>
    <div>
        <PartsTable :parts="parts" :meta="meta" :currentPage="page" :perPage="perPage" @update:currentPage="page = $event" @update:perPage="perPage = $event"/>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: "auth",
});

const route = useRoute();

const page = ref(Number(route.query.page) || 1);
const perPage = ref(Number(route.query.perPage) || 25);
const manufacturer = ref(route.query.manufacturer || '');
const modality = ref(route.query.modality || '');
const search = ref(route.query.search || '');

const queryParams = computed(() => ({
    offset: (page.value - 1) * perPage.value,
    limit: perPage.value,
    manufacturer_slug: manufacturer.value,
    modality_slug: modality.value,
    search: search.value
}));

const { data: partsData } = await useParts(queryParams);

const parts = computed(() => partsData.value.parts);
const meta = computed(() => partsData.value.meta);

watch([page, perPage, manufacturer, modality, search], () => {
    updateQuery();
});

function updateQuery() {
    const query = {
        page: null,
        perPage: null,
        manufacturer: manufacturer.value || '',
        modality: modality.value || '',
        search: search.value || '',
    };
    if (page.value !== 1) {
        query.page = page.value;
    }
    if (perPage.value !== 25) {
        query.perPage = perPage.value;
    }
    navigateTo(`/parts?${Object.entries(query).filter(([key, value]) => value).map(([key, value]) => `${key}=${value}`).join('&')}`);
}
</script>
