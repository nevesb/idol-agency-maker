/** PRNG determinístico (Mulberry32) — mesma seed + mesma sequência de chamadas = mesmos valores. */
export function mulberry32(seed: number): () => number {
	let t = seed >>> 0;
	return () => {
		t += 0x6d2b79f5;
		let x = Math.imul(t ^ (t >>> 15), 1 | t);
		x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
		return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
	};
}

export function randomBetween(rng: () => number, min: number, max: number): number {
	return min + (max - min) * rng();
}
