import { describe, expect, it } from 'vitest';
import {
	WEEKS_PER_MONTH,
	WEEKS_PER_YEAR,
	advanceWeek,
	deriveCalendar,
	isMonthBoundaryAfterWeek,
	monthToSeason,
	toggleTimeMode
} from './calendar';

describe('deriveCalendar', () => {
	it('semana 1 é ano 1 mês 1 semana 1', () => {
		expect(deriveCalendar(1)).toMatchObject({
			year: 1,
			month: 1,
			weekInMonth: 1,
			absoluteWeek: 1
		});
	});

	it('semana 5 é mês 2 semana 1', () => {
		expect(deriveCalendar(5)).toMatchObject({
			year: 1,
			month: 2,
			weekInMonth: 1
		});
	});

	it('avança ano após 48 semanas', () => {
		expect(deriveCalendar(WEEKS_PER_YEAR + 1)).toMatchObject({
			year: 2,
			month: 1,
			weekInMonth: 1
		});
	});
});

describe('monthToSeason', () => {
	it('março é primavera', () => {
		expect(monthToSeason(3)).toBe('spring');
	});
	it('dezembro é inverno', () => {
		expect(monthToSeason(12)).toBe('winter');
	});
});

describe('helpers', () => {
	it('advanceWeek', () => {
		expect(advanceWeek(3, 2)).toBe(5);
		expect(advanceWeek(1, -1)).toBe(1);
	});
	it('isMonthBoundaryAfterWeek', () => {
		expect(isMonthBoundaryAfterWeek(WEEKS_PER_MONTH)).toBe(true);
		expect(isMonthBoundaryAfterWeek(3)).toBe(false);
	});
	it('toggleTimeMode', () => {
		expect(toggleTimeMode('pause')).toBe('live');
		expect(toggleTimeMode('live')).toBe('pause');
		expect(toggleTimeMode('skip')).toBe('pause');
	});
});
