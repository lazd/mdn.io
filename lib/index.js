const { format } = require('util')

function handler(service, query) {
  if (!query) return service.fallbackUrl

  return format(service.url, encodeURIComponent(`site:${service.domain} `) + query)
}

module.exports = handler
