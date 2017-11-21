// @flow

import {
  Candlestick,
  MutableCandlestick,
  isMutableCandlestick,
  transform
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
    // Transforms raw datum in the array to the format of
    // [open, high, low, close, volume, time]
    transform = transform,

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

  get length () {
    return this._candlesticks.length
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

  get time () {
    return this._getDataList('time')
  }

  forEach (iteratee) {
    this._candlesticks.forEach(iteratee)
  }

  // Adds a candlestick to the end of the list
  _add (...candlesticks) {
    if (!candlesticks.length) {
      return
    }

    this._candlesticks.push(...candlesticks)
    this._length += candlesticks.length
  }

  _index (n) {
    return n < 0
      ? this._length + n
      : n
  }

  // Returns `AbstractCandlestick`
  _get (n) {
    return this._candlesticks[this._index(n)]
  }

  // @param {AbstractCandlestick} candlestick
  _set (n, candlestick) {
    this._candlesticks[this._index(n)] = candlestick
  }

  _insert (n, ...candlesticks) {
    if (!candlesticks.length) {
      return
    }

    this._candlesticks.splice(this._index(n), 0, ...candlesticks)
    this._length += candlesticks.length
  }

  // @param {function(candlestick)} condition
  // search (condition) {
  //
  // }

  _lastClosedTime () {
    let isLastUnClosed = false
    let lastClosedTime = 0
    const length = this.length

    if (!length) {
      return {
        lastClosedTime,
        isLastUnClosed
      }
    }

    const lastCandlestick = this._get(-1)
    isLastUnClosed = isMutableCandlestick(lastCandlestick)

    const lastClosedCandlestick = isLastUnClosed
      ? this._get(-2)
      : lastCandlestick

    if (lastClosedCandlestick) {
      lastClosedTime = + lastClosedCandlestick.time
    }

    return {
      lastClosedTime,
      isLastUnClosed
    }
  }

  // Updates the list of candlesticks with raw data.
  // Compare existing data, append new ones.
  // @param {Array} data
  update (...data) {
    const stack = []

    const {
      lastClosedTime,
      isLastUnClosed
    } = this._lastClosedTime()

    const lastIndex = findLastIndex(data, datum => {
      const transformed = this._transform(datum)
      const time = cleanTime(getTime(transformed))

      // Put newer data into a temporary stack
      if (+ time > lastClosedTime) {
        stack.push(transformed)
        return
      }

      // stop
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
