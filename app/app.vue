<template>
    <UApp>
        <AppHeader />
        <main class="max-w-6xl mx-auto p-4">
            <Breadcrumbs />
            <NuxtPage />
        </main>
        <AppFooter />
    </UApp>
</template>

<script setup>
import AppHeader from '~/components/AppHeader.vue';
import AppFooter from '~/components/AppFooter.vue';
import Breadcrumbs from '~/components/Breadcrumbs.vue';
</script>
