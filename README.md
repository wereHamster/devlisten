## devlisten


Given a `requestListener` (a function you can pass to `http.createServer`),
set up a TCP/IP server which listens on a free port, and a UNIX socket in the
`BOXEN_SOCKET_DIR`. Once done, invokes the callback with strings describing all
the addresses through which the application is reachable.

This function is useful during development, hence its name `devlisten`. It
won't do anything stupid in production, but because it uses a non-deterministic
IP port, it's probably not that useful there.

Since frameworks like [express], [connect], [koa] expose an interface which is
compatible with `requestListener`, you can pass those directly to `devlisten`.


### Example

```
const app = express();

devlisten('catalog', app, (err, addresses) => {
  console.log(`Listening on ${addresses.join(', ')}`);
});
```


[express]: http://expressjs.com/
[connect]: https://github.com/senchalabs/connect
[koa]: http://koajs.com/
