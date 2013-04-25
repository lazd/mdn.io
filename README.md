# mdn.io
> Short URLs for MDN

## Why?

The [Mozilla Developer Network] is an awesome JavaScript resource. When looking for JavaScript references on something like `Function.apply`, you might Google "mdn apply" and click the first result.

mdn.io does that for you :)

#### Use it in comments when explaining concepts

```javascript
// Make sure add() takes a single argument (see http://mdn.io/Function.length)
expect(queue.add.length).to.equal(1);
```


#### As a [lmgtfy] replacement for JavaScript questions

> **friend:** dude, is it call() or apply() that takes an array?

> **you:** mdn.io/apply


#### As a quick way to look something up on the MDN

> [mdn.io/bind](http://mdn.io/bind)

> [mdn.io/closure](http://mdn.io/closure)

> [mdn.io/cross origin sharing](http://mdn.io/cross origin sharing)


## How does it work?

mdn.io queries the [Google Web Search API] with `yourqueryhere site:developer.mozilla.org` and redirects you to the first result. This is the same mechanism the MDN search box uses, so you'll always get accurate results.

Note that, because this is a search, the page you're redirected to may change in the future. However, you can rest assured that you'll always be redirected to the page that Google finds most relevant.


## Starting the server

mdn.io has no dependencies, start it with:

`PORT=8080 node server.js`


[lmgtfy]: http://lmgtfy.com/?q=mdn%20apply
[Mozilla Developer Network]: https://developer.mozilla.org/en-US/
[Google Web Search API]: https://developers.google.com/web-search/docs/