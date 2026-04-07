import type { GameStateV1, ManagementTraitId } from '$lib/types/simulation';
import { describe, expect, it } from 'vitest';
import { savesRequireUserChoice } from './save-conflict-logic';
import type { SaveEnvelopeV1 } from './types';

function env(week: number, savedAt: string, seed = 1, name = 'A'): SaveEnvelopeV1 {
	const game = {
		version: 1,
		seed,
		agencyId: 'x',
		agencyName: name,
		agencyTier: 'small',
		balanceYen: 0,
		absoluteWeek: week,
		idols: [],
		marketIdols: [],
		jobBoard: [],
		contracts: [],
		assignedJobs: [],
		rivals: [],
		lastWeekLog: null,
		ledger: [],
		worldPackId: 'd',
		startingRegionId: 'tokyo',
		jobHistory: [],
		postMortems: [],
		headlines: [],
		alerts: [],
		agencyMood: 'neutral',
		pendingActions: [],
		agencyStrategy: {
			focus: 'balanced',
			agendaPosture: 'normal',
			imagePosture: 'safe',
			growthPosture: 'organic'
		},
		staffMembers: [],
		producerProfile: {
			name: 'Producer',
			sex: 'other' as const,
			birthday: { month: 1, day: 1 },
			managementTraits: ['pragmatic', 'cautious'] as [ManagementTraitId, ManagementTraitId]
		},
		messages: [],
		newsHistory: [],
		scoutPool: [],
		activeScoutMissions: [],
		scoutReports: [],
		reserveIdolPool: [],
		liveSim: { status: 'idle' as const, currentDay: 0, dayResults: [], speed: 1 as const }
	} as GameStateV1;
	return {
		meta: { envelopeVersion: 1, savedAt, slotIndex: 0 },
		game
	};
}

describe('savesRequireUserChoice', () => {
	it('false quando semana e timestamps alinhados', () => {
		const t = '2026-04-02T12:00:00.000Z';
		expect(savesRequireUserChoice(env(5, t), env(5, t), t)).toBe(false);
	});

	it('true quando semana difere', () => {
		const t = '2026-04-02T12:00:00.000Z';
		expect(savesRequireUserChoice(env(5, t), env(6, t), t)).toBe(true);
	});

	it('true quando timestamps divergem', () => {
		expect(
			savesRequireUserChoice(
				env(3, '2026-04-01T12:00:00.000Z'),
				env(3, '2026-04-01T12:00:00.000Z'),
				'2026-04-02T12:00:00.000Z'
			)
		).toBe(true);
	});
});
