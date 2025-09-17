<template>
    <div>
        <h1>{{ part?.title }}</h1>
    </div>
</template>
<script setup>
definePageMeta({
    middleware: "auth",
});

const route = useRoute();
const manufacturer_slug = route.params.manufacturer_slug;
const part_slug = route.params.part_slug;

const { data: part } = await usePart(part_slug, manufacturer_slug);
</script>
