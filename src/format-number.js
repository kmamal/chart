
const formatNumber = (x, precision = null) => {
	const str = precision !== null
		? x.toExponential(precision - 1)
		: x.toExponential()
	const chars = Array.from(str)

	const firstChar = chars[0]
	const hasSign = firstChar === '-' || firstChar === '+'

	const wholeStart = hasSign ? 1 : 0
	const hasWhole = chars[wholeStart] !== '0'
	if (!hasWhole) { return '0' }
	const wholeEnd = wholeStart + 1

	const eIndex = chars.indexOf('e', wholeEnd)

	const fracStart = Math.min(eIndex, wholeEnd + 1)
	const fracEnd = eIndex

	const expStart = eIndex + 1
	const exp = parseInt(chars.slice(expStart).join(''), 10)
	const isValueLessThanOne = exp < 0

	const numSignChars = wholeStart
	const numWholeChars = 1
	const numFracChars = fracEnd - fracStart

	const numLeadingZeros = Math.max(0, -exp)
	const numTrailingZeros = Math.max(0, exp - numFracChars)

	const lengthEstimate = 1
		+ numSignChars
		+ numLeadingZeros
		+ 1
		+ numWholeChars
		+ numFracChars
		+ numTrailingZeros
	const res = new Array(Math.floor(lengthEstimate * 1.33))

	let writeIndex = 0

	const numWholeDigits = isValueLessThanOne ? 1 : exp + 1
	let commaPosition = numWholeDigits

	if (hasSign) {
		res[writeIndex++] = chars[0]
		commaPosition++
	}

	let dotStepper = 3 - (numWholeDigits % 3)
	if (dotStepper === 3) { dotStepper = 0 }

	for (let i = 0; i < numLeadingZeros; i++) {
		if (writeIndex === commaPosition) {
			res[writeIndex++] = ','
			dotStepper = 0
		} else if (dotStepper === 3) {
			res[writeIndex++] = '.'
			dotStepper = 0
			commaPosition++
		}
		res[writeIndex++] = '0'
		++dotStepper
	}

	{
		if (writeIndex === commaPosition) {
			res[writeIndex++] = ','
			dotStepper = 0
		} else if (dotStepper === 3) {
			res[writeIndex++] = '.'
			dotStepper = 0
			commaPosition++
		}
		res[writeIndex++] = chars[wholeStart]
		++dotStepper
	}

	for (let i = fracStart; i < fracEnd; i++) {
		if (writeIndex === commaPosition) {
			res[writeIndex++] = ','
			dotStepper = 0
		} else if (dotStepper === 3) {
			res[writeIndex++] = '.'
			dotStepper = 0
			commaPosition++
		}
		res[writeIndex++] = chars[i]
		++dotStepper
	}

	for (let i = 0; i < numTrailingZeros; i++) {
		if (writeIndex === commaPosition) {
			res[writeIndex++] = ','
			dotStepper = 0
		} else if (dotStepper === 3) {
			res[writeIndex++] = '.'
			dotStepper = 0
			commaPosition++
		}
		res[writeIndex++] = '0'
		++dotStepper
	}

	return res.join('')
}

module.exports = { formatNumber }
