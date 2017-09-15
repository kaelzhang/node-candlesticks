import {
  Candlestick,
  MutableCandlestick
} from './candlestick'

import {
  cleanTime
} from './utils'

import findLastIndex from 'lodash.findlastindex'


const getTime = datum => datum[5]

// An candlesticks manager with order
export class Candlesticks {
  constructor ({

    // @type {function}
    // Transforms item in the array to
    // [open, high, low, close, volume, time]
    transfrom,

    // @type {function(time)}
    // To determine whether a datum which represents a candlestick is closed
    closed
  }) {

    this._candlesticks = []
    this._length = 0

    this._transform = transform
    this._closed = closed
  }

  _getDataList (name) {
    return this._candlesticks.map(c => c[name])
  }

  get open () {
    return this._getDataList('open')
  }

  get high () {
    return this._getDataList('high')
  }

  get low () {
    return this._getDataList('low')
  }

  get close () {
    return this._getDataList('close')
  }

  get volume () {
    return this._getDataList('volume')
  }

  // Adds a candlestick to the end of the list
  _add (...candlesticks) {
    if (!candlesticks.length) {
      return
    }

    this._candlesticks.push(...candlesticks)
    this._length += candlesticks.length
  }

  _n (n) {
    return n < 0
      ? this._length + n
      : n
  }

  // Returns `AbstractCandlestick`
  _get (n) {
    return this._candlesticks[this._n(n)]
  }

  // @param {AbstractCandlestick} candlestick
  _set (n, candlestick) {
    this._candlesticks[this._n(n)] = candlestick
  }

  _insert (n, ...candlesticks) {
    if (!candlesticks.length) {
      return
    }

    this._candlesticks.splice(this._n(n), 0, ...candlesticks)
    this._length += candlesticks.length
  }

  // @param {Array} data
  update (data) {
    const stack = []

    const lastCandlestick = this._get(-1)
    const isLastUnClosed = lastCandlestick instanceof MutableCandlestick
    const lastClosedCandlestick = isLastUnClosed
      ? this._get(-2)
      : lastCandlestick

    const lastClosedTime = lastClosedCandlestick.time

    const lastIndex = findLastIndex(data, datum => {
      const transformed = this._transform(datum)
      const time = clean(getTime(transformed))

      if (time > lastClosedTime) {
        stack.push(datum)
        return
      }

      return true
    })

    if (!stack.length) {
      return
    }

    if (isLastUnClosed) {
      this._set(-1, this._create(stack.pop()))
    }

    let datum

    while (datum = stack.pop()) {
      this._add(this._create(datum))
    }
  }

  _create (datum) {
    const time = getTime(datum)
    const closed = this._closed(time)

    return closed
      ? new Candlestick(...datum)
      : new MutableCandlestick(...datum)
  }
}
