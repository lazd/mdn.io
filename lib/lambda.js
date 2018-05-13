const { createHandler } = require('servie-lambda')
const handler = require('./index')
const config = require('./config')

exports.handler = createHandler(handler(config))
