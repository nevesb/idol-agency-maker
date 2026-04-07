import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const LS_KEY = 'sia_save_slot';

function readInitialSlot(): number {
	if (!browser) return 0;
	const n = parseInt(localStorage.getItem(LS_KEY) ?? '0', 10);
	return Number.isFinite(n) && n >= 0 ? n : 0;
}

export const currentSaveSlot = writable<number>(readInitialSlot());

if (browser) {
	currentSaveSlot.subscribe((v) => {
		localStorage.setItem(LS_KEY, String(Math.max(0, v)));
	});
}
