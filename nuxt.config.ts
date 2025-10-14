require('dotenv').config();
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      titleTemplate: '%s | MULTI, INC. Parts Catalog',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'MULTI, INC. Parts Catalog' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        // Intentionally no global canonical; page-level or module-generated canonicals will apply
      ],
      script: [
        {
          src: 'https://kit.fontawesome.com/dc73769163.js',
          crossorigin: 'anonymous'
        },
        {
          src: 'https://js.hs-scripts.com/4679263.js',
          id: 'hs-script-loader',
          async: true,
          defer: true,
          type: "text/javascript"
        },
        {
          src: `https://www.googletagmanager.com/gtag/js?id=${process.env.NUXT_PUBLIC_GA_ID || 'G-LPH95E885X'}`,
          async: true,
        },
      ]
    }
  },
  compatibilityDate: '2025-07-15',
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },
  modules: ['@nuxtjs/seo', '@nuxt/ui'],
  // Disable module-provided sitemap/robots routes so our explicit Nitro routes take precedence
  sitemap: {
    enabled: false,
  },
  robots: {
    enabled: false,
  },
  ui: {
    colorMode: false
  },
  css: ['~/assets/css/main.css'],
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://parts.multi-inc.com',
    name: 'MULTI, INC. Parts Catalog',
    description: 'MULTI, INC. exists to provide access to authentic parts, services, and technology through our OEM allegiant relationships. Explore our vast parts catalog.',
    defaultLocale: 'en'
  },
  runtimeConfig: {
    directus_url: process.env.NUXT_DIRECTUS_URL,
    directus_token: process.env.NUXT_DIRECTUS_TOKEN,
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://parts.multi-inc.com',
      directus: {
        url: process.env.NUXT_DIRECTUS_URL,
        autoRefresh: true,
      },
      sitemaps: {
        base: process.env.NUXT_PUBLIC_SITEMAPS_BASE || 'https://sitemaps-multi-3dyyx.ondigitalocean.app',
      },
      analytics: {
        gaMeasurementId: process.env.NUXT_PUBLIC_GA_ID || 'G-LPH95E885X',
        clarityProjectId: process.env.NUXT_PUBLIC_CLARITY_ID || 'lgmti6r585'
      },
    },
  },
})