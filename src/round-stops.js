const D = require('@kmamal/numbers/decimal/base10')

const factors = [ 1, 2, 5, 10 ]

const roundStops = (start, end, step) => {
	if (start === end) {
		return {
			start: D.fromNumber(start),
			end: D.fromNumber(end),
			step: D.fromNumber(step),
		}
	}

	const minStep = Math.abs(step)

	const scale = 10 ** Math.ceil(Math.log10(minStep) - 1)
	let bestStep
	for (const factor of factors) {
		const candidate = factor * scale
		if (candidate >= minStep) {
			bestStep = candidate
			break
		}
	}

	let roundStart = start / bestStep
	let roundEnd = end / bestStep
	if (start < end) {
		roundStart = Math.ceil(roundStart)
		roundEnd = Math.floor(roundEnd)
	} else {
		roundEnd = Math.ceil(roundEnd)
		roundStart = Math.floor(roundStart)
	}
	let roundStep = D.fromNumber(bestStep)
	roundStart = D.mul(D.fromInteger(BigInt(roundStart)), roundStep)
	roundEnd = D.mul(D.fromInteger(BigInt(roundEnd)), roundStep)
	roundStep = D.mul(roundStep, D.fromInteger(BigInt(Math.sign(step))))

	return {
		start: roundStart,
		end: roundEnd,
		step: roundStep,
	}
}

const iterate = function * (start, end, step) {
	if (D.gt(step, D.fromNumber(0))) {
		for (let x = start; D.lte(x, end); x = D.add(x, step)) { yield D.toNumber(x) }
	} else {
		for (let x = start; D.gte(x, end); x = D.add(x, step)) { yield D.toNumber(x) }
	}
}

module.exports = {
	roundStops,
	iterate,
}
