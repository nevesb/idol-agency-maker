import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'sia-theme';

function readTheme(): Theme {
	if (!browser) return 'dark';
	const v = localStorage.getItem(STORAGE_KEY);
	return v === 'light' || v === 'dark' ? v : 'dark';
}

export const theme = writable<Theme>(readTheme());

function applyUiMode(t: Theme) {
	document.documentElement.dataset.ui = t === 'dark' ? 'fm26' : 'default';
}

if (browser) {
	document.documentElement.dataset.theme = readTheme();
	applyUiMode(readTheme());
	theme.subscribe((t) => {
		localStorage.setItem(STORAGE_KEY, t);
		document.documentElement.dataset.theme = t;
		applyUiMode(t);
	});
}

export function toggleTheme(): void {
	theme.update((t) => (t === 'dark' ? 'light' : 'dark'));
}
