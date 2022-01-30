
const resample = (original, resampledLength) => {
	const originalLength = original.length
	const ratio = originalLength / resampledLength
	const resampled = new Array(2 * resampledLength)
	let index = 0
	while (index < resampledLength) {
		const next = index + 1
		const start = Math.floor(index * ratio)
		const end = Math.max(start + 1, Math.floor(next * ratio))
		let min = Infinity
		let max = -Infinity
		for (let i = start; i < end; i++) {
			const x = original[i]
			min = Math.min(x, min)
			max = Math.max(x, max)
		}
		resampled[2 * index + 0] = min
		resampled[2 * index + 1] = max
		index = next
	}
	return resampled
}

module.exports = { resample }
