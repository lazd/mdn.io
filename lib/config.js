module.exports = {
  url: process.env.SERVICE_URL || 'https://duckduckgo.com/?q=%21%20%s',
  // The domain to limit search results.
  domain: process.env.SEARCH_DOMAIN || 'developer.mozilla.org',
  // The default URL for empty queries.
  fallbackUrl: process.env.FALLBACK_URL || 'https://developer.mozilla.org/en-US/docs/Web/JavaScript'
}
