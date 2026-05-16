const { DURATION, duration } = require('@kmamal/date/duration')
const { PARTS, fromTimestamp } = require('@kmamal/date/date')
const { ceil, floor } = require('@kmamal/date/rounding')
const { shift } = require('@kmamal/date/shift')

const {
	year: dYear,
	second: dSec,
} = DURATION

const factors10 = [ 10, 5, 2, 1 ]
const factors12 = [ 6, 4, 3, 2, 1 ]
const factors24 = [ 12, 8, ...factors12 ]
const factors60 = [ 30, 20, 15, ...factors10 ]

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

	if (_start === _end) {
		return {
			start,
			end,
			stepValue: 1,
			stepPart: 'second',
		}
	}

	const minStep = Math.abs(step)

	let stepPart = null
	let stepValue = null
	let factors

	let partIndex
	findStep:
	for (partIndex = 0; partIndex < PARTS.length; partIndex++) {
		const part = PARTS[partIndex]
		factors = partFactors[part]

		if (part === 'millisecond') { break }

		for (const factor of factors) {
			const d = duration(factor, part)
			if (d < minStep) {
				break findStep
			}
			stepPart = part
			stepValue = factor
		}
	}

	if (stepPart === null && stepValue === null) {
		const exp = 10 ** Math.ceil(Math.log10(minStep / dYear) - 1)
		for (let i = factors.length - 1; i >= 0; i--) {
			stepValue = factors[i] * exp
			const d = duration(stepValue, stepPart)
			if (d >= minStep) { break }
		}
	}
	else if (stepPart === 'second' && stepValue === 1) {
		const exp = 10 ** Math.ceil(Math.log10(minStep) - 1)
		let value
		for (let i = factors.length - 1; i >= 0; i--) {
			value = factors[i] * exp
			const d = duration(value, 'millisecond')
			if (d >= minStep) { break }
		}
		if (value < dSec) {
			stepValue = value
			stepPart = 'millisecond'
		}
	}

	const sign = Math.sign(step)
	const isPositive = sign === 1

	if (isPositive) {
		ceil.$$$(start, stepPart)
		floor.$$$(end, stepPart)
	}
	else {
		floor.$$$(start, stepPart)
		ceil.$$$(end, stepPart)
	}

	let startValue = start[stepPart]
	if (stepPart === 'month' || stepPart === 'day') { startValue-- }
	let startDiff = -startValue % stepValue
	if (startDiff !== 0 && isPositive) {
		startDiff = stepValue + startDiff
	}
	shift.$$$(start, stepPart, startDiff)

	let endValue = end[stepPart]
	if (stepPart === 'month' || stepPart === 'day') { endValue-- }
	let endDiff = -endValue % stepValue
	if (endDiff !== 0 && !isPositive) {
		endDiff = stepValue + endDiff
	}
	shift.$$$(end, stepPart, endDiff)

	for (partIndex++; partIndex < PARTS.length; partIndex++) {
		const part = PARTS[partIndex]
		const value = part === 'month' || part === 'day' ? 1 : 0
		start[part] = value
		end[part] = value
	}

	return {
		start,
		end,
		stepValue: sign * stepValue,
		stepPart,
	}
}

const iterateDate = function * (start, end, stepValue, stepPart) {
	const endTime = end.timestamp
	let date = start
	if (stepValue > 0) {
		while (date.timestamp <= endTime) {
			yield date
			date = shift(date, stepPart, stepValue)
		}
	}
	else {
		while (date.timestamp >= endTime) {
			yield date
			date = shift(date, stepPart, stepValue)
		}
	}
}

module.exports = {
	roundStopsDate,
	iterateDate,
}
