simple-batcher
==============

```
npm install simple-batcher
```

or

```
yarn add simple-batcher
```

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

This module provides just a default export, which is the `Batcher` class. You
can import it with:

```js
import Batcher from 'simple-batcher'
```

The API is described below:

### `Batcher([config | dispatch])`

The constructor for the batcher object. It may receive as argument either the
dispatch function or a configuration object. When a configuration object is
passed, the following keys are supported:

- `config.dispatch`: The function responsible for performing the dispatch of
  the accumulated requests. Note that the user can also subclass `Batcher` and
  provide the `dispatch` method directly as well.

- `config.timeout`: Timeout in milliseconds for the dispatch. (Default: 10)

- `config.maxRequests`: Maximum number of requests to be accumulated. If that
  number is reached at a call to `this.request`, the dispatch is performed
  immediately. (Default: 100)


### `async Batcher.request(arg)`

Request an operation using `arg` as input data. This is an asynchronous method
that resolves to the result respective to `arg` after the batch operation is
performed.
