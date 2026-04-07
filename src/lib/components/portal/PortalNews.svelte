<script lang="ts">
	import type { NewsCategoryKey, NewsItem } from '$lib/types/simulation';
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

	function outletName(n: NewsItem): string {
		if (n.category === 'economy') return $_('portal.newsOutletBiz');
		if (n.category === 'scandal' || n.category === 'rival') return $_('portal.newsOutletIndie');
		return $_('portal.newsOutletMain');
	}

	function outletColor(n: NewsItem): string {
		if (n.category === 'economy') return 'text-emerald-400';
		if (n.category === 'scandal' || n.category === 'rival') return 'text-rose-400';
		return 'text-blue-400';
	}

	let sorted = $derived(
		[...$gameState.newsHistory]
			.filter((n) => activeFilter === 'all' || n.category === activeFilter)
			.sort((a, b) => b.week - a.week || b.importance - a.importance)
	);

	let mainStory = $derived(sorted[0] ?? null);
	let otherStories = $derived(sorted.slice(1));
</script>

<div class="space-y-4">
	<div>
		<h2 class="text-lg font-semibold">{$_('news.title')}</h2>
		<p class="mt-1 text-sm text-[var(--muted)]">{$_('news.subtitle')}</p>
	</div>

	<!-- Filters -->
	<div class="flex flex-wrap gap-2">
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

	{#if sorted.length === 0}
		<p class="text-sm text-[var(--muted)]">{$_('news.empty')}</p>
	{:else}
		<!-- Main story card -->
		{#if mainStory}
			<div class="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
				<div class="flex items-center gap-2 text-xs">
					<span class="font-semibold {outletColor(mainStory)}">{outletName(mainStory)}</span>
					<span class={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase ${CATEGORY_COLORS[mainStory.category] ?? ''}`}>
						{mainStory.category.replace('_', ' ')}
					</span>
					<span class="ml-auto text-[var(--muted)]">W{mainStory.week}</span>
				</div>
				<p class="mt-3 text-base font-semibold leading-snug">{mainStory.text}</p>
				{#if mainStory.relatedIdolId}
					{@const idol = $gameState.idols.find((i) => i.id === mainStory.relatedIdolId)}
					{#if idol}
						<div class="mt-3 flex items-center gap-2">
							<div class="h-6 w-6 rounded-full bg-[var(--accent)]/30 text-center text-[10px] font-bold leading-6">
								{idol.nameRomaji.charAt(0)}
							</div>
							<a href={`/roster/${idol.id}`} class="text-xs text-[var(--accent)] underline decoration-dotted" data-sveltekit-preload-data="hover">
								{idol.nameRomaji}
							</a>
						</div>
					{/if}
				{/if}
			</div>
		{/if}

		<!-- Grid of smaller stories -->
		{#if otherStories.length > 0}
			<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
				{#each otherStories as it (it.id)}
					<div class="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 shadow-sm">
						<div class="flex items-center gap-2 text-xs">
							<span class="font-medium {outletColor(it)}">{outletName(it)}</span>
							<span class={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase ${CATEGORY_COLORS[it.category] ?? ''}`}>
								{it.category.replace('_', ' ')}
							</span>
						</div>
						<p class="mt-2 text-sm leading-snug">{it.text}</p>
						<div class="mt-2 flex items-center justify-between text-[10px] text-[var(--muted)]">
							<span>W{it.week}</span>
							{#if it.relatedIdolId}
								{@const idol = $gameState.idols.find((i) => i.id === it.relatedIdolId)}
								{#if idol}
									<a href={`/roster/${idol.id}`} class="text-[var(--accent)] underline decoration-dotted" data-sveltekit-preload-data="hover">
										{idol.nameRomaji}
									</a>
								{/if}
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	{/if}
</div>
