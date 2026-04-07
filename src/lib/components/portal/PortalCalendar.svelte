<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import { deriveCalendar } from '$lib/simulation/calendar';
	import { gameState } from '$lib/stores/game-state';
	import type { JobCategory } from '$lib/types/simulation';
	import { _ } from 'svelte-i18n';

	let weekOffset = $state(0);
	let viewWeek = $derived($gameState.absoluteWeek + weekOffset);
	let cal = $derived(deriveCalendar(viewWeek));
	let isCurrentWeek = $derived(weekOffset === 0);

	const dayKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;

	const JOB_CATEGORY_COLORS: Partial<Record<JobCategory, string>> = {
		show: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
		tv: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
		radio: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
		recording: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
		dubbing: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
		photo: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
		meet_greet: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
		event: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
		endorsement: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
		streaming: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
		composition: 'bg-violet-500/20 text-violet-300 border-violet-500/40'
	};

	function jobColor(cat: JobCategory): string {
		return JOB_CATEGORY_COLORS[cat] ?? 'bg-gray-500/20 text-gray-300 border-gray-500/40';
	}

	let assignedJobsThisWeek = $derived($gameState.assignedJobs);

	let calendarDays = $derived(
		dayKeys.map((dk, i) => {
			const dayJobs = $gameState.jobBoard
				.filter((j) => j.scheduledDay === i && assignedJobsThisWeek.some((a) => a.jobId === j.id))
				.map((j) => {
					const idol = $gameState.idols.find((idol) =>
						assignedJobsThisWeek.some((a) => a.jobId === j.id && a.idolId === idol.id)
					);
					return { job: j, idolName: idol?.nameRomaji ?? '?' };
				});
			return { dayKey: dk, dayIndex: i, entries: dayJobs };
		})
	);

	let expiringContracts = $derived(
		$gameState.contracts
			.filter((c) => c.status === 'active' && c.expiresWeek - $gameState.absoluteWeek <= 4)
			.map((c) => {
				const idol = $gameState.idols.find((i) => i.contractId === c.id);
				return { contract: c, idolName: idol?.nameRomaji ?? '?' };
			})
	);
</script>

<div class="space-y-4">
	<!-- Header with navigation -->
	<div class="flex items-center justify-between">
		<h2 class="text-lg font-semibold">{$_('portal.tab.calendar')}</h2>
		<div class="flex items-center gap-3">
			<button
				class="rounded px-2 py-1 text-sm text-[var(--muted)] hover:bg-[var(--elevated)]"
				onclick={() => weekOffset--}
			>
				←
			</button>
			<span class="text-sm font-medium">
				W{viewWeek} · Y{cal.year} M{cal.month} · {$_(`time.season.${cal.season}`)}
			</span>
			<button
				class="rounded px-2 py-1 text-sm text-[var(--muted)] hover:bg-[var(--elevated)]"
				onclick={() => weekOffset++}
			>
				→
			</button>
			{#if !isCurrentWeek}
				<button
					class="rounded-md bg-[var(--elevated)] px-2 py-1 text-xs text-[var(--accent)]"
					onclick={() => (weekOffset = 0)}
				>
					{$_('portal.thisWeek')}
				</button>
			{/if}
		</div>
	</div>

	<!-- Week grid -->
	<div class="grid grid-cols-7 gap-2">
		{#each calendarDays as day (day.dayKey)}
			<div
				class="min-h-[10rem] rounded-lg border p-2 {isCurrentWeek ? 'border-[var(--border)]' : 'border-[var(--border)]/50'} bg-[var(--surface)]"
			>
				<div class="mb-2 text-center text-xs font-semibold text-[var(--muted)] uppercase">
					{$_(`schedule.dayShort.${day.dayKey}`)}
				</div>
				{#if day.entries.length === 0}
					<p class="text-center text-[10px] text-[var(--muted)] opacity-50">—</p>
				{:else}
					<div class="space-y-1">
						{#each day.entries as entry (`${entry.job.id}`)}
							<div class="rounded border px-1.5 py-1 text-[10px] leading-tight {jobColor(entry.job.category)}">
								<div class="font-semibold truncate">{entry.job.name}</div>
								<div class="text-[9px] opacity-80 truncate">{entry.idolName}</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{/each}
	</div>

	<!-- Important dates -->
	{#if expiringContracts.length > 0}
		<Card title={$_('portal.upcomingEvents')}>
			<ul class="space-y-1.5 text-sm">
				{#each expiringContracts as entry (`${entry.contract.id}`)}
					<li class="flex items-center gap-2 rounded-md bg-rose-500/10 px-2 py-1.5">
						<span class="text-xs text-rose-400">W{entry.contract.expiresWeek}</span>
						<span>{entry.idolName} — {$_('contract.expires')}</span>
					</li>
				{/each}
			</ul>
		</Card>
	{/if}
</div>
