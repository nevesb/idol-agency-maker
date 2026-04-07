<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Tile from '$lib/components/ui/Tile.svelte';
	import { gameState } from '$lib/stores/game-state';
	import type { AgencyEconomyTier } from '$lib/types/simulation';
	import { _ } from 'svelte-i18n';

	const TIER_ORDER: AgencyEconomyTier[] = ['garage', 'small', 'medium', 'large', 'elite'];

	function tierRank(t: AgencyEconomyTier): number {
		return TIER_ORDER.indexOf(t);
	}

	function threatLevel(rivalTier: AgencyEconomyTier): 'low' | 'medium' | 'high' {
		const playerRank = tierRank($gameState.agencyTier);
		const rivalRank = tierRank(rivalTier);
		const diff = rivalRank - playerRank;
		if (diff >= 2) return 'high';
		if (diff >= 0) return 'medium';
		return 'low';
	}

	function threatColor(level: 'low' | 'medium' | 'high'): string {
		if (level === 'high') return 'bg-rose-500/20 text-rose-300';
		if (level === 'medium') return 'bg-amber-500/20 text-amber-300';
		return 'bg-emerald-500/20 text-emerald-300';
	}

	function threatLabel(level: 'low' | 'medium' | 'high'): string {
		if (level === 'high') return $_('portal.threatHigh');
		if (level === 'medium') return $_('portal.threatMedium');
		return $_('portal.threatLow');
	}

	let maxBudget = $derived(
		Math.max(
			$gameState.balanceYen,
			...$gameState.rivals.map((r) => r.budgetYen),
			1
		)
	);

	function barWidth(budget: number): string {
		return `${Math.round((budget / maxBudget) * 100)}%`;
	}

	let rivalNews = $derived(
		$gameState.newsHistory
			.filter((n) => n.category === 'rival')
			.sort((a, b) => b.week - a.week)
	);

	function lastRivalActivity(rivalName: string): string | null {
		const news = rivalNews.find((n) => n.text.toLowerCase().includes(rivalName.toLowerCase()));
		return news?.text ?? null;
	}

	let avgStress = $derived(
		$gameState.idols.length === 0
			? 0
			: Math.round($gameState.idols.reduce((a, i) => a + i.wellness.stress, 0) / $gameState.idols.length)
	);
</script>

<div class="space-y-4">
	<h2 class="text-lg font-semibold">{$_('portal.tab.competitors')}</h2>

	<!-- Player agency card -->
	<div class="rounded-xl border-2 border-[var(--accent)]/40 bg-[var(--surface)] p-4 shadow-sm">
		<div class="flex items-center gap-3">
			<div class="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)]/20 text-lg font-bold text-[var(--accent)]">
				{$gameState.agencyName.charAt(0)}
			</div>
			<div>
				<h3 class="font-semibold">{$gameState.agencyName}</h3>
				<span class="text-xs text-[var(--muted)]">{$_('portal.myAgency')}</span>
			</div>
		</div>
		<div class="mt-3 grid gap-2 sm:grid-cols-4 text-sm">
			<div>
				<span class="text-xs text-[var(--muted)]">{$_('game.tier')}</span>
				<p class="font-semibold capitalize">{$_(`game.agencyTier.${$gameState.agencyTier}`)}</p>
			</div>
			<div>
				<span class="text-xs text-[var(--muted)]">{$_('game.balance')}</span>
				<p class="font-semibold">¥{$gameState.balanceYen.toLocaleString()}</p>
			</div>
			<div>
				<span class="text-xs text-[var(--muted)]">{$_('nav.roster')}</span>
				<p class="font-semibold">{$gameState.idols.length}</p>
			</div>
			<div>
				<span class="text-xs text-[var(--muted)]">{$_('game.wellness.stress')}</span>
				<p class="font-semibold">{avgStress}</p>
			</div>
		</div>
		<!-- Budget bar -->
		<div class="mt-3">
			<div class="h-2 rounded-full bg-[var(--border)]">
				<div class="h-2 rounded-full bg-[var(--accent)] transition-all" style="width: {barWidth($gameState.balanceYen)}"></div>
			</div>
		</div>
	</div>

	<!-- Rival agencies -->
	{#if $gameState.rivals.length === 0}
		<p class="text-sm text-[var(--muted)]">{$_('portal.noRivals')}</p>
	{:else}
		<div class="space-y-3">
			{#each $gameState.rivals as rival (rival.id)}
				{@const threat = threatLevel(rival.tier)}
				{@const activity = lastRivalActivity(rival.name)}
				<div class="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
					<div class="flex items-center gap-3">
						<div class="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--elevated)] text-sm font-bold text-[var(--muted)]">
							{rival.name.charAt(0)}
						</div>
						<div class="min-w-0 flex-1">
							<div class="flex items-center gap-2">
								<h3 class="font-semibold truncate">{rival.name}</h3>
								<span class={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${threatColor(threat)}`}>
									{threatLabel(threat)}
								</span>
							</div>
							<div class="mt-1 flex gap-4 text-xs text-[var(--muted)]">
								<span>{$_('game.tier')}: <strong class="capitalize text-[var(--text)]">{$_(`game.agencyTier.${rival.tier}`)}</strong></span>
								<span>{$_('portal.budget')}: <strong class="text-[var(--text)]">¥{rival.budgetYen.toLocaleString()}</strong></span>
							</div>
						</div>
					</div>

					<!-- Budget comparison bar -->
					<div class="mt-3">
						<div class="h-1.5 rounded-full bg-[var(--border)]">
							<div
								class="h-1.5 rounded-full transition-all {threat === 'high' ? 'bg-rose-500' : threat === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}"
								style="width: {barWidth(rival.budgetYen)}"
							></div>
						</div>
					</div>

					<!-- Recent activity -->
					<div class="mt-2 text-xs text-[var(--muted)]">
						<span class="font-medium">{$_('portal.recentActivity')}:</span>
						{#if activity}
							<span class="ml-1">{activity}</span>
						{:else}
							<span class="ml-1 italic">{$_('portal.noRecentActivity')}</span>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
