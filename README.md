# mdn.io

> The "I'm feeling lucky" URL shortener.

## Why?

The [Mozilla Developer Network] is an awesome JavaScript resource. When looking for JavaScript references on something like `Function.apply`, you might use a search engine with "apply site:developer.mozilla.org" and click the first result.

#### Use it in comments when explaining concepts

```javascript
// Make sure add() takes a single argument (see https://mdn.io/Function.length)
expect(queue.add.length).to.equal(1);
```

#### As a [lmgtfy] replacement for JavaScript questions

> **friend:** dude, is it `call()` or `apply()` that takes an array?

> **you:** mdn.io/apply

#### Type directly in the address bar as a shortcut to search the MDN

> [mdn.io/bind](https://mdn.io/bind)

> [mdn.io/closure](https://mdn.io/closure)

> [mdn.io/cross origin sharing](https://mdn.io/cross%20origin%20sharing)

## How does it work?

mdn.io uses DuckDuckGo's Bang! functionality to redirect you to the first search result.

Note that, because this is a search, the page you're redirected to may change in the future. However, you can rest assured that you'll always be redirected to the page that DuckDuckGo finds most relevant.

## Development

```sh
npm install # Install dependencies.
npm dev # Run server locally.
```

## Deployment

```sh
npm run deploy
```

[lmgtfy]: http://lmgtfy.com/?q=mdn%20apply
[Mozilla Developer Network]: https://developer.mozilla.org/en-US/
[Google Web Search API]: https://developers.google.com/web-search/docs/
