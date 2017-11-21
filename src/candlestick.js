import {
  equal,
  farGreater,
  farLesser
} from './approximately'

import {
  cleanTime,
  diff,
  lowerShadow,
  define
} from './utils'


const KEY_CANDLESTICK = Symbol.for('candlesticks:candlestick')
const KEY_MUTABLE_CANDLESTICK = Symbol.for('candlestick:mutable')

export const isCandlestick = subject => !!subject[KEY_CANDLESTICK]
export const isMutableCandlestick = subject =>
  !!subject[KEY_MUTABLE_CANDLESTICK]

export const transform = ({
  open,
  close,
  high,
  low,
  volume,
  time
}) => [open, high, low, close, volume, time]

class AbstractCandlestick {
  constructor (open) {
    define(this, 'open', open)

    this[KEY_CANDLESTICK] = true
  }

  get body () {
    return diff(this.open, this.close)
  }

  get isBearish () {
    return this.open > this.close
  }

  get isBullish () {
    return this.open < this.close
  }

  get isDoji () {
    return equal(this.open, this.close)
  }

  get upperShadow () {
    return this.isBearish
      ? this.high - this.open
      : this.high - this.close
  }

  get lowerShadow () {
    return this.isBearish
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
    // TODO:
    // - split
    // - dividend
    // - absoluteChange
    // - percentChange

    this[KEY_MUTABLE_CANDLESTICK] = true
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
    define(this, 'isBearish', this.isBearish)
    define(this, 'isBullish', this.isBullish)
    define(this, 'isDoji', this.isDoji)
    define(this, 'upperShadow', this.upperShadow)
    define(this, 'lowerShadow', this.lowerShadow)

    this._high = Math.max(open, close)
    this._low = Math.min(open, close)
  }
}


Candlestick.from = object => {
  return new Candlestick(...transform(object))
}
