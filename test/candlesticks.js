import test from 'ava'
import {
  Candlesticks
} from '../src'


const CODE = 'sz002239'

const PAST = + new Date(2017, 8, 1)
const NOW = + new Date + 1000

const map = (data, key) => {
  return data.map(datum => datum[key])
}

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

test('basic', async t => {
  const candlesticks = new Candlesticks({
    closed: time => + time < Date.now()
  })

  function updateAndTest (data) {
    candlesticks.update(...data)
    t.is(candlesticks.length, data.length)
    t.deepEqual(candlesticks.open, map(data, 'open'))
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
})
