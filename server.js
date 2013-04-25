var http = require('http');

// Get port from environment variables
var port = process.env.PORT || 3000;

var MDNio = {
  searchHost: 'http://www.google.com/uds',
  defaultURL: 'https://developer.mozilla.org/en-US/docs/JavaScript',
  // Build search URL
  getSearchURL: function(query) {
    return MDNio.searchHost+'/GwebSearch?q='+encodeURIComponent(query+' site:developer.mozilla.org')+'&v=1.0';
  },
  // Get the MDN URL corresponding to a search
  getURL: function(query, callback) {
    console.log('Getting URL for:', query);

    // Return the default URL for empty queries
    if (!query) return callback(null, MDNio.defaultURL);

    // Get results from Google
    http.get(MDNio.getSearchURL(query), MDNio.getResponse.bind(MDNio, function(error, result) {
      // On error or no result, redirect to default URL
      var url = !error && result.responseData && result.responseData.results && result.responseData.results.length ? result.responseData.results[0].unescapedUrl : MDNio.defaultURL;
      
      callback(error, url);
    })).end();
  },
  // Handle the response from the server
  getResponse: function(callback, response) {
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
  handleRequest: function (req, res) {
    var query = MDNio.getQuery(req.url);

    // Find the url corresponding to the passed path
    MDNio.getURL(query, function(error, url) {
      if (error || !url) url = MDNio.defaultURL;

      console.log(query+' => '+url);

      // Redirect to the URL
      res.writeHead(303, {'Location': url});
      res.end();    
    });
  }
};

// Start a server
http.createServer(MDNio.handleRequest).listen(port);

console.log('Server running on port '+port);
