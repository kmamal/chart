const { DURATION, duration } = require('@kmamal/date/duration')
const { PARTS, fromTimestamp } = require('@kmamal/date/date')
const { ceil, floor } = require('@kmamal/date/rounding')
const { shift, shiftTimestamp } = require('@kmamal/date/shift')

const {
	year: dYear,
	second: dSec,
} = DURATION

const factors10 = [ 10, 5, 2, 1 ]
const factors12 = [ 6, 4, 3, 2, 1 ]
const factors24 = [ 12, 8, 6, 4, 3, 2, 1 ]
const factors60 = [ 30, 20, 15, 10, 5, 2, 1 ]

const partFactors = {
	year: factors10,
	month: factors12,
	week: factors10,
	day: factors10,
	hour: factors24,
	minute: factors60,
	second: factors60,
	millisecond: factors10,
}

const roundStopsDate = (_start, _end, step) => {
	const start = fromTimestamp(_start)
	const end = fromTimestamp(_end)

	if (start.timestamp === end.timestamp) { return null }

	const minStep = Math.abs(step)

	let index = 0
	let stepPart = PARTS[index]
	let factors = partFactors[stepPart]
	let stepValue = factors[0]

	let part = stepPart
	findStep:
	for (;;) {
		for (const factor of factors) {
			const d = duration(factor, part)
			if (d < minStep) {
				break findStep
			}
			stepPart = part
			stepValue = factor
		}

		part = PARTS[++index]
		factors = partFactors[part]
	}

	if (stepPart === 'year' && stepValue === 10) {
		const exp = 10 ** Math.ceil(Math.log10(minStep / dYear) - 1)
		for (let i = factors.length - 1; i >= 0; i--) {
			stepValue = factors[i] * exp
			const d = duration(stepValue, stepPart)
			if (d > minStep) { break }
		}
	} else if (stepPart === 'second' && stepValue === 1) {
		const exp = 10 ** Math.ceil(Math.log10(minStep) - 1)
		let value
		for (let i = factors.length - 1; i >= 0; i--) {
			value = factors[i] * exp
			const d = duration(value, 'millisecond')
			if (d > minStep) { break }
		}
		if (value < dSec) {
			stepValue = value
			stepPart = 'millisecond'
		}
	}

	const sign = Math.sign(step)
	const isPositive = sign === 1

	const round$$$ = isPositive ? ceil.$$$ : floor.$$$

	round$$$(start, stepPart)
	let startPart = start[stepPart]
	if (stepPart === 'month' || stepPart === 'day') { startPart-- }
	let startPartDiff = -startPart % stepValue
	if (startPartDiff !== 0 && isPositive) {
		startPartDiff = stepValue + startPartDiff
	}
	shift.$$$(start, stepPart, startPartDiff)

	round$$$(end, stepPart)
	let endPart = end[stepPart]
	if (stepPart === 'month' || stepPart === 'day') { endPart-- }
	let endPartDiff = -endPart % stepValue
	if (endPartDiff !== 0 && isPositive) {
		endPartDiff = stepValue + endPartDiff
	}
	shift.$$$(end, stepPart, endPartDiff)

	return {
		start,
		end,
		step: [
			sign * stepValue,
			stepPart,
		],
	}
}

const iterateDate = function * (start, end, stepValue, stepPart) {
	const lastTime = shiftTimestamp(end.timestamp, stepPart, -stepValue)
	let date = start
	if (stepValue > 0) {
		while (date.timestamp <= lastTime) {
			yield date
			date = shift(date, stepPart, stepValue)
		}
	} else {
		while (date.timestamp >= lastTime) {
			yield date
			date = shift(date, stepPart, stepValue)
		}
	}
}

const iterateReverseDate = function * (start, end, stepValue, stepPart) {
	const startTime = start.timestamp
	let date = shift(end, stepPart, -stepValue)
	if (stepValue > 0) {
		while (date.timestamp >= startTime) {
			yield date
			date = shift(date, stepPart, -stepValue)
		}
	} else {
		while (date.timestamp <= startTime) {
			yield date
			date = shift(date, stepPart, -stepValue)
		}
	}
}

module.exports = {
	roundStopsDate,
	iterateDate,
	iterateReverseDate,
}
