<script lang="ts">
	import './layout.css';
	import { browser } from '$app/environment';
	import favicon from '$lib/assets/favicon.svg';
	import { initI18n } from '$lib/i18n/bootstrap';
	import { idbGetSave, saveSlotKey } from '$lib/persistence/idb';
	import { parseSaveEnvelopeJson } from '$lib/persistence/serialize';
	import { runStartupCloudConflictCheck } from '$lib/persistence/startup-save-sync';
	import { getSupabaseBrowser } from '$lib/supabase/browser-client';
	import { authUser, initAuthListener } from '$lib/stores/auth-session';
	import { gameState, markPersistenceHydrated } from '$lib/stores/game-state';
	import { currentSaveSlot } from '$lib/stores/save-slot';
	import { absoluteWeek } from '$lib/stores/time-control';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

	let { children } = $props();

	initI18n();

	onMount(() => {
		const sb = getSupabaseBrowser();
		if (sb) initAuthListener(sb);

		let authUnsub: (() => void) | null = null;

		if (browser) {
			void (async () => {
				try {
					const slot = get(currentSaveSlot);
					const raw = await idbGetSave(saveSlotKey(slot));
					if (raw) {
						const env = parseSaveEnvelopeJson(raw);
						if (env) {
							gameState.set(env.game);
							absoluteWeek.set(env.game.absoluteWeek);
						}
					}
					const client = getSupabaseBrowser();
					if (client) {
						const u = get(authUser);
						if (u) {
							await runStartupCloudConflictCheck(client, u.id);
						} else {
							authUnsub = authUser.subscribe((user) => {
								if (!user) return;
								authUnsub?.();
								authUnsub = null;
								void runStartupCloudConflictCheck(client, user.id);
							});
						}
					}
				} catch (e) {
					console.warn('[save] hydrate', e);
				} finally {
					markPersistenceHydrated();
				}
			})();
		} else {
			markPersistenceHydrated();
		}

		return () => {
			authUnsub?.();
		};
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Star Idol Agency</title>
</svelte:head>

{@render children()}
