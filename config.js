var mdnDomain   = 'developer.mozilla.org';
var mdnHomepage = 'https://developer.mozilla.org/en-US/docs/Web/JavaScript';

/*
  Environment variables:
    PORT: The port to run the server on
    SERVICE: The search service to use. ('google' or 'bing')
    SEARCH_DOMAIN: The domain to search
    FALLBACK_URL: The default URL for empty queries
*/

module.exports = {
  port: process.env.PORT || 3000,
  domain: process.env.SEARCH_DOMAIN || mdnDomain,
  service: process.env.SERVICE || 'google',
  fallbackUrl: process.env.FALLBACK_URL || mdnHomepage,

  services: {
    google: 'https://www.google.com/search?btnI&q=%s',
    bing: 'http://www.bing.com/search?q=%s',
    ddg: 'https://duckduckgo.com/?q=%21%20%s'
  }
};
