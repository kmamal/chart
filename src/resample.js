
const resample = (original, resampledLength) => {
	const originalLength = original.length
	const ratio = originalLength / resampledLength
	const resampled = new Array(2 * resampledLength)
	for (let i = 0; i < resampledLength; i++)	{
		const next = i + 1
		const start = Math.floor(i * ratio)
		const end = Math.max(start + 1, Math.floor(next * ratio))
		let min = Infinity
		let max = -Infinity
		for (let j = start; j < end; j++) {
			const x = original[j]
			min = Math.min(x, min)
			max = Math.max(x, max)
		}
		resampled[2 * i + 0] = min
		resampled[2 * i + 1] = max
	}
	return resampled
}

module.exports = { resample }
