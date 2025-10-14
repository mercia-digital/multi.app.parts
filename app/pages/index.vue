<template>
    <div class="container">
        <h1 class="text-4xl font-bold mb-4 text-center">MULTI, INC. Parts Catalog</h1>
        <p class="text-center text-xl mb-8">Browse our extensive catalog of authentic parts from leading manufacturers
        </p>
        <PartsSearchFilters :search="search" :manufacturer="manufacturer" :modality="modality"
            @update:manufacturer="manufacturer = $event" @update:modality="modality = $event" @submit="onSubmitHome" />
        <h3 class="text-2xl font-bold mt-16 mb-4 text-center">Browse by Manufacturer</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
            <div v-for="manufacturer in manufacturers" :key="manufacturer.id" class="shadow-md rounded-lg p-4">
                <NuxtLink :to="'/parts/manufacturer/' + manufacturer.slug">
                    <img :src="runtimeConfig.public.directus.url + '/assets/' + manufacturer.logo + '?fit=inside&width=320'"
                        alt="{{manufacturer.name}}" class="mb-4 ml-auto mr-auto"></img>
                    <h2 class="text-center font-bold">{{ manufacturer.name }}</h2>
                </NuxtLink>
            </div>
        </div>
        <div class="cta-section mt-16 bg-gray-100 rounded-lg p-8 text-center max-w-4xl mx-auto">
            <h2 class="text-2xl font-bold mb-4">Can't find what you're looking for?</h2>
            <p class="mb-6">Browse our complete parts catalog or contact us for assistance.</p>
            <div class="flex flex-wrap justify-center gap-4">
                <NuxtLink to="/parts" class="px-6 py-3 bg-[#dc602e] text-white rounded-full hover:bg-[#2275b5] transition-colors"> Browse All Parts </NuxtLink>
                <NuxtLink to="https://www.multi-inc.com/contact" target="_blank" class="px-6 py-3 bg-[#304d6d] text-white rounded-full hover:bg-[#1e3a5f] transition-colors"> Contact Us </NuxtLink>
            </div>
        </div>
    </div>
</template>
<script setup>
const runtimeConfig = useRuntimeConfig();

const { data: manufacturers } = await useCollection('manufacturers');

// Controlled props for homepage search UI
const search = ref('');
const manufacturer = ref('');
const modality = ref('');

const router = useRouter();

function onSubmitHome(payload) {
    const query = {};
    if (payload.search) query.search = payload.search;
    if (payload.manufacturer) query.manufacturer = payload.manufacturer;
    if (payload.modality) query.modality = payload.modality;
    router.push({ path: '/parts', query });
}


// SEO: homepage defaults, canonical, and JSON-LD
useSeoDefaults();

const { setCanonicalHead } = useCanonical(['page']);
setCanonicalHead();

const siteUrl = (runtimeConfig.public?.siteUrl || 'https://parts.multi-inc.com').replace(/\/$/, '');
useJsonLd([
    {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'MULTI, INC. Parts Catalog',
        url: siteUrl + '/',
        potentialAction: {
            '@type': 'SearchAction',
            target: siteUrl + '/parts?term={search_term_string}',
            'query-input': 'required name=search_term_string'
        }
    },
    {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'MULTI, INC.',
        url: siteUrl + '/',
        logo: siteUrl + '/favicon.ico'
    }
]);

// Fallback OG image for homepage (no guaranteed natural image)
// @ts-ignore
defineOgImage({
    title: 'MULTI, INC. Parts Catalog',
    description: 'MULTI, INC. exists to provide access to authentic parts, services, and technology through our OEM allegiant relationships. Explore our vast parts catalog.'
});

</script>
