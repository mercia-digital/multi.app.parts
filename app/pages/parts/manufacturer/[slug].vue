<template>
    <div>
        <!-- CMS override: render Directus page when a page exists for this manufacturer slug -->
        <div v-if="isCmsOverride">
            <div class="prose max-w-none">
                <!-- <h1 v-if="cmsPage?.title" class="mb-4">{{ cmsPage.title }}</h1> -->
                <!-- <div v-if="cmsPage?.content" v-html="cmsPage.content"></div> -->
                <EditorBlocks v-if="cmsPage?.content2" :content="cmsPage.content2" />
                <div v-else>
                    <p>Content coming soon.</p>
                </div>
            </div>
        </div>
        <div v-else class="flex gap-6 flex-wrap lg:flex-nowrap">
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

// Try to load a CMS page from Directus `pages` collection using the manufacturer slug
const { data: cmsPage } = await useCollectionItem('pages', route.params.slug || '');
const isCmsOverride = computed(() => !!cmsPage?.value);

// If a CMS page exists, set some basic SEO meta using its fields
useHead(() => {
    if (!cmsPage?.value) return {};
    const title = cmsPage.value.seo_title || cmsPage.value.title || '';
    const description = cmsPage.value.seo_description || '';
    return {
        title,
        meta: [
            { name: 'description', content: description }
        ]
    };
});

// manufacturer is represented by the path slug; change path when it changes
const manufacturer = computed({
    get: () => route.params.slug || '',
    set: (v) => {
        const path = v ? `/parts/manufacturer/${v}` : '/parts';
        const query = { ...route.query, page: undefined };
        router.push({ path, query });
    }
});

// query-based filters
const search = computed({
    get: () => route.query.search || '',
    set: (v) => router.replace({ query: { ...route.query, search: v || undefined, page: undefined } })
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

// Only fetch parts when there is no CMS override page
let partsData = ref({ parts: [], meta: {} });
let pending = ref(false);

if (!isCmsOverride.value) {
    const result = await useParts({
        limit: perPage,
        offset: offset,
        search: search,
        manufacturer_slug: manufacturer,
        modality_slug: modality,
    });
    partsData = result.data;
    pending = result.pending;
}

const parts = computed(() => partsData.value.parts);
const meta = computed(() => partsData.value.meta);

// SEO: manufacturer landing
const runtimeConfig = useRuntimeConfig();
const siteUrl = (runtimeConfig.public?.siteUrl || 'https://parts.multi-inc.com').replace(/\/$/, '');

// Fetch manufacturer for naming and social image when available
const { data: manufacturerData } = await useCollectionItem('manufacturers', route.params.slug || '');
const manufacturerName = computed(() => manufacturerData.value?.name || (route.params.slug || '').toString().replace(/-/g, ' ').toUpperCase());
const manufacturerLogo = computed(() => manufacturerData.value?.logo ? `${runtimeConfig.public.directus.url}/assets/${manufacturerData.value.logo}?fit=inside&width=1200&height=630` : undefined);

// Apply defaults and social images (when not using CMS page SEO)
if (!cmsPage?.value) {
    useSeoDefaults({
        title: `${manufacturerName.value} Parts`,
        description: `Browse ${manufacturerName.value} parts from MULTI, INC.`,
        image: manufacturerLogo.value,
        url: siteUrl + route.fullPath
    });

    // Fallback OG image when a manufacturer logo isn't available
    if (!manufacturerLogo.value) {
        // defineOgImage is auto-imported by nuxt-og-image (via @nuxtjs/seo bundle)
        // It will generate a social image server-side for richer sharing cards.
        // @ts-ignore
        defineOgImage({
            title: `${manufacturerName.value} Parts`,
            description: 'MULTI, INC. exists to provide access to authentic parts, services, and technology through our OEM allegiant relationships. Explore our vast parts catalog.',
        });
    }
}

// Canonical for all cases
const { setCanonicalHead } = useCanonical(['page']);
setCanonicalHead();

// Pagination prev/next when listing is active (no CMS override)
if (!isCmsOverride.value) {
    const totalPages = computed(() => {
        const count = Number(meta.value?.filter_count || 0);
        const pp = Number(perPage.value || 25);
        return Math.max(1, Math.ceil(count / pp));
    });

    function buildPageUrl(n) {
        const base = new URL(siteUrl + route.path);
        const q = { ...route.query };
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
}

// JSON-LD for Organization and Breadcrumbs (applies even if CMS override is used)
useJsonLd([
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: manufacturerName.value,
    url: siteUrl + route.path,
    logo: manufacturerLogo.value
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl + '/'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Parts',
        item: siteUrl + '/parts'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: manufacturerName.value,
        item: siteUrl + route.path
      }
    ]
  }
]);
</script>