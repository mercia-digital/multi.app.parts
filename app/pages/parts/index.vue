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

// Single source of truth: route.query
const search = computed({
    get: () => route.query.search || '',
    set: (v) => router.replace({ query: { ...route.query, search: v || undefined, page: undefined } })
});

const manufacturer = computed({
    get: () => route.query.manufacturer || '',
    set: (v) => router.replace({ query: { ...route.query, manufacturer: v || undefined, page: undefined } })
});

const modality = computed({
    get: () => route.query.modality || '',
    set: (v) => router.replace({ query: { ...route.query, modality: v || undefined, page: undefined } })
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
    const query = {
        ...route.query,
        search: payload.search || undefined,
        manufacturer: payload.manufacturer || undefined,
        modality: payload.modality || undefined,
        page: undefined // reset page to 1
    };
    router.replace({ query });
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

// SEO: listing page defaults, canonical, and prev/next
useSeoDefaults();

const totalPages = computed(() => {
    const count = Number(meta.value?.filter_count || 0);
    const pp = Number(perPage.value || 25);
    return Math.max(1, Math.ceil(count / pp));
});

const { setCanonicalHead } = useCanonical(['page']);
setCanonicalHead();

const runtimeConfig = useRuntimeConfig();
const siteUrl = (runtimeConfig.public?.siteUrl || 'https://parts.multi-inc.com').replace(/\/$/, '');

function buildPageUrl(n) {
    const base = new URL(siteUrl + route.path);
    const q = { ...route.query };
    // keep key filters; normalize page
    if (!n || n === 1) delete q.page; else q.page = n;
    for (const [k, v] of Object.entries(q)) {
        if (v == null || v === '' || (Array.isArray(v) && v.length === 0)) continue;
        base.searchParams.set(k, Array.isArray(v) ? String(v[0]) : String(v));
    }
    return base.toString();
}

useHead(() => {
    const links = [];
    if (page.value > 1) links.push({ rel: 'prev', href: buildPageUrl(page.value - 1) });
    if (page.value < totalPages.value) links.push({ rel: 'next', href: buildPageUrl(page.value + 1) });
    return { link: links };
});

// Fallback OG image for listing pages (no natural image)
// @ts-ignore
defineOgImage({
    title: 'MULTI, INC. Parts Catalog',
    description: 'Browse our extensive catalog of authentic parts from leading manufacturers.'
});
</script>
