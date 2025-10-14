import { defineEventHandler, getRequestURL, sendRedirect } from 'h3'

// Redirect legacy manufacturer URLs:
//   /manufacturer/{slug}  ->  /parts/manufacturer/{slug}
// Preserve query parameters and use a permanent (301) redirect.
export default defineEventHandler((event) => {
  const url = getRequestURL(event)
  const { pathname, search } = url

  // Match exactly two segments with optional trailing slash
  const match = pathname.match(/^\/manufacturer\/([^\/]+)\/?$/)
  if (!match) {
    return
  }

  const slug = decodeURIComponent(match[1])
  const target = `/parts/manufacturer/${encodeURIComponent(slug)}${search || ''}`
  return sendRedirect(event, target, 301)
})
