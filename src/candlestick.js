import {
  equal,
  greater,
  farGreater,
  farLesser
} from './approximately'

import {
  cleanTime,
  diff,
  lowerShadow,
  define
} from './utils'


class AbstractCandlestick {
  constructor (open) {
    define(this, 'open', open)
  }

  get body () {
    return diff(this.open, this.close)
  }

  get isBlack () {
    return this.open > this.close
  }

  get isWhite () {
    return this.open < this.close
  }

  get isDoji () {
    return equal(this.open, this.close)
  }

  get upperShadow () {
    return this.isBlack
      ? this.high - this.open
      : this.high - this.close
  }

  get lowerShadow () {
    return this.isBlack
      ? this.close - this.low
      : this.open - this.low
  }

  //
  // Computed properties for all
  /////////////////////////////////////////////////////

  get isDragonflyDoji () {
    return this.isDoji
    && equal(this.high, this._high)
  }

  get isGravestoneDoji () {
    return this.isDoji
    && equal(this.low, this._low)
  }

  // Black or white hanging man
  get isHangingMan () {
    return !this.isDoji
    && farGreater(this.lowerShadow, this.body)
  }

  get hasLongLowerShadow () {
    return farGreater(this.lowerShadow, this.body)
  }

  get hasLongUpperShadow () {
    return farGreater(this.upperShadow, this.body)
  }

  // Black or white hammer
  get isHammer () {
    return !this.isDoji
    && !this.hasLongUpperShadow
    && this.hasLongLowerShadow
  }

  get isInvertedHammer () {
    return !this.isDoji
    && this.hasLongUpperShadow
    && !this.hasLongLowerShadow
  }

  get isMarubozu () {
    return this.high === this._high
    && this.low === this._low
  }

  get hasShavenBottom () {
    return this.low === this._low
    && this.upperShadow > 0
  }

  get hasShavenHead () {
    return this.high === this._high
    && this.lowerShadow > 0
  }
}


export class MutableCandlestick extends AbstractCandlestick {
  constructor (open, high, low, close, volume, time) {
    super(open)

    this.high = high
    this.low = low
    this.close = close
    this.volume = volume
    this.time = time
  }

  get _high () {
    return Math.max(this.open, this.close)
  }

  get _low () {
    return Math.min(this.open, this.close)
  }

  set time (time) {
    this._time = cleanTime(time)
  }

  get time () {
    return this._time
  }
}

export class Candlestick extends AbstractCandlestick {
  constructor (open, high, low, close, volume, time) {

    super(open)

    define(this, 'high', high)
    define(this, 'low', low)
    define(this, 'close', close)
    define(this, 'volume', volume)
    define(this, 'time', cleanTime(time))
    define(this, 'body', this.body)
    define(this, 'isBlack', this.isBlack)
    define(this, 'isWhite', this.isWhite)
    define(this, 'isDoji', this.isDoji)
    define(this, 'upperShadow', this.upperShadow)
    define(this, 'lowerShadow', this.lowerShadow)

    this._high = Math.max(open, close)
    this._low = Math.min(open, close)
  }
}
