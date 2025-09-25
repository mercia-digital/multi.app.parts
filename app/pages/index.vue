<template>
    <div class="container">
        <h1 class="text-4xl font-bold mb-4 text-center">MULTI, INC. Parts Catalog</h1>
        <p class="text-center text-xl mb-8">Browse our extensive catalog of authentic parts from leading manufacturers</p>
        <PartsSearchFilters />
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
            <div v-for="manufacturer in manufacturers" :key="manufacturer.id" class="shadow-md rounded-lg p-4">
                <NuxtLink :to="'/parts/manufacturer/' + manufacturer.slug">
                    <img :src="runtimeConfig.public.directus.url + '/assets/' + manufacturer.logo + '?fit=inside&width=320'" alt="{{manufacturer.name}}" class="mb-4 ml-auto mr-auto"></img>
                    <h2 class="text-center font-bold">{{ manufacturer.name }}</h2>
                </NuxtLink>
            </div>
        </div>
    </div>
</template>
<script setup>
const runtimeConfig = useRuntimeConfig();

const { data: manufacturers } = await useCollection('manufacturers');

</script>
