<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import IdolAvatar from '$lib/components/ui/IdolAvatar.svelte';
	import TutorialHint from '$lib/components/ui/TutorialHint.svelte';
	import {
		acceptanceProbability,
		autoFillClausesForIdol
	} from '$lib/simulation/contract-negotiation';
	import { defaultContractClauses } from '$lib/simulation/contract';
	import { estimateBuyoutYen } from '$lib/simulation/market';
	import { tierFromPotential, computeTalentAverage } from '$lib/simulation/stats';
	import { getActiveTutorialHints } from '$lib/simulation/tutorial';
	import type { IdolCore } from '$lib/types/game';
	import type { FameTierVisual } from '$lib/types/simulation';
	import { gameState, hireFromMarket } from '$lib/stores/game-state';
	import { dismissTutorialHint, dismissedTutorialIds } from '$lib/stores/tutorial';
	import { _ } from 'svelte-i18n';

	const STAT_KEYS = ['vocal', 'dance', 'acting', 'visual', 'charisma'] as const;
	const TIER_ORDER: FameTierVisual[] = ['F', 'E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS'];

	let tierFilter = $state<string>('all');
	let confirmId = $state<string | null>(null);

	let hints = $derived(
		getActiveTutorialHints($gameState.absoluteWeek, '/mercado', $dismissedTutorialIds)
	);

	function offerStats(m: IdolCore) {
		const base = defaultContractClauses(75_000);
		const auto = autoFillClausesForIdol(base, m);
		return {
			standardPct: Math.round(acceptanceProbability(base, m) * 100),
			autoPct: Math.round(acceptanceProbability(auto, m) * 100)
		};
	}

	function wellnessLabel(m: IdolCore): string {
		if (m.activityState === 'burnout') return 'Burnout';
		if (m.activityState === 'crisis') return 'Crisis';
		return m.activityState === 'active' ? 'Active' : m.activityState;
	}

	let filteredMarket = $derived(
		$gameState.marketIdols.filter((m) => {
			if (tierFilter === 'all') return true;
			return tierFromPotential(m.potential) === tierFilter;
		})
	);
</script>

{#each hints as hint (hint.id)}
	<TutorialHint messageKey={hint.message} ondismiss={() => dismissTutorialHint(hint.id)} />
{/each}

<h1 class="text-xl font-semibold">{$_('nav.mercado')}</h1>
<p class="mt-2 text-[var(--muted)]">{$_('domain.mercado')}</p>

<div class="mt-4 flex items-center gap-3">
	<label class="text-xs text-[var(--muted)]" for="tier-filter">Filter by tier</label>
	<select
		id="tier-filter"
		class="rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-sm"
		bind:value={tierFilter}
	>
		<option value="all">All ({$gameState.marketIdols.length})</option>
		{#each TIER_ORDER as t (t)}
			{@const count = $gameState.marketIdols.filter((m) => tierFromPotential(m.potential) === t).length}
			{#if count > 0}
				<option value={t}>{t} ({count})</option>
			{/if}
		{/each}
	</select>
</div>

<div class="mt-4">
	<Card title={$_('game.marketPool')}>
		{#if filteredMarket.length === 0}
			<p class="text-sm text-[var(--muted)]">{$_('game.marketEmpty')}</p>
		{:else}
			<ul class="space-y-3 text-sm">
				{#each filteredMarket as m (m.id)}
					{@const cost = estimateBuyoutYen(m)}
					{@const neg = offerStats(m)}
					{@const tier = tierFromPotential(m.potential)}
					{@const ta = computeTalentAverage(m.visible)}
					<li class="rounded-lg border border-[var(--border)] bg-[var(--elevated)]/40 p-3">
						<div class="flex flex-wrap items-start justify-between gap-3">
							<div class="flex-1">
								<div class="flex items-center gap-2">
									<IdolAvatar idol={m} size="sm" />
									<span class="font-medium">{m.nameRomaji}</span>
									{#if m.nameJp && m.nameJp !== m.nameRomaji}
										<span class="text-xs text-[var(--muted)]">{m.nameJp}</span>
									{/if}
									<span class="rounded bg-[var(--elevated)] px-1.5 py-0.5 text-xs font-bold">{tier}</span>
									<span class="text-xs capitalize text-[var(--muted)]">{wellnessLabel(m)}</span>
								</div>
								<div class="mt-1 text-xs text-[var(--muted)]">
									Age {m.age} · {m.gender} · PT {m.potential} · TA {ta.toFixed(1)}
								</div>

								<div class="mt-2 grid grid-cols-5 gap-2">
									{#each STAT_KEYS as sk (sk)}
										<div class="text-center">
											<div class="text-[0.6rem] uppercase text-[var(--muted)]">{sk.slice(0, 3)}</div>
											<div class="relative mt-0.5 h-1.5 w-full rounded-full bg-[var(--border)]">
												<div
													class="absolute left-0 top-0 h-full rounded-full bg-[var(--accent)]"
													style:width="{m.visible[sk]}%"
												></div>
											</div>
											<div class="text-[0.6rem] font-mono">{m.visible[sk]}</div>
										</div>
									{/each}
								</div>

								<div class="mt-2 text-[0.65rem] text-[var(--muted)]">
									{$_('game.negStandard', { values: { n: neg.standardPct } })} ·
									{$_('game.negAuto', { values: { n: neg.autoPct } })}
								</div>
							</div>

							<div class="flex flex-col items-end gap-2">
								<div class="text-right">
									<div class="text-xs text-[var(--muted)]">{$_('game.buyout')}</div>
									<div class="text-lg font-bold">¥{cost.toLocaleString()}</div>
								</div>
								{#if confirmId === m.id}
									<div class="flex items-center gap-2">
										<button
											type="button"
											class="rounded-md bg-[var(--accent)] px-3 py-1.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-40"
											disabled={$gameState.balanceYen < cost}
											onclick={() => { hireFromMarket(m.id); confirmId = null; }}
										>
											Confirm
										</button>
										<button
											type="button"
											class="text-xs text-[var(--muted)] underline"
											onclick={() => { confirmId = null; }}
										>
											Cancel
										</button>
									</div>
								{:else}
									<button
										type="button"
										class="rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm font-medium hover:border-[var(--accent)] disabled:opacity-40"
										disabled={$gameState.balanceYen < cost}
										onclick={() => { confirmId = m.id; }}
									>
										{$_('game.sign')}
									</button>
								{/if}
							</div>
						</div>
					</li>
				{/each}
			</ul>
		{/if}
	</Card>
</div>
