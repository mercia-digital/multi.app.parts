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
const slug = route.params.slug;

const { data: manufacturer } = await useManufacturer(slug);

const page = ref(Number(route.query.page) || 1);
const perPage = ref(Number(route.query.perPage) || 25);

const queryParams = computed(() => ({
    offset: (page.value - 1) * perPage.value,
    limit: perPage.value,
    manufacturer_id: manufacturer.value.id,
}));

const { data: partsData } = await useParts(queryParams);

const parts = computed(() => partsData.value.parts);
const meta = computed(() => partsData.value.meta);

watch([page, perPage, manufacturer], () => {
    updateQuery();
});

function updateQuery() {
    const query = {
        page: null,
        perPage: null
    };
    if (page.value !== 1) {
        query.page = page.value;
    }
    if (perPage.value !== 25) {
        query.perPage = perPage.value;
    }
    navigateTo(`/parts/manufacturer/${slug}?${Object.entries(query).filter(([key, value]) => value).map(([key, value]) => `${key}=${value}`).join('&')}`);
}
</script>