<template>
    <div class="wrapper p-3 border-t-2 border-t-solid border-t-gray-200 mt-8">
        <div v-html="appSettings.portal_footer_copyright" class="max-w-6xl mx-auto"></div>
    </div>
</template>
<script setup>
const runtimeConfig = useRuntimeConfig();
const { data: appSettings } = await useAppSettings();
</script>
