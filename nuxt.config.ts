require('dotenv').config();
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  modules: ['nuxt-directus', '@nuxt/ui'],
  ui: {
    colorMode: false
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    directus_url: process.env.NUXT_DIRECTUS_URL,
    directus_token: process.env.NUXT_DIRECTUS_TOKEN,
    public: {
      directus: {
        url: process.env.NUXT_DIRECTUS_URL,
        autoRefresh: true,
      },
    },
  },
})