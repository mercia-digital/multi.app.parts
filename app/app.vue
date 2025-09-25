<template>
    <UApp>
        <AppHeader />
        <main class="mx-auto p-4" style="max-width: 1920px">
            <Breadcrumbs v-if="route.path !== '/'" />
            <NuxtPage />
        </main>
        <AppFooter />
    </UApp>
</template>

<script setup>
import AppHeader from '~/components/AppHeader.vue';
import AppFooter from '~/components/AppFooter.vue';
import Breadcrumbs from '~/components/Breadcrumbs.vue';

const route = useRoute();
</script>
