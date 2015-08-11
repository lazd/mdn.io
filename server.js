var http    = require('http');
var https   = require('https');
var debug   = require('debug')('mdn.io');
var LRU     = require('lru-cache');
var util    = require('util');
var urlLib  = require('url');
var config  = require('./config');

var CACHE_TIMEOUT = 7 * 24 * 60 * 60 * 1000 // 7 days.
var CACHE_MAX_SIZE = 10000000 // 10Mb.
var ATTEMPT_TIMEOUT = 30 * 60 * 1000 // 30 minutes.

function getServiceUrl (service, query) {
  var searchQuery = encodeURIComponent(query + ' site:' + config.domain);

  return util.format(service, searchQuery);
}

function followRedirect (url, done) {
  var req = /^https?:\/\//i.test(url) ? https.get(url) : http.get(url);

  req.once('response', function (res) {
    req.abort();

    if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 303) {
      if (res.headers.location) {
        return followRedirect(res.headers.location, done);
      }
    }

    return done(null, url);
  });

  req.once('error', done);
}

function handler () {
  var service = config.services[config.service];

  var redirectCache = LRU({
    max: CACHE_MAX_SIZE,
    length: function (n) { return n.length; },
    maxAge: CACHE_TIMEOUT
  });

  var failedRedirectCache = LRU({
    max: 1,
    maxAge: ATTEMPT_TIMEOUT
  })

  return function (req, res) {
    var query

    // Catch invalid URI decodes. E.g. "%abc".
    try {
      query = decodeURIComponent(req.url.substr(1));
    } catch (e) {
      res.statusCode = 400;
      res.end();
    }

    var url = redirectCache.get(query);
    var serviceUrl = getServiceUrl(service, query);
    var failedRedirect = failedRedirectCache.itemCount > 0;

    function redirect (url) {
      debug('Redirect (%s => %s)', query || '(empty query)', url);

      res.writeHead(303, { 'Location': url });
      res.end();
    }

    if (!query) {
      return redirect(config.fallbackUrl);
    }

    if (url) {
      debug('Using cache (%s => %s)', query, url);

      return redirect(url);
    }

    if (failedRedirect) {
      debug('Using client side redirect (%s => %s)', query, serviceUrl);

      return redirect(serviceUrl);
    }

    followRedirect(serviceUrl, function (err, url) {
      if (err) {
        debug('Error redirecting (%s)', err);

        res.writeHead(500);
        res.end();
        return;
      }

      // If we weren't redirected where the domain we wanted to go,
      // fallback to client-side redirects.
      if (urlLib.parse(url).hostname !== config.domain) {
        failedRedirectCache.set(query, url);

        debug('Redirect failed (%s => %s)', query, url);

        return redirect(serviceUrl);
      }

      redirectCache.set(query, url);

      debug('Redirect cached (%s => %s)', query, url);

      return redirect(url);
    });
  };
}

var server = module.exports = http.createServer(handler());

if (!module.parent) {
  server.listen(config.port, function () {
    debug('Server running on port %s', config.port);
    debug('Search service: %s', config.service);
    debug('Domain: %s', config.domain);
    debug('Default URL: %s', config.fallbackUrl);
  });
}
