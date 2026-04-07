import type {
	AgencyEconomyTier,
	AgencyMood,
	GameAlert,
	GameMessage,
	GameStateV1,
	Headline,
	JobHistoryEntry,
	LiveSimState,
	ManagementTraitId,
	NewsItem,
	PendingAction,
	PostMortemEntry,
	ProducerProfile,
	ScoutingMission,
	ScoutNPC,
	ScoutReport,
	StaffMemberStub,
	WeekPhaseLog
} from '$lib/types/simulation';
import type { IdolCore } from '$lib/types/game';
import type { SaveEnvelopeV1 } from './types';
import { mergeAgencyStrategy } from '$lib/simulation/agency-strategy';

function isRecord(x: unknown): x is Record<string, unknown> {
	return typeof x === 'object' && x !== null && !Array.isArray(x);
}

const AGENCY_TIERS: AgencyEconomyTier[] = ['garage', 'small', 'medium', 'large', 'elite'];
const AGENCY_MOODS: AgencyMood[] = ['great', 'good', 'neutral', 'poor', 'crisis'];

function asAgencyTier(x: unknown): AgencyEconomyTier {
	return AGENCY_TIERS.includes(x as AgencyEconomyTier) ? (x as AgencyEconomyTier) : 'small';
}

function asAgencyMood(x: unknown): AgencyMood {
	return AGENCY_MOODS.includes(x as AgencyMood) ? (x as AgencyMood) : 'neutral';
}

/** Núcleo mínimo de save legado (antes dos campos P3/P4). */
function isGameCoreLoadable(x: unknown): x is Record<string, unknown> {
	if (!isRecord(x)) return false;
	if (x.version !== 1) return false;
	if (typeof x.seed !== 'number') return false;
	if (typeof x.agencyName !== 'string') return false;
	if (!Array.isArray(x.idols)) return false;
	if (!Array.isArray(x.marketIdols)) return false;
	if (!Array.isArray(x.jobBoard)) return false;
	if (!Array.isArray(x.contracts)) return false;
	if (!Array.isArray(x.assignedJobs)) return false;
	if (!Array.isArray(x.rivals)) return false;
	if (!Array.isArray(x.ledger)) return false;
	if (typeof x.balanceYen !== 'number') return false;
	if (typeof x.absoluteWeek !== 'number') return false;
	if (x.lastWeekLog !== null && !isRecord(x.lastWeekLog)) return false;
	return true;
}

/**
 * Preenche defaults para saves antigos e valida o núcleo.
 * Use ao hidratar JSON; o objeto devolvido é um `GameStateV1` completo.
 */
export function migrateToFullGameState(x: unknown): GameStateV1 | null {
	if (!isGameCoreLoadable(x)) return null;
	const r = x;
	const lastWeekLog =
		r.lastWeekLog === null ? null : (r.lastWeekLog as WeekPhaseLog | null);
	return {
		version: 1,
		seed: r.seed as number,
		agencyId: typeof r.agencyId === 'string' ? r.agencyId : 'player_agency',
		agencyName: r.agencyName as string,
		agencyTier: asAgencyTier(r.agencyTier),
		balanceYen: r.balanceYen as number,
		absoluteWeek: r.absoluteWeek as number,
		idols: r.idols as GameStateV1['idols'],
		marketIdols: r.marketIdols as GameStateV1['marketIdols'],
		jobBoard: r.jobBoard as GameStateV1['jobBoard'],
		contracts: r.contracts as GameStateV1['contracts'],
		assignedJobs: r.assignedJobs as GameStateV1['assignedJobs'],
		rivals: r.rivals as GameStateV1['rivals'],
		lastWeekLog,
		ledger: r.ledger as GameStateV1['ledger'],
		worldPackId: typeof r.worldPackId === 'string' ? r.worldPackId : 'embedded_default',
		startingRegionId: typeof r.startingRegionId === 'string' ? r.startingRegionId : 'tokyo',
		jobHistory: Array.isArray(r.jobHistory) ? (r.jobHistory as JobHistoryEntry[]) : [],
		postMortems: Array.isArray(r.postMortems) ? (r.postMortems as PostMortemEntry[]) : [],
		headlines: Array.isArray(r.headlines) ? (r.headlines as Headline[]) : [],
		alerts: Array.isArray(r.alerts) ? (r.alerts as GameAlert[]) : [],
		agencyMood: asAgencyMood(r.agencyMood),
		pendingActions: Array.isArray(r.pendingActions)
			? (r.pendingActions as PendingAction[])
			: [],
		agencyStrategy: mergeAgencyStrategy(r.agencyStrategy),
		staffMembers: Array.isArray(r.staffMembers) ? (r.staffMembers as StaffMemberStub[]) : [],
		producerProfile: isRecord(r.producerProfile)
			? (r.producerProfile as unknown as ProducerProfile)
			: {
					name: 'Producer',
					sex: 'other' as const,
					birthday: { month: 1, day: 1 },
					managementTraits: ['pragmatic', 'cautious'] as [ManagementTraitId, ManagementTraitId]
				},
		messages: Array.isArray(r.messages) ? (r.messages as GameMessage[]) : [],
		newsHistory: Array.isArray(r.newsHistory) ? (r.newsHistory as NewsItem[]) : [],
		scoutPool: Array.isArray(r.scoutPool) ? (r.scoutPool as ScoutNPC[]) : [],
		activeScoutMissions: Array.isArray(r.activeScoutMissions)
			? (r.activeScoutMissions as ScoutingMission[])
			: [],
		scoutReports: Array.isArray(r.scoutReports) ? (r.scoutReports as ScoutReport[]) : [],
		reserveIdolPool: Array.isArray(r.reserveIdolPool) ? (r.reserveIdolPool as IdolCore[]) : [],
		liveSim: isRecord(r.liveSim)
			? (r.liveSim as unknown as LiveSimState)
			: { status: 'idle' as const, currentDay: 0, dayResults: [], speed: 1 as const }
	};
}

/** Estado completo em memória (todos os campos obrigatórios presentes). */
export function isGameStateV1(x: unknown): x is GameStateV1 {
	if (!isGameCoreLoadable(x)) return false;
	const r = x;
	if (typeof r.agencyId !== 'string') return false;
	if (typeof r.worldPackId !== 'string') return false;
	if (typeof r.startingRegionId !== 'string') return false;
	if (!Array.isArray(r.jobHistory)) return false;
	if (!Array.isArray(r.postMortems)) return false;
	if (!Array.isArray(r.headlines)) return false;
	if (!Array.isArray(r.alerts)) return false;
	if (typeof r.agencyMood !== 'string' || !AGENCY_MOODS.includes(r.agencyMood as AgencyMood))
		return false;
	if (!Array.isArray(r.pendingActions)) return false;
	if (!AGENCY_TIERS.includes(r.agencyTier as AgencyEconomyTier)) return false;
	if (!isRecord(r.agencyStrategy)) return false;
	if (!Array.isArray(r.staffMembers)) return false;
	return true;
}

export function isSaveEnvelopeV1(x: unknown): x is SaveEnvelopeV1 {
	if (!isRecord(x)) return false;
	if (!isRecord(x.meta)) return false;
	if (x.meta.envelopeVersion !== 1) return false;
	if (typeof x.meta.savedAt !== 'string') return false;
	if (typeof x.meta.slotIndex !== 'number') return false;
	return migrateToFullGameState(x.game) !== null;
}

export function parseSaveEnvelopeJson(json: string): SaveEnvelopeV1 | null {
	try {
		const raw: unknown = JSON.parse(json);
		if (!isRecord(raw)) return null;
		if (!isRecord(raw.meta)) return null;
		if (raw.meta.envelopeVersion !== 1) return null;
		if (typeof raw.meta.savedAt !== 'string') return null;
		if (typeof raw.meta.slotIndex !== 'number') return null;
		const game = migrateToFullGameState(raw.game);
		if (!game) return null;
		return {
			meta: {
				envelopeVersion: 1,
				savedAt: raw.meta.savedAt,
				slotIndex: raw.meta.slotIndex
			},
			game
		};
	} catch {
		return null;
	}
}

export function stringifySaveEnvelope(env: SaveEnvelopeV1): string {
	return JSON.stringify(env);
}

export function buildSaveEnvelope(game: GameStateV1, slotIndex: number): SaveEnvelopeV1 {
	return {
		meta: {
			envelopeVersion: 1,
			savedAt: new Date().toISOString(),
			slotIndex
		},
		game
	};
}

/** Comprime GameStateV1 para uma string base64 pronta para upload via edge function. */
export function compressForUpload(state: GameStateV1): string {
	return btoa(JSON.stringify(state));
}

/** Descomprime a string base64 de volta para GameStateV1, retornando null se inválido. */
export function decompressFromDownload(data: string): GameStateV1 | null {
	try {
		const json = atob(data);
		const parsed: unknown = JSON.parse(json);
		return migrateToFullGameState(parsed);
	} catch {
		return null;
	}
}
