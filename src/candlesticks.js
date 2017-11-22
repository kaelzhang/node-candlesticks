import {
  Candlestick,
  MutableCandlestick,
  isMutableCandlestick,
  transform
} from './candlestick'

import {
  cleanTime
} from './utils'

import delegates from 'delegates'

import findLastIndex from 'lodash.findlastindex'

const KEY_CANDLESTICKS = Symbol.for('candlesticks:default')
const isCandlesticks = subject => !!subject[KEY_CANDLESTICKS]

const getTime = datum => datum[5]
const noStop = () => false
const happensPast = time => + time < Date.now()

// An candlesticks manager with order
export class Candlesticks {
  constructor ({

    // @type {function}
    // Transforms raw datum in the array to the format of
    // [open, high, low, close, volume, time]
    transform: _transform = transform,

    // @type {function(time)}
    // To determine whether a datum which represents a candlestick is closed
    closed = happensPast
  } = {}) {

    this._candlesticks = []
    this._transform = _transform
    this._closed = closed
    this[KEY_CANDLESTICKS] = true
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

  get time () {
    return this._getDataList('time')
  }

  // Clear all
  clear () {
    this._candlesticks.length = 0
  }

  // Iterate candlesticks
  lastForEach (iteratee, stopAfterWhat = noStop) {
    const candlesticks = this._candlesticks

    let i = this.length
    while (i > 0) {
      const candle = candlesticks[-- i]
      iteratee.call(candlesticks, candle, i, candlesticks)
      if (stopAfterWhat(candle, i)) {
        break
      }
    }
  }

  _index (n) {
    return n < 0
      ? this.length + n
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
  }

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
      this.push(this._create(datum))
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

Candlesticks.from = (data, options = {}) => {
  if (isCandlesticks(data)) {
    return data
  }

  const candlesticks = new Candlesticks(options)
  candlesticks.update(...data.map(transform))

  return candlesticks
}


delegates(Candlesticks.prototype, '_candlesticks')
.method('forEach')
.method('slice')
.method('push')
.getter('length')
