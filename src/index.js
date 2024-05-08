const debug = require("debug")("mdn.io");

const service = {
  url: "https://duckduckgo.com/?q=%21%20",
  // The domain to limit search results.
  domain: "developer.mozilla.org",
  // The default URL for empty queries.
  fallbackUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
};

function handler(query) {
  debug("query %s", query || "(empty query)");

  if (!query) return service.fallbackUrl;

  return service.url + encodeURIComponent(`site:${service.domain} ${query}`);
}

module.exports = handler;
