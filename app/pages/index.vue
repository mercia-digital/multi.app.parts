<template>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
        <div v-for="manufacturer in manufacturers" :key="manufacturer.id" class="shadow-md rounded-lg p-4">
            <NuxtLink :to="'/parts/manufacturer/' + manufacturer.slug">
                <img :src="runtimeConfig.public.directus.url + '/assets/' + manufacturer.logo + '?fit=inside&width=320'" alt="{{manufacturer.name}}" class="mb-4 ml-auto mr-auto"></img>
                <h2 class="text-center font-bold">{{ manufacturer.name }}</h2>
            </NuxtLink>
        </div>
    </div>
</template>
<script setup>
definePageMeta({
    middleware: "auth",
});

const runtimeConfig = useRuntimeConfig();

const { data: manufacturers } = await useManufacturers();

</script>
