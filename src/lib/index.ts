export { DOMAINS, domainByPath, routeTitles } from './navigation/domains';
export type { DomainDef, DomainId, DomainPath } from './navigation/domains';
export * from './simulation/calendar';
export * from './simulation/stats';
export * from './simulation/rng';
export * from './simulation/economy';
export * from './simulation/contract';
export * from './simulation/wellness';
export * from './simulation/fame';
export * from './simulation/jobs';
export * from './simulation/market';
export * from './simulation/initial-state';
export { runWeekPipeline, hireMarketIdol } from './simulation/week-pipeline';
export type * from './types/game';
export type * from './types/simulation';
export * from './persistence';
export {
	gameState,
	advanceGameWeekSync,
	advanceGameWeekWithWorker,
	hireFromMarket,
	assignJob,
	unassignJob,
	markPersistenceHydrated,
	replaceGameState,
	startNewGame,
	saveGameNow
} from './stores/game-state';
export { authUser, initAuthListener } from './stores/auth-session';
export { currentSaveSlot } from './stores/save-slot';
export { initI18n, setLocale } from './i18n/bootstrap';
export { getSupabaseBrowser } from './supabase/browser-client';
export { attachGlobalShortcuts } from './shortcuts/global';
export { theme, toggleTheme } from './stores/theme';
export { timeMode, absoluteWeek } from './stores/time-control';
export { searchPaletteOpen } from './stores/search-palette';
export { bookmarks, setBookmarkSlot, getBookmarkPath } from './stores/bookmarks';
