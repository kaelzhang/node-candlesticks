import approximateEqual from 'approximately-equal'

export const precision = 0.01
export const highTimes = 2

export const equal = (a, b) => approximateEqual(a, b, precision)

export const farGreater = (a, b) => a / b > highTimes
export const farLesser = (a, b) => a / b < highTimes
