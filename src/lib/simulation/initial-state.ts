import type { IdolCore } from '$lib/types/game';
import type {
	AgencyEconomyTier,
	GameMessage,
	GameStateV1,
	ManagementTraitId,
	NewsItem,
	ProducerProfile,
	RivalAgencyStub
} from '$lib/types/simulation';
import { createContract, defaultContractClauses } from '$lib/simulation/contract';
import { generateJobBoard } from '$lib/simulation/job-board-gen';
import { idolCoreToRuntime } from '$lib/simulation/market';
import { buildPendingActions } from '$lib/simulation/pending-actions';
import { defaultAgencyStrategy } from '$lib/simulation/agency-strategy';
import { initScoutPool } from '$lib/simulation/scouting';
import { getEmbeddedWorldPackIdols } from '$lib/world-pack/loader';
import { getMvpPlayableAgencies, type PlayableAgency } from '$lib/simulation/agency-catalog';

function stubIdol(partial: Partial<IdolCore> & Pick<IdolCore, 'id' | 'nameRomaji'>): IdolCore {
	const defaults: Omit<IdolCore, 'id' | 'nameRomaji'> = {
		nameJp: partial.nameRomaji,
		age: 19,
		gender: 'female',
		potential: 55,
		visible: {
			vocal: 52,
			dance: 48,
			acting: 45,
			variety: 50,
			visual: 58,
			charisma: 55,
			communication: 50,
			aura: 47,
			stamina: 55,
			discipline: 52,
			mentality: 50,
			adaptability: 48
		},
		hidden: {
			consistency: 12,
			ambition: 11,
			loyalty: 13,
			temperament: 10,
			personalLife: 8
		},
		activityState: 'active',
		personalityLabelKey: 'personality.balanced',
		visualSeed: 1,
		regionId: 'tokyo'
	};
	return {
		...defaults,
		...partial,
		id: partial.id,
		nameRomaji: partial.nameRomaji,
		nameJp: partial.nameJp ?? partial.nameRomaji
	};
}

export function createInitialGame(seed = 42_001): GameStateV1 {
	const agencyId = 'player_agency';
	const week0 = 1;
	const rosterCore: IdolCore[] = [
		stubIdol({
			id: 'idol_01',
			nameRomaji: 'Hoshino Airi',
			potential: 62,
			visible: {
				vocal: 58,
				dance: 52,
				acting: 48,
				variety: 55,
				visual: 60,
				charisma: 56,
				communication: 54,
				aura: 50,
				stamina: 58,
				discipline: 55,
				mentality: 52,
				adaptability: 50
			}
		}),
		stubIdol({
			id: 'idol_02',
			nameRomaji: 'Yamada Ren',
			gender: 'male',
			potential: 48,
			activityState: 'training'
		})
	];
	const marketCore: IdolCore[] = [
		stubIdol({
			id: 'mkt_01',
			nameRomaji: 'Sato Miu',
			potential: 58
		}),
		stubIdol({
			id: 'mkt_02',
			nameRomaji: 'Kondo Leo',
			gender: 'male',
			potential: 44
		})
	];

	const clauses = defaultContractClauses(85_000);
	const contracts = rosterCore.map((c, i) =>
		createContract(c.id, week0, { ...clauses, salaryYenPerMonth: 85_000 + i * 10_000 })
	);

	const idols = rosterCore.map((c, i) => {
		const rt = idolCoreToRuntime(c, agencyId);
		rt.contractId = contracts[i]!.id;
		return rt;
	});

	const jobBoard = generateJobBoard('small', week0, seed);
	const assignedJobs = [
		{ jobId: jobBoard[0]!.id, idolId: 'idol_01' },
		{ jobId: jobBoard[1]!.id, idolId: 'idol_02' }
	];

	const base: GameStateV1 = {
		version: 1,
		seed,
		agencyId,
		agencyName: 'Star Idol Agency',
		agencyTier: 'small',
		balanceYen: 2_500_000,
		absoluteWeek: week0,
		idols,
		marketIdols: marketCore,
		jobBoard,
		contracts,
		assignedJobs,
		rivals: [
			{ id: 'rival_1', name: 'Crimson Stage Pro', tier: 'medium', budgetYen: 8_000_000 },
			{ id: 'rival_2', name: 'Neon Dreams LLC', tier: 'small', budgetYen: 3_200_000 }
		],
		lastWeekLog: null,
		ledger: [],
		worldPackId: 'embedded_default',
		startingRegionId: 'tokyo',
		jobHistory: [],
		postMortems: [],
		headlines: [],
		alerts: [],
		agencyMood: 'neutral',
		pendingActions: [],
		agencyStrategy: defaultAgencyStrategy(),
		staffMembers: [
			{
				id: 'stf_pr_1',
				roleKey: 'pr_manager',
				name: 'Mori Yukie',
				skill: 62,
				dedication: 72,
				charisma: 55,
				experience: 48
			}
		],
		producerProfile: {
			name: 'Producer',
			sex: 'other' as const,
			birthday: { month: 1, day: 1 },
			managementTraits: ['pragmatic', 'cautious'] as [ManagementTraitId, ManagementTraitId]
		},
		messages: [],
		newsHistory: [],
		scoutPool: initScoutPool(seed),
		activeScoutMissions: [],
		scoutReports: [],
		reserveIdolPool: [],
		liveSim: { status: 'idle' as const, currentDay: 0, dayResults: [], speed: 1 as const }
	};
	return { ...base, pendingActions: buildPendingActions(base) };
}

export type NewGameOptions = {
	/** P5-10 / P1-14: mercado inicial a partir do pack embutido (dev). */
	worldPack?: 'default' | 'embedded_sample';
	/** Região inicial (afeta `startingRegionId` e `regionId` dos cores). */
	startingRegionId?: string;
	/** #50: perfil do produtor criado no wizard de novo jogo. */
	producerProfile?: ProducerProfile;
	/** Agência selecionada no wizard (id de PlayableAgency). */
	selectedAgencyId?: string;
};

function applyStartingRegion(s: GameStateV1, regionId: string): GameStateV1 {
	return {
		...s,
		startingRegionId: regionId,
		idols: s.idols.map((i) => ({ ...i, regionId })),
		marketIdols: s.marketIdols.map((c) => ({ ...c, regionId }))
	};
}

function buildRivalsFromAgencies(
	allAgencies: PlayableAgency[],
	selectedId: string,
	seed: number
): RivalAgencyStub[] {
	const unselected = allAgencies.filter((a) => a.id !== selectedId);
	const rivals: RivalAgencyStub[] = unselected.map((a) => ({
		id: a.id,
		name: a.name,
		tier: a.tier,
		budgetYen: a.startingBudget
	}));
	rivals.push({
		id: `rival_gen_${seed}`,
		name: 'Rising Talent Pro',
		tier: 'small',
		budgetYen: 1_800_000
	});
	return rivals;
}

function distributeWorldPackIdols(
	allIdols: IdolCore[],
	agency: PlayableAgency,
	rivals: RivalAgencyStub[],
	agencyId: string,
	week: number
): {
	rosterIdols: import('$lib/types/simulation').IdolRuntime[];
	contracts: import('$lib/types/simulation').ActiveContract[];
	marketIdols: IdolCore[];
	reserveIdolPool: IdolCore[];
} {
	const sorted = [...allIdols].sort((a, b) => b.potential - a.potential);

	const rosterCores = sorted.splice(0, agency.rosterSize);

	const marketCount = Math.min(12, sorted.length);
	const marketIdols = sorted.splice(0, marketCount);

	const idolsPerRival = Math.min(3, Math.floor(sorted.length / rivals.length) || 1);
	const _rivalAllocated = sorted.splice(0, idolsPerRival * rivals.length);

	const reserveIdolPool = sorted;

	const clauses = defaultContractClauses(85_000);
	const contracts = rosterCores.map((c, i) =>
		createContract(c.id, week, { ...clauses, salaryYenPerMonth: 85_000 + i * 10_000 })
	);

	const rosterIdols = rosterCores.map((c, i) => {
		const rt = idolCoreToRuntime(c, agencyId);
		rt.contractId = contracts[i]!.id;
		return rt;
	});

	return { rosterIdols, contracts, marketIdols, reserveIdolPool };
}

const TRAIT_LABELS: Record<ManagementTraitId, string> = {
	aggressive: 'agressiva',
	cautious: 'cautelosa',
	visionary: 'visionária',
	pragmatic: 'pragmática',
	charismatic: 'carismática'
};

function newsOutletForTier(tier: AgencyEconomyTier): string {
	switch (tier) {
		case 'garage':
		case 'small':
			return 'Idol Underground';
		case 'medium':
			return 'Entertainment Weekly JP';
		case 'large':
		case 'elite':
			return 'Nikkei Entertainment';
	}
}

function injectWelcomeItems(state: GameStateV1): GameStateV1 {
	const { agencyName, producerProfile, agencyTier } = state;
	const outlet = newsOutletForTier(agencyTier);
	const traitLabel = TRAIT_LABELS[producerProfile.managementTraits[0]] ?? 'equilibrada';

	const welcomeNews: NewsItem = {
		id: 'news_welcome_1',
		week: 1,
		text: `[${outlet}] ${agencyName} acaba de anunciar a contratação de um novo produtor. "${producerProfile.name} chega com uma visão ${traitLabel} para levar a agência a novos patamares," disse um porta-voz.`,
		category: 'milestone',
		importance: 100
	};

	const welcomeMsg: GameMessage = {
		id: 'msg_welcome_1',
		week: 1,
		day: 0,
		from: 'staff_admin',
		subject: `Bem-vindo à ${agencyName}!`,
		body: `Parabéns por assumir o cargo de produtor! Sua equipe está pronta. Comece atribuindo jobs na tela de Operações.`,
		category: 'info',
		read: false,
		actionUrl: '/operacoes'
	};

	return {
		...state,
		newsHistory: [welcomeNews, ...state.newsHistory],
		messages: [welcomeMsg, ...state.messages]
	};
}

/** P5-10: novo jogo com nome da agência e seed opcional. */
export function createNewGameState(
	agencyName: string,
	seed?: number,
	opts?: NewGameOptions
): GameStateV1 {
	const resolvedSeed = seed ?? (Math.floor(Math.random() * 0xfffffff) || 42_001);

	if (opts?.selectedAgencyId) {
		const allAgencies = getMvpPlayableAgencies();
		const agency = allAgencies.find((a) => a.id === opts.selectedAgencyId);
		if (agency) {
			return createGameFromAgency(agencyName, resolvedSeed, agency, allAgencies, opts);
		}
	}

	const s = createInitialGame(resolvedSeed);
	let next: GameStateV1 = { ...s, agencyName };
	if (opts?.worldPack === 'embedded_sample') {
		const marketIdols = getEmbeddedWorldPackIdols();
		next = { ...next, marketIdols, worldPackId: 'embedded_sample' };
	}
	if (opts?.startingRegionId && opts.startingRegionId.trim()) {
		next = applyStartingRegion(next, opts.startingRegionId.trim());
	}
	if (opts?.producerProfile) {
		next = { ...next, producerProfile: opts.producerProfile };
	}
	const withPending = { ...next, pendingActions: buildPendingActions(next) };
	return injectWelcomeItems(withPending);
}

function createGameFromAgency(
	agencyName: string,
	seed: number,
	agency: PlayableAgency,
	allAgencies: PlayableAgency[],
	opts: NewGameOptions
): GameStateV1 {
	const agencyId = 'player_agency';
	const week0 = 1;
	const rivals = buildRivalsFromAgencies(allAgencies, agency.id, seed);
	const allIdols = getEmbeddedWorldPackIdols();

	const { rosterIdols, contracts, marketIdols, reserveIdolPool } = distributeWorldPackIdols(
		allIdols,
		agency,
		rivals,
		agencyId,
		week0
	);

	const jobBoard = generateJobBoard(agency.tier, week0, seed);
	const assignedJobs =
		rosterIdols.length >= 2 && jobBoard.length >= 2
			? [
					{ jobId: jobBoard[0]!.id, idolId: rosterIdols[0]!.id },
					{ jobId: jobBoard[1]!.id, idolId: rosterIdols[1]!.id }
				]
			: rosterIdols.length >= 1 && jobBoard.length >= 1
				? [{ jobId: jobBoard[0]!.id, idolId: rosterIdols[0]!.id }]
				: [];

	const base: GameStateV1 = {
		version: 1,
		seed,
		agencyId,
		agencyName,
		agencyTier: agency.tier,
		balanceYen: agency.startingBudget,
		absoluteWeek: week0,
		idols: rosterIdols,
		marketIdols,
		jobBoard,
		contracts,
		assignedJobs,
		rivals,
		lastWeekLog: null,
		ledger: [],
		worldPackId: 'embedded_sample',
		startingRegionId: agency.regionId,
		jobHistory: [],
		postMortems: [],
		headlines: [],
		alerts: [],
		agencyMood: 'neutral',
		pendingActions: [],
		agencyStrategy: defaultAgencyStrategy(),
		staffMembers: [
			{
				id: 'stf_pr_1',
				roleKey: 'pr_manager',
				name: 'Mori Yukie',
				skill: 62,
				dedication: 72,
				charisma: 55,
				experience: 48
			}
		],
		producerProfile: opts.producerProfile ?? {
			name: 'Producer',
			sex: 'other' as const,
			birthday: { month: 1, day: 1 },
			managementTraits: ['pragmatic', 'cautious'] as [ManagementTraitId, ManagementTraitId]
		},
		messages: [],
		newsHistory: [],
		scoutPool: initScoutPool(seed),
		activeScoutMissions: [],
		scoutReports: [],
		reserveIdolPool,
		liveSim: { status: 'idle' as const, currentDay: 0, dayResults: [], speed: 1 as const }
	};

	const withPending = { ...base, pendingActions: buildPendingActions(base) };
	return injectWelcomeItems(withPending);
}
