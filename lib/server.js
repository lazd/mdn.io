const debug = require('debug')('mdn.io')
const { createServer } = require('http')
const { createHandler } = require('servie-http')
const handler = require('./index')
const config = require('./config')
const port = process.env.PORT || 3000

const server = module.exports = createServer(createHandler(handler(config)))

if (!module.parent) {
  server.listen(port, function () {
    debug('server running on port %s', port)
  })
}
