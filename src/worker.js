const handler = require("./index");

addEventListener("fetch", (event) => {
  event.respondWith(redirect(event.request));
});

function redirect(request) {
  const url = new URL(request.url);
  const redirectUrl = handler(decodeURIComponent(url.pathname.slice(1)));

  return new Response(null, {
    status: 303,
    headers: {
      Location: redirectUrl,
      "Referrer-Policy": "no-referrer",
    },
  });
}
