const { PARTS, getPart } = require('@kmamal/util/date/parts')
const { elapsed } = require('@kmamal/util/date/elapsed')
const { duration } = require('@kmamal/util/date/duration')
const { ceil, floor } = require('@kmamal/util/date/rounding')
const { shift } = require('@kmamal/util/date/shift')

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

const roundStepsDate = (_start, _end, step) => {
	const start = new Date(_start)
	const end = new Date(_end)
	if (start.getTime() === end.getTime()) { return null }

	const minStep = Math.abs(step)

	const constantParts = {}

	let index = 0
	let part
	while (index < PARTS.length) {
		part = PARTS[index]
		const e = elapsed(start, end, part)
		if (e !== 0) { break }
		constantParts[part] = getPart(start, part)
		index++
	}

	let factors = partFactors[part]
	let stepValue = factors[factors.length - 1]
	let stepPart = part

	findStep:
	for (;;) {
		for (const factor of factors) {
			const d = duration(factor, part)
			if (d < minStep) { break findStep }
			stepValue = factor
			stepPart = part
		}

		part = PARTS[++index]
		factors = partFactors[part]
	}

	const sign = Math.sign(step)
	const isPositive = sign === 1

	const round$$$ = isPositive ? ceil.$$$ : floor.$$$

	round$$$(start, stepPart)
	let startPartDiff = -getPart(start, stepPart, true) % stepValue
	if (startPartDiff !== 0 && isPositive) {
		startPartDiff = stepValue + startPartDiff
	}
	shift.$$$(start, stepPart, startPartDiff)

	round$$$(end, stepPart)
	let endPartDiff = -getPart(end, stepPart, true) % stepValue
	if (endPartDiff !== 0 && !isPositive) {
		endPartDiff = stepValue + endPartDiff
	}
	shift.$$$(end, stepPart, endPartDiff)

	return {
		constantParts,
		start,
		end,
		step: [
			sign * stepValue,
			stepPart,
		],
	}
}

const iterate = function * (start, end, stepValue, stepPart) {
	const endTime = end.getTime()
	const x = new Date(start)
	while (x.getTime() !== endTime) {
		yield x
		shift.$$$(x, stepPart, stepValue)
	}
}

module.exports = {
	roundStepsDate,
	iterate,
}
