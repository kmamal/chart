
const calcParameters = (src1, src2, dst1, dst2) => {
	const srcHalfRange = src2 / 2 - src1 / 2
	const dstHalfRange = dst2 / 2 - dst1 / 2

	const scale = dstHalfRange / srcHalfRange
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
	const { scale, delta } = calcParametersLog(src1, src2, dst1, dst2)
	const inverseScale = 1 / scale
	return {
		transformPosition: makeTransformPositionLog(scale, delta),
		reversePosition: makeReversePositionLog(inverseScale, delta),
	}
}

const makeTransformers2d = (src, dst) => {
	const [
		[ src1x, src1y ],
		[ src2x, src2y ],
	] = src

	const [
		[ dst1x, dst1y ],
		[ dst2x, dst2y ],
	] = dst

	const tx = makeTransformers(src1x, src2x, dst1x, dst2x)
	const ty = makeTransformers(src1y, src2y, dst1y, dst2y)

	return {
		transformPosition: ([ x, y ]) => [
			tx.transformPosition(x),
			ty.transformPosition(y),
		],
		reversePosition: ([ x, y ]) => [
			tx.reversePosition(x),
			ty.reversePosition(y),
		],
		transformLength: ([ x, y ]) => [
			tx.transformLength(x),
			ty.transformLength(y),
		],
		reverseLength: ([ x, y ]) => [
			tx.reverseLength(x),
			ty.reverseLength(y),
		],
	}
}

const setTransform = (ctx, src, dst = null) => {
	const [
		[ src1x, src1y ],
		[ src2x, src2y ],
	] = src

	let dst1x
	let dst2x
	let dst1y
	let dst2y
	if (dst === null) {
		const { canvas: { width, height } } = ctx
		dst1x = 0
		dst2x = width
		dst1y = 0
		dst2y = height
	}
	else {
		[
			[ dst1x, dst1y ],
			[ dst2x, dst2y ],
		] = dst
	}

	const { scale: sx, delta: dx } = calcParameters(src1x, src2x, dst1x, dst2x)
	const { scale: sy, delta: dy } = calcParameters(src1y, src2y, dst1y, dst2y)
	ctx.setTransform(sx, 0, 0, sy, dx, dy)
}

module.exports = {
	calcParameters,
	makeTransformPosition,
	makeReversePosition,
	makeTransformLength,
	makeReverseLength,
	makeTransformers,
	calcParametersLog,
	makeTransformPositionLog,
	makeReversePositionLog,
	makeTransformersLog,
	setTransform,
}
