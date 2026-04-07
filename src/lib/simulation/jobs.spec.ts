import { describe, expect, it } from 'vitest';
import type { JobPosting } from '$lib/types/simulation';
import { createInitialGame } from './initial-state';
import { canIdolTakeJob, jobAverageStatRequirement, outcomeFromPerformance } from './jobs';

describe('jobs', () => {
	it('outcomeFromPerformance segue limiares GDD', () => {
		expect(outcomeFromPerformance(0.71)).toBe('success');
		expect(outcomeFromPerformance(0.55)).toBe('partial');
		expect(outcomeFromPerformance(0.2)).toBe('failure');
	});

	it('jobAverageStatRequirement', () => {
		expect(jobAverageStatRequirement(2)).toBe(20);
		expect(jobAverageStatRequirement(6)).toBe(40);
	});

	it('canIdolTakeJob respeita stats e fama mínima', () => {
		const g = createInitialGame(1);
		const idol = g.idols[0]!;
		const easy: JobPosting = {
			id: 't',
			category: 'radio',
			name: 'T',
			difficulty: 1,
			visibility: 1,
			paymentYen: 1,
			fameGain: 1,
			primaryStats: ['vocal'],
			durationDays: 1,
			competitive: false,
			scheduledDay: 0
		};
		expect(canIdolTakeJob(idol, easy)).toBe(true);
		const hard: JobPosting = {
			...easy,
			id: 't2',
			difficulty: 18,
			minFameTier: 'SSS'
		};
		expect(canIdolTakeJob(idol, hard)).toBe(false);
	});
});
