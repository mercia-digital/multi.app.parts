export default defineEventHandler(async (event) => {
  // Intercept old URLs shaped like /part/:part_number (single segment under /part)
  const { pathname } = getRequestURL(event);

  // Only handle exactly two segments: /part/<value>
  const match = pathname.match(/^\/part\/([^\/]+)$/);
  if (!match) {
    return; // Not an old-style part URL; continue normal handling
  }

  const legacyPn = decodeURIComponent(match[1]);
  if (!legacyPn) {
    return;
  }

  const config = useRuntimeConfig();

  try {
    // Query Directus for the part matching the legacy field `old_directus_pn`
    const resp = await $fetch<{ data: any[] }>(config.directus_url + '/items/parts', {
      headers: {
        Authorization: 'Bearer ' + config.directus_token,
      },
      params: {
        filter: {
          _and: [
            { old_directus_pn: { _eq: legacyPn } },
            { status: { _neq: 'archived' } },
          ],
        },
        limit: 1,
        fields: [
          'slug',
          'part_number',
          'manufacturer.slug',
        ],
      },
    });

    const part = resp?.data?.[0];
    const manufacturerSlug = part?.manufacturer?.slug;

    // If found, redirect permanently to the new URL structure used by the app
    if (part && manufacturerSlug) {
      // NOTE: The current app routes to /part/[manufacturer_slug]/[part_slug]
      // so we build the URL using the part's slug to match existing pages.
      const target = `/part/${encodeURIComponent(manufacturerSlug)}/${encodeURIComponent(part.slug)}`;
      return sendRedirect(event, target, 301);
    }
  } catch (e) {
    // Swallow errors and fall through to normal handling to avoid breaking requests
    console.error('[legacy-part-redirect] lookup failed:', e);
  }

  // If not found or on error, redirect to parts search (temporary)
  const target = `/parts?search=${encodeURIComponent(legacyPn)}`;
  return sendRedirect(event, target, 302);
});
