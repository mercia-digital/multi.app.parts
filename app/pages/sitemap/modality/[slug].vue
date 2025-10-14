<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold">Modality: {{ modalityName }}</h1>
    <p class="text-gray-600">HTML sitemap listing for {{ modalityName }} parts</p>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <UCard v-for="p in parts" :key="p.id">
        <template #header>
          <NuxtLink class="text-blue-700 hover:underline" :to="detailPath(p)">
            {{ p.title || p.part_number }}
          </NuxtLink>
        </template>
        <div class="text-sm text-gray-700">Part Number: <strong>{{ p.part_number }}</strong></div>
      </UCard>
    </div>

    <div class="flex items-center justify-between mt-6">
      <div class="text-sm text-gray-600">Page {{ page }} of {{ totalPages }}</div>
      <div class="flex gap-2">
        <NuxtLink v-if="page > 1" class="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200" :to="{ query: { page: page - 1 || undefined } }">Prev</NuxtLink>
        <NuxtLink v-if="page < totalPages" class="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200" :to="{ query: { page: page + 1 } }">Next</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const runtimeConfig = useRuntimeConfig()

// Data for modality title
const { data: modalityData } = await useCollectionItem('modalities', route.params.slug || '')
const modalityName = computed(() => modalityData.value?.name || String(route.params.slug || '').replace(/-/g, ' ').toUpperCase())

// Pagination state
const perPage = ref(50)
const page = computed({
  get: () => Number(route.query.page) || 1,
  set: (v) => navigateTo({ query: { ...route.query, page: v !== 1 ? v : undefined } })
})
const offset = computed(() => (page.value - 1) * perPage.value)

// Fetch parts filtered by modality slug
const { data: partsData } = await useParts({
  limit: perPage,
  offset: offset,
  search: ref(''),
  manufacturer_slug: ref(''),
  modality_slug: computed(() => String(route.params.slug || '')),
  manufacturer_id: ref(null),
  modality_id: ref(null),
})

const parts = computed(() => partsData.value.parts || [])
const totalCount = computed(() => Number(partsData.value.meta?.filter_count || 0))
const totalPages = computed(() => Math.max(1, Math.ceil(totalCount.value / perPage.value)))

function detailPath(p) {
  const manuSlug = p?.manufacturer?.slug
  const partSlug = p?.slug || p?.part_slug || p?.id
  return manuSlug && partSlug ? `/part/${manuSlug}/${partSlug}` : '/parts'
}

// SEO
useSeoDefaults({ title: `HTML Sitemap: ${modalityName.value} parts` })
const { setCanonicalHead } = useCanonical(['page'])
setCanonicalHead()
</script>
