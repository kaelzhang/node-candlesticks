export cleanTime = time => time instanceof Date
  ? time
  : new Date(time)


export const define = (host, name, value) => {
  Object.defineProperty(host, name, {
    value,
    enumerable: true
  })
}


export const lowerShadow = (open, low, close) =>
  Math.min(open, close) - low


export const upperShadow = (open, high, close) =>
  high - Math.max(open, close)


export const diff = (a, b) => Math.abs(a - b)
