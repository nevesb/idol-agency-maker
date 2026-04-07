import type { IdolCore } from '$lib/types/game';
import type { ContractClauses, IdolRuntime, ActiveContract, GameStateV1 } from '$lib/types/simulation';

/**
 * P2-06 / P2-07 — probabilidade 0–1 de aceitar oferta (heurística MVP).
 * Preferências derivadas de hidden stats e idade.
 */
export function acceptanceProbability(clauses: ContractClauses, idol: IdolCore): number {
	const { ambition, loyalty, temperament } = idol.hidden;
	const salaryOk = clauses.salaryYenPerMonth >= 45_000 ? 1 : 0.85;
	const shareOk = clauses.revenueSharePercent <= 35 ? 1 : 0.9 - (clauses.revenueSharePercent - 35) * 0.01;
	const exclusivePenalty = clauses.exclusive ? 0.92 : 1;
	const restOk = clauses.mandatoryRestDaysPerWeek >= 1 ? 1 : 0.88 + loyalty * 0.004;
	const ambitionBoost = 1 + (ambition - 10) * 0.015;
	const temperBoost = temperament >= 12 ? 0.95 : 1.02;
	const youth = idol.age <= 22 ? 1.04 : 1;
	const p =
		0.45 *
		salaryOk *
		Math.max(0.5, shareOk) *
		exclusivePenalty *
		restOk *
		ambitionBoost *
		temperBoost *
		youth;
	return Math.max(0.05, Math.min(0.98, p));
}

/** Contrato "auto-fill" casual-friendly (P2-07). */
export function autoFillClausesForIdol(base: ContractClauses, idol: IdolCore): ContractClauses {
	const bump = Math.round(idol.potential * 800);
	return {
		...base,
		salaryYenPerMonth: Math.min(250_000, base.salaryYenPerMonth + bump),
		revenueSharePercent: Math.max(
			18,
			base.revenueSharePercent - (idol.hidden.loyalty > 12 ? 2 : 0)
		),
		mandatoryRestDaysPerWeek: Math.max(base.mandatoryRestDaysPerWeek, 1)
	};
}

/** P2-06: Idol generates a counter-proposal based on their personality */
export function generateCounterProposal(offered: ContractClauses, idol: IdolCore): ContractClauses {
	const { ambition, loyalty } = idol.hidden;
	const salaryBump = ambition > 12 ? 25_000 : 10_000;
	const shareDrop = loyalty > 14 ? 0 : 3;
	return {
		...offered,
		salaryYenPerMonth: Math.min(300_000, offered.salaryYenPerMonth + salaryBump),
		revenueSharePercent: Math.max(15, offered.revenueSharePercent - shareDrop),
		mandatoryRestDaysPerWeek: Math.max(offered.mandatoryRestDaysPerWeek, 1)
	};
}

export type NegotiationOutcome = 'accepted' | 'rejected' | 'counter';

/** P2-06: Multi-round evaluation (max 3 rounds before rejection) */
export function evaluateOffer(
	clauses: ContractClauses,
	idol: IdolCore,
	round: number
): NegotiationOutcome {
	const prob = acceptanceProbability(clauses, idol);
	if (prob >= 0.7) return 'accepted';
	if (round >= 3) return 'rejected';
	if (prob >= 0.3) return 'counter';
	return 'rejected';
}

/** P2-08: Expire contracts past their expiresWeek */
export function expireContracts(
	contracts: ActiveContract[],
	currentWeek: number
): ActiveContract[] {
	return contracts.map((c) => {
		if (c.status === 'active' && currentWeek >= c.expiresWeek) {
			return { ...c, status: 'expired' as const };
		}
		return c;
	});
}

/** P2-08: Terminate contract early (rescission) */
export function terminateContract(state: GameStateV1, contractId: string): GameStateV1 {
	const cIdx = state.contracts.findIndex((c) => c.id === contractId);
	if (cIdx < 0) return state;
	const contract = state.contracts[cIdx]!;
	if (contract.status !== 'active') return state;

	const fee = contract.clauses.terminationFeeYen;
	const contracts = state.contracts.map((c, i) =>
		i === cIdx ? { ...c, status: 'terminated' as const } : c
	);
	const idols = state.idols.map((idol) =>
		idol.contractId === contractId ? { ...idol, contractId: null } : idol
	);
	const ledger = [
		...state.ledger,
		{
			week: state.absoluteWeek,
			kind: 'termination_fee',
			amountYen: -fee,
			note: `Terminated ${contractId}`
		}
	];
	return { ...state, contracts, idols, balanceYen: state.balanceYen - fee, ledger };
}

/** P2-08: Renew an expiring/expired contract with new clauses */
export function renewContract(
	state: GameStateV1,
	contractId: string,
	newClauses: ContractClauses
): GameStateV1 {
	const cIdx = state.contracts.findIndex((c) => c.id === contractId);
	if (cIdx < 0) return state;
	const old = state.contracts[cIdx]!;

	const renewed: ActiveContract = {
		id: `ctr_${old.idolId}_${state.absoluteWeek}`,
		idolId: old.idolId,
		clauses: newClauses,
		signedWeek: state.absoluteWeek,
		expiresWeek: state.absoluteWeek + newClauses.durationMonths * 4,
		status: 'active'
	};

	const contracts = [
		...state.contracts.map((c, i) =>
			i === cIdx ? { ...c, status: 'expired' as const } : c
		),
		renewed
	];
	const idols = state.idols.map((idol) =>
		idol.contractId === contractId ? { ...idol, contractId: renewed.id } : idol
	);
	return { ...state, contracts, idols };
}

/** P2-10: Wellness triggers from salary/rest/events */
export function applyWellnessTriggers(
	idol: IdolRuntime,
	contract: ActiveContract | undefined,
	marketAvgSalary: number
): IdolRuntime {
	const w = { ...idol.wellness };

	if (contract) {
		if (contract.clauses.salaryYenPerMonth < marketAvgSalary * 0.7) {
			w.happiness = Math.max(0, w.happiness - 3);
		}
		if (contract.clauses.mandatoryRestDaysPerWeek >= 2) {
			w.physical = Math.min(100, w.physical + 2);
		}
	}

	return { ...idol, wellness: w };
}

/** P2-11: FSM activityState transitions based on wellness */
export function resolveActivityState(idol: IdolRuntime): IdolRuntime {
	const w = idol.wellness;
	const avg = (w.physical + w.happiness + w.motivation + (100 - w.stress)) / 4;

	let next = idol.activityState;

	if (w.stress >= 90 && avg < 30) {
		next = 'crisis';
	} else if (w.stress >= 75 || avg < 40) {
		next = 'burnout';
	} else if (w.stress >= 60 && w.physical < 40) {
		next = 'overwork';
	} else if (idol.activityState === 'crisis' && w.stress < 60 && avg > 50) {
		next = 'active';
	} else if (idol.activityState === 'burnout' && w.stress < 50 && avg > 55) {
		next = 'active';
	} else if (idol.activityState === 'overwork' && w.stress < 45) {
		next = 'active';
	}

	if (next === idol.activityState) return idol;
	return { ...idol, activityState: next };
}

/** P2-18: Player proposal to market idol; idol accepts/rejects based on heuristic + RNG */
export function evaluatePlayerProposal(
	clauses: ContractClauses,
	idol: IdolCore,
	seed: number
): boolean {
	const prob = acceptanceProbability(clauses, idol);
	const rng = ((seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
	return rng < prob;
}
