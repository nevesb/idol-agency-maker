import { describe, expect, it } from 'vitest';
import { createInitialGame } from './initial-state';
import { canAssignJob, maxJobsForIdol } from './schedule-contract';

describe('schedule-contract', () => {
	it('bloqueia além de maxJobsPerWeek', () => {
		let s = createInitialGame(1);
		const j0 = s.jobBoard[0]!.id;
		const j1 = s.jobBoard[1]!.id;
		const idol = s.idols[0]!;
		const max = maxJobsForIdol(s, idol.id);
		const jExtra = s.jobBoard[max]!.id;
		expect(max).toBeLessThan(99);
		s = {
			...s,
			assignedJobs: [{ jobId: j0, idolId: idol.id }]
		};
		expect(canAssignJob(s, j1, idol.id).ok).toBe(true);
		s = { ...s, assignedJobs: Array.from({ length: max }, (_, i) => ({ jobId: s.jobBoard[i]!.id, idolId: idol.id })) };
		expect(canAssignJob(s, jExtra, idol.id).ok).toBe(false);
	});
});
