import { defineEventHandler, createError } from 'h3'
import { sendProxy } from 'h3'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig(event)
    const base = (config.public as any)?.sitemaps?.base || 'https://sitemaps-multi-3dyyx.ondigitalocean.app'
    const targetUrl = `${base.replace(/\/$/, '')}/sitemaps/index.xml`

    return sendProxy(event, targetUrl, {
      headers: {
        Accept: 'application/xml',
        'Cache-Control': 'public, max-age=43200',
      },
    })
  } catch (error) {
    console.error('Error proxying sitemap index:', error)
    throw createError({ statusCode: 500, statusMessage: 'Error proxying sitemap index' })
  }
})
