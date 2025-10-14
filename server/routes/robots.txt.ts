import { defineEventHandler, setHeader } from 'h3'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = String((config.public as any)?.siteUrl || 'https://parts.multi-inc.com').replace(/\/$/, '')

  const lines = [
    'User-agent: *',
    'Allow: /',
    `Sitemap: ${siteUrl}/sitemaps/index.xml`,
    ''
  ]

  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=86400')

  return lines.join('\n')
})
