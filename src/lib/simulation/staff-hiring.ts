import type { GameStateV1, StaffMemberStub, StaffRole } from '$lib/types/simulation';
import { buildPendingActions } from '$lib/simulation/pending-actions';
import { mulberry32, randomBetween } from '$lib/simulation/rng';

export type StaffOffer = {
	id: string;
	roleKey: StaffRole;
	displayName: string;
	hireCostYen: number;
	salaryYenPerMonth: number;
	skill: number;
	dedication: number;
	charisma: number;
	experience: number;
};

const ROLES: StaffRole[] = [
	'coach',
	'pr_manager',
	'choreographer',
	'vocal_trainer',
	'stylist',
	'manager',
	'scout',
	'producer',
	'marketing',
	'accountant',
	'medic'
];

const HIRE_COST_BASE: Record<StaffRole, number> = {
	coach: 320_000,
	pr_manager: 280_000,
	choreographer: 300_000,
	vocal_trainer: 300_000,
	stylist: 220_000,
	manager: 350_000,
	scout: 250_000,
	producer: 400_000,
	marketing: 260_000,
	accountant: 200_000,
	medic: 280_000
};

const SALARY_BASE: Record<StaffRole, number> = {
	coach: 95_000,
	pr_manager: 88_000,
	choreographer: 90_000,
	vocal_trainer: 90_000,
	stylist: 75_000,
	manager: 100_000,
	scout: 80_000,
	producer: 110_000,
	marketing: 85_000,
	accountant: 70_000,
	medic: 85_000
};

/** P3-23: Generate staff offers rotating by week, 3 offers at a time */
export function staffOffersForWeek(absoluteWeek: number, seed = 42): StaffOffer[] {
	const rng = mulberry32((seed ^ (absoluteWeek * 0x9e3779b9)) >>> 0);
	const phase = absoluteWeek % ROLES.length;
	const offers: StaffOffer[] = [];

	for (let i = 0; i < 3; i++) {
		const roleIdx = (phase + i) % ROLES.length;
		const role = ROLES[roleIdx]!;
		const hireCost = Math.round(HIRE_COST_BASE[role] * randomBetween(rng, 0.85, 1.15));
		const salary = Math.round(SALARY_BASE[role] * randomBetween(rng, 0.9, 1.1));
		const skill = Math.round(randomBetween(rng, 40, 80));
		const dedication = Math.round(randomBetween(rng, 45, 85));
		const charisma = Math.round(randomBetween(rng, 30, 75));
		const experience = Math.round(randomBetween(rng, 20, 70));
		const nameIdx = Math.floor(rng() * 1000);
		offers.push({
			id: `off_${role}_${absoluteWeek}_${i}`,
			roleKey: role,
			displayName: `Staff ${role} #${nameIdx}`,
			hireCostYen: hireCost,
			salaryYenPerMonth: salary,
			skill,
			dedication,
			charisma,
			experience
		});
	}
	return offers;
}

export function hireStaffOffer(state: GameStateV1, offerId: string): GameStateV1 {
	const offers = staffOffersForWeek(state.absoluteWeek, state.seed);
	const offer = offers.find((o) => o.id === offerId);
	if (!offer) return state;
	if (state.balanceYen < offer.hireCostYen) return state;
	if (state.staffMembers.some((s) => s.roleKey === offer.roleKey && s.name === offer.displayName))
		return state;

	const member: StaffMemberStub = {
		id: `stf_${state.seed}_${state.absoluteWeek}_${offer.id}`,
		roleKey: offer.roleKey,
		name: offer.displayName,
		skill: offer.skill,
		dedication: offer.dedication,
		charisma: offer.charisma,
		experience: offer.experience,
		salaryYenPerMonth: offer.salaryYenPerMonth
	};

	const ledger = [
		...state.ledger,
		{
			week: state.absoluteWeek,
			kind: 'staff_hire',
			amountYen: -offer.hireCostYen,
			note: `Hired ${offer.displayName} (${offer.roleKey})`
		}
	];

	const next: GameStateV1 = {
		...state,
		balanceYen: state.balanceYen - offer.hireCostYen,
		staffMembers: [...state.staffMembers, member],
		ledger
	};
	return { ...next, pendingActions: buildPendingActions(next) };
}

/** P3-25: Coach growth bonus applied to stat ticks */
export const COACH_GROWTH_FACTOR = 0.15;

export function coachGrowthBonus(staffMembers: StaffMemberStub[]): number {
	const coach = staffMembers.find((s) => s.roleKey === 'coach');
	if (!coach) return 0;
	return COACH_GROWTH_FACTOR * (coach.skill / 100);
}

/** P3-26: PR scandal mitigation */
export const SCANDAL_MITIGATION_FACTOR = 0.3;

export function prMitigationFactor(staffMembers: StaffMemberStub[]): number {
	const pr = staffMembers.find((s) => s.roleKey === 'pr_manager');
	if (!pr) return 0;
	return SCANDAL_MITIGATION_FACTOR * (pr.skill / 100);
}
