import { computed } from 'vue'
import { useHead, useRoute, useRuntimeConfig } from '#imports'

/**
 * Builds a canonical URL from runtime siteUrl + current route.
 * Only whitelists the provided query parameters. `page=1` is stripped.
 */
export const useCanonical = (paramsWhitelist: string[] = ['page']) => {
  const route = useRoute()
  const runtimeConfig = useRuntimeConfig() as any
  const siteUrl: string = runtimeConfig.public?.siteUrl || ''

  const canonical = computed(() => {
    const base = siteUrl.replace(/\/$/, '') + route.path
    const url = new URL(base)
    const query = (route.query || {}) as Record<string, any>
    for (const key of Object.keys(query)) {
      if (!paramsWhitelist.includes(key)) continue
      const raw = Array.isArray(query[key]) ? query[key][0] : query[key]
      if (key === 'page' && (raw === undefined || raw === null || String(raw) === '1')) continue
      if (raw !== undefined && raw !== null && String(raw) !== '') {
        url.searchParams.set(key, String(raw))
      }
    }
    return url.toString()
  })

  const head = computed(() => ({
    link: [{ rel: 'canonical', href: canonical.value }]
  }))

  const setCanonicalHead = () => useHead(head.value)

  return { canonical, head, setCanonicalHead }
}
