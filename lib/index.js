const debug = require('debug')('mdn.io')
const { format } = require('util')
const { redirect } = require('servie-redirect')

function handler (service) {
  return function (req) {
    const query = req.url.substr(1)

    debug('query %s', query || '(empty query)')

    if (!query) {
      return redirect(req, service.fallbackUrl, 303)
    }

    const url = format(service.url, query + encodeURIComponent(` site:${service.domain}`))

    return redirect(req, url, 303)
  }
}

module.exports = handler
