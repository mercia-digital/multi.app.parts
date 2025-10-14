<template>
    <UApp>
        <NuxtLoadingIndicator color="var(--ui-secondary)" height=5 />
        <AppHeader />
        <main class="mx-auto p-4" style="max-width: 1400px">
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
