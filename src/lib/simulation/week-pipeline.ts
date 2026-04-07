import type {
	DayResult,
	GameEvent,
	GameEventType,
	GameMessage,
	GameStateV1,
	JobHistoryEntry,
	JobPosting,
	JobResultLog,
	NewsItem,
	WeekPhaseLog,
	WellnessState
} from '$lib/types/simulation';
import {
	weeklyUpkeepYen,
	weeklySalaryFromMonthly,
	weeklyMerchRevenue,
	weeklyFacilityCost,
	weeklyScoutingCost,
	evaluateTierChange,
	applyFameDecay
} from '$lib/simulation/economy';
import { resolveAssignedJob } from '$lib/simulation/jobs';
import { tickWellnessWeekly, tickWellnessDaily } from '$lib/simulation/wellness';
import { createContract, defaultContractClauses } from '$lib/simulation/contract';
import { expireContracts, resolveActivityState, applyWellnessTriggers } from '$lib/simulation/contract-negotiation';
import { estimateBuyoutYen, idolCoreToRuntime } from '$lib/simulation/market';
import { generateJobBoard } from '$lib/simulation/job-board-gen';
import { buildPostMortem, gradeLetterFromPerformance } from '$lib/simulation/post-mortem';
import { computeAgencyMood, computeWeeklyAlerts } from '$lib/simulation/intelligence-alerts';
import { headlinesFromJobResults } from '$lib/simulation/week-headlines';
import { buildPendingActions } from '$lib/simulation/pending-actions';
import { jobPerformanceStrategyMultiplier } from '$lib/simulation/agency-strategy';
import { tickRivalWeek } from '$lib/simulation/rival-tick';
import { applyWeeklyIdolStatTick } from '$lib/simulation/weekly-stat-tick';
import { tickScoutingWeekly } from '$lib/simulation/scouting';
import { mulberry32 } from '$lib/simulation/rng';
import { generateDailyNews } from '$lib/simulation/news-feed';
import { generateDayMessages, generateWeeklyMessages } from '$lib/simulation/messages';

function jobById(board: JobPosting[], id: string): JobPosting | undefined {
	return board.find((j) => j.id === id);
}

function activeContractFor(
	idol: { contractId: string | null },
	contracts: GameStateV1['contracts']
) {
	if (!idol.contractId) return undefined;
	return contracts.find((c) => c.id === idol.contractId && c.status === 'active');
}

const DAY_EVENT_TYPES: GameEventType[] = [
	'scandal_personal',
	'injury',
	'viral_moment',
	'fan_conflict',
	'media_praise',
	'charity_event'
];

const DAY_NAMES = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

/**
 * Process a single day of the week (Live mode building block).
 * Jobs with scheduledDay === dayIndex are resolved; idle idols get rest recovery.
 */
export function runDayStep(
	state: GameStateV1,
	dayIndex: number
): { nextState: GameStateV1; dayResult: DayResult } {
	const nextWeek = state.absoluteWeek;
	let balance = state.balanceYen;
	const ledger = [...state.ledger];
	const idols = state.idols.map((idol) => ({ ...idol }));
	const idolMap = new Map(idols.map((i) => [i.id, i]));
	const assignments = state.assignedJobs;
	const jobResults: JobResultLog[] = [];
	const events: GameEvent[] = [];
	const newsItems: NewsItem[] = [];
	const messages: GameMessage[] = [];
	const idolUpdates: { idolId: string; wellness: WellnessState }[] = [];
	const newHistory: JobHistoryEntry[] = [];
	const newPostMortems = [...state.postMortems];

	const rng = mulberry32((state.seed ^ (nextWeek * 7 + dayIndex)) >>> 0);

	const todayJobs = assignments.filter((a) => {
		const job = jobById(state.jobBoard, a.jobId);
		return job && job.scheduledDay === dayIndex;
	});

	const workedToday = new Set<string>();

	for (const a of todayJobs) {
		const idol = idolMap.get(a.idolId);
		const job = jobById(state.jobBoard, a.jobId);
		if (!idol || !job) continue;

		if (idol.activityState === 'burnout' || idol.activityState === 'crisis') continue;

		const stratMult = jobPerformanceStrategyMultiplier(state.agencyStrategy, job.category);
		const log = resolveAssignedJob({
			idol,
			job,
			gameSeed: state.seed,
			absoluteWeek: nextWeek,
			strategyMultiplier: stratMult
		});
		jobResults.push(log);
		workedToday.add(idol.id);

		const grade = gradeLetterFromPerformance(log.performance);
		newHistory.push({
			week: nextWeek,
			jobId: job.id,
			jobName: job.name,
			idolId: idol.id,
			idolNameRomaji: idol.nameRomaji,
			outcome: log.outcome,
			performance: log.performance,
			revenueYen: log.revenueYen,
			fameDelta: log.fameDelta,
			gradeLetter: grade
		});

		const pm = buildPostMortem({
			week: nextWeek,
			job,
			idol,
			performance: log.performance,
			outcome: log.outcome
		});
		newPostMortems.push(pm);

		const share = activeContractFor(idol, state.contracts)?.clauses.revenueSharePercent ?? 30;
		const agencyCut = Math.round(log.revenueYen * (1 - share / 100));
		balance += agencyCut;
		ledger.push({
			week: nextWeek,
			kind: 'job_revenue',
			amountYen: agencyCut,
			note: `Job ${job.name} (${log.outcome})`
		});

		idol.famePoints = Math.max(0, Math.round(idol.famePoints + log.fameDelta));
		const overwork = assignments.filter((x) => x.idolId === idol.id).length >= 3;
		idol.wellness = tickWellnessDaily(idol.wellness, {
			overwork,
			jobOutcome: log.outcome
		});
	}

	for (let idx = 0; idx < idols.length; idx++) {
		const idol = idols[idx]!;
		if (!workedToday.has(idol.id)) {
			idol.wellness = tickWellnessDaily(idol.wellness, {
				overwork: false,
				jobOutcome: null
			});
		}
		idolUpdates.push({ idolId: idol.id, wellness: { ...idol.wellness } });
	}

	for (const idol of idols) {
		const roll = Math.floor(rng() * 100);
		if (roll < 5) {
			const evtType = DAY_EVENT_TYPES[Math.floor(rng() * DAY_EVENT_TYPES.length)]!;
			events.push({
				id: `evt_d${dayIndex}_${idol.id}`,
				week: nextWeek,
				type: evtType,
				severity: 'minor',
				targetId: idol.id,
				description: `Evento ${evtType} para ${idol.nameRomaji} em ${DAY_NAMES[dayIndex]}`,
				consequences: {}
			});
		}
	}

	const intermediateState: GameStateV1 = {
		...state,
		balanceYen: balance,
		idols,
		ledger,
		postMortems: newPostMortems,
		jobHistory: [...state.jobHistory, ...newHistory]
	};

	const partialDayResult: DayResult = {
		dayIndex,
		jobResults,
		events,
		newsItems: [],
		messages: [],
		idolUpdates
	};

	newsItems.push(...generateDailyNews(intermediateState, nextWeek, dayIndex, jobResults, state.seed));
	messages.push(...generateDayMessages(intermediateState, dayIndex, partialDayResult));

	const dayResult: DayResult = {
		dayIndex,
		jobResults,
		events,
		newsItems,
		messages,
		idolUpdates
	};

	const nextState: GameStateV1 = {
		...intermediateState,
		messages: [...state.messages, ...messages],
		newsHistory: [...state.newsHistory, ...newsItems]
	};

	return { nextState, dayResult };
}

/** Pre-week setup: expire contracts, calculate upkeep, salaries. */
function runPreWeekSetup(state: GameStateV1): GameStateV1 {
	const nextWeek = state.absoluteWeek + 1;
	let balance = state.balanceYen;
	const ledger = [...state.ledger];
	const contracts = expireContracts(state.contracts, nextWeek);

	const upkeep = weeklyUpkeepYen(state.agencyTier);
	balance -= upkeep;
	ledger.push({ week: nextWeek, kind: 'upkeep', amountYen: -upkeep, note: 'Agency upkeep' });

	const facilityCost = weeklyFacilityCost(state.agencyTier);
	if (facilityCost > 0) {
		balance -= facilityCost;
		ledger.push({ week: nextWeek, kind: 'facilities', amountYen: -facilityCost, note: 'Facilities' });
	}

	const scoutingCost = weeklyScoutingCost(state.agencyTier);
	if (scoutingCost > 0) {
		balance -= scoutingCost;
		ledger.push({ week: nextWeek, kind: 'scouting', amountYen: -scoutingCost, note: 'Scouting ops' });
	}

	const idols = state.idols.map((idol) => {
		const ctr = activeContractFor(idol, state.contracts);
		if (ctr) {
			const sal = weeklySalaryFromMonthly(ctr.clauses.salaryYenPerMonth);
			balance -= sal;
			ledger.push({
				week: nextWeek,
				kind: 'salary',
				amountYen: -sal,
				note: `Salary ${idol.nameRomaji}`
			});
		}
		return { ...idol };
	});

	return {
		...state,
		absoluteWeek: nextWeek,
		balanceYen: balance,
		ledger,
		contracts,
		idols
	};
}

/** Post-week finalization: fame decay, tier evaluation, new board, rival tick, alerts, mood. */
function runPostWeekFinalize(
	state: GameStateV1,
	dayResults: DayResult[]
): GameStateV1 {
	const nextWeek = state.absoluteWeek;
	const idols = state.idols.map((i) => ({ ...i }));
	const idolMap = new Map(idols.map((i) => [i.id, i]));
	let balance = state.balanceYen;
	const ledger = [...state.ledger];
	const contracts = state.contracts;

	const allJobResults = dayResults.flatMap((d) => d.jobResults);
	const workedThisWeek = new Set(allJobResults.map((r) => r.idolId));

	for (let idx = 0; idx < idols.length; idx++) {
		const i = idols[idx]!;
		const nextI = applyWeeklyIdolStatTick(i, workedThisWeek.has(i.id));
		idols[idx] = nextI;
		idolMap.set(nextI.id, nextI);
	}

	const avgSalary =
		contracts.filter((c) => c.status === 'active').length > 0
			? Math.round(
					contracts
						.filter((c) => c.status === 'active')
						.reduce((s, c) => s + c.clauses.salaryYenPerMonth, 0) /
						contracts.filter((c) => c.status === 'active').length
				)
			: 80_000;

	let totalMerch = 0;
	for (let idx = 0; idx < idols.length; idx++) {
		let i = idols[idx]!;
		const merch = weeklyMerchRevenue(i);
		if (merch > 0) totalMerch += merch;
		i.famePoints = applyFameDecay(i, workedThisWeek.has(i.id));
		const ctr = i.contractId
			? contracts.find((c) => c.id === i.contractId && c.status === 'active')
			: undefined;
		i = applyWellnessTriggers(i, ctr, avgSalary);
		i = resolveActivityState(i);
		idols[idx] = i;
	}
	if (totalMerch > 0) {
		balance += totalMerch;
		ledger.push({ week: nextWeek, kind: 'merch', amountYen: totalMerch, note: 'Merchandise sales' });
	}

	const notes: string[] = [`Week ${nextWeek} — resolved ${allJobResults.length} job(s).`];

	const successCount = allJobResults.filter((r) => r.outcome === 'success').length;
	const ratio = allJobResults.length ? successCount / allJobResults.length : 0.5;
	const agencyMood = computeAgencyMood(idols, ratio);

	const idolNames = new Map(idols.map((i) => [i.id, i.nameRomaji]));
	const jobNames = new Map(state.jobBoard.map((j) => [j.id, j.name]));
	const jobHeadlines = headlinesFromJobResults(nextWeek, allJobResults, idolNames, jobNames);
	const jobBoard = generateJobBoard(state.agencyTier, nextWeek, state.seed);
	const { rivals, rivalNotes, rivalHeadlines } = tickRivalWeek(state.rivals, state.seed, nextWeek) as {
		rivals: typeof state.rivals;
		rivalNotes: string[];
		rivalHeadlines: typeof state.headlines;
	};
	for (const line of rivalNotes) notes.push(line);

	const combined = [...jobHeadlines, ...rivalHeadlines];
	combined.sort((a, b) => (b.drama ?? 0.25) - (a.drama ?? 0.25));
	const momentPick = combined.slice(0, 5);
	const headlines = [...momentPick, ...state.headlines].slice(0, 15);

	const alerts = computeWeeklyAlerts(
		{ ...state, idols, absoluteWeek: nextWeek },
		balance,
		nextWeek
	);

	const jobHistory = state.jobHistory.slice(-200);
	const postMortems = state.postMortems.slice(-100);

	const newTier = evaluateTierChange({ ...state, absoluteWeek: nextWeek, ledger });
	if (newTier !== state.agencyTier) {
		notes.push(`Agency tier: ${state.agencyTier} → ${newTier}`);
	}

	const weeklyMsgs = generateWeeklyMessages({ ...state, balanceYen: balance, idols, absoluteWeek: nextWeek });
	const messages = [...state.messages, ...weeklyMsgs].slice(-100);
	const newsHistory = state.newsHistory.slice(-50);

	return {
		...state,
		balanceYen: balance,
		agencyTier: newTier,
		idols,
		rivals,
		jobBoard,
		assignedJobs: [],
		lastWeekLog: { phase: 4, notes, jobResults: allJobResults },
		ledger,
		jobHistory,
		postMortems,
		headlines,
		alerts,
		agencyMood,
		messages,
		newsHistory,
		liveSim: { ...state.liveSim, status: 'week_complete' },
		pendingActions: buildPendingActions({
			...state,
			absoluteWeek: nextWeek,
			jobBoard,
			assignedJobs: [],
			idols
		})
	};
}

function rotateMarketPool(state: GameStateV1): GameStateV1 {
	const rng = mulberry32((state.seed ^ (state.absoluteWeek * 31 + 7777)) >>> 0);
	const maxMarket = 18;
	let market = [...state.marketIdols];
	let reserve = [...state.reserveIdolPool];

	const removeCount = Math.min(market.length, 1 + Math.floor(rng() * 2));
	for (let i = 0; i < removeCount && market.length > 0; i++) {
		const idx = Math.floor(rng() * market.length);
		reserve.push(market[idx]!);
		market.splice(idx, 1);
	}

	const addCount = Math.min(reserve.length, 2 + Math.floor(rng() * 2));
	for (let i = 0; i < addCount && reserve.length > 0 && market.length < maxMarket; i++) {
		const idx = Math.floor(rng() * reserve.length);
		market.push(reserve[idx]!);
		reserve.splice(idx, 1);
	}

	return { ...state, marketIdols: market, reserveIdolPool: reserve };
}

/**
 * Pipeline semanal (P3-12–15 condensado):
 * salários + upkeep → resolver jobs dia a dia → post-week → alertas + mood → market rotation.
 * Compõe runDayStep × 7 — Skip mode (tudo de uma vez).
 */
export function runWeekPipeline(state: GameStateV1): GameStateV1 {
	let current = runPreWeekSetup(state);
	const dayResults: DayResult[] = [];

	for (let day = 0; day < 7; day++) {
		const { nextState, dayResult } = runDayStep(current, day);
		current = nextState;
		dayResults.push(dayResult);
	}

	current = tickScoutingWeekly(current);
	current = runPostWeekFinalize(current, dayResults);
	current = rotateMarketPool(current);

	return current;
}

/** Runs pre-week setup, exported for the Live mode worker. */
export { runPreWeekSetup, runPostWeekFinalize };

/** Contratar idol do mercado (MVP) */
export function hireMarketIdol(state: GameStateV1, marketIdolId: string): GameStateV1 {
	const idx = state.marketIdols.findIndex((m) => m.id === marketIdolId);
	if (idx < 0) return state;
	const core = state.marketIdols[idx]!;
	const buyout = estimateBuyoutYen(core);
	if (state.balanceYen < buyout) return state;

	const signedWeek = state.absoluteWeek;
	const clauses = defaultContractClauses(75_000);
	const ctr = createContract(core.id, signedWeek, clauses);
	const runtime = idolCoreToRuntime(core, state.agencyId);
	runtime.contractId = ctr.id;

	const marketIdols = state.marketIdols.filter((_, i) => i !== idx);
	const ledger = [
		...state.ledger,
		{
			week: signedWeek,
			kind: 'signing',
			amountYen: -buyout,
			note: `Signed ${core.nameRomaji}`
		}
	];

	const next: GameStateV1 = {
		...state,
		balanceYen: state.balanceYen - buyout,
		marketIdols,
		idols: [...state.idols, runtime],
		contracts: [...state.contracts, ctr],
		ledger,
		pendingActions: buildPendingActions({
			...state,
			marketIdols,
			idols: [...state.idols, runtime]
		})
	};
	return next;
}
