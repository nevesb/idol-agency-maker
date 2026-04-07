<script lang="ts">
	import { page } from '$app/state';
	import Card from '$lib/components/ui/Card.svelte';
	import IdolAvatar from '$lib/components/ui/IdolAvatar.svelte';
	import { fameTierFromPoints } from '$lib/simulation/fame';
	import { tierFromPotential } from '$lib/simulation/stats';
	import { gameState, renewContractAction, terminateContractAction } from '$lib/stores/game-state';
	import { _ } from 'svelte-i18n';

	type TabId = 'overview' | 'stats' | 'jobs' | 'contract' | 'compare' | 'agenda';

	let activeTab = $state<TabId>('overview');
	let compareId = $state<string | null>(null);
	let confirmTerminate = $state(false);

	let idol = $derived($gameState.idols.find((i) => i.id === page.params.id));

	let compareIdol = $derived(
		compareId ? $gameState.idols.find((i) => i.id === compareId) ?? null : null
	);

	let contract = $derived(
		idol?.contractId
			? $gameState.contracts.find((c) => c.id === idol!.contractId) ?? null
			: null
	);

	let idolJobs = $derived(
		idol ? $gameState.jobHistory.filter((j) => j.idolId === idol!.id) : []
	);

	const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

	let idolSchedule = $derived.by(() => {
		if (!idol) return [];
		return $gameState.assignedJobs
			.filter((a) => a.idolId === idol!.id)
			.map((a) => {
				const job = $gameState.jobBoard.find((j) => j.id === a.jobId);
				return job ? { jobId: a.jobId, name: job.name, day: job.scheduledDay } : null;
			})
			.filter((x): x is { jobId: string; name: string; day: number } => x !== null)
			.sort((a, b) => a.day - b.day);
	});

	const VISIBLE_STAT_KEYS = [
		'vocal', 'dance', 'visual', 'acting', 'variety', 'charisma',
		'communication', 'aura', 'stamina', 'discipline', 'mentality', 'adaptability'
	] as const satisfies readonly (keyof import('$lib/types/game').IdolVisibleStats)[];

	const TABS: TabId[] = ['overview', 'stats', 'jobs', 'contract', 'agenda', 'compare'];
</script>

{#if !idol}
	<p class="py-12 text-center text-[var(--muted)]">{$_('profile.notFound')}</p>
	<a href="/roster" class="text-sm text-[var(--accent)] underline">{$_('profile.backRoster')}</a>
{:else}
	<div class="space-y-4">
		<a href="/roster" class="text-sm text-[var(--accent)] underline">{$_('profile.backRoster')}</a>

		<div class="flex items-center gap-4">
			<IdolAvatar {idol} size="xl" />
			<div>
				<div class="flex items-baseline gap-3">
					<h1 class="text-2xl font-bold">{idol.nameRomaji}</h1>
					<span class="text-sm text-[var(--muted)]">{idol.nameJp}</span>
					<span class="rounded bg-[var(--elevated)] px-2 py-0.5 text-xs font-bold">
						{fameTierFromPoints(idol.famePoints)}
					</span>
				</div>
			</div>
		</div>

		<div class="flex gap-1 border-b border-[var(--border)]">
			{#each TABS as t (t)}
				<button
					type="button"
					class="px-3 py-2 text-sm font-medium {activeTab === t
						? 'border-b-2 border-[var(--accent)] text-[var(--text)]'
						: 'text-[var(--muted)] hover:text-[var(--text)]'}"
					onclick={() => (activeTab = t)}
				>
					{$_(`profile.tab.${t}`)}
				</button>
			{/each}
		</div>

	{#if activeTab === 'overview'}
		<Card title={$_('profile.overviewTitle')}>
			<dl class="grid grid-cols-2 gap-2 text-sm">
				<dt class="text-[var(--muted)]">{$_('profile.region')}</dt>
				<dd>{idol.regionId}</dd>
				<dt class="text-[var(--muted)]">Tier</dt>
				<dd>{tierFromPotential(idol.potential)} (PT {idol.potential})</dd>
				<dt class="text-[var(--muted)]">{$_('game.fame')}</dt>
				<dd>{fameTierFromPoints(idol.famePoints)} ({idol.famePoints})</dd>
				<dt class="text-[var(--muted)]">Age</dt>
				<dd>{idol.age}</dd>
				<dt class="text-[var(--muted)]">State</dt>
				<dd class="capitalize">{idol.activityState}</dd>
				<dt class="text-[var(--muted)]">{$_('game.wellness.physical')}</dt>
				<dd>{Math.round(idol.wellness.physical)}</dd>
				<dt class="text-[var(--muted)]">{$_('game.wellness.happiness')}</dt>
				<dd>{Math.round(idol.wellness.happiness)}</dd>
				<dt class="text-[var(--muted)]">{$_('game.wellness.stress')}</dt>
				<dd>{Math.round(idol.wellness.stress)}</dd>
				<dt class="text-[var(--muted)]">{$_('game.wellness.motivation')}</dt>
				<dd>{Math.round(idol.wellness.motivation)}</dd>
			</dl>
			{#if idol.enrichment}
				<div class="mt-4 space-y-2 border-t border-[var(--border)] pt-3">
					<p class="text-xs font-semibold text-[var(--muted)]">Background</p>
					<p class="text-sm">{idol.enrichment.background.pt || idol.enrichment.background.ja}</p>
					<p class="text-xs font-semibold text-[var(--muted)]">Aparência</p>
					<p class="text-sm">
						{idol.enrichment.physical.hairColor} {idol.enrichment.physical.hairStyle},
						{idol.enrichment.physical.eyeColor} {idol.enrichment.physical.eyeShape},
						{idol.enrichment.physical.skinTone}
						{#if idol.enrichment.physical.accessories}
							· {idol.enrichment.physical.accessories}
						{/if}
					</p>
				</div>
			{/if}
			<p class="mt-3 text-xs text-[var(--muted)]">{$_('profile.overviewHint')}</p>
		</Card>

		{:else if activeTab === 'stats'}
			<Card title={$_('profile.statsTitle')}>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-[var(--border)] text-left text-xs text-[var(--muted)]">
							<th class="pb-1">{$_('profile.statCol')}</th>
							<th class="pb-1 text-right">{$_('profile.valueCol')}</th>
							{#if compareIdol}
								<th class="pb-1 text-right">{compareIdol.nameRomaji}</th>
							{/if}
						</tr>
					</thead>
					<tbody>
						{#each VISIBLE_STAT_KEYS as key (key)}
							<tr class="border-b border-[var(--border)]/50">
								<td class="py-1 capitalize">{key}</td>
								<td class="py-1 text-right font-mono">{idol.visible[key]}</td>
								{#if compareIdol}
									<td class="py-1 text-right font-mono">{compareIdol.visible[key]}</td>
								{/if}
							</tr>
						{/each}
					</tbody>
				</table>
			</Card>

		{:else if activeTab === 'jobs'}
			<Card title={$_('profile.jobsTitle')}>
				{#if idolJobs.length === 0}
					<p class="text-sm text-[var(--muted)]">{$_('profile.noJobs')}</p>
				{:else}
					<ul class="space-y-2 text-sm">
						{#each idolJobs as j (`${j.week}-${j.jobId}`)}
							<li class="rounded border border-[var(--border)] bg-[var(--elevated)]/40 p-2">
								<span class="font-medium">{j.jobName}</span>
								<span class="ml-2 text-xs text-[var(--muted)]">W{j.week} · {j.gradeLetter} · ¥{j.revenueYen.toLocaleString()}</span>
							</li>
						{/each}
					</ul>
				{/if}
			</Card>

	{:else if activeTab === 'contract'}
		<Card title={$_('profile.contractTitle')}>
			{#if !contract}
				<p class="text-sm text-[var(--muted)]">{$_('profile.noContract')}</p>
			{:else}
				<dl class="grid grid-cols-2 gap-2 text-sm">
					<dt class="text-[var(--muted)]">{$_('contract.salary')}</dt>
					<dd>¥{contract.clauses.salaryYenPerMonth.toLocaleString()}</dd>
					<dt class="text-[var(--muted)]">{$_('contract.share')}</dt>
					<dd>{contract.clauses.revenueSharePercent}%</dd>
					<dt class="text-[var(--muted)]">{$_('contract.maxJobs')}</dt>
					<dd>{contract.clauses.maxJobsPerWeek}</dd>
					<dt class="text-[var(--muted)]">{$_('contract.expires')}</dt>
					<dd>W{contract.expiresWeek}</dd>
					<dt class="text-[var(--muted)]">{$_('contract.duration')}</dt>
					<dd>{contract.clauses.durationMonths} months</dd>
					<dt class="text-[var(--muted)]">Termination Fee</dt>
					<dd>¥{contract.clauses.terminationFeeYen.toLocaleString()}</dd>
				</dl>
				<div class="mt-4 flex gap-2">
					<button
						type="button"
						class="rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm font-medium hover:border-[var(--accent)] disabled:opacity-40"
						disabled={contract.status !== 'active'}
						onclick={() => { renewContractAction(idol!.id); }}
					>
						{$_('contract.renew')}
					</button>
					{#if !confirmTerminate}
						<button
							type="button"
							class="rounded-md border border-red-800 bg-[var(--surface)] px-3 py-1.5 text-sm font-medium text-red-400 hover:bg-red-900/30 disabled:opacity-40"
							disabled={contract.status !== 'active'}
							onclick={() => { confirmTerminate = true; }}
						>
							{$_('contract.terminate')}
						</button>
					{:else}
						<div class="flex items-center gap-2">
							<span class="text-xs text-red-400">¥{contract.clauses.terminationFeeYen.toLocaleString()} fee</span>
							<button
								type="button"
								class="rounded-md bg-red-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600"
								onclick={() => { terminateContractAction(idol!.id); confirmTerminate = false; }}
							>
								Confirm
							</button>
							<button
								type="button"
								class="text-xs text-[var(--muted)] underline"
								onclick={() => { confirmTerminate = false; }}
							>
								Cancel
							</button>
						</div>
					{/if}
				</div>
			{/if}
		</Card>

	{:else if activeTab === 'agenda'}
		<Card title="Weekly Schedule">
			{#if idolSchedule.length === 0}
				<p class="text-sm text-[var(--muted)]">No jobs assigned this week.</p>
			{:else}
				<div class="grid grid-cols-7 gap-1 text-xs">
					{#each DAY_NAMES as day, dayIdx (day)}
						<div class="space-y-1">
							<div class="border-b border-[var(--border)] pb-1 text-center font-semibold text-[var(--muted)]">{day}</div>
							{#each idolSchedule.filter(s => s.day === dayIdx) as s (s.jobId)}
								<div class="rounded border border-blue-800 bg-blue-900/20 p-1 text-[0.65rem]">{s.name}</div>
							{:else}
								<div class="p-1 text-center text-[var(--muted)]">—</div>
							{/each}
						</div>
					{/each}
				</div>
			{/if}
		</Card>

	{:else if activeTab === 'compare'}
			<Card title={$_('profile.compareTitle')}>
				<div class="mb-3 flex items-center gap-2 text-sm">
					<span class="text-[var(--muted)]">{$_('profile.comparePick')}</span>
					<select
						class="rounded border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-sm"
						onchange={(e) => {
							const v = (e.target as HTMLSelectElement).value;
							compareId = v || null;
						}}
					>
						<option value="">{$_('profile.compareNone')}</option>
						{#each $gameState.idols.filter((i) => i.id !== idol!.id) as other (other.id)}
							<option value={other.id}>{other.nameRomaji}</option>
						{/each}
					</select>
					{#if compareId}
						<button
							type="button"
							class="text-xs text-[var(--accent)] underline"
							onclick={() => (compareId = null)}
						>
							{$_('profile.compareClear')}
						</button>
					{/if}
				</div>

				{#if compareIdol}
					<table class="w-full text-sm">
						<thead>
							<tr class="border-b border-[var(--border)] text-left text-xs text-[var(--muted)]">
								<th class="pb-1">{$_('profile.statCol')}</th>
								<th class="pb-1 text-right">{idol.nameRomaji}</th>
								<th class="pb-1 text-right">{compareIdol.nameRomaji}</th>
							</tr>
						</thead>
						<tbody>
							{#each VISIBLE_STAT_KEYS as key (key)}
								<tr class="border-b border-[var(--border)]/50">
									<td class="py-1 capitalize">{key}</td>
									<td class="py-1 text-right font-mono">{idol.visible[key]}</td>
									<td class="py-1 text-right font-mono">{compareIdol.visible[key]}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				{/if}
			</Card>
		{/if}
	</div>
{/if}
