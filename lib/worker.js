const debug = require('debug')('mdn.io')
const handler = require('./index')
const config = require('./config')
const public = require('./public')

addEventListener('fetch', event => {
  event.respondWith(redirect(event.request))
})

function redirect(request) {
  const url = new URL(request.url)

  const query = url.pathname.substr(1);
  debug('query %s', query || '(empty query)')

  const check = public.checkForPublic(query);
  if (check != null) return new Response(check.body, { status: 200, headers: { 'Content-Type': check.type + '; charset=UTF-8' } })

  return Response.redirect(handler(config, query), 303)
}
