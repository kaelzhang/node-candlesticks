import test from 'ava'
import {
  Candlesticks,
  Candlestick
} from '../src'
import {
  transform
} from '../src/candlestick'

const CODE = 'sz002239'

const PAST = + new Date(2017, 8, 1)
const NOW = + new Date + 1000

const map = (data, key) => data.map(datum => datum[key])

const create = (past, offset = 0) => {
  return {
    open: Math.random(),
    high: Math.random(),
    low: Math.random(),
    close: Math.random(),
    volume: Math.random(),
    time: past
      ? new Date(PAST + offset)
      : new Date(NOW + offset)
  }
}

test('basic: length', async t => {
  const candlesticks = new Candlesticks({
    closed: time => + time < Date.now()
  })

  function updateAndTest (data) {
    candlesticks.update(...data)
    andTest(data)
  }

  function andTest (data) {
    t.is(candlesticks.length, data.length, 'length')
    t.deepEqual(candlesticks.open, map(data, 'open'), 'batch open')
    t.deepEqual(candlesticks.high, map(data, 'high'), 'batch high')

    candlesticks.forEach((c, i) => {
      const d = data[i]

      t.is(c.open, d.open, 'open')
      t.is(c.high, d.high, 'high')
    })

    let j = 0

    candlesticks.forEach((c, i) => {
      const d = data[data.length - 1 - j ++]

      t.is(c.open, d.open, 'reverse open')
      t.is(c.high, d.high, 'reverse high')
    }, true)
  }

  const data1 = [
    create(true, 1),
    create(true, 2)
  ]

  updateAndTest(data1)

  const data2 = data1.concat([
    create(true, 3)
  ])

  updateAndTest(data2)

  const data3 = data2.concat([
    create(false, 1)
  ])

  updateAndTest(data3)

  const data4 = data2.concat([
    create(false, 2)
  ])

  updateAndTest(data4)

  candlesticks.clear()
  andTest([])
})


const bull = {
  open: 5,
  high: 10,
  low: 4,
  close: 8,
  volume: 1000,
  time: new Date()
}
const bullArray = transform(bull)

const bear = {
  close: 5,
  low: 4,
  high: 10,
  open: 8,
  volume: 1000,
  time: new Date()
}
const bearArray = transform(bear)


function testBull (t, candle, data) {
  testCandle(t, candle, data)
  t.is(candle.isBearish, false)
  t.is(candle.isBullish, true)
  t.is(candle.upperShadow, 2)
  t.is(candle.lowerShadow, 1)
  t.is(candle.body, 3)
}

function testBear (t, candle, data) {
  testCandle(t, candle, data)
  t.is(candle.isBearish, true)
  t.is(candle.isBullish, false)
  t.is(candle.upperShadow, 2)
  t.is(candle.lowerShadow, 1)
  t.is(candle.body, 3)
}

function testCandle (t, candle, data) {
  t.is(candle.open, data.open, 'open')
  t.is(candle.high, data.high, 'high')
  t.is(candle.low, data.low, 'low')
  t.is(candle.close, data.close, 'close')
  t.is(candle.volume, data.volume, 'volume')
  t.is(+ candle.time, + data.time, 'time')
}

test('new Candlestick', async t => {
  testBull(t, new Candlestick(...bullArray), bull)
  testBull(t, Candlestick.from(bullArray), bull)
  testBull(t, Candlestick.from(bull), bull)

  testBear(t, new Candlestick(...bearArray), bear)
  testBear(t, Candlestick.from(bearArray), bear)
  testBear(t, Candlestick.from(bear), bear)
})
