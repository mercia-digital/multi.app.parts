# SEO Implementation Plan for `multi.app.parts`
### HTML Sitemaps (in-app)
- Implemented pages:
  - `app/pages/sitemap/index.vue` lists manufacturers and modalities
  - `app/pages/sitemap/manufacturers/[slug].vue` lists parts for a manufacturer with pagination
  - `app/pages/sitemap/modality/[slug].vue` lists parts for a modality with pagination
- Simple card listings with title and part number linking to detail pages
- Canonicals and basic SEO meta applied; per-page size set to 50 (adjustable)

This plan tracks decisions, tasks, and notes for implementing SEO and indexing. Keep this file updated as changes land.

## Update — 2025-10-13 (Decisions + TODOs)
  - Include `<link rel="prev">` and `<link rel="next">` on paginated pages
- Module choice: Use `@nuxtjs/seo` meta bundle (sitemap, robots, OG image, schema.org)

## High-level Milestones
- Modules installed and base config added in `nuxt.config.ts`
- Robots and sitemaps served dynamically
- Page-level SEO implemented (home, listing, detail, manufacturer)
- Error/noindex safeguards
- QA + validation (structured data, Lighthouse)

## Task Checklist
- [x] Add `@nuxtjs/seo` to `package.json` and install (user completed)
- [x] Configure `nuxt.config.ts`:
  - [x] `modules: ['@nuxtjs/seo']`
  - [x] `runtimeConfig.public.siteUrl = 'https://parts.multi-inc.com'` (or from `NUXT_PUBLIC_SITE_URL`)
  - [x] `site` info: name, description, defaultLocale
  - [x] `app.head` defaults: `titleTemplate`, meta defaults (charset, viewport, robots), social defaults
  - [ ] Robots config (allow all, reference sitemap)
  - [ ] Sitemap config (see details below)
- [ ] Remove static `public/robots.txt` to prevent conflicts (pending your approval)
- [x] Create SEO composables in `app/composables/`: `useCanonical.ts`, `useSeoDefaults.ts`, `useJsonLd.ts`
- [x] Implement page-level SEO:
  - [x] `app/pages/index.vue` (Home): SEO defaults, canonical, WebSite+SearchAction and Organization JSON‑LD
  - [x] `app/pages/parts/index.vue` (Listing): SEO defaults, canonical, rel=prev/next
  - [x] `app/pages/part/[manufacturer_slug]/[part_slug].vue` (Detail): canonical via composable, Product + BreadcrumbList JSON‑LD
  - [x] `app/pages/parts/manufacturer/[slug].vue` (Manufacturer): SEO defaults (when no CMS override), canonical, rel=prev/next, Organization + BreadcrumbList JSON‑LD
- [x] Error/noindex: `error.vue` sets `robots: noindex, nofollow`
- [ ] QA: verify `/robots.txt` and `/sitemap.xml`, validate JSON‑LD, Lighthouse SEO
 - [x] HTML Sitemaps: `/sitemap` index; `/sitemap/manufacturers/[slug]`; `/sitemap/modality/[slug]` with pagination

## Configuration Details

### `nuxt.config.ts`
- Add module:
  - `modules: ['@nuxtjs/seo', '@nuxt/ui']`
- Runtime site URL:
  - `runtimeConfig.public.siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://parts.multi-inc.com'`
- Site metadata (used by the bundle):
  - `site: { name: 'MULTI, INC. Parts Catalog', description: 'OEM and aftermarket parts catalog from MULTI, INC.', defaultLocale: 'en' }`
- Head defaults:
  - `titleTemplate: '%s | MULTI, INC. Parts Catalog'`
  - Base meta: `charset`, `viewport`, `format-detection=telephone=no`, `robots=index,follow`
  - Social defaults: `og:site_name`, `og:type=website`, `twitter:card=summary_large_image`
  - Do not set a global canonical. Use page-level canonicals or allow module auto-generation from `siteUrl`.

### Robots (dynamic)
- Serve `/robots.txt` from the module (nuxt-simple-robots under the bundle)
- Base policy: allow all; reference sitemap index at `${siteUrl}/sitemap.xml`
- Remove `public/robots.txt`

### Sitemaps (dynamic)
- Use `@nuxtjs/sitemap` under the bundle
- `siteUrl` = `runtimeConfig.public.siteUrl`
- Index + child sitemaps:
  - Static routes: `/`, `/parts`
  - Manufacturers: build from API `server/api/data/get-collection.ts?collection=manufacturers`
    - Route pattern: `/parts/manufacturer/{slug}`
  - Parts: build from API `server/api/data/get-collection.ts?collection=parts`
    - Route pattern for details: `/part/{manufacturerSlug}/{partNumber}` (adjust to actual route shape); chunk large lists
- Exclude: `/api/**`, admin tools, error routes, any auth/utility pages
- Set defaults: `changefreq`, `priority` (optional), `xsl` disabled unless needed

### Pagination SEO (`pages/parts.vue`)
- Canonical:
  - Page 1 → `/parts`
  - Page N>1 → `/parts?page=N`
- Add `<link rel="prev">` and `<link rel="next">` when applicable via `useHead()`
- Parameter hygiene: only include `page` (and optional `sort`) in canonical; other filters canonicalize to a static landing or `/parts`

## Page-level SEO Patterns

### Home (`pages/index.vue`)
- `useSeoMeta()` for title/description
- Canonical to `/`
- JSON‑LD:
  - `WebSite` with `SearchAction` targeting `/parts?term={search_term_string}`
  - `Organization` for MULTI, INC.

### Listing (`pages/parts.vue`)
- `useSeoMeta()` for list title/description
- Canonical per pagination policy
- Prev/Next link tags
- Optional listing JSON‑LD if needed

### Detail (`pages/part/[...].vue`)
- `useSeoMeta()` with dynamic title/description/social from part data
- Canonical to clean detail URL
- JSON‑LD `Product` with: name, description, image(s), sku/mpn/gtin when available, brand, offers (or “Call for pricing”); add `BreadcrumbList`

### Manufacturer (`pages/parts/manufacturer/[slug].vue`)
- Ensure only `link rel="canonical"` (remove any `{ name: 'canonical' }` meta)
- Add `og:image`/`twitter:image` from manufacturer logo (fallback if none)
- JSON‑LD `Organization` + `BreadcrumbList`

## Shared Utilities (to add under `app/composables/`)
- `useCanonical(route, { includeParams })` builds canonical from `siteUrl` + `route.path` and a whitelist of query params (e.g., `['page', 'sort']`)
- `useSeoDefaults()` returns standard title suffix and default meta
- `useJsonLd(type, data)` helper to append JSON‑LD via unhead consistently (`innerHTML` recommended)
- `useOgImage()` optional: integrate `nuxt-og-image` for fallback share cards

## Error/Noindex Coverage
- Ensure `error.vue` sets `robots: noindex, nofollow`
- Apply `noindex` to any thin/utility/admin pages

## QA & Validation
- Verify dynamic endpoints:
  - `GET /robots.txt`
  - `GET /sitemap.xml` (and child sitemaps)
- Spot-check canonicals across home/listing/detail/manufacturer
- Validate JSON‑LD via Google Rich Results Test
- Run Lighthouse SEO and fix issues

## Data Sources for Sitemaps
- Use existing endpoints under `server/api/data/`:
  - `get-collection.ts` for `manufacturers` and `parts`
  - If needed, add focused endpoints (e.g., pagination or updatedAt filters) to avoid heavy builds

## Risks & Mitigations
- Large parts collections can slow sitemap generation → chunk routes, consider runtime on-demand generation, or incremental builds
- Social images may be missing for some entities → use `nuxt-og-image` fallback
- Filtered listings can explode URL space → canonicalize to base or stable landings

## Sitemaps Strategy (120k+ URLs)

### Context
- Current: XML sitemaps generated by a separate app and proxied to this domain to avoid load on this app. HTML sitemaps will live in this app to aid indexing and internal linking.
- Goal: Consider moving XML sitemaps back into this app without degrading UX.

### Options
- External (Status quo)
  - Keep external generator serving XML via proxy.
  - Pros: Zero load on Nuxt app; proven. Cons: Split system; coordination overhead.

- Internal (Nuxt/Nitro generated XML)
  - Implement Nitro routes for `/sitemap.xml` (index) and `/sitemaps/*.xml` (children) using streaming generation and aggressive caching.
  - Techniques: keyset pagination over DB (avoid OFFSET for large sets), chunk sitemaps (≤ 50k URLs; recommend 5–10k), include `lastmod` from `updatedAt`.
  - Caching: Nitro `cachedEventHandler` (TTL 6–24h), ETag/Last-Modified, gzip. Add background warmers (post-deploy) and on-demand revalidation for touched chunks.
  - Infra: If serverless/ephemeral, persist XML to object storage/CDN (e.g., S3) and serve via signed/edge cache.
  - Risk: Initial generation spikes CPU/DB unless cache is warmed; must test under load.

- Hybrid (Recommended path to test/migrate)
  - Phase 1: Keep external for heavy "parts" sitemaps. Generate lighter sitemaps internally (index, manufacturers, modalities, top categories).
  - Phase 2: Build and benchmark Nitro parts-sitemap generator (streamed + cached). Run side-by-side behind non-linked test endpoints.
  - Phase 3: If performance holds, switch index to reference internal parts sitemaps; otherwise keep external for parts.

### Implementation Sketch (Internal/Hybrid)
- Routes
  - `/sitemap.xml`: small index referencing child sitemaps (e.g., `/sitemaps/manufacturers.xml`, `/sitemaps/parts-0001.xml` …)
  - `/sitemaps/manufacturers.xml`: list manufacturer landing URLs from `server/api/data/get-collection?collection=manufacturers`.
  - `/sitemaps/parts-*.xml`: list part detail URLs by stable chunking (e.g., by `id` ranges or alphabetical prefixes), 5–10k URLs per file.
- Data
  - Prefer keyset pagination by `(updated_at, id)` to support incremental updates and stable chunking.
  - Include `lastmod` for each URL; prioritize recently updated parts in earlier chunks if desired.
- Caching & Performance
  - Use `cachedEventHandler` with TTL (e.g., 12h) and background regeneration on cache miss.
  - Add ETag and `Cache-Control: public, max-age=86400, stale-while-revalidate=604800`.
  - Optional: scheduled warmers to prebuild hot chunks post-deploy.
- HTML Sitemaps (remain in-app)
  - Keep indexable HTML sitemaps (index, manufacturers, modalities), paginate lists, avoid dumping 120k items on single pages.
  - No need to mirror all XML content in HTML; focus on discoverability paths.

### Open Questions
## Worklog
- 2025-09-29: Plan created; decisions captured. Awaiting `@nuxtjs/seo` installation to begin config.
- 2025-09-29: Added "Sitemaps Strategy (120k+ URLs)" section; proposed hybrid path (internal lightweight sitemaps first, prototype internal parts sitemaps with caching/streaming); pending benchmark and switch decision.
- 2025-09-29: Implemented base SEO: updated `nuxt.config.ts` (head defaults, site metadata), added composables (`useCanonical`, `useSeoDefaults`, `useJsonLd`), applied page-level SEO to Home, Listing (with prev/next), Manufacturer, and Detail pages; added `error.vue` with `noindex`.
- 2025-09-29: Added HTML sitemaps (`/sitemap`, manufacturer and modality pages) with pagination and links to part detail.
