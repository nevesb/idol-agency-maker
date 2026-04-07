import type { GameStateV1, ScoutingMission, ScoutNPC, ScoutReport } from '$lib/types/simulation';
import type { IdolCore } from '$lib/types/game';
import { mulberry32, randomBetween } from '$lib/simulation/rng';
import { buildPendingActions } from '$lib/simulation/pending-actions';
import { createContract, defaultContractClauses } from '$lib/simulation/contract';
import { idolCoreToRuntime } from '$lib/simulation/market';

export type ScoutingPipeline = 'street' | 'audition' | 'transfer';

export interface ScoutingPipelineInfo {
	id: ScoutingPipeline;
	costRange: [number, number];
	precisionRange: [number, number];
	durationWeeks: [number, number];
	description: string;
}

export const SCOUTING_PIPELINES: ScoutingPipelineInfo[] = [
	{
		id: 'street',
		costRange: [200_000, 500_000],
		precisionRange: [30, 60],
		durationWeeks: [2, 4],
		description: 'Send a scout to search the streets. Cheap but imprecise.'
	},
	{
		id: 'audition',
		costRange: [500_000, 1_500_000],
		precisionRange: [60, 90],
		durationWeeks: [1, 2],
		description: 'Hold an audition. Medium cost, high precision.'
	},
	{
		id: 'transfer',
		costRange: [1_000_000, 5_000_000],
		precisionRange: [90, 100],
		durationWeeks: [1, 1],
		description: 'Direct transfer from another agency. Expensive but exact stats.'
	}
];

const SCOUT_NAMES = [
	'Yamada Ren',
	'Tanaka Mei',
	'Suzuki Haruto',
	'Watanabe Yui',
	'Nakamura Sora',
	'Kobayashi Aoi',
	'Itou Kaito',
	'Saito Hina',
	'Kimura Ryota',
	'Hayashi Sakura'
];

const SPECIALTIES = ['vocal', 'dance', 'visual', 'variety', 'all-round'];

const REGIONS = ['tokyo', 'osaka', 'fukuoka', 'sapporo', 'nagoya'];

/** Initialize scout pool for a new game. */
export function initScoutPool(seed: number): ScoutNPC[] {
	const rng = mulberry32(seed >>> 0);
	const count = Math.floor(randomBetween(rng, 3, 6));
	const scouts: ScoutNPC[] = [];

	for (let i = 0; i < count; i++) {
		const nameIdx = Math.floor(rng() * SCOUT_NAMES.length);
		const specIdx = Math.floor(rng() * SPECIALTIES.length);
		const regionIdx = Math.floor(rng() * REGIONS.length);

		scouts.push({
			id: `scout_${seed}_${i}`,
			name: SCOUT_NAMES[nameIdx]!,
			regionId: REGIONS[regionIdx]!,
			specialty: SPECIALTIES[specIdx]!,
			skill: Math.round(randomBetween(rng, 30, 90))
		});
	}

	return scouts;
}

/** Start a scouting mission — deducts cost, adds to active missions. */
export function startMission(
	state: GameStateV1,
	pipeline: ScoutingPipeline,
	scoutId: string,
	regionId: string
): GameStateV1 {
	const pipelineInfo = SCOUTING_PIPELINES.find((p) => p.id === pipeline);
	if (!pipelineInfo) return state;

	const scout = state.scoutPool.find((s) => s.id === scoutId);
	if (!scout) return state;

	const rng = mulberry32((state.seed ^ (state.absoluteWeek * 0x9e3779b9) ^ hashString(scoutId)) >>> 0);

	const cost = Math.round(randomBetween(rng, pipelineInfo.costRange[0], pipelineInfo.costRange[1]));
	if (state.balanceYen < cost) return state;

	const precision = Math.round(
		randomBetween(rng, pipelineInfo.precisionRange[0], pipelineInfo.precisionRange[1])
	);
	const duration = Math.round(
		randomBetween(rng, pipelineInfo.durationWeeks[0], pipelineInfo.durationWeeks[1])
	);

	const mission: ScoutingMission = {
		id: `mission_${state.absoluteWeek}_${scoutId}_${regionId}`,
		scoutId,
		regionId,
		duration,
		precision: Math.min(100, precision + Math.round(scout.skill * 0.1)),
		cost,
		status: 'active'
	};

	const ledger = [
		...state.ledger,
		{
			week: state.absoluteWeek,
			kind: 'scouting_mission',
			amountYen: -cost,
			note: `Scouting mission (${pipeline}) in ${regionId}`
		}
	];

	const next: GameStateV1 = {
		...state,
		balanceYen: state.balanceYen - cost,
		activeScoutMissions: [...state.activeScoutMissions, mission],
		ledger
	};
	return { ...next, pendingActions: buildPendingActions(next) };
}

/** Advance all active missions by 1 week. Complete ones that are done. */
export function tickScoutingWeekly(state: GameStateV1): GameStateV1 {
	const stillActive: ScoutingMission[] = [];
	const newReports: ScoutReport[] = [];
	let reservePool = [...state.reserveIdolPool];
	const newMessages = [...state.messages];

	for (const mission of state.activeScoutMissions) {
		const remaining = mission.duration - 1;

		if (remaining <= 0) {
			const { report, usedIdolIds } = resolveMission(
				mission,
				reservePool,
				state.seed,
				state.absoluteWeek
			);
			newReports.push(report);
			reservePool = reservePool.filter((idol) => !usedIdolIds.includes(idol.id));

			const scout = state.scoutPool.find((s) => s.id === mission.scoutId);
			const scoutName = scout?.name ?? 'Scout';
			newMessages.push({
				id: `msg_scout_${mission.id}`,
				week: state.absoluteWeek,
				day: 0,
				from: scoutName,
				subject: `${scoutName} voltou de ${mission.regionId} com relatório pronto!`,
				body: `Missão em ${mission.regionId} concluída. ${report.discoveredIdols.length} talento(s) encontrado(s).`,
				category: 'info',
				read: false
			});
		} else {
			stillActive.push({ ...mission, duration: remaining });
		}
	}

	return {
		...state,
		activeScoutMissions: stillActive,
		scoutReports: [...state.scoutReports, ...newReports],
		reserveIdolPool: reservePool,
		messages: newMessages
	};
}

/** Resolve a completed mission into a report. */
function resolveMission(
	mission: ScoutingMission,
	reservePool: IdolCore[],
	seed: number,
	week: number
): { report: ScoutReport; usedIdolIds: string[] } {
	const rng = mulberry32((seed ^ (week * 0x9e3779b9) ^ hashString(mission.id)) >>> 0);

	const precisionJitter = Math.round(randomBetween(rng, -15, 15));
	const adjustedPrecision = Math.max(0, Math.min(100, mission.precision + precisionJitter));

	const baseCount = adjustedPrecision >= 70 ? 3 : adjustedPrecision >= 40 ? 2 : 1;
	const bonusRoll = rng();
	const targetCount = bonusRoll > 0.8 ? baseCount + 1 : baseCount;

	const regionPool = reservePool.filter((idol) => idol.regionId === mission.regionId);
	const fallbackPool = reservePool.filter((idol) => idol.regionId !== mission.regionId);
	const combinedPool = [...regionPool, ...fallbackPool];

	const sorted = [...combinedPool].sort((a, b) => {
		if (adjustedPrecision >= 70) return b.potential - a.potential;
		return rng() - 0.5;
	});

	const count = Math.min(targetCount, sorted.length);
	const discovered = sorted.slice(0, count);
	const usedIdolIds = discovered.map((idol) => idol.id);

	const report: ScoutReport = {
		id: `report_${mission.id}_${week}`,
		missionId: mission.id,
		scoutId: mission.scoutId,
		regionId: mission.regionId,
		week,
		discoveredIdols: discovered,
		read: false
	};

	return { report, usedIdolIds };
}

/** Sign a discovered idol from a scouting report. */
export function signDiscoveredIdol(
	state: GameStateV1,
	reportId: string,
	idolId: string
): GameStateV1 {
	const reportIdx = state.scoutReports.findIndex((r) => r.id === reportId);
	if (reportIdx < 0) return state;

	const report = state.scoutReports[reportIdx]!;
	const idol = report.discoveredIdols.find((i) => i.id === idolId);
	if (!idol) return state;

	const clauses = defaultContractClauses(75_000);
	const ctr = createContract(idol.id, state.absoluteWeek, clauses);
	const runtime = idolCoreToRuntime(idol, state.agencyId);
	runtime.contractId = ctr.id;

	const updatedReports = state.scoutReports.map((r, i) =>
		i === reportIdx
			? {
					...r,
					read: true,
					discoveredIdols: r.discoveredIdols.filter((di) => di.id !== idolId)
				}
			: r
	);

	const ledger = [
		...state.ledger,
		{
			week: state.absoluteWeek,
			kind: 'scouting_signing',
			amountYen: 0,
			note: `Signed scouted idol ${idol.nameRomaji}`
		}
	];

	const next: GameStateV1 = {
		...state,
		idols: [...state.idols, runtime],
		contracts: [...state.contracts, ctr],
		scoutReports: updatedReports,
		ledger
	};
	return { ...next, pendingActions: buildPendingActions(next) };
}

/** Legacy alias kept for existing callers. */
export const generateScoutPool = initScoutPool;

function hashString(s: string): number {
	let h = 0;
	for (let i = 0; i < s.length; i++) {
		h = Math.imul(h ^ s.charCodeAt(i), 0x01000193);
	}
	return h >>> 0;
}
