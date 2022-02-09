/**
 * This module provides as default export the class `Batcher`, whose
 * purpose is to provide an easy way of batching multiple requests to be
 * executed as a single operation.
 */

/**
 * Default value for `config.timeout` in `Batcher(config)`.
 */
const DEFAULT_TIMEOUT = 10


/**
 * Default value for `config.maxRequests` in `Batcher(config)`.
 */
const DEFAULT_MAX_REQUESTS = 20


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
  constructor(config) {
    if (typeof config === 'function') {
      config = {dispatch: config}
    }

    /**
     * The timeout configuration.
     *
     * @type {int}
     */
    this.timeout = config?.timeout || DEFAULT_TIMEOUT

    /**
     * The maxRequests configuration.
     *
     * @type {int}
     */
    this.maxRequests = config?.maxRequests || DEFAULT_MAX_REQUESTS

    if (config.dispatch) {
      this.dispatch = config.dispatch
    }

    this._pending = []
    this._timeoutId = null
  }

  /**
   * Request an operation using `arg` as input data.
   *
   * @param {*} arg - Request data to be pushed to the internal payload array.
   *
   * @returns {*} - This method resolves to the result for this request.
   *
   * @async
   */
  async request(arg) {
    return new Promise((resolve, reject) => {
      clearTimeout(this._timeoutId)
      this._pending.push({arg, resolve, reject})
      if (this._pending.length === this.maxRequests) {
        this._dispatch()
      } else {
        this._timeoutId = setTimeout(this._dispatch.bind(this), this.timeout)
      }
    })
  }

  /**
   * Call the dispatch function for the pending requests and call the
   * appropriate callbacks.
   *
   * @async
   * @private
   */
  async _dispatch() {
    const pending = this._pending
    this._pending = []
    const payload = pending.map(({arg}) => arg)
    let data
    try {
      data = await this.dispatch(payload)
    } catch (e) {
      for (let {reject} of pending) {
        reject(e)
      }
      return
    }
    for (let i = 0; i < pending.length; i++) {
      pending[i].resolve(data[i])
    }
  }

  /**
   * The dispatch function.
   *
   * This function must either be replaced with the dispatch function passed
   * to the constructor or overridden by a subclass.
   */
  async dispatch(payload) {
    const msg = 'the dispatch function must be passed to the constructor or implemented by subclasses'
    throw new Error(msg)
  }
}


export default Batcher
