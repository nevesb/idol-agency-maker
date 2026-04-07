import { describe, expect, it } from 'vitest';
import { mulberry32, randomBetween } from './rng';

describe('mulberry32', () => {
	it('produz a mesma primeira amostra para a mesma seed', () => {
		const a = mulberry32(42_001);
		const b = mulberry32(42_001);
		expect(a()).toBeCloseTo(b(), 10);
	});

	it('randomBetween respeita limites', () => {
		const rng = mulberry32(7);
		for (let i = 0; i < 50; i++) {
			const x = randomBetween(rng, 0.8, 1.2);
			expect(x).toBeGreaterThanOrEqual(0.8);
			expect(x).toBeLessThanOrEqual(1.2);
		}
	});
});
