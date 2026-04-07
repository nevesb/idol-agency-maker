<script lang="ts">
	import { resolve } from '$app/paths';
	import Card from '$lib/components/ui/Card.svelte';
	import DataTable from '$lib/components/ui/DataTable.svelte';
	import { fameTierFromPoints } from '$lib/simulation/fame';
	import { gameState } from '$lib/stores/game-state';
	import { _ } from 'svelte-i18n';

	let expandedPm = $state<string | null>(null);

	let lastWeek = $derived($gameState.lastWeekLog);
	let pmForWeek = $derived(
		lastWeek
			? $gameState.postMortems.filter((p) => p.week === $gameState.absoluteWeek)
			: []
	);

	let resultsRows = $derived(
		lastWeek
			? lastWeek.jobResults.map((r) => {
					const idol = $gameState.idols.find((i) => i.id === r.idolId);
					const jobLabel =
						$gameState.jobHistory.find(
							(h) =>
								h.week === $gameState.absoluteWeek &&
								h.jobId === r.jobId &&
								h.idolId === r.idolId
						)?.jobName ?? r.jobId;
					return {
						key: r.jobId + r.idolId,
						job: jobLabel,
						idol: idol?.nameRomaji ?? r.idolId,
						outcome: r.outcome,
						perf: r.performance.toFixed(2),
						revenue: `¥${r.revenueYen.toLocaleString()}`,
						fame: String(r.fameDelta)
					};
				})
			: []
	);

	let showMonthly = $derived($gameState.absoluteWeek > 0 && $gameState.absoluteWeek % 4 === 0);
</script>

<h1 class="text-xl font-semibold">{$_('results.title')}</h1>
<p class="mt-2 text-sm text-[var(--muted)]">
	<a href={resolve('/operacoes')} class="text-[var(--accent)] underline">{$_('results.backOps')}</a>
</p>

<div class="mt-6 grid gap-4 lg:grid-cols-[3fr_2fr]">
	<div class="space-y-4">
		<Card title={$_('portal.moodTitle')}>
			<p class="text-lg font-semibold capitalize">{$_(`portal.mood.${$gameState.agencyMood}`)}</p>
		</Card>

		<Card title={$_('portal.headlinesTitle')}>
			<ul class="space-y-2 text-sm">
				{#if $gameState.headlines.length === 0}
					<li class="text-[var(--muted)]">{$_('portal.noHeadlines')}</li>
				{:else}
					{#each $gameState.headlines.slice(0, 5) as h (`${h.week}-${h.text}`)}
						<li class="rounded-md border border-[var(--border)] px-2 py-1.5">
							W{h.week} · {h.text}
						</li>
					{/each}
				{/if}
			</ul>
		</Card>

		<Card title={$_('results.postMortemTitle')}>
			{#if pmForWeek.length === 0}
				<p class="text-sm text-[var(--muted)]">{$_('results.noPostMortem')}</p>
			{:else}
				<ul class="space-y-2 text-sm">
					{#each pmForWeek as pm (pm.id)}
						<li class="rounded-lg border border-[var(--border)] bg-[var(--elevated)]/40 p-2">
							<button
								type="button"
								class="flex w-full items-center justify-between text-left font-medium"
								onclick={() => (expandedPm = expandedPm === pm.id ? null : pm.id)}
							>
								{$gameState.jobHistory.find((h) => h.week === pm.week && h.jobId === pm.jobId)
									?.jobName ?? pm.jobId}
								· {$_('results.grade')} {pm.gradeLetter}
								<span class="text-xs text-[var(--muted)]">{expandedPm === pm.id ? '−' : '+'}</span>
							</button>
							{#if expandedPm === pm.id}
								<div class="mt-2 grid gap-2 text-xs sm:grid-cols-2">
									<div>
										<p class="font-semibold text-emerald-200">+</p>
										<ul class="list-inside list-disc">
											{#each pm.positives.slice(0, 4) as line}
												<li>{line}</li>
											{/each}
										</ul>
									</div>
									<div>
										<p class="font-semibold text-rose-200">−</p>
										<ul class="list-inside list-disc">
											{#each pm.negatives.slice(0, 4) as line}
												<li>{line}</li>
											{/each}
										</ul>
									</div>
								</div>
								<p class="mt-2 text-xs text-[var(--muted)]">{pm.fanReaction}</p>
								<p class="text-xs text-[var(--muted)]">{pm.mediaReaction}</p>
							{/if}
						</li>
					{/each}
				</ul>
			{/if}
		</Card>
	</div>

	<div class="space-y-4">
		<Card title={$_('results.sideFinance')}>
			<p class="text-xl font-semibold">¥{$gameState.balanceYen.toLocaleString()}</p>
			<p class="mt-2 text-xs text-[var(--muted)]">{$_('game.tier')}: {$_(`game.agencyTier.${$gameState.agencyTier}`)}</p>
		</Card>

		<Card title={$_('results.sideWellness')}>
			<ul class="space-y-1 text-xs">
				{#each $gameState.idols as i (i.id)}
					<li class="flex justify-between gap-2">
						<span>{i.nameRomaji}</span>
						<span class="text-[var(--muted)]">σ {Math.round(i.wellness.stress)}</span>
					</li>
				{/each}
			</ul>
		</Card>

		<Card title={$_('results.sideFame')}>
			<ul class="space-y-1 text-xs">
				{#each $gameState.idols as i (i.id)}
					<li class="flex justify-between gap-2">
						<span>{i.nameRomaji}</span>
						<span>{fameTierFromPoints(i.famePoints)}</span>
					</li>
				{/each}
			</ul>
		</Card>

		{#if showMonthly}
			<Card title={$_('results.monthlyTitle')}>
				<p class="text-sm text-[var(--muted)]">{$_('results.monthlyBody')}</p>
				<div class="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
					<div class="rounded border border-[var(--border)] p-2">{$_('results.mTile1')}</div>
					<div class="rounded border border-[var(--border)] p-2">{$_('results.mTile2')}</div>
					<div class="rounded border border-[var(--border)] p-2">{$_('results.mTile3')}</div>
					<div class="rounded border border-[var(--border)] p-2">{$_('results.mTile4')}</div>
				</div>
			</Card>
		{/if}
	</div>
</div>

<Card title={$_('results.tableTitle')} class="mt-6">
		<DataTable
		columns={[
			{ key: 'idol', label: $_('game.rosterTitle') },
			{ key: 'job', label: $_('results.colJob') },
			{ key: 'outcome', label: $_('results.colOutcome') },
			{ key: 'perf', label: $_('results.colPerf') },
			{ key: 'revenue', label: $_('results.colRev') },
			{ key: 'fame', label: $_('game.fame') }
		]}
		rows={resultsRows}
		emptyLabel={$_('game.noResultsYet')}
	/>
</Card>
