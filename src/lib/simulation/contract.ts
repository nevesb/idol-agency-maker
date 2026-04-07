import type { ActiveContract, ContractClauses, IdolRuntime } from '$lib/types/simulation';

const WEEKS_PER_MONTH = 4;

export function defaultContractClauses(salaryYenPerMonth = 80_000): ContractClauses {
	return {
		durationMonths: 12,
		salaryYenPerMonth,
		revenueSharePercent: 30,
		exclusive: false,
		maxJobsPerWeek: 3,
		imageRights: 'partial',
		terminationFeeYen: 500_000,
		datingRestriction: false,
		mandatoryRestDaysPerWeek: 1
	};
}

export function contractExpiresWeek(signedWeek: number, durationMonths: 6 | 12 | 24): number {
	return signedWeek + durationMonths * WEEKS_PER_MONTH;
}

export function createContract(
	idolId: string,
	signedWeek: number,
	clauses: ContractClauses,
	id = `ctr_${idolId}_${signedWeek}`
): ActiveContract {
	return {
		id,
		idolId,
		clauses,
		signedWeek,
		expiresWeek: contractExpiresWeek(signedWeek, clauses.durationMonths),
		status: 'active'
	};
}

/** Jobs escalados esta semana vs limite do contrato */
export function canAssignMoreJobsThisWeek(
	idol: IdolRuntime,
	assignedCountThisWeek: number,
	contract: ActiveContract | undefined
): boolean {
	const max = contract?.clauses.maxJobsPerWeek ?? 99;
	return assignedCountThisWeek < max;
}
