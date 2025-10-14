# Project TODO

This file tracks the refactoring of the application from a private portal to a public-facing catalog site.

## Dependencies and Configuration
- [x] Add `@nuxt/ui` module for `UApp`, `UPagination`, and `USelect` components.
  - [x] Install dependency and add to `nuxt.config.ts` `modules`.
- [x] Add `he` package used by `app/components/PartsTable.vue`.
- [x] Define `runtimeConfig` mappings so server and client code can access Directus settings:
  - [x] Server: `directus_url <- process.env.NUXT_DIRECTUS_URL`, `directus_token <- process.env.NUXT_DIRECTUS_TOKEN`.
  - [x] Client: `public.directus.url <- process.env.NUXT_PUBLIC_DIRECTUS_URL` (for image asset URLs).
- [ ] Optional: Do NOT add `@nuxtjs/directus` (we are removing `useDirectus*` usages); only needed if any Directus composables remain.
 - [x] Optional: Do NOT add `@nuxtjs/directus` (we are removing `useDirectus*` usages); only needed if any Directus composables remain. (Removed from modules and uninstalled.)

## Data Access Strategy (Keep)
- [ ] Ensure server-side data fetching continues to use the Directus token. No user login is required for the public site.
  - [ ] Verify `.env` contains the required values for Directus, e.g. `NUXT_DIRECTUS_URL` and `NUXT_DIRECTUS_TOKEN` (private) and, if needed for client image URLs, `NUXT_PUBLIC_DIRECTUS_URL` (public).
  - [ ] Verify `runtimeConfig` exposes these values correctly (either via `nuxt.config.ts` or Nuxt’s env mapping) so that server routes can read `directus_url` and `directus_token`, and client code can read `runtimeConfig.public.directus.url`.

## Authentication Removal
- [ ] Remove Authentication Middleware
  - [ ] Delete `app/middleware/auth.ts`.
- [ ] Delete Login Page
  - [ ] Delete `app/pages/login.vue`.
- [ ] Remove page-level auth middleware
  - [x] Remove `definePageMeta({ middleware: 'auth' })` from:
    - [x] `app/pages/index.vue`
    - [x] `app/pages/parts/index.vue`
    - [x] `app/pages/parts/manufacturer/[slug].vue`
    - [x] `app/pages/parts/modality/[slug].vue`
    - [x] `app/pages/part/[manufacturer_slug]/[part_slug].vue`
- [ ] Update Global Application Files
  - [ ] Check `app/app.vue` for any global middleware references (none currently) and ensure none remain.

## Remove Customer Logic and Pricing
- [ ] Remove Customer Data Logic
  - [ ] Delete `app/composables/useCustomers.ts`.
- [ ] Clean Up the Application Header
  - [x] Modify `app/components/AppHeader.vue` to remove user-specific elements (logout button, customer name, `useDirectusUser`, `useDirectusAuth`, `useCustomer`, and the user object watcher).
- [ ] Remove Pricing from the Parts Table (UI)
  - [x] Modify `app/components/PartsTable.vue` to remove pricing columns ("List Price", "Your Price") and the `formatCurrency` function.
- [ ] Remove Pricing from Server Queries (API)
  - [x] In `server/api/data/get-parts.ts`, remove `prices.*`, the `deep.prices` filter, and any fields related to `your_price` or customer-specific pricing. Keep token-based Authorization headers intact.
  - [x] In `server/api/data/find-part.ts`, ensure no pricing-only fields are fetched or exposed that the UI won’t display.

## Documentation and Testing
- [ ] Update README
  - [ ] Clarify that this is a public catalog. Authentication is removed; data is fetched server-side using the Directus token.
- [ ] Testing Plan
  - [ ] Verify all routes are publicly accessible (no redirects to `/login`).
  - [ ] Verify header shows no user/login/logout UI.
  - [ ] Verify parts listing and detail pages show no pricing fields.
  - [ ] Verify server API endpoints still load data using the Directus token.
