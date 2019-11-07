const debug = require('debug')('mdn.io')
const { createServer } = require('http')
const { createHandler } = require('servie-http')
const { redirect } = require('servie-redirect')
const { getURL } = require('servie-url')
const handler = require('./index')
const config = require('./config')
const port = process.env.PORT || 3000

const server = module.exports = createServer(createHandler(req => {
  const url = getURL(req)

  return redirect(req, handler(config, url.pathname.substr(1)), 303)
}))

if (!module.parent) {
  server.listen(port, function () {
    debug('server running on port %s', port)
  })
}
