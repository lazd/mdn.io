var http    = require('http');
var debug   = require('debug')('mdn.io');
var LRU     = require('lru-cache');
var util    = require('util');
var request = require('request');
var config  = require('./config');

function getServiceUrl (service, query) {
  var searchQuery = encodeURIComponent(query + ' site:' + config.domain);

  return util.format(service, searchQuery);
}

function getRedirectUrl (service, query, done) {
  var req = request(getServiceUrl(service, query));

  req.on('response', function (res) {
    var url = res.request.uri.href;

    req.abort();

    return done(null, url);
  });

  req.on('error', done);
}

function handler () {
  var service = config.services[config.service];

  var cache = LRU({
    max: 10000000, // 10Mb
    length: function (n) { return n.length; },
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
  });

  return function (req, res) {
    var query = decodeURIComponent(req.url.substr(1));
    var url = cache.get(query);

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

    getRedirectUrl(service, query, function (err, url) {
      if (err) {
        debug('Error redirecting (%s)', err);

        res.writeHead(500);
        res.end();
        return;
      }

      cache.set(query, url);

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
