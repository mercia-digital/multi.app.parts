# SEO & Indexing Audit for `parts.nuxt3.multi`

This document outlines the current SEO and indexing setup in the codebase, identifies strengths, and lists concrete improvements.

# Findings

- **[Nuxt + SEO Modules]**
  - `@nuxtjs/seo` is enabled in `nuxt.config.ts` (`modules` includes `@nuxtjs/seo`). This typically bundles features like `@nuxtjs/sitemap`, `nuxt-simple-robots`, `nuxt-og-image`, and Schema.org integration.
  - `site` is configured in `nuxt.config.ts` with:
    - `url: https://parts.multi-inc.com`
    - `name: MULTI, INC. Parts Catalog`
    - `description` and `defaultLocale`.

- **[Global Head Config]** (`nuxt.config.ts` → `app.head`)
  - `titleTemplate`: `"%s | MULTI, INC. Parts Catalog"`.
  - Meta: `charset`, `viewport`, `format-detection`, global `robots: index, follow`, `google-site-verification`, `og:site_name`, `og:type=website`, `twitter:card=summary_large_image`.
  - Link: favicon(s), Google Fonts preconnects, and a global canonical set to `https://parts.multi-inc.com`.
  - Scripts: Font Awesome, HubSpot (`https://js.hs-scripts.com/4679263.js`), GA4 (`G-LPH95E885X`), Microsoft Clarity. `__dangerouslyDisableSanitizers: ['script']` enabled to allow inline scripts.
  - Note: The global canonical may conflict with per-page canonicals (see Issues).

- **[Homepage SEO]** (`pages/index.vue`)
  - `useSeoMeta()` sets title, description, OG, Twitter, `robots: index, follow`.
  - `useHead()` sets canonical to `https://parts.multi-inc.com` and adds JSON‑LD:
    - `WebSite` with `SearchAction` targeting `https://parts.multi-inc.com/parts?term={search_term_string}`.
    - `Organization` for MULTI, INC.

- **[Parts Listing SEO]** (`pages/parts.vue`)
  - `useSeoMeta()` for title, description, OG/Twitter, `robots: index, follow`.
  - `useHead()` sets canonical to `https://parts.multi-inc.com/parts` (canonicalizes filter variations to a single URL).
  - Pagination UI present, but no `<link rel="prev">` / `<link rel="next">` hints in head.

- **[Part Detail SEO]** (`pages/part/[part_number].vue`)
  - Dynamically computes `title`, `description`, social image from part data.
  - `useHead()` sets: description, OG/Twitter set incl. image, `robots: index, follow`.
  - Canonical: `https://parts.multi-inc.com/part/{part_number}`.
  - JSON‑LD:
    - `Product` (name, image, description, sku, brand, offers placeholder with “Call for pricing”).
    - `BreadcrumbList` based on computed breadcrumbs.

- **[Manufacturer SEO]** (`pages/manufacturer/[slug].vue`)
  - `useHead()` sets title and description (HTML stripped, ~160 chars).
  - Mistakenly sets a `meta` tag `{ name: 'canonical', content: ... }` (invalid). Also correctly sets `link rel="canonical"` to the manufacturer URL (this is the one that matters).
  - JSON‑LD:
    - `Organization` for the manufacturer.
    - `BreadcrumbList`.
  - Lacks explicit `og:image` / `twitter:image` for richer sharing.

- **[Sitemaps & Robots]**
  - `public/_robots.txt` (note leading underscore) contains rules and references a sitemap index:
    - Disallows: `/admin/`, `/private/`, `/api/`, `/_nuxt/`, `/.nuxt/`, `/.output/`.
    - Sets crawl-delays and agents.
    - `Sitemap: https://parts.multi-inc.com/sitemaps/index.xml`.
  - `public/topparts.xml` is a large static XML (likely a parts sitemap). `public/sitemaps/` is present but empty.
  - `@nuxtjs/seo` implies `@nuxtjs/sitemap` and `nuxt-simple-robots` are available. No explicit sitemap or robots configuration is set in `nuxt.config.ts`, so behavior may rely on defaults if those submodules are active.
  - Custom HTML sitemaps for human browsing are implemented under `pages/sitemap/`:
    - `pages/sitemap/index.vue` (lists manufacturers and modalities), uses `useHead()` with a basic title/description.
    - `pages/sitemap/manufacturers/[slug].vue` and `pages/sitemap/modalities/[slug].vue` list detail pages, set page title/description, and use `definePageMeta({ layout: false, prerender: { ... } })` to generate static pages.

- **[Layouts and App Shell]**
  - `app.vue` hides the site header/footer for routes under `/sitemap/` to present a clean HTML sitemap experience.

- **[Error Page Indexing]** (`error.vue`)
  - Custom error template without explicit `noindex`. If served for 404/500, consider adding a `robots: noindex, nofollow` meta.

- **[Performance/Assets]**
  - Fonts are preconnected and loaded via Google Fonts (sensible). Product pages use part images for OG/Twitter previews.

# What’s Working Well

- **[Sensible Global Defaults]** in `nuxt.config.ts` for robots, social defaults, and verification.
- **[Page-Level SEO]** with `useSeoMeta()` and `useHead()` across homepage, listing, and product detail pages.
- **[Structured Data]**: `Product` + `BreadcrumbList` on product pages; `WebSite` + `SearchAction` and `Organization` on homepage; `Organization` and `BreadcrumbList` on manufacturer pages.
- **[Canonical Strategy]**: Homepage, `/parts`, product detail, and manufacturer pages set clean canonicals.
- **[Martech Coverage]**: GA4, HubSpot, and Clarity are integrated.

# Issues and Risks

- **[Conflicting Canonicals]**
  - `nuxt.config.ts` sets a global canonical to `https://parts.multi-inc.com` while pages like `/parts`, `/part/[part_number]`, and `/manufacturer/[slug]` set their own canonical. Multiple canonicals can confuse crawlers.

- **[Invalid Canonical in Meta]**
  - `pages/manufacturer/[slug].vue` includes `{ name: 'canonical', content: ... }` in `meta`. Canonicals must be `link rel="canonical"`.

- **[Robots.txt Source of Truth]**
  - Static robots file is named `_robots.txt`, so it will be served at `/_robots.txt` (not at `/robots.txt`).
  - If dynamic robots from `nuxt-simple-robots` are used, mixing static and dynamic can conflict. The file references `https://parts.multi-inc.com/sitemaps/index.xml`, which isn’t present in `public/` and may require dynamic generation/config.

- **[Sitemap Strategy Fragmented]**
  - Static `public/topparts.xml` exists, custom HTML sitemaps exist, and auto-generated XML sitemaps may be enabled via `@nuxtjs/seo` defaults — but no explicit sitemap configuration is in `nuxt.config.ts`.

- **[Manufacturer Social Previews]**
  - Missing `og:image`/`twitter:image` on `pages/manufacturer/[slug].vue` reduces share quality.

- **[Pagination SEO on `/parts`]**
  - No `<link rel="prev">` / `<link rel="next">` hints. Canonical currently points to `/parts` which consolidates parameter variants; consider page-specific canonicals or at least prev/next for discoverability.

- **[Error/Noindex Coverage]**
  - `error.vue` does not set `robots: noindex`. Empty states and error pages should prevent indexing.

- **[JSON‑LD Consistency]**
  - Some pages use `children` for JSON‑LD; others use `innerHTML`. Both work with unhead, but unify for consistency.

# Recommended Actions

- **[Remove Global Canonical]**
  - File: `nuxt.config.ts` → `app.head.link`
  - Remove: `{ rel: 'canonical', href: 'https://parts.multi-inc.com' }`.
  - Rely on page-level canonicals (or let `@nuxtjs/seo` auto-generate from `site.url`).

- **[Fix Manufacturer Canonical]**
  - File: `pages/manufacturer/[slug].vue` → `useHead({ meta: [...] })`
  - Remove the invalid `{ name: 'canonical', content: ... }`. Keep the `link rel="canonical"`.
  
- **[Choose One Robots Strategy]**
  - Option A (Dynamic via `nuxt-simple-robots`):
    - Configure in `nuxt.config.ts` (e.g., allow all, add sitemap references) and remove the static robots file.
  - Option B (Static):
    - Rename `public/_robots.txt` → `public/robots.txt` so it serves at `/robots.txt`.
    - Ensure it references the correct sitemap URL(s) you intend to serve.

- **[Unify Sitemap Strategy]**
  - Configure `@nuxtjs/sitemap` in `nuxt.config.ts`:
    - Provide `siteUrl` (use `site.url`).
    - Define sitemaps (e.g., index + child sitemaps for parts and manufacturers; chunk large collections).
    - Exclude non-indexable routes.
  - Remove or deprecate `public/topparts.xml` if duplicative, or reference only the canonical sitemap(s) from robots.txt.
  - Keep HTML sitemaps in `pages/sitemap/` for users; they can remain indexable but are optional for crawlers.

- **[Add Social Images on Manufacturer Pages]**
  - File: `pages/manufacturer/[slug].vue`
  - In `useHead()`, add `og:image` and `twitter:image` from `manufacturer.logo` (via `getManufacturerLogoUrl`) with a fallback image.

- **[Add Pagination Hints on `/parts`]**
  - File: `pages/parts.vue`
  - In `useHead()`, compute and add `<link rel="prev">` and `<link rel="next">` for `page > 1` and `page < totalPages`.
  - Consider whether canonical should include `?page=` for paginated pages; current consolidation to `/parts` is fine if intentional.

- **[Noindex for Error Pages]**
  - File: `error.vue`
  - Add `useHead({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] })`.

- **[JSON‑LD Hygiene]**
  - Standardize on `innerHTML` or `children` project-wide for JSON‑LD.
  - Validate `Product` schema: prefer `mpn` when appropriate, add `itemCondition`, `gtin` (if available), and enrich `brand`.

# Optional Enhancements

- **[Open Graph Image Generation]**
  - Use `nuxt-og-image` (part of `@nuxtjs/seo`) and `defineOgImage` for consistent share cards when product imagery is missing.

- **[X‑Robots‑Tag Headers]**
  - For large XML or non-HTML assets, control indexing via headers using Nitro middleware as needed.

- **[Indexability Review]**
  - Verify which filtered `/parts` pages should be indexable vs. consolidated under `/parts` canonical; current canonical setup already consolidates filters to `/parts`.

# Quick File Pointers

- `nuxt.config.ts`: global head, modules, `site` config.
- `pages/index.vue`: homepage SEO with `useSeoMeta`, canonical, `WebSite` + `SearchAction`, `Organization` JSON‑LD.
- `pages/parts.vue`: listing SEO with `useSeoMeta`, canonical, pagination UI.
- `pages/part/[part_number].vue`: detailed SEO (OG/Twitter, canonical, `Product` + `BreadcrumbList` JSON‑LD).
- `pages/manufacturer/[slug].vue`: manufacturer SEO (fix canonical meta, add social images).
- `pages/sitemap/`: HTML sitemaps (index, manufacturers, modalities), prerendered.
- `public/_robots.txt`: static robots (rename to `robots.txt` or replace with dynamic).
- `public/topparts.xml`: static sitemap (rationalize with sitemap module).

# Status

- Baseline SEO is strong and structured. Implement the targeted fixes above to remove conflicting signals (canonical/robots/sitemap), improve shareability, and enhance crawl guidance.
