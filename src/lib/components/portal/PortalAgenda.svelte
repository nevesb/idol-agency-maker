<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import { gameState } from '$lib/stores/game-state';
	import type { IdolRuntime, JobCategory } from '$lib/types/simulation';
	import { _ } from 'svelte-i18n';

	const dayKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;

	const JOB_CAT_ICON: Partial<Record<JobCategory, string>> = {
		show: '🎤',
		tv: '📺',
		radio: '📻',
		recording: '🎵',
		dubbing: '🎙️',
		photo: '📷',
		meet_greet: '🤝',
		event: '🎪',
		endorsement: '💰',
		streaming: '📡',
		composition: '🎼'
	};

	let expandedIdolId: string | null = $state(null);

	function isBlocked(idol: IdolRuntime): boolean {
		return idol.activityState === 'burnout' || idol.activityState === 'crisis';
	}

	let idolSchedules = $derived(
		$gameState.idols.map((idol) => {
			const blocked = isBlocked(idol);
			const days = dayKeys.map((dk, i) => {
				if (blocked) {
					return { dayKey: dk, status: 'unavailable' as const, jobName: null, jobCat: null };
				}
				const assignment = $gameState.assignedJobs.find((a) => a.idolId === idol.id);
				const job = assignment
					? $gameState.jobBoard.find((j) => j.id === assignment.jobId && j.scheduledDay === i)
					: null;
				if (job) {
					return { dayKey: dk, status: 'job' as const, jobName: job.name, jobCat: job.category };
				}
				return { dayKey: dk, status: 'rest' as const, jobName: null, jobCat: null };
			});
			return { idol, days, blocked };
		})
	);

	let totalJobsThisWeek = $derived($gameState.assignedJobs.length);
	let idolsIdle = $derived(
		$gameState.idols.filter((idol) => !$gameState.assignedJobs.some((a) => a.idolId === idol.id) && !isBlocked(idol)).length
	);
	let idolsInBurnout = $derived(
		$gameState.idols.filter((idol) => isBlocked(idol)).length
	);
</script>

<div class="space-y-4">
	<h2 class="text-lg font-semibold">{$_('portal.tab.agenda')}</h2>

	<!-- Summary stats -->
	<div class="flex flex-wrap gap-3">
		<div class="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2">
			<span class="text-xs text-[var(--muted)]">{$_('portal.totalJobsWeek')}</span>
			<span class="ml-2 font-semibold">{totalJobsThisWeek}</span>
		</div>
		<div class="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2">
			<span class="text-xs text-[var(--muted)]">{$_('portal.idolsIdle')}</span>
			<span class="ml-2 font-semibold">{idolsIdle}</span>
		</div>
		<div class="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2">
			<span class="text-xs text-[var(--muted)]">{$_('portal.idolsBurnout')}</span>
			<span class="ml-2 font-semibold text-rose-400">{idolsInBurnout}</span>
		</div>
	</div>

	<!-- Schedule grid -->
	<div class="overflow-x-auto">
		<table class="w-full text-xs">
			<thead>
				<tr>
					<th class="sticky left-0 z-10 bg-[var(--surface)] pb-2 pr-3 text-left font-semibold text-[var(--muted)]">Idol</th>
					{#each dayKeys as dk (dk)}
						<th class="pb-2 text-center font-semibold text-[var(--muted)]">{$_(`schedule.dayShort.${dk}`)}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each idolSchedules as sched (sched.idol.id)}
					<tr
						class="cursor-pointer border-t border-[var(--border)] transition-colors hover:bg-[var(--elevated)]/30 {sched.blocked ? 'opacity-50' : ''}"
						onclick={() => (expandedIdolId = expandedIdolId === sched.idol.id ? null : sched.idol.id)}
					>
						<td class="sticky left-0 z-10 bg-[var(--surface)] py-2 pr-3 font-medium">
							<span class="truncate">{sched.idol.nameRomaji}</span>
							{#if sched.blocked}
								<span class="ml-1 text-rose-400">⛔</span>
							{/if}
						</td>
						{#each sched.days as day (day.dayKey)}
							<td class="py-2 text-center">
								{#if day.status === 'job' && day.jobCat}
									<div class="mx-auto max-w-[5rem] rounded bg-blue-500/15 px-1 py-0.5" title={day.jobName ?? ''}>
										<span class="mr-0.5">{JOB_CAT_ICON[day.jobCat] ?? '📋'}</span>
										<span class="truncate text-[10px]">{day.jobName}</span>
									</div>
								{:else if day.status === 'unavailable'}
									<span class="text-rose-400 text-[10px]">{$_('portal.unavailable')}</span>
								{:else}
									<span class="text-[10px] text-[var(--muted)] opacity-40">{$_('portal.rest')}</span>
								{/if}
							</td>
						{/each}
					</tr>
					{#if expandedIdolId === sched.idol.id}
						<tr>
							<td colspan="8" class="bg-[var(--elevated)]/30 px-3 py-3">
								<div class="grid gap-2 text-xs sm:grid-cols-3">
									<div>
										<span class="text-[var(--muted)]">{$_('game.fame')}:</span>
										<span class="ml-1 font-medium">{sched.idol.famePoints}</span>
									</div>
									<div>
										<span class="text-[var(--muted)]">{$_('game.wellness.stress')}:</span>
										<span class="ml-1 font-medium">{sched.idol.wellness.stress}</span>
									</div>
									<div>
										<span class="text-[var(--muted)]">{$_('game.wellness.motivation')}:</span>
										<span class="ml-1 font-medium">{sched.idol.wellness.motivation}</span>
									</div>
								</div>
							</td>
						</tr>
					{/if}
				{/each}
			</tbody>
		</table>
	</div>
</div>
