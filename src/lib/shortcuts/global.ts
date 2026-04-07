import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import type { DomainPath } from '$lib/navigation/domains';
import { DOMAINS } from '$lib/navigation/domains';
import { getBookmarkPath, setBookmarkSlot } from '$lib/stores/bookmarks';
import { advanceWeekUiFlow } from '$lib/stores/game-state';
import { searchPaletteOpen } from '$lib/stores/search-palette';
import { timeMode } from '$lib/stores/time-control';
import { toggleTimeMode } from '$lib/simulation/calendar';
import { get } from 'svelte/store';

function isTypingTarget(target: EventTarget | null): boolean {
	if (!target || !(target instanceof HTMLElement)) return false;
	const tag = target.tagName;
	if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
	return target.isContentEditable;
}

/**
 * Atalhos globais (GDD / implementation plan P0-16, P0-18).
 * 1–6: domínios · Space: play/pause · Ctrl/Cmd+Enter: saltar semana · Ctrl/Cmd+K: pesquisa · F1: glossário · Shift+dígito: bookmark
 */
export function attachGlobalShortcuts(getPathname: () => string): () => void {
	const handler = (e: KeyboardEvent) => {
		if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
			e.preventDefault();
			searchPaletteOpen.update((o) => !o);
			return;
		}

		if (get(searchPaletteOpen)) {
			if (e.key === 'Escape') {
				e.preventDefault();
				searchPaletteOpen.set(false);
			}
			return;
		}

		if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
			if (!isTypingTarget(e.target)) {
				e.preventDefault();
				void advanceWeekUiFlow();
			}
			return;
		}

		if (e.key === 'Escape') return;

		if (isTypingTarget(e.target)) return;

		if (e.key === 'F1') {
			e.preventDefault();
			goto(resolve('/ajuda/glossario' as DomainPath));
			return;
		}

		if (e.key === ' ' && !e.ctrlKey && !e.metaKey) {
			e.preventDefault();
			timeMode.update(toggleTimeMode);
			return;
		}

		if (!e.ctrlKey && !e.metaKey && !e.altKey && e.key >= '1' && e.key <= '6') {
			const digit = parseInt(e.key, 10) as 1 | 2 | 3 | 4 | 5 | 6;
			const domain = DOMAINS.find((d) => d.shortcutDigit === digit);
			if (domain) {
				e.preventDefault();
				goto(resolve(domain.path));
			}
			return;
		}

		if (e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
			const mapDigitToSlot: Record<string, number> = {
				'1': 0,
				'2': 1,
				'3': 2,
				'4': 3,
				'5': 4,
				'6': 5,
				'7': 6,
				'8': 7,
				'9': 8,
				'0': 9
			};
			const slot = mapDigitToSlot[e.key];
			if (slot !== undefined) {
				e.preventDefault();
				const path = getBookmarkPath(slot);
				if (path) {
					const d = DOMAINS.find((x) => x.path === path);
					if (d) goto(resolve(d.path));
				}
				else setBookmarkSlot(slot, getPathname());
			}
		}
	};

	window.addEventListener('keydown', handler);
	return () => window.removeEventListener('keydown', handler);
}
