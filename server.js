var http = require('http');

/*
  Environment variables:
    PORT: The port to run the server on
    SERVICE: The search service to use. ('google' or 'bing')
    SEARCH_DOMAIN: The domain to search
    FALLBACK_URL: The default URL for empty queries
*/

var mdnio = {
  port: process.env.PORT || 3000,
  service: process.env.SERVICE || 'google',
  
  searchDomain: process.env.SEARCH_DOMAIN || 'developer.mozilla.org',
  fallbackURL: process.env.FALLBACK_URL || 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',

  serviceURLs: {
    google: 'http://google.com/search?btnI&q=', // Use btnI to enable "I'm feeling lucky"
    bing: 'http://www.bing.com/search?q=',
    ddg: 'https://duckduckgo.com/?q=%21%20' // encodeURIComponent('! ') == %21%20
  },

  // Build search URL
  getSearchURL: function(query) {
    return mdnio.serviceURLs[mdnio.service]+encodeURIComponent(query+' site:'+mdnio.searchDomain);
  },

  // Decode the query
  getQuery: function(url) {
    return unescape(url.slice(1));
  },

  // Handle requests from clients
  handleRequest: function(req, res) {
    var query = mdnio.getQuery(req.url);
    var url = query ? mdnio.getSearchURL(query) : mdnio.fallbackURL;

    console.log((query || '(empty query)')+' => '+url);

    // Redirect to the URL
    res.writeHead(303, { 'Location': url });
    res.end();
  },

  startServer: function() {
    if (!mdnio.service || !mdnio.serviceURLs.hasOwnProperty(mdnio.service))
      mdnio.service = 'google';

    // Start a server
    http.createServer(mdnio.handleRequest).listen(mdnio.port);

    console.log('mdn.io server running on port '+mdnio.port);
    console.log('Search service: '+mdnio.service);
    console.log('Domain: '+mdnio.searchDomain);
    console.log('Default URL: '+mdnio.fallbackURL);
  }
};

// Start the server
mdnio.startServer();
