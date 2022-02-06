
const calcParameters = (src1, src2, dst1, dst2) => {
	const scale = (dst2 - dst1) / (src2 - src1)
	const delta = dst1 - src1 * scale
	return { scale, delta }
}

const makeTransformPosition = (s, d) => (x) => x * s + d
const makeReversePosition = (is, d) => (x) => (x - d) * is
const makeTransformLength = (a) => (x) => x * a
const makeReverseLength = makeTransformLength

const makeTransformers = (src1, src2, dst1, dst2) => {
	const { scale, delta } = calcParameters(src1, src2, dst1, dst2)
	const inverseScale = 1 / scale
	return {
		transformPosition: makeTransformPosition(scale, delta),
		reversePosition: makeReversePosition(inverseScale, delta),
		transformLength: makeTransformLength(scale),
		reverseLength: makeReverseLength(inverseScale),
	}
}

const calcParametersLog = (src1, src2, dst1, dst2) => {
	const src1log = Math.log(src1)
	const src2log = Math.log(src2)
	return calcParameters(src1log, src2log, dst1, dst2)
}

const makeTransformPositionLog = (s, d) => {
	const linear = makeTransformPosition(s, d)
	return (x) => linear(Math.log(x))
}
const makeReversePositionLog = (is, d) => {
	const linear = makeReversePosition(is, d)
	return (x) => Math.exp(linear(x))
}

const makeTransformersLog = (src1, src2, dst1, dst2) => {
	const { scale, delta } = calcParameters(src1, src2, dst1, dst2)
	const inverseScale = 1 / scale
	return {
		transformPosition: makeTransformPositionLog(scale, delta),
		reversePosition: makeReversePositionLog(inverseScale, delta),
	}
}

const setTransform = (ctx, coordinates, area = ctx.canvas) => {
	const {
		x: { from: x1, to: x2 },
		y: { from: y1, to: y2 },
	} = coordinates

	const {
		x = 0, y = 0,
		width: w, height: h,
	} = area

	const { scale: sX, delta: dX } = calcParameters(x1, x2, x, w - x)
	const { scale: sY, delta: dY } = calcParameters(y1, y2, h - y, y)
	ctx.setTransform(sX, 0, 0, sY, dX, dY)
}

module.exports = {
	calcParameters,
	makeTransformPosition,
	makeReversePosition,
	makeTransformLength,
	makeReverseLength,
	makeTransformers,
	setTransform,
}
