const debug = require('debug')('mdn.io')
const { createServer } = require('http')
const { Response } = require('servie')
const { createHandler } = require('servie-http')
const { redirect } = require('servie-redirect')
const { getURL } = require('servie-url')
const handler = require('./index')
const config = require('./config')
const public = require('./public')
const port = process.env.PORT || 3000

const server = module.exports = createServer(createHandler(req => {
  const url = getURL(req)

  const query = url.pathname.substr(1);
  debug('query %s', query || '(empty query)')

  const check = public.checkForPublic(query);
  if (check != null) return new Response(check.body, { statusCode: 200, headers: { 'Content-Type': check.type + '; charset=UTF-8' } })

  return redirect(req, handler(config, query), 303)
}))

if (!module.parent) {
  server.listen(port, function () {
    debug('server running on port %s', port)
  })
}
