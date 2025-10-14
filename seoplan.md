# SEO Plan – multi.app.parts

This document tracks confirmed decisions, tasks, and progress for the new catalog app’s SEO. No changes are implemented yet; this is the plan of record.

## Decisions (2025-10-13)
- **URL schemes**
  - Keep: `/part/{manufacturer_slug}/{part_slug}` (detail) – already handled.
  - Redirect: `/manufacturer/{slug}` → `/parts/manufacturer/{slug}` (301), preserve relevant query params.
- **Pagination canonical policy**
  - Page 1 canonical → base listing (e.g., `/parts`).
  - Page N>1 canonical → include `?page=N`.
  - Do not include `sort` in canonical.
- **Filtered listings**
  - Canonicalize filtered `/parts` URLs back to base listings.
  - Keep dedicated manufacturer/modality landings indexable.
- **XML sitemaps**
  - Keep external generator for now.
  - Implement proxying in the new app so `/sitemap.xml` and `/sitemaps/*.xml` are served by the app (like the live project).
- **Robots**
  - No extra disallows beyond standard.
- **Social images**
  - Enable fallback OG/Twitter images (e.g., nuxt-og-image) if it helps visibility.
- **Analytics**
  - Keep the inline GA/Clarity approach used in the live site unless issues arise.
- **Scope**
  - Focus on the new project only (no edits to the live project now).

## TODO (planning only; do not implement yet)
- [ ] Sitemaps proxy
  - [ ] Add Nitro routes in `server/routes/sitemaps/` for: `/sitemap.xml` (index) and `/sitemaps/[...path].xml` (children) that proxy to the external generator.
  - [ ] Set appropriate cache headers (e.g., max-age=12h) and content-type.
  - [ ] Confirm target base URL to proxy (same as live project?) and whether the index path should be `/sitemap.xml` or `/sitemaps/index.xml`.
- [ ] Robots.txt
  - [ ] Configure dynamic robots via `@nuxtjs/seo` bundle (nuxt-simple-robots) to reference the proxied sitemap index.
  - [ ] Exclude `/api/**` and any admin/utility endpoints as needed.
- [ ] Canonical policy
  - [ ] Ensure `useCanonical` allowlist excludes `sort`.
  - [ ] Page 1 canonical to base; N>1 canonical to `?page=N` across listings.
  - [ ] Canonicalize filtered `/parts` pages back to base.
- [ ] Pagination hints
  - [ ] Add rel=prev/next to paginated listings (manufacturers, modalities, general parts listings) consistent with policy.
- [ ] Social image fallback
  - [ ] Enable `nuxt-og-image` or equivalent fallback for pages without a natural image (manufacturers, certain listings).
- [ ] Analytics
  - [ ] Align inline GA/Clarity injection with live approach; add sanitizers if required for inline scripts.
- [ ] Redirects
  - [ ] Implement 301 for `/manufacturer/{slug}` → `/parts/manufacturer/{slug}` with param preservation where appropriate.
- [ ] QA & Validation
  - [ ] Verify `/robots.txt`, proxied `/sitemap.xml`, and child sitemaps.
  - [ ] Spot-check canonicals (home, listings, detail, manufacturer) and JSON-LD.
  - [ ] Run Lighthouse SEO; fix issues discovered.

## Milestones
- **M1**: Proxy routes for XML sitemaps added and verified (no generation yet).
- **M2**: Robots served dynamically and referencing proxied sitemap index.
- **M3**: Canonical + pagination policies applied across listings.
- **M4**: Manufacturer redirects live (safe deploy window).
- **M5**: Social image fallback enabled where helpful.
- **M6**: QA complete (robots/sitemaps/canonicals/JSON-LD/Lighthouse).

## Open Questions
- Should the proxy target match the live project’s endpoint (`https://sitemaps-multi-3dyyx.ondigitalocean.app`)?
- Should the sitemap index be exposed as `/sitemap.xml` (preferred) while internally proxying `/sitemaps/index.xml`?

## Worklog
- 2025-10-13: Created initial plan from confirmed decisions. No code changes yet.
