import {
	runWeekPipeline,
	runDayStep,
	runPreWeekSetup,
	runPostWeekFinalize
} from '$lib/simulation/week-pipeline';
import type { DayResult, GameEvent, GameStateV1 } from '$lib/types/simulation';

type WorkerInMessage =
	| { type: 'run-week'; state: GameStateV1 }
	| { type: 'start-live'; state: GameStateV1 }
	| { type: 'resume-live' }
	| { type: 'pause-live' }
	| { type: 'set-speed'; speed: 1 | 2 | 4 }
	| { type: 'update-assignments'; assignments: { jobId: string; idolId: string }[] };

type WorkerOutMessage =
	| { type: 'week-complete'; state: GameStateV1 }
	| { type: 'day-complete'; dayIndex: number; dayResult: DayResult; state: GameStateV1 }
	| { type: 'week-complete-live'; state: GameStateV1 }
	| { type: 'paused'; dayIndex: number }
	| { type: 'urgent-event'; event: GameEvent; dayIndex: number };

let liveState: GameStateV1 | null = null;
let liveDay = 0;
let liveDayResults: DayResult[] = [];
let paused = false;
let speed: 1 | 2 | 4 = 1;
let pendingTimeout: ReturnType<typeof setTimeout> | null = null;

function post(msg: WorkerOutMessage) {
	postMessage(msg);
}

function delayForSpeed(): number {
	return Math.round(1200 / speed);
}

function processNextDay() {
	if (!liveState || paused) return;

	if (liveDay > 6) {
		const final = runPostWeekFinalize(liveState, liveDayResults);
		post({ type: 'week-complete-live', state: final });
		liveState = null;
		return;
	}

	const { nextState, dayResult } = runDayStep(liveState, liveDay);
	liveState = nextState;
	liveDayResults.push(dayResult);

	const urgentEvents = dayResult.events.filter(
		(e) => e.severity === 'moderate' || e.severity === 'major'
	);
	for (const evt of urgentEvents) {
		post({ type: 'urgent-event', event: evt, dayIndex: liveDay });
	}

	const hasUrgentMessages = dayResult.messages.some((m) => m.category === 'urgent');
	if (urgentEvents.length > 0 || hasUrgentMessages) {
		paused = true;
		post({ type: 'day-complete', dayIndex: liveDay, dayResult, state: liveState });
		post({ type: 'paused', dayIndex: liveDay });
		liveDay++;
		return;
	}

	post({ type: 'day-complete', dayIndex: liveDay, dayResult, state: liveState });
	liveDay++;

	pendingTimeout = setTimeout(processNextDay, delayForSpeed());
}

self.onmessage = (e: MessageEvent<WorkerInMessage>) => {
	const msg = e.data;

	switch (msg.type) {
		case 'run-week': {
			const next = runWeekPipeline(msg.state);
			post({ type: 'week-complete', state: next });
			break;
		}

		case 'start-live': {
			if (pendingTimeout) clearTimeout(pendingTimeout);
			liveState = runPreWeekSetup(msg.state);
			liveDay = 0;
			liveDayResults = [];
			paused = false;
			processNextDay();
			break;
		}

		case 'resume-live': {
			paused = false;
			processNextDay();
			break;
		}

		case 'pause-live': {
			paused = true;
			if (pendingTimeout) {
				clearTimeout(pendingTimeout);
				pendingTimeout = null;
			}
			post({ type: 'paused', dayIndex: liveDay });
			break;
		}

		case 'set-speed': {
			speed = msg.speed;
			break;
		}

		case 'update-assignments': {
			if (liveState && paused) {
				liveState = { ...liveState, assignedJobs: msg.assignments };
			}
			break;
		}
	}
};

export {};
