<script lang="ts">
	import { page } from '$app/state';
	import Breadcrumbs from '$lib/components/layout/Breadcrumbs.svelte';
	import HeaderStatusStrip from '$lib/components/layout/HeaderStatusStrip.svelte';
	import MainNav from '$lib/components/layout/MainNav.svelte';
	import SearchPalette from '$lib/components/layout/SearchPalette.svelte';
	import TimeControls from '$lib/components/layout/TimeControls.svelte';
	import { setLocale } from '$lib/i18n/bootstrap';
	import { attachGlobalShortcuts } from '$lib/shortcuts/global';
	import { searchPaletteOpen } from '$lib/stores/search-palette';
	import { theme, toggleTheme } from '$lib/stores/theme';
	import { onMount } from 'svelte';
	import { _, locale } from 'svelte-i18n';

	let { children } = $props();

	onMount(() => {
		const detach = attachGlobalShortcuts(() => page.url.pathname);
		return () => detach();
	});
</script>

<div class="flex min-h-screen flex-col pb-16">
	<header
		class="fm26-shell sticky top-0 z-30 bg-[var(--fm-header-bg)] shadow-[0_1px_0_var(--fm-header-border)]"
	>
		<div class="mx-auto flex w-full max-w-[1920px] items-stretch gap-2 px-2 sm:gap-3 sm:px-4">
			<a href="/portal" class="fm26-brand shrink-0" data-sveltekit-preload-data="hover"
				>SIA</a
			>
			<MainNav />
			<div class="flex shrink-0 flex-wrap items-center justify-end gap-1.5 py-1.5 sm:gap-2">
				<a
					href="/auth"
					class="fm26-toolbtn fm26-toolbtn-ghost"
					data-sveltekit-preload-data="hover"
				>
					{$_('nav.auth')}
				</a>
				<button
					type="button"
					class="fm26-toolbtn"
					onclick={() => searchPaletteOpen.set(true)}
					title="Ctrl+K"
				>
					{$_('search.open')}
				</button>
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
					class="fm26-toolbtn"
					onclick={toggleTheme}
					title={$_('theme.toggle')}
				>
					{$theme === 'dark' ? $_('theme.light') : $_('theme.dark')}
				</button>
			</div>
		</div>
		<div class="mx-auto w-full max-w-[1920px]">
			<HeaderStatusStrip />
		</div>
	</header>

	<main class="mx-auto w-full max-w-[1920px] flex-1 px-4 py-4">
		<Breadcrumbs />
		{@render children()}
		<p class="mt-8 text-xs text-[var(--muted)]">{$_('shortcuts.hint')}</p>
	</main>

	<TimeControls />
	<SearchPalette />
</div>
