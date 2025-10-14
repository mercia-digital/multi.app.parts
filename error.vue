<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-6 text-center">
    <h1 class="text-3xl font-bold mb-4">Something went wrong</h1>
    <p class="mb-6">{{ error?.message || 'An unexpected error occurred.' }}</p>
    <NuxtLink to="/" class="text-blue-600 underline">Go back home</NuxtLink>
  </div>
</template>

<script setup lang="ts">
// Nuxt error boundary provides the error prop
const props = defineProps<{ error?: any }>()

// Ensure error pages are not indexed
useHead({
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
