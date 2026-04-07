<script lang="ts">
	import type { NewsCategoryKey } from '$lib/types/simulation';
	import { gameState } from '$lib/stores/game-state';
	import { _ } from 'svelte-i18n';

	type FilterKey = 'all' | 'job_result' | 'economy' | 'rival' | 'milestone';

	let activeFilter: FilterKey = $state('all');

	const FILTERS: { key: FilterKey; i18n: string }[] = [
		{ key: 'all', i18n: 'news.filterAll' },
		{ key: 'job_result', i18n: 'news.filterJobs' },
		{ key: 'economy', i18n: 'news.filterEconomy' },
		{ key: 'rival', i18n: 'news.filterRival' },
		{ key: 'milestone', i18n: 'news.filterMilestone' }
	];

	const CATEGORY_COLORS: Record<NewsCategoryKey, string> = {
		job_result: 'bg-blue-500/20 text-blue-300',
		economy: 'bg-emerald-500/20 text-emerald-300',
		rival: 'bg-orange-500/20 text-orange-300',
		scandal: 'bg-rose-500/20 text-rose-300',
		award: 'bg-amber-500/20 text-amber-300',
		milestone: 'bg-violet-500/20 text-violet-300',
		system: 'bg-gray-500/20 text-gray-300'
	};

	let filtered = $derived(
		[...$gameState.newsHistory]
			.filter((n) => activeFilter === 'all' || n.category === activeFilter)
			.sort((a, b) => b.week - a.week || b.importance - a.importance)
	);
</script>

<h1 class="text-xl font-semibold">{$_('news.title')}</h1>
<p class="mt-2 text-sm text-[var(--muted)]">{$_('news.subtitle')}</p>

<div class="mt-4 flex flex-wrap gap-2">
	{#each FILTERS as f (f.key)}
		<button
			class="rounded-full px-3 py-1 text-xs font-medium transition-colors {activeFilter === f.key
				? 'bg-[var(--accent)] text-white'
				: 'bg-[var(--elevated)] text-[var(--muted)] hover:bg-[var(--border)]'}"
			onclick={() => (activeFilter = f.key)}
		>
			{$_(f.i18n)}
		</button>
	{/each}
</div>

<ul class="mt-6 space-y-2 text-sm">
	{#if filtered.length === 0}
		<li class="text-[var(--muted)]">{$_('news.empty')}</li>
	{:else}
		{#each filtered as it (it.id)}
			<li class="rounded-md border border-[var(--border)] bg-[var(--elevated)]/40 px-3 py-2">
				<div class="flex items-center gap-2">
					<span class="text-xs text-[var(--muted)]">W{it.week}</span>
					<span
						class="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase {CATEGORY_COLORS[
							it.category
						] ?? 'bg-gray-500/20 text-gray-300'}"
					>
						{it.category.replace('_', ' ')}
					</span>
					<span class="ml-auto text-[10px] text-[var(--muted)]">{$_('news.source')}</span>
				</div>
				<p class="mt-1">{it.text}</p>
				{#if it.relatedIdolId}
					<a
						href={`/roster/${it.relatedIdolId}`}
						class="mt-1 inline-block text-xs text-[var(--accent)] underline decoration-dotted"
						data-sveltekit-preload-data="hover"
					>
						Ver idol →
					</a>
				{/if}
			</li>
		{/each}
	{/if}
</ul>
