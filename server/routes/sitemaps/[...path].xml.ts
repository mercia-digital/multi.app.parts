import { defineEventHandler, createError } from 'h3'
import { sendProxy } from 'h3'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig(event)
    const base = (config.public as any)?.sitemaps?.base || 'https://sitemaps-multi-3dyyx.ondigitalocean.app'

    const path = event.path.replace('/sitemaps/', '').replace(/\.xml$/, '')
    if (!path) {
      throw createError({ statusCode: 404, statusMessage: 'Sitemap not found' })
    }

    const targetUrl = `${base.replace(/\/$/, '')}/sitemaps/${path}.xml`

    return sendProxy(event, targetUrl, {
      headers: {
        Accept: 'application/xml',
        'Cache-Control': 'public, max-age=43200',
      },
    })
  } catch (error) {
    console.error('Error proxying sitemap:', error)
    throw createError({ statusCode: 500, statusMessage: 'Error proxying sitemap' })
  }
})
