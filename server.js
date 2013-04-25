var http = require('http');

// Get port from environment variables
var port = process.env.PORT || 3000;

var MDNio = {
  searchHost: 'http://www.google.com/uds',
  defaultURL: 'https://developer.mozilla.org/en-US/docs/JavaScript',
  // Build search URL
  getSearchURL: function(keyword) {
    return MDNio.searchHost+'/GwebSearch?q='+encodeURIComponent(keyword+' site:developer.mozilla.org')+'&v=1.0';
  },
  // Get the MDN URL corresponding to a search
  getURL: function(keyword, callback) {
    console.log('Getting URL for:', keyword);

    if (!keyword) return callback(null, MDNio.defaultURL);

    var searchURL = MDNio.getSearchURL(keyword);
    console.log('Searching for:', keyword);

    // Get results from Google
    http.get(searchURL, MDNio.getResponse.bind(MDNio, function(error, result) {
      var url = !error && result.responseData && result.responseData.results && result.responseData.results.length ? result.responseData.results[0].unescapedUrl : null;
      console.log('Redirecting to:', url);
      callback(error, url)
    })).end();
  },
  // Handle the response from the server
  getResponse: function(callback, response) {
    console.log('Response status:', response.statusCode);

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
  // Handle requests from clients
  handleRequest: function (req, res) {
    // Find the url corresponding to the passed path
    MDNio.getURL(req.url.slice(1), function(error, url) {
      // On error or empty URL, redirect to default URL
      if (error || !url)
          url = MDNio.defaultURL;

      // Redirect to the URL
      res.writeHead(303, {'Location': url});
      res.end();    
    });
  }
}

// Start a server
http.createServer(MDNio.handleRequest).listen(port);

console.log('Server running on port '+port);
