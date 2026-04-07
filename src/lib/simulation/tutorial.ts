export interface TutorialStep {
	id: string;
	week: number;
	route: string;
	message: string;
	dismissed: boolean;
}

const ALL_STEPS: TutorialStep[] = [
	{
		id: 'welcome',
		week: 1,
		route: '/portal',
		message: 'tutorial.welcome',
		dismissed: false
	},
	{
		id: 'assign_jobs',
		week: 1,
		route: '/portal',
		message: 'tutorial.assignJobs',
		dismissed: false
	},
	{
		id: 'operations_hint',
		week: 1,
		route: '/operacoes',
		message: 'tutorial.operationsHint',
		dismissed: false
	},
	{
		id: 'roster_hint',
		week: 1,
		route: '/roster',
		message: 'tutorial.rosterHint',
		dismissed: false
	},
	{
		id: 'market_hint',
		week: 2,
		route: '/mercado',
		message: 'tutorial.marketHint',
		dismissed: false
	},
	{
		id: 'scouting_hint',
		week: 2,
		route: '/scouting',
		message: 'tutorial.scoutingHint',
		dismissed: false
	},
	{
		id: 'advance_week',
		week: 1,
		route: '/operacoes',
		message: 'tutorial.advanceWeek',
		dismissed: false
	},
	{
		id: 'check_results',
		week: 2,
		route: '/operacoes/resultados',
		message: 'tutorial.checkResults',
		dismissed: false
	}
];

export function getActiveTutorialHints(
	absoluteWeek: number,
	currentRoute: string,
	dismissedIds: string[]
): TutorialStep[] {
	return ALL_STEPS.filter(
		(s) => s.week <= absoluteWeek && s.route === currentRoute && !dismissedIds.includes(s.id)
	);
}
