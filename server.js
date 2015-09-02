var http    = require('http');
var debug   = require('debug')('mdn.io');
var util    = require('util');
var config  = require('./config');

function getServiceUrl (service, query) {
  var searchQuery = encodeURIComponent(query + ' site:' + config.domain);

  return util.format(service, searchQuery);
}

function handler () {
  var service = config.services[config.service];

  return function (req, res) {
    var query

    function redirect (url) {
      debug('Redirect (%s => %s)', query || '(empty query)', url);

      res.writeHead(303, { 'Location': url });
      res.end();
    }

    // Catch invalid URI decodes. E.g. "%abc".
    try {
      query = decodeURIComponent(req.url.substr(1)).trim();
    } catch (e) {
      res.statusCode = 400;
      res.end();
    }

    if (!query) {
      redirect(config.fallbackUrl);
      return;
    }

    redirect(getServiceUrl(service, query));
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
