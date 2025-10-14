import { useSeoMeta } from '#imports'

interface SeoDefaultsOptions {
  title?: string
  description?: string
  image?: string
  url?: string
}

/**
 * Apply common SEO meta (title, description, OG/Twitter) on a page.
 * Use together with `useCanonical()` for canonical link.
 */
export function useSeoDefaults(opts: SeoDefaultsOptions = {}) {
  const title = opts?.title || 'MULTI, INC. Parts Catalog'
  const description = opts?.description || 'MULTI, INC. exists to provide access to authentic parts, services, and technology through our OEM allegiant relationships. Explore our vast parts catalog.'
  const image = opts?.image
  const url = opts?.url

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogUrl: url,
    ogImage: image,
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: image,
  })
}
