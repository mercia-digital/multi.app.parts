<!-- pages/404.vue -->
<template>
  <section class="not-found container min-h-[60vh] flex flex-col items-center justify-center text-center py-16">
    <h1 class="title">404 - Page Not Found</h1>
    <p class="subtitle">Oops! The page you are looking for isn't available.</p>
    <div class="actions">
      <NuxtLink class="text-white bg-[#dc602e] px-4 py-2 rounded-full hover:bg-[#dc602e]/75 transition-colors" to="/">Go Home</NuxtLink>
      <NuxtLink class="text-white bg-[#2275b5] px-4 py-2 rounded-full hover:bg-[#2275b5]/75 transition-colors" to="/parts">Explore the Catalog</NuxtLink>
    </div>
  </section>
</template>
  
<script setup lang="ts">
import { setResponseStatus } from 'h3'

useHead({
  title: '404 - Page Not Found',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

// Ensure proper HTTP status for SEO/analytics
const event = useRequestEvent()
if (process.server && event) {
  setResponseStatus(event, 404)
}
</script>
  
<style scoped lang="less">
.not-found {
  color: #304d6d;
  .title {
    font-size: 2.25rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
  }
  .subtitle {
    font-size: 1.125rem;
    color: #555;
    margin-bottom: 1.5rem;
  }
  .actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 0.5rem;
  }
}
</style>