const debug = require('debug')('mdn.io')
const { format } = require('util')

function handler (service, query) {
  debug('query %s', query || '(empty query)')

  if (!query) return service.fallbackUrl

  return format(service.url, query + encodeURIComponent(` site:${service.domain}`))
}

module.exports = handler
