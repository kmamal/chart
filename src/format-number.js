
const formatNumber = (_x, precision = null) => {
	const x = precision !== null
		? parseFloat(_x.toPrecision(precision))
		: _x

	const chars = Array.from(x.toExponential())

	let wholeStart
	let wholeEnd

	if (chars[0] === '-' || chars[0] === '+') {
		wholeStart = 1
		wholeEnd = 2
	} else {
		wholeStart = 0
		wholeEnd = 1
	}
	if (chars[wholeStart] === '0') { wholeStart = wholeEnd }

	let fracStart
	let fracEnd
	if (chars[wholeEnd] === '.') {
		fracStart = wholeEnd + 1
		fracEnd = chars.lastIndexOf('e')
	} else {
		fracStart = wholeEnd
		fracEnd = wholeEnd
	}

	const exp = parseInt(chars.slice(fracEnd + 1).join(''), 10)

	const signLength = wholeStart
	const wholeLength = wholeEnd - wholeStart
	const fracLength = fracEnd - fracStart

	let leadingZeros = 0
	let trailingZeros = 0
	if (exp > fracLength) {
		trailingZeros = exp - fracLength
	} else if (-exp >= wholeLength) {
		leadingZeros = Math.max(0, (-exp + 1) - wholeLength)
	}

	const totalLength = 0
		+ signLength
		+ leadingZeros
		+ wholeLength
		+ fracLength
		+ trailingZeros
	const res = new Array(totalLength)
	let writeIndex = 0

	const wholeDigits = leadingZeros ? 1 : wholeLength + exp
	let commaPosition = wholeDigits

	if (wholeStart) {
		res[writeIndex++] = chars[0]
		commaPosition++
	}

	let dotStepper = 3 - (wholeDigits % 3)
	if (dotStepper === 3) { dotStepper = 0 }

	for (let i = 1; i < leadingZeros; i++) {
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

	for (let i = wholeStart; i < wholeEnd; i++) {
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

	for (let i = 0; i < trailingZeros; i++) {
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

	// console.log({
	// 	chars: chars.join(''),
	// 	sign: chars.slice(0, wholeStart).join(''),
	// 	whole: chars.slice(wholeStart, wholeEnd).join(''),
	// 	frac: chars.slice(fracStart, fracEnd).join(''),
	// 	exp,
	// 	res: res.join(''),
	// })

	return res.join('')
}

module.exports = { formatNumber }
