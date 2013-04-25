var http = require('http');

/*
  Environment variables:
    PORT: The port to run the server on
    SEARCH_SERVER: The Google Web Search API server to use
    SEARCH_DOMAIN: The domain to search
    FALLBACK_URL: The default URL for empty queries/no matches
*/

var mdnio = {
  port: process.env.PORT || 3000,
  searchServer: process.env.SEARCH_SERVER || 'http://www.google.com/uds',
  searchDomain: process.env.SEARCH_DOMAIN || 'developer.mozilla.org',
  fallbackURL: process.env.FALLBACK_URL || 'https://developer.mozilla.org/en-US/docs/JavaScript',

  // Build search URL
  getSearchURL: function(query) {
    return mdnio.searchServer+'/GwebSearch?q='+encodeURIComponent(query+' site:'+mdnio.searchDomain)+'&v=1.0';
  },

  // Get the MDN URL corresponding to a search
  getURL: function(query, callback) {
    // Return the default URL for empty queries
    if (!query) return callback(null, mdnio.fallbackURL);

    // Get results from Google
    http.get(mdnio.getSearchURL(query), mdnio.handlResponse.bind(mdnio, function(error, result) {
      // On error or no result, redirect to default URL
      var url = !error && result.responseData && result.responseData.results && result.responseData.results.length ? result.responseData.results[0].unescapedUrl : mdnio.fallbackURL;
      
      callback(error, url);
    })).end();
  },

  // Handle the response from the server
  handlResponse: function(callback, response) {
    var str = '';
    response.on('data', function(chunk) {
      str += chunk;
    });

    response.on('end', function() {
      try {
        callback(null, JSON.parse(str));
      }
      catch (error) {
        callback(error);
      }
    });
  },

  // Decode the query
  getQuery: function(url) {
    return unescape(url.slice(1));
  },

  // Handle requests from clients
  handleRequest: function(req, res) {
    var query = mdnio.getQuery(req.url);

    // Find the url corresponding to the passed path
    mdnio.getURL(query, function(error, url) {
      if (error || !url) url = mdnio.fallbackURL;

      console.log(query+' => '+url);

      // Redirect to the URL
      res.writeHead(303, { 'Location': url });
      res.end();
    });
  },

  startServer: function() {
    // Start a server
    http.createServer(mdnio.handleRequest).listen(mdnio.port);

    console.log('mdn.io server running on port '+mdnio.port);
    console.log('Search server: '+mdnio.searchServer);
    console.log('Search domain: '+mdnio.searchDomain);
    console.log('Default URL: '+mdnio.fallbackURL);
  }
};

// Start the server
mdnio.startServer();
