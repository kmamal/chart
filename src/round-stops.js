const D = require('@kmamal/numbers/decimal/base10')
const R = require('@kmamal/numbers/rational')

const factors = [ 1, 2, 5, 10 ]

const roundStops = (start, end, step) => {
	if (start === end) {
		return {
			start: D.fromNumber(start),
			end: D.fromNumber(end),
			step: D.fromNumber(1),
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

	const rBestStep = R.fromNumber(bestStep)
	let roundStart = R.div(R.fromNumber(start), rBestStep)
	let roundEnd = R.div(R.fromNumber(end), rBestStep)
	if (step < 0) {
		roundStart = R.toInteger(R.ceil(roundStart))
		roundEnd = R.toInteger(R.floor(roundEnd))
	}
	else {
		roundStart = R.toInteger(R.floor(roundStart))
		roundEnd = R.toInteger(R.ceil(roundEnd))
	}
	const roundStep = D.fromNumber(bestStep)
	roundStart = D.mul(D.fromInteger(roundStart), roundStep)
	roundEnd = D.mul(D.fromInteger(roundEnd), roundStep)
	if (step < 0) { roundStep.man = -roundStep.man }

	return {
		start: roundStart,
		end: roundEnd,
		step: roundStep,
	}
}

const ZERO = D.fromNumber(0)

const iterate = function * (start, end, step) {
	if (D.gt(step, ZERO)) {
		for (let x = start; D.lte(x, end); x = D.add(x, step)) {
			yield D.toNumber(x)
		}
	}
	else {
		for (let x = start; D.gte(x, end); x = D.add(x, step)) {
			yield D.toNumber(x)
		}
	}
}

module.exports = {
	roundStops,
	iterate,
}
