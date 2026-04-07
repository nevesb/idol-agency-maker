import { browser } from '$app/environment';
import { get, writable } from 'svelte/store';
import {
	createInitialGame,
	createNewGameState,
	type NewGameOptions
} from '$lib/simulation/initial-state';
import type { AgencyStrategyV1, DayResult, GameEvent, LiveSimState, ProducerProfile } from '$lib/types/simulation';
import { hireStaffOffer } from '$lib/simulation/staff-hiring';
import { hireMarketIdol, runWeekPipeline } from '$lib/simulation/week-pipeline';
import { startMission, signDiscoveredIdol, type ScoutingPipeline } from '$lib/simulation/scouting';
import { canAssignJob } from '$lib/simulation/schedule-contract';
import { idbPutSave, saveSlotKey } from '$lib/persistence/idb';
import { buildSaveEnvelope, stringifySaveEnvelope } from '$lib/persistence/serialize';
import {
	cloudUpsertSave,
	fetchSubscriptionTier
} from '$lib/persistence/supabase-save';
import { buildPendingActions } from '$lib/simulation/pending-actions';
import { canUseSlot } from '$lib/persistence/slots';
import { getSupabaseBrowser } from '$lib/supabase/browser-client';
import type { IdolCore } from '$lib/types/game';
import type { GameStateV1 } from '$lib/types/simulation';
import { authUser } from './auth-session';
import { currentSaveSlot } from './save-slot';
import { absoluteWeek, timeMode } from './time-control';

export const gameState = writable<GameStateV1>(createInitialGame());

let persistenceHydrated = false;
let idbTimer: ReturnType<typeof setTimeout> | null = null;

export function markPersistenceHydrated(): void {
	persistenceHydrated = true;
}

absoluteWeek.set(get(gameState).absoluteWeek);
gameState.subscribe((s) => absoluteWeek.set(s.absoluteWeek));

function scheduleIdbPersist(): void {
	if (!browser || !persistenceHydrated) return;
	if (idbTimer) clearTimeout(idbTimer);
	idbTimer = setTimeout(() => {
		idbTimer = null;
		void writeCurrentToIdb();
	}, 900);
}

gameState.subscribe(() => scheduleIdbPersist());

async function writeCurrentToIdb(): Promise<void> {
	const g = get(gameState);
	const slot = get(currentSaveSlot);
	const env = buildSaveEnvelope(g, slot);
	try {
		await idbPutSave(saveSlotKey(slot), stringifySaveEnvelope(env));
	} catch (e) {
		console.warn('[save] IndexedDB failed', e);
	}
}

async function autoSaveCloudAfterWeek(): Promise<void> {
	const client = getSupabaseBrowser();
	const user = get(authUser);
	if (!client || !user) return;
	try {
		const tier = await fetchSubscriptionTier(client, user.id);
		const slot = get(currentSaveSlot);
		if (!canUseSlot(tier, slot)) return;
		const g = get(gameState);
		const env = buildSaveEnvelope(g, slot);
		const { error } = await cloudUpsertSave(client, user.id, slot, g.agencyName, env);
		if (error) console.warn('[save] cloud auto-save', error.message);
	} catch (e) {
		console.warn('[save] cloud auto-save', e);
	}
}

export function replaceGameState(next: GameStateV1): void {
	gameState.set(next);
	absoluteWeek.set(next.absoluteWeek);
}

/** P5-10: reinicia campanha. */
export function startNewGame(
	agencyName: string,
	seed?: number,
	opts?: NewGameOptions,
	producerProfile?: ProducerProfile
): void {
	const merged: NewGameOptions = { ...opts, ...(producerProfile ? { producerProfile } : {}) };
	replaceGameState(createNewGameState(agencyName.trim() || 'Star Idol Agency', seed, merged));
}

export function advanceGameWeekSync(): void {
	gameState.update((s) => runWeekPipeline(s));
	void writeCurrentToIdb();
	void autoSaveCloudAfterWeek();
}

/** Mesmo fluxo do botão “Saltar semana” (atalho Ctrl/Cmd+Enter). */
export async function advanceWeekUiFlow(): Promise<void> {
	timeMode.set('skip');
	try {
		await advanceGameWeekWithWorker();
	} catch {
		advanceGameWeekSync();
	}
	timeMode.set('pause');
}

/** Web Worker quando disponível; caso contrário pipeline síncrono. */
export function advanceGameWeekWithWorker(): Promise<void> {
	const current = get(gameState);
	return new Promise((resolve, reject) => {
		if (typeof Worker === 'undefined') {
			gameState.set(runWeekPipeline(current));
			void writeCurrentToIdb();
			void autoSaveCloudAfterWeek();
			resolve();
			return;
		}
		const worker = new Worker(new URL('../workers/week-sim.worker.ts', import.meta.url), {
			type: 'module'
		});
		worker.onmessage = (e: MessageEvent<{ type: string; state: GameStateV1 }>) => {
			if (e.data.type === 'week-complete') {
				gameState.set(e.data.state);
				void writeCurrentToIdb();
				void autoSaveCloudAfterWeek();
				worker.terminate();
				resolve();
			}
		};
		worker.onerror = (err) => {
			worker.terminate();
			reject(err);
		};
		worker.postMessage({ type: 'run-week', state: current });
	});
}

// --- Live sim (day-by-day) ---

let liveWorker: Worker | null = null;

function ensureLiveWorker(): Worker {
	if (liveWorker) return liveWorker;
	liveWorker = new Worker(new URL('../workers/week-sim.worker.ts', import.meta.url), {
		type: 'module'
	});
	liveWorker.onmessage = handleLiveWorkerMessage;
	liveWorker.onerror = () => {
		terminateLiveWorker();
	};
	return liveWorker;
}

function terminateLiveWorker(): void {
	if (liveWorker) {
		liveWorker.terminate();
		liveWorker = null;
	}
}

function handleLiveWorkerMessage(
	e: MessageEvent<{
		type: string;
		state?: GameStateV1;
		dayIndex?: number;
		dayResult?: DayResult;
		event?: GameEvent;
	}>
): void {
	const msg = e.data;

	switch (msg.type) {
		case 'day-complete': {
			if (msg.state && msg.dayResult != null && msg.dayIndex != null) {
				gameState.set(msg.state);
				gameState.update((s) => ({
					...s,
					liveSim: {
						...s.liveSim,
						status: 'day_complete',
						currentDay: msg.dayIndex! + 1,
						dayResults: [...s.liveSim.dayResults, msg.dayResult!]
					}
				}));
			}
			break;
		}

		case 'paused': {
			gameState.update((s) => ({
				...s,
				liveSim: { ...s.liveSim, status: 'paused' }
			}));
			timeMode.set('pause');
			break;
		}

		case 'urgent-event': {
			break;
		}

		case 'week-complete-live': {
			if (msg.state) {
				gameState.set({
					...msg.state,
					liveSim: { ...msg.state.liveSim, status: 'week_complete' }
				});
				void writeCurrentToIdb();
				void autoSaveCloudAfterWeek();
			}
			timeMode.set('pause');
			terminateLiveWorker();
			break;
		}
	}
}

export function startLiveWeek(): void {
	const current = get(gameState);
	if (typeof Worker === 'undefined') {
		advanceGameWeekSync();
		return;
	}

	gameState.update((s) => ({
		...s,
		liveSim: { status: 'running', currentDay: 0, dayResults: [], speed: s.liveSim.speed }
	}));
	timeMode.set('live');

	const worker = ensureLiveWorker();
	worker.postMessage({ type: 'start-live', state: current });
}

export function pauseLiveSim(): void {
	gameState.update((s) => ({
		...s,
		liveSim: { ...s.liveSim, status: 'paused' }
	}));
	timeMode.set('pause');
	liveWorker?.postMessage({ type: 'pause-live' });
}

export function resumeLiveSim(): void {
	gameState.update((s) => ({
		...s,
		liveSim: { ...s.liveSim, status: 'running' }
	}));
	timeMode.set('live');
	liveWorker?.postMessage({ type: 'resume-live' });
}

export function setSimSpeed(speed: 1 | 2 | 4): void {
	gameState.update((s) => ({
		...s,
		liveSim: { ...s.liveSim, speed }
	}));
	liveWorker?.postMessage({ type: 'set-speed', speed });
}

export function hireFromMarket(marketIdolId: string): void {
	gameState.update((s) => hireMarketIdol(s, marketIdolId));
}

/** P3-23 MVP — contrata staff a partir da oferta da semana. */
export function hireStaffFromOffer(offerId: string): void {
	gameState.update((s) => hireStaffOffer(s, offerId));
}

/** P1-14: substitui o pool do mercado (ex.: JSON importado). */
export function replaceMarketIdols(idols: IdolCore[]): void {
	gameState.update((s) => {
		const next = { ...s, marketIdols: idols };
		return { ...next, pendingActions: buildPendingActions(next) };
	});
}

/** Escala uma idol a um job do board atual (substitui escalação anterior do mesmo job). */
export function assignJob(jobId: string, idolId: string): void {
	gameState.update((s) => {
		const chk = canAssignJob(s, jobId, idolId);
		if (!chk.ok) return s;
		const rest = s.assignedJobs.filter((a) => a.jobId !== jobId);
		return { ...s, assignedJobs: [...rest, { jobId, idolId }] };
	});
}

export function setAgencyStrategy(patch: Partial<AgencyStrategyV1>): void {
	gameState.update((s) => ({
		...s,
		agencyStrategy: { ...s.agencyStrategy, ...patch }
	}));
}

export function startScoutMission(pipeline: ScoutingPipeline, scoutId: string, regionId: string): void {
	gameState.update((s) => startMission(s, pipeline, scoutId, regionId));
}

export function signScoutedIdol(reportId: string, idolId: string): void {
	gameState.update((s) => signDiscoveredIdol(s, reportId, idolId));
}

export function unassignJob(jobId: string): void {
	gameState.update((s) => ({
		...s,
		assignedJobs: s.assignedJobs.filter((a) => a.jobId !== jobId)
	}));
}

export function markMessageRead(messageId: string): void {
	gameState.update((s) => ({
		...s,
		messages: s.messages.map((m) => (m.id === messageId ? { ...m, read: true } : m))
	}));
}

export function markAllMessagesRead(): void {
	gameState.update((s) => ({
		...s,
		messages: s.messages.map((m) => ({ ...m, read: true }))
	}));
}

export function renewContractAction(idolId: string): void {
	gameState.update((s) => {
		const idol = s.idols.find((i) => i.id === idolId);
		if (!idol?.contractId) return s;
		const contract = s.contracts.find((c) => c.id === idol.contractId);
		if (!contract || contract.status !== 'active') return s;
		const weeksPerMonth = 4;
		const newExpires = s.absoluteWeek + contract.clauses.durationMonths * weeksPerMonth;
		const updatedContracts = s.contracts.map((c) =>
			c.id === contract.id ? { ...c, expiresWeek: newExpires } : c
		);
		const next = { ...s, contracts: updatedContracts };
		return { ...next, pendingActions: buildPendingActions(next) };
	});
}

export function terminateContractAction(idolId: string): void {
	gameState.update((s) => {
		const idol = s.idols.find((i) => i.id === idolId);
		if (!idol?.contractId) return s;
		const contract = s.contracts.find((c) => c.id === idol.contractId);
		if (!contract) return s;
		const fee = contract.clauses.terminationFeeYen;
		const core: IdolCore = {
			id: idol.id,
			nameRomaji: idol.nameRomaji,
			nameJp: idol.nameJp ?? idol.nameRomaji,
			age: idol.age,
			gender: idol.gender,
			potential: idol.potential,
			visible: idol.visible,
			hidden: idol.hidden,
			activityState: 'active',
			personalityLabelKey: idol.personalityLabelKey,
			visualSeed: idol.visualSeed,
			regionId: idol.regionId
		};
		const next: GameStateV1 = {
			...s,
			balanceYen: s.balanceYen - fee,
			idols: s.idols.filter((i) => i.id !== idolId),
			marketIdols: [...s.marketIdols, core],
			contracts: s.contracts.map((c) =>
				c.id === contract.id ? { ...c, status: 'terminated' as const } : c
			),
			ledger: [
				...s.ledger,
				{
					week: s.absoluteWeek,
					kind: 'termination_fee',
					amountYen: -fee,
					note: `Terminated contract with ${idol.nameRomaji}`
				}
			]
		};
		return { ...next, pendingActions: buildPendingActions(next) };
	});
}

/** Guarda imediato local + nuvem (manual). */
export async function saveGameNow(): Promise<{ ok: boolean; message: string }> {
	await writeCurrentToIdb();
	const client = getSupabaseBrowser();
	const user = get(authUser);
	if (!client || !user) {
		return { ok: true, message: 'local_only' };
	}
	const tier = await fetchSubscriptionTier(client, user.id);
	const slot = get(currentSaveSlot);
	if (!canUseSlot(tier, slot)) {
		return { ok: false, message: 'slot_not_allowed' };
	}
	const g = get(gameState);
	const env = buildSaveEnvelope(g, slot);
	const { error } = await cloudUpsertSave(client, user.id, slot, g.agencyName, env);
	if (error) return { ok: false, message: error.message };
	return { ok: true, message: 'cloud_ok' };
}
