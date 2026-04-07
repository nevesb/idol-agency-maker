import type { GameStateV1 } from '$lib/types/simulation';

export function idolAssignmentCount(state: GameStateV1, idolId: string): number {
	return state.assignedJobs.filter((a) => a.idolId === idolId).length;
}

export function maxJobsForIdol(state: GameStateV1, idolId: string): number {
	const idol = state.idols.find((i) => i.id === idolId);
	if (!idol?.contractId) return 99;
	const c = state.contracts.find((x) => x.id === idol.contractId && x.status === 'active');
	return c?.clauses.maxJobsPerWeek ?? 99;
}

export function canAssignJob(
	state: GameStateV1,
	jobId: string,
	idolId: string
): { ok: true } | { ok: false; reason: string } {
	const idol = state.idols.find((i) => i.id === idolId);
	if (!idol) return { ok: false, reason: 'no_idol' };
	if (idol.activityState === 'burnout' || idol.activityState === 'crisis') {
		return { ok: false, reason: 'wellness_blocked' };
	}
	if (!state.jobBoard.some((j) => j.id === jobId)) return { ok: false, reason: 'no_job' };
	const current = idolAssignmentCount(state, idolId);
	const replacing = state.assignedJobs.some((a) => a.jobId === jobId);
	const nextCount = replacing ? current : current + 1;
	const max = maxJobsForIdol(state, idolId);
	if (nextCount > max) return { ok: false, reason: 'max_jobs_contract' };
	return { ok: true };
}
