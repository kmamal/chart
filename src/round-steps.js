
const factors = [ 1, 2, 5, 10 ]

const roundSteps = (start, end, step) => {
	if (start === end) { return null }

	const minStep = Math.abs(step)

	const exp = 10 ** Math.ceil(Math.log10(minStep) - 1)
	let bestStep
	for (const factor of factors) {
		const candidate = factor * exp
		if (candidate >= minStep) {
			bestStep = candidate
			break
		}
	}

	const startSign = Math.sign(start)
	const endSign = Math.sign(start)
	const stepSign = Math.sign(step)
	let startRounding = Math.abs(start) % bestStep
	if (startRounding && stepSign * startSign >= 0) {
		startRounding = bestStep - startRounding
	}
	let endRounding = Math.abs(end) % bestStep
	if (endRounding && stepSign * endSign >= 0) {
		endRounding = bestStep - endRounding
	}

	const roundStep = stepSign * bestStep
	const roundStart = start + stepSign * startRounding
	const roundEnd = end + stepSign * endRounding

	return {
		start: roundStart,
		end: roundEnd,
		step: roundStep,
	}
}

const iterate = function * (start, end, step) {
	if (step > 0) {
		for (let x = start; x < end; x += step) { yield x }
	} else {
		for (let x = start; x > end; x += step) { yield x }
	}
}

module.exports = {
	roundSteps,
	iterate,
}
