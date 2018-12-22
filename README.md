# mdn.io
> The "I'm feeling lucky" URL shortener

## Why?

The [Mozilla Developer Network] is an awesome JavaScript resource. When looking for JavaScript references on something like `Function.apply`, you might Google "apply site:developer.mozilla.org" and click the first result.

mdn.io does that for you, and can be configured to [search any domain](#searching-other-domains).

#### Use it in comments when explaining concepts

```javascript
// Make sure add() takes a single argument (see http://mdn.io/Function.length)
expect(queue.add.length).to.equal(1);
```

#### As a [lmgtfy] replacement for JavaScript questions

> **friend:** dude, is it call() or apply() that takes an array?

> **you:** mdn.io/apply

#### Type directly in the address bar as a shortcut to search the MDN

> [mdn.io/bind](http://mdn.io/bind)

> [mdn.io/closure](http://mdn.io/closure)

> [mdn.io/cross origin sharing](http://mdn.io/cross%20origin%20sharing)


## How does it work?

mdn.io uses Google's "I'm feeling lucky" functionality to redirect you to the first search result.

Note that, because this is a search, the page you're redirected to may change in the future. However, you can rest assured that you'll always be redirected to the page that Google finds most relevant.


## Searching other domains

mdn.io can be used to search any domain. See the [configuration](#configuration) section and fire up your own instance.


## Starting the server

mdn.io has no dependencies, start it with:

`PORT=8080 node server.js`

### Configuration

Configure mdn.io with the following environment variables:

| Variable            | Description                                          | Default                                               |
|:------------------- |:---------------------------------------------------- |:----------------------------------------------------- |
| **`PORT`**          | The port to run the server on.                       | `3000`                                                |
| **`SERVICE`**       | The search service to use `google`, `bing` or `ddg`. | `google`                                              |
| **`SEARCH_DOMAIN`** | The domain to search.                                | `developer.mozilla.org`                               |
| **`FALLBACK_URL`**  | The fallback URL for empty queries.                  | `https://developer.mozilla.org/en-US/docs/JavaScript` |

**Note:**: Bing does not have an "I'm feeling lucky" equivalent, so you'll be redirected to Bing's search result page instead.

#### Example: Reddit URL shortener

`SEARCH_DOMAIN="reddit.com" FALLBACK_URL="http://reddit.com" PORT=8080 node server.js`


[lmgtfy]: http://lmgtfy.com/?q=mdn%20apply
[Mozilla Developer Network]: https://developer.mozilla.org/en-US/
[Google Web Search API]: https://developers.google.com/web-search/docs/
