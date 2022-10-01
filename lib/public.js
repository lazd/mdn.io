module.exports = {
  checkForPublic(query) {
    if (!query || query == 'index.html') return { body: this.indexhtml, type: 'text/html' }
    if (query == '.well-known/opensearch.xml') return { body: this.opensearchxml, type: 'text/xml' }
    return null
  },

  indexhtml: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>mdn.io</title>
  <link rel="search" type="application/opensearchdescription+xml" href="/.well-known/opensearch.xml" title="MDN Web Docs" />
  <style>
    body {
      background-color: #252525;
      color: white;
      padding: 1rem;
      display: grid;
      grid-template-columns: 100%;
      /* From MDN Web Docs */
      font-family: Inter, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    }

    header {
      text-align: center;
      grid-row: 1;
      grid-column: 1;
    }

    main {
      text-align: center;
      grid-row: 2;
      grid-column: 1;
    }

    footer {
      text-align: center;
      grid-row: 3;
      grid-column: 1;
    }

    a {
      color: #539bf5;
    }
  </style>
</head>
<body>
  <header>
    <h1>mdn.io</h1>
  </header>
  <main>
    <p>mdn.io is the "I'm feeling lucky" URL shortener. mdn.io is fully open source, and you can find more info at its <a href="https://github.com/lazd/mdn.io#readme">README</a>.</p>
  </main>
  <footer>
    <h3>Adding it as a search engine in your browser</h3>
    <p>In some browsers, you can right click the address bar and click <code>Add MDN Web Docs</code>. From there, you can configure a keyword in your browsers settings.</p>
    <p>Firefox: <a href="https://support.mozilla.org/en-US/kb/add-or-remove-search-engine-firefox#w_add-a-search-engine-from-the-address-bar" target="_blank">support.mozilla.org/en-US/kb/add-or-remove-search-engine-firefox</a></p>
    <p>Chromium-based browsers:</p>
  </footer>
</body>
</html>`,

  opensearchxml: `<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/" xmlns:moz="http:/www.mozilla.org/2006/browser/search/">
  <ShortName>MDN Web Docs</ShortName>
  <Description>Search MDN Web Docs</Description>
  <InputEncoding>UTF-8</InputEncoding>
  <Image width="16" height="16" type="image/ico">
      https://developer.mozilla.org/favicon.ico
  </Image>
  <Url type="text/html" method="get" template="http://mdn.io/{searchTerms}" />
  <moz:SearchForm>http://mdn.io</moz:SearchForm>
</OpenSearchDescription>`
}