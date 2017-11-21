[![Build Status](https://travis-ci.org/kaelzhang/node-candlesticks.svg?branch=master)](https://travis-ci.org/kaelzhang/node-candlesticks)
[![Coverage](https://codecov.io/gh/kaelzhang/node-candlesticks/branch/master/graph/badge.svg)](https://codecov.io/gh/kaelzhang/node-candlesticks)
<!-- optional appveyor tst
[![Windows Build Status](https://ci.appveyor.com/api/projects/status/github/kaelzhang/node-candlesticks?branch=master&svg=true)](https://ci.appveyor.com/project/kaelzhang/node-candlesticks)
-->
<!-- optional npm version
[![NPM version](https://badge.fury.io/js/candlesticks.svg)](http://badge.fury.io/js/candlesticks)
-->
<!-- optional npm downloads
[![npm module downloads per month](http://img.shields.io/npm/dm/candlesticks.svg)](https://www.npmjs.org/package/candlesticks)
-->
<!-- optional dependency status
[![Dependency Status](https://david-dm.org/kaelzhang/node-candlesticks.svg)](https://david-dm.org/kaelzhang/node-candlesticks)
-->

# candlesticks

The thing to manage candlesticks.

## Install

```sh
$ npm install candlesticks
```

## Usage

```js
import {
  Candlesticks,
  Candlestick
} from 'candlesticks'

const candlesticks = new Candlesticks({
  // Determine whether the candlestick is closed
  closed (time: Date): Boolean {
    // ...
  },
  transform (datum: RawDatum): ArrayDatum {

  }
})
```

### struct `ArrayDatum`

```js
[
  open,   // Number
  high,   // Number
  low,    // Number
  close,  // Number
  volume, // Number
  time    // Date
]
```

### struct `ObjectDatum`

```js
{
  open,   // Number
  high,   // Number
  low,    // Number
  close,  // Number
  volume, // Number
  time    // Date
}
```

## class: Candlesticks(options)

### Candlesticks.from(data: Array<ObjectDatum | ArrayDatum | Candlestick>)

### candlesticks.update(...data)

- **data** `Array.<RawDatum>`

### candlesticks.open

Returns `Array.<Number>` open prices

### candlesticks.high

Returns `Array.<Number>`

### candlesticks.low

Returns `Array.<Number>`

### candlesticks.close

Returns `Array.<Number>`

### candlesticks.volume

Returns `Array.<Number>`

### candlesticks.time

Returns `Array.<Date>`

## class: Candlestick(...ArrayDatum)

### Candlestick.from(datum: ObjectDatum | ArrayDatum | Candlestick)

## License

MIT
