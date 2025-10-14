<template>
  <div class="space-y-10">
    <section>
      <h1 class="text-2xl font-bold mb-4">Sitemap: Manufacturers</h1>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <UCard v-for="m in manufacturers" :key="m.id">
          <template #header>
            <NuxtLink class="text-blue-700 hover:underline" :to="`/sitemap/manufacturers/${m.slug}`">
              {{ m.name }}
            </NuxtLink>
          </template>
          <p class="text-sm text-gray-600">View all parts by {{ m.name }}</p>
        </UCard>
      </div>
    </section>

    <section>
      <h2 class="text-2xl font-bold mb-4">Sitemap: Modalities</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <UCard v-for="mod in modalities" :key="mod.id">
          <template #header>
            <NuxtLink class="text-blue-700 hover:underline" :to="`/sitemap/modality/${mod.slug}`">
              {{ mod.name }}
            </NuxtLink>
          </template>
          <p class="text-sm text-gray-600">View all parts for {{ mod.name }}</p>
        </UCard>
      </div>
    </section>
  </div>
</template>

<script setup>
// Data
const { data: manufacturers } = await useCollection('manufacturers')
const { data: modalities } = await useCollection('modalities')

// SEO
useSeoDefaults({ title: 'HTML Sitemaps' })
const { setCanonicalHead } = useCanonical([])
setCanonicalHead()
</script>
