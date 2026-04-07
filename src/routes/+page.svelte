<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { setLocale } from '$lib/i18n/bootstrap';
	import { idbGetSave, saveSlotKey } from '$lib/persistence/idb';
	import { currentSaveSlot } from '$lib/stores/save-slot';
	import { theme, toggleTheme } from '$lib/stores/theme';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { _, locale } from 'svelte-i18n';

	let hasSave = $state(false);

	onMount(async () => {
		if (browser) {
			try {
				const slot = get(currentSaveSlot);
				const raw = await idbGetSave(saveSlotKey(slot));
				hasSave = !!raw;
			} catch {
				/* no save */
			}
		}
	});

	function onContinue() {
		goto('/portal');
	}
	function onNewGame() {
		goto('/new-game');
	}
	function onLoadGame() {
		goto('/agencia');
	}
	function onSettings() {
		goto('/definir');
	}
</script>

<div
	class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#050608]"
>
	<!-- starfield background -->
	<div class="pointer-events-none absolute inset-0 overflow-hidden">
		<div
			class="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(62,207,142,0.08)_0%,transparent_70%)]"
		></div>
		<div
			class="absolute right-1/4 top-1/4 h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,rgba(62,207,142,0.04)_0%,transparent_70%)]"
		></div>
		<div
			class="absolute bottom-1/4 left-1/4 h-[200px] w-[200px] rounded-full bg-[radial-gradient(circle,rgba(46,229,157,0.05)_0%,transparent_70%)]"
		></div>
		{#each { length: 40 } as _, i}
			<div
				class="absolute h-px w-px rounded-full bg-white"
				style="
					top: {Math.random() * 100}%;
					left: {Math.random() * 100}%;
					opacity: {0.15 + Math.random() * 0.45};
					width: {1 + Math.random() * 2}px;
					height: {1 + Math.random() * 2}px;
					animation: twinkle {2 + Math.random() * 4}s ease-in-out infinite;
					animation-delay: {Math.random() * 3}s;
				"
			></div>
		{/each}
	</div>

	<div class="relative z-10 flex flex-col items-center gap-10 px-6">
		<!-- title -->
		<div class="flex flex-col items-center gap-3 text-center">
			<h1
				class="bg-gradient-to-b from-white via-white to-[var(--accent)] bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl"
			>
				Star Idol Agency
			</h1>
			<p class="text-sm tracking-widest text-[#8b949e] uppercase">
				{$_('menu.version')}
			</p>
		</div>

		<!-- main buttons -->
		<div class="flex w-full max-w-xs flex-col gap-3">
			{#if hasSave}
				<button
					type="button"
					class="fm26-continue w-full rounded-lg px-6 py-3 text-center text-base font-bold tracking-wide shadow-lg shadow-[var(--fm-continue-bg)]/20 transition-all hover:scale-[1.02] hover:shadow-xl"
					onclick={onContinue}
				>
					{$_('menu.continue')}
				</button>
			{/if}

			<button
				type="button"
				class="w-full rounded-lg border border-[var(--border)] bg-[var(--elevated)] px-6 py-3 text-base font-semibold text-[var(--text)] transition-all hover:border-[var(--accent)] hover:bg-[var(--elevated)]/80"
				onclick={onNewGame}
			>
				{$_('menu.newGame')}
			</button>

			<button
				type="button"
				class="w-full rounded-lg border border-[var(--border)] bg-[var(--elevated)] px-6 py-3 text-base font-semibold text-[var(--text)] transition-all hover:border-[var(--accent)] hover:bg-[var(--elevated)]/80"
				onclick={onLoadGame}
			>
				{$_('menu.loadGame')}
			</button>

			<button
				type="button"
				class="w-full rounded-lg border border-[var(--border)] bg-transparent px-6 py-3 text-base font-semibold text-[var(--muted)] transition-all hover:border-[var(--accent)] hover:text-[var(--text)]"
				onclick={onSettings}
			>
				{$_('menu.settings')}
			</button>
		</div>

		<!-- footer controls -->
		<div class="flex flex-wrap items-center justify-center gap-4 text-xs">
			<div
				class="flex rounded-md border border-[var(--border)] p-0.5 text-[0.625rem] font-bold"
			>
				<button
					type="button"
					class="rounded px-1.5 py-0.5 {$locale === 'en'
						? 'bg-[var(--accent)] text-[#050608]'
						: 'text-[var(--muted)]'}"
					onclick={() => setLocale('en')}>EN</button
				>
				<button
					type="button"
					class="rounded px-1.5 py-0.5 {$locale === 'pt'
						? 'bg-[var(--accent)] text-[#050608]'
						: 'text-[var(--muted)]'}"
					onclick={() => setLocale('pt')}>PT</button
				>
				<button
					type="button"
					class="rounded px-1.5 py-0.5 {$locale === 'ja'
						? 'bg-[var(--accent)] text-[#050608]'
						: 'text-[var(--muted)]'}"
					onclick={() => setLocale('ja')}>JA</button
				>
			</div>

			<button
				type="button"
				class="rounded-md border border-[var(--border)] px-2 py-1 text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--text)]"
				onclick={toggleTheme}
			>
				{$theme === 'dark' ? $_('theme.light') : $_('theme.dark')}
			</button>

			<a
				href="/auth"
				class="text-[var(--muted)] underline decoration-dotted transition hover:text-[var(--accent)]"
			>
				{$_('menu.account')}
			</a>
		</div>
	</div>
</div>

<style>
	@keyframes twinkle {
		0%,
		100% {
			opacity: 0.15;
		}
		50% {
			opacity: 0.7;
		}
	}
</style>
