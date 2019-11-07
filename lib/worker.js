const handler = require('./index')
const config = require('./config')

addEventListener('fetch', event => {
  event.respondWith(redirect(event.request))
})

function redirect(request) {
  const url = new URL(request.url)

  return Response.redirect(handler(config, url.pathname.substr(1)), 303)
}
