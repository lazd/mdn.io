const handler = require("./index");

addEventListener("fetch", (event) => {
  event.respondWith(redirect(event.request));
});

function redirect(request) {
  const url = new URL(request.url);

  return Response.redirect(handler(decodeURIComponent(url.pathname.slice(1))), 303);
}
