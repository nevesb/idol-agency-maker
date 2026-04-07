import type { IdolCore, IdolVisibleStats } from './game';

/** Tier operacional da agência (GDD agency-economy) */
export type AgencyEconomyTier = 'garage' | 'small' | 'medium' | 'large' | 'elite';

/** As 9 cláusulas negociáveis (GDD contract-system) */
export interface ContractClauses {
	durationMonths: 6 | 12 | 24;
	salaryYenPerMonth: number;
	revenueSharePercent: number;
	exclusive: boolean;
	maxJobsPerWeek: number;
	imageRights: 'total' | 'partial' | 'restricted';
	terminationFeeYen: number;
	datingRestriction: boolean;
	mandatoryRestDaysPerWeek: number;
}

export type ContractStatus = 'active' | 'negotiating' | 'expired' | 'terminated';

export interface ActiveContract {
	id: string;
	idolId: string;
	clauses: ContractClauses;
	signedWeek: number;
	expiresWeek: number;
	status: ContractStatus;
}

/** 4 barras 0–100 (GDD happiness-wellness) */
export interface WellnessState {
	physical: number;
	happiness: number;
	stress: number;
	motivation: number;
}

export type JobCategory =
	| 'show'
	| 'tv'
	| 'radio'
	| 'recording'
	| 'dubbing'
	| 'photo'
	| 'meet_greet'
	| 'event'
	| 'endorsement'
	| 'streaming'
	| 'composition';

export type FameTierVisual = 'F' | 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS';

/** Job no board (subset da ficha GDD) */
export interface JobPosting {
	id: string;
	category: JobCategory;
	name: string;
	difficulty: number;
	visibility: number;
	paymentYen: number;
	fameGain: number;
	/** Stats visíveis usados no match (chaves de IdolVisibleStats) */
	primaryStats: (keyof IdolVisibleStats)[];
	minFameTier?: FameTierVisual;
	durationDays: number;
	competitive: boolean;
	/** Day of the week this job is scheduled (0=Mon .. 6=Sun) */
	scheduledDay: number;
}

export type JobOutcomeKind = 'success' | 'partial' | 'failure';

export interface JobResultLog {
	jobId: string;
	idolId: string;
	performance: number;
	outcome: JobOutcomeKind;
	revenueYen: number;
	fameDelta: number;
}

export interface IdolRuntime extends IdolCore {
	wellness: WellnessState;
	/** Fama 0–10000 (GDD) */
	famePoints: number;
	contractId: string | null;
	agencyId: string | null;
	weeksInactive: number;
}

export interface RivalAgencyStub {
	id: string;
	name: string;
	tier: AgencyEconomyTier;
	budgetYen: number;
}

export interface WeekPhaseLog {
	phase: 1 | 2 | 3 | 4;
	notes: string[];
	jobResults: JobResultLog[];
}

/** Histórico de jobs concluídos (P4-11, P5-01). */
export interface JobHistoryEntry {
	week: number;
	jobId: string;
	jobName: string;
	idolId: string;
	idolNameRomaji: string;
	outcome: JobOutcomeKind;
	performance: number;
	revenueYen: number;
	fameDelta: number;
	gradeLetter: string;
}

/** P3-06 / P4-22 — pós-mortem por job. */
export interface PostMortemEntry {
	id: string;
	week: number;
	jobId: string;
	idolId: string;
	positives: string[];
	negatives: string[];
	fanReaction: string;
	mediaReaction: string;
	gradeLetter: string;
}

/** P3-17 / P4-04 — manchetes recentes. */
export interface Headline {
	week: number;
	text: string;
	kind: 'job' | 'economy' | 'rival';
	/** P3-17 — peso para seleção de momentos (0–1). */
	drama?: number;
}

export type GameAlertSeverity = 'info' | 'warn' | 'critical';

/** P3-32 / P4-02 — alertas (máx. 3 no portal). */
export interface GameAlert {
	id: string;
	severity: GameAlertSeverity;
	message: string;
	href?: string;
}

export type AgencyMood = 'great' | 'good' | 'neutral' | 'poor' | 'crisis';

/** P3-28 — alavancas de estratégia da agência. */
export type StrategyFocus = 'balanced' | 'commercial' | 'artistic' | 'scouting';
export type AgendaPosture = 'light' | 'normal' | 'packed';
export type ImagePosture = 'safe' | 'edgy' | 'viral';
export type GrowthPosture = 'organic' | 'aggressive';

export interface AgencyStrategyV1 {
	focus: StrategyFocus;
	agendaPosture: AgendaPosture;
	imagePosture: ImagePosture;
	growthPosture: GrowthPosture;
}

/** P3-22: Staff role keys (11 cargos GDD) */
export type StaffRole =
	| 'coach'
	| 'pr_manager'
	| 'choreographer'
	| 'vocal_trainer'
	| 'stylist'
	| 'manager'
	| 'scout'
	| 'producer'
	| 'marketing'
	| 'accountant'
	| 'medic';

/** P3-22: Staff member with 4 attributes */
export interface StaffMemberStub {
	id: string;
	roleKey: StaffRole | string;
	name: string;
	/** Primary skill for their role (0-100) */
	skill: number;
	/** Work ethic / dedication (0-100) */
	dedication: number;
	/** Charisma / people skills (0-100) */
	charisma: number;
	/** Experience level (0-100) */
	experience: number;
	/** Monthly salary */
	salaryYenPerMonth?: number;
}

/** P4-06 — decisões pendentes (MVP: links). */
export interface PendingAction {
	id: string;
	title: string;
	href: string;
}

// --- P6-01..P6-04: Scouting ---

export type ScoutingMissionStatus = 'active' | 'completed' | 'failed';

export interface ScoutingMission {
	id: string;
	scoutId: string;
	regionId: string;
	/** Weeks the mission lasts */
	duration: number;
	/** 0–100 — higher = better chance to find high-potential idols */
	precision: number;
	cost: number;
	status: ScoutingMissionStatus;
}

export interface ScoutNPC {
	id: string;
	name: string;
	regionId: string;
	specialty: string;
	/** Scouting proficiency 0–100 */
	skill: number;
}

// --- P6-05..P6-08: Events ---

export type GameEventType =
	| 'scandal_personal'
	| 'scandal_dating'
	| 'injury'
	| 'viral_moment'
	| 'fan_conflict'
	| 'group_tension'
	| 'media_praise'
	| 'award_nomination'
	| 'collab_opportunity'
	| 'charity_event';

export type GameEventSeverity = 'minor' | 'moderate' | 'major';

export interface GameEvent {
	id: string;
	week: number;
	type: GameEventType;
	severity: GameEventSeverity;
	targetId: string;
	description: string;
	consequences: {
		wellnessDelta?: Partial<WellnessState>;
		fameDelta?: number;
		balanceDelta?: number;
	};
}

// --- P6-09..P6-12: Groups ---

export interface IdolGroup {
	id: string;
	name: string;
	concept: string;
	members: string[];
	leaderId: string;
	/** 0–0.3 synergy bonus applied to group jobs */
	synergy: number;
	colorHex: string;
	disbanded: boolean;
}

// --- P6-13..P6-16: News Feed ---

export type NewsCategoryKey =
	| 'job_result'
	| 'economy'
	| 'rival'
	| 'scandal'
	| 'award'
	| 'milestone'
	| 'system';

export interface NewsItem {
	id: string;
	week: number;
	text: string;
	category: NewsCategoryKey;
	relatedIdolId?: string;
	importance: number;
}

// --- P6-17..P6-19: Finance Report ---

export interface IdolROI {
	idolId: string;
	revenue: number;
	cost: number;
	roi: number;
}

export interface MonthlyReport {
	month: number;
	totalRevenue: number;
	totalExpenses: number;
	netIncome: number;
	roiByIdol: IdolROI[];
	projections: { week: number; projectedBalance: number }[];
}

// --- P6-20..P6-23: Music Charts ---

export interface Song {
	id: string;
	title: string;
	composerId: string;
	producerId: string;
	quality: number;
	releaseWeek: number;
	chartPosition: number;
	royalties: number;
}

// --- P6-26..P6-31: Dev Plans ---

export type DevStage =
	| 'basic'
	| 'intermediate'
	| 'advanced'
	| 'specialized'
	| 'master'
	| 'debut_ready'
	| 'active'
	| 'veteran';

export interface DevPlan {
	idolId: string;
	stage: DevStage;
	startWeek: number;
	targetStats: Partial<IdolVisibleStats>;
	progress: number;
	mentorId?: string;
}

// --- #50: Producer Profile ---

export type ManagementTraitId =
	| 'aggressive'
	| 'cautious'
	| 'visionary'
	| 'pragmatic'
	| 'charismatic';

export interface ProducerProfile {
	name: string;
	sex: 'male' | 'female' | 'other';
	birthday: { month: number; day: number };
	managementTraits: [ManagementTraitId, ManagementTraitId];
}

// --- #51: Messages / Inbox ---

export type MessageCategory = 'task' | 'info' | 'urgent' | 'offer';

export interface GameMessage {
	id: string;
	week: number;
	day: number;
	from: string;
	subject: string;
	body: string;
	category: MessageCategory;
	read: boolean;
	relatedIdolId?: string;
	relatedJobId?: string;
	actionUrl?: string;
}

// --- Live Sim (day-by-day) ---

export interface DayResult {
	dayIndex: number;
	jobResults: JobResultLog[];
	events: GameEvent[];
	newsItems: NewsItem[];
	messages: GameMessage[];
	idolUpdates: { idolId: string; wellness: WellnessState }[];
}

export type LiveSimStatus = 'idle' | 'running' | 'paused' | 'day_complete' | 'week_complete';

export interface LiveSimState {
	status: LiveSimStatus;
	currentDay: number;
	dayResults: DayResult[];
	speed: 1 | 2 | 4;
}

// --- Scouting (expanded for MVP) ---

export interface ScoutReport {
	id: string;
	missionId: string;
	scoutId: string;
	regionId: string;
	week: number;
	discoveredIdols: IdolCore[];
	read: boolean;
}

// --- P6-32..P6-34: Archetypes ---

export type ArchetypeKey =
	| 'center'
	| 'ace'
	| 'visual'
	| 'leader'
	| 'mood_maker'
	| 'rapper'
	| 'dancer'
	| 'vocalist'
	| 'variety'
	| 'mysterious'
	| 'cute'
	| 'cool';

export interface IdolArchetype {
	key: ArchetypeKey;
	diegeticName: string;
	statWeights: Partial<Record<keyof IdolVisibleStats, number>>;
	groupSynergyBonus: number;
}

export interface GameStateV1 {
	version: 1;
	seed: number;
	agencyId: string;
	agencyName: string;
	agencyTier: AgencyEconomyTier;
	balanceYen: number;
	absoluteWeek: number;
	idols: IdolRuntime[];
	marketIdols: IdolCore[];
	jobBoard: JobPosting[];
	contracts: ActiveContract[];
	assignedJobs: { jobId: string; idolId: string }[];
	rivals: RivalAgencyStub[];
	lastWeekLog: WeekPhaseLog | null;
	ledger: { week: number; kind: string; amountYen: number; note: string }[];
	worldPackId: string;
	startingRegionId: string;
	jobHistory: JobHistoryEntry[];
	postMortems: PostMortemEntry[];
	headlines: Headline[];
	alerts: GameAlert[];
	agencyMood: AgencyMood;
	pendingActions: PendingAction[];
	agencyStrategy: AgencyStrategyV1;
	staffMembers: StaffMemberStub[];

	/** #50: Producer profile (created at new game) */
	producerProfile: ProducerProfile;
	/** #51: In-game messages / inbox */
	messages: GameMessage[];
	/** #22: News feed history */
	newsHistory: NewsItem[];
	/** #18: Scouting — available scouts */
	scoutPool: ScoutNPC[];
	/** #18: Scouting — active missions */
	activeScoutMissions: ScoutingMission[];
	/** #18: Scouting — reports ready to read */
	scoutReports: ScoutReport[];
	/** Reserve pool for scouting discovery and market rotation */
	reserveIdolPool: IdolCore[];
	/** Live sim state (day-by-day progression) */
	liveSim: LiveSimState;
}
