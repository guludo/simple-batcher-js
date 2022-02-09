simple-batcher-js
=================

This is a simple Javascript library for batching asynchronous operations of
the same type.

This module provides as default export the class `Batcher`, whose purpose is
to provide an easy way of batching multiple requests to be executed as a
single operation.

This is commonly useful when multiple operations can be optimized when they
are executed in a single run. The advantage of using the operation batcher is
that multiple requests can be done by independent parts of a software without
they needing how to cooperate for the optimization.

As an example, let's consider that different parts of the UI of an application
require fetching the same kind of data for different entities "at the same
time" (for example, when a new screen is loaded). While each one can make a
fetch to get the required data, resulting in multiple requests to the server,
if the server allows making a single request for multiple entities, an
optimization can be made by batching the requests into a single one.


Creating the batcher object
---------------------------

The solution for the scenario above can be achieved by using the Batcher
class. You can create it like so:

```js
const myBatcher = new Batcher(async payload => {
 return await makeSingleRequest(payload)
})
```

The argument passed to the constructor, the dispatch function, must be a
(possibly asynchronous) function that will execute the batched operation.

The dispatch function will receive as argument a payload array containing the
argument for each request made by the interested parts of the application (by
calling `myBatcher.request`) and must resolve to an array of the same size
containing the results respective to each request.

Note that the constructor also accepts a configuration object as argument,
whose format is described in the API for `Batcher`.


Making requests
---------------

Once we have `myBatcher` in place, each interested part of the application can
make request by calling `myBatcher.request(arg)`, which is an asynchronous
method that resolves to the result for `arg`. The argument for
`myBatcher.request` is application specific, containing the data necessary for
that request.

At each call to `request`, the batcher will add the argument to its internal
list of pending requests and wait for a short timeout before dispatching them.
If the timeout is reached, then the accumulated payload is dispatched by
calling the dispatch function (the one passed to the constructor).

The batcher also avoids accumulating too many pending requests by limiting the
maximum number of requests. If a call to `request` reaches that limit, the
accumulated payload is dispatched right away.

Both timeout and maximum number of requests can be configured when
instantiating the batcher object. See the API documentation for that.


API
---

This module only has one export, which is the `Batcher` class. You can import it with:

```js
import Batcher from 'simple-batcher'
```

The API is described as below:

```js
/**
 * The batcher class.
 *
 * @param {function|object} config - The configuration object for this
 *    batcher. Note that if only the dispatch function is intended to be
 *    passed, it can be passed directly without wrapping in an object.
 *
 * @param {function} config.dispatch - The function responsible for performing
 *    the dispatch of the accumulated requests. Note that the user can also
 *    subclass `Batcher` and provide the `dispatch` method directly
 *    as well.
 *
 * @param {int} config.timeout - Timeout in milliseconds for the dispatch.
 *
 * @param {int} config.maxRequests - Maximum number of requests to be
 *    accumulated. If that number is reached at a call to `this.request`, the
 *    dispatch is performed immediately.
 */
class Batcher {
  /**
   * Request an operation using `arg` as input data.
   *
   * @param {*} arg - Request data to be pushed to the internal payload array.
   *
   * @returns {*} - This method resolves to the result for this request.
   *
   * @async
   */
  async request(arg)

  /**
   * The dispatch function.
   *
   * This function is either be replaced with the dispatch function passed
   * to the constructor or overridden by a subclass.
   */
  async dispatch(payload)
}
```
