import { useHead } from '#imports'

/**
 * Inject JSON-LD into <head>. Accepts a single schema object or an array.
 * Example:
 * useJsonLd({
 *   '@context': 'https://schema.org',
 *   '@type': 'Organization',
 *   name: 'MULTI, INC.'
 * })
 */
export function useJsonLd(schema: Record<string, any> | Record<string, any>[]) {
  const schemas = Array.isArray(schema) ? schema : [schema]
  useHead({
    script: schemas.map((s) => ({
      type: 'application/ld+json',
      // unhead will handle proper serialization
      innerHTML: JSON.stringify(s)
    }))
  })
}
