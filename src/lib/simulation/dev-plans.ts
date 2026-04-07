import type { DevPlan, DevStage, IdolRuntime } from '$lib/types/simulation';
import type { IdolVisibleStats } from '$lib/types/game';

const STAGE_ORDER: DevStage[] = [
	'basic',
	'intermediate',
	'advanced',
	'specialized',
	'master',
	'debut_ready',
	'active',
	'veteran'
];

const STAGE_PROGRESS_THRESHOLD: Record<DevStage, number> = {
	basic: 100,
	intermediate: 200,
	advanced: 350,
	specialized: 500,
	master: 700,
	debut_ready: 400,
	active: Infinity,
	veteran: Infinity
};

const STAGE_STAT_TARGETS: Record<DevStage, Partial<IdolVisibleStats>> = {
	basic: { vocal: 25, dance: 25, stamina: 30 },
	intermediate: { vocal: 40, dance: 40, charisma: 30, stamina: 40 },
	advanced: { vocal: 55, dance: 55, acting: 40, variety: 35 },
	specialized: { vocal: 70, dance: 70, charisma: 50, aura: 45 },
	master: { vocal: 85, dance: 85, charisma: 65, mentality: 60 },
	debut_ready: { discipline: 50, communication: 40, adaptability: 40 },
	active: {},
	veteran: {}
};

const COACH_MULTIPLIER = 1.35;
const BASE_PROGRESS_PER_TICK = 12;

/** P6-26: Create a dev plan for an idol at a given stage. */
export function createDevPlan(
	idolId: string,
	stage: DevStage,
	week: number,
	mentorId?: string
): DevPlan {
	return {
		idolId,
		stage,
		startWeek: week,
		targetStats: { ...STAGE_STAT_TARGETS[stage] },
		progress: 0,
		mentorId
	};
}

function statBonus(idol: IdolRuntime, stage: DevStage): Partial<IdolVisibleStats> {
	const targets = STAGE_STAT_TARGETS[stage];
	const bonus: Partial<IdolVisibleStats> = {};

	for (const [key, target] of Object.entries(targets) as [keyof IdolVisibleStats, number][]) {
		const current = idol.visible[key];
		if (current < target) {
			bonus[key] = Math.min(2, target - current);
		}
	}
	return bonus;
}

/** P6-28: Advance dev plan progress and apply stat bonuses to idol. */
export function tickDevPlan(
	plan: DevPlan,
	idol: IdolRuntime,
	hasCoach: boolean
): { plan: DevPlan; idol: IdolRuntime } {
	const mult = hasCoach ? COACH_MULTIPLIER : 1;
	const disciplineFactor = idol.visible.discipline / 50;
	const progressDelta = Math.round(BASE_PROGRESS_PER_TICK * mult * disciplineFactor);

	const bonus = statBonus(idol, plan.stage);
	const visible = { ...idol.visible };
	for (const [key, delta] of Object.entries(bonus) as [keyof IdolVisibleStats, number][]) {
		visible[key] = Math.min(100, visible[key] + Math.round(delta * mult));
	}

	return {
		plan: { ...plan, progress: plan.progress + progressDelta },
		idol: { ...idol, visible }
	};
}

/** P6-30: Check if an idol is ready to advance to the next dev stage. */
export function checkStageAdvancement(
	plan: DevPlan,
	idol: IdolRuntime
): DevStage | null {
	const threshold = STAGE_PROGRESS_THRESHOLD[plan.stage];
	if (plan.progress < threshold) return null;

	const targets = STAGE_STAT_TARGETS[plan.stage];
	for (const [key, min] of Object.entries(targets) as [keyof IdolVisibleStats, number][]) {
		if (idol.visible[key] < min * 0.85) return null;
	}

	const idx = STAGE_ORDER.indexOf(plan.stage);
	if (idx < 0 || idx >= STAGE_ORDER.length - 1) return null;
	return STAGE_ORDER[idx + 1]!;
}
