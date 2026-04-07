import type { TimeMode } from '$lib/types/game';

/** 4 semanas = 1 mês, 12 meses = 1 ano (GDD time-calendar) */
export const WEEKS_PER_MONTH = 4;
export const MONTHS_PER_YEAR = 12;
export const WEEKS_PER_YEAR = WEEKS_PER_MONTH * MONTHS_PER_YEAR;

export type GameSeason = 'spring' | 'summer' | 'autumn' | 'winter';

export interface CalendarDerived {
	year: number;
	month: number;
	weekInMonth: number;
	season: GameSeason;
	absoluteWeek: number;
}

/** Semana absoluta ≥ 1: semana 1 = ano 1, mês 1, semana 1 */
export function deriveCalendar(absoluteWeek: number): CalendarDerived {
	const w = Math.max(1, Math.floor(absoluteWeek));
	const zero = w - 1;
	const year = Math.floor(zero / WEEKS_PER_YEAR) + 1;
	const weekInYear = zero % WEEKS_PER_YEAR;
	const month = Math.floor(weekInYear / WEEKS_PER_MONTH) + 1;
	const weekInMonth = (weekInYear % WEEKS_PER_MONTH) + 1;
	return {
		absoluteWeek: w,
		year,
		month,
		weekInMonth,
		season: monthToSeason(month)
	};
}

/** Mar–Mai primavera; Jun–Ago verão; Set–Nov outono; Dez–Fev inverno */
export function monthToSeason(month: number): GameSeason {
	const m = ((month - 1) % 12) + 1;
	if (m >= 3 && m <= 5) return 'spring';
	if (m >= 6 && m <= 8) return 'summer';
	if (m >= 9 && m <= 11) return 'autumn';
	return 'winter';
}

export function advanceWeek(current: number, delta = 1): number {
	return Math.max(1, current + delta);
}

export function isMonthBoundaryAfterWeek(absoluteWeek: number): boolean {
	return absoluteWeek > 0 && absoluteWeek % WEEKS_PER_MONTH === 0;
}

export function toggleTimeMode(mode: TimeMode): TimeMode {
	if (mode === 'pause') return 'live';
	if (mode === 'live') return 'pause';
	return 'pause';
}
