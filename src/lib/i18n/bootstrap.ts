import { browser } from '$app/environment';
import { addMessages, init, locale } from 'svelte-i18n';
import en from './locales/en.json';
import ja from './locales/ja.json';
import pt from './locales/pt.json';

const STORAGE_KEY = 'sia-locale';

let started = false;

/** Mensagens síncronas + init imediato (evita erro “Cannot format… without initial locale”). */
export function initI18n(): void {
	if (started) return;
	started = true;
	addMessages('en', en);
	addMessages('pt', pt);
	addMessages('ja', ja);
	let initial: 'en' | 'pt' | 'ja' = 'en';
	if (browser) {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (raw === 'pt' || raw === 'ja') initial = raw;
	}
	init({ fallbackLocale: 'en', initialLocale: initial });
}

export function setLocale(next: 'en' | 'pt' | 'ja'): void {
	if (!browser) return;
	localStorage.setItem(STORAGE_KEY, next);
	locale.set(next);
}
