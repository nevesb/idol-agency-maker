import { describe, expect, it } from 'vitest';
import { createInitialGame } from './initial-state';
import { hireStaffOffer, staffOffersForWeek } from './staff-hiring';

describe('staffOffersForWeek', () => {
	it('varia a cada semana', () => {
		const a = staffOffersForWeek(1);
		const b = staffOffersForWeek(2);
		expect(a[0]!.id).not.toEqual(b[0]!.id);
	});

	it('returns 3 offers', () => {
		expect(staffOffersForWeek(5).length).toBe(3);
	});

	it('offers have 4 attributes', () => {
		const offer = staffOffersForWeek(1)[0]!;
		expect(offer.skill).toBeGreaterThan(0);
		expect(offer.dedication).toBeGreaterThan(0);
		expect(offer.charisma).toBeGreaterThan(0);
		expect(offer.experience).toBeGreaterThan(0);
	});
});

describe('hireStaffOffer', () => {
	it('debita saldo e adiciona membro', () => {
		const s = createInitialGame(1);
		const offer = staffOffersForWeek(s.absoluteWeek, s.seed)[0]!;
		const next = hireStaffOffer(s, offer.id);
		expect(next.staffMembers.length).toBe(s.staffMembers.length + 1);
		expect(next.balanceYen).toBe(s.balanceYen - offer.hireCostYen);
	});

	it('noop sem saldo', () => {
		const s = { ...createInitialGame(2), balanceYen: 100 };
		const offer = staffOffersForWeek(s.absoluteWeek, s.seed)[0]!;
		expect(hireStaffOffer(s, offer.id)).toEqual(s);
	});
});
