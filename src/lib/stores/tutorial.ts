import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const STORAGE_KEY = 'sia_tutorial_dismissed';

function loadDismissed(): string[] {
	if (!browser) return [];
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? JSON.parse(raw) : [];
	} catch {
		return [];
	}
}

function saveDismissed(ids: string[]): void {
	if (!browser) return;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export const dismissedTutorialIds = writable<string[]>(loadDismissed());

export function dismissTutorialHint(id: string): void {
	dismissedTutorialIds.update((ids) => {
		const next = [...ids, id];
		saveDismissed(next);
		return next;
	});
}

export function resetTutorial(): void {
	dismissedTutorialIds.set([]);
	saveDismissed([]);
}
