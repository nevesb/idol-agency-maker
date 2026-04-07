<script lang="ts">
	import { deriveCalendar } from '$lib/simulation/calendar';
	import {
		advanceWeekUiFlow,
		startLiveWeek,
		pauseLiveSim,
		resumeLiveSim,
		setSimSpeed,
		gameState
	} from '$lib/stores/game-state';
	import { absoluteWeek, timeMode } from '$lib/stores/time-control';
	import { _ } from 'svelte-i18n';
	import { derived } from 'svelte/store';

	const liveSim = derived(gameState, ($gs) => $gs.liveSim);
	const isRunning = derived(liveSim, ($ls) => $ls.status === 'running');
	const isPaused = derived(liveSim, ($ls) => $ls.status === 'paused');
	const isDayComplete = derived(liveSim, ($ls) => $ls.status === 'day_complete');
	const isLiveActive = derived(
		liveSim,
		($ls) => $ls.status === 'running' || $ls.status === 'paused' || $ls.status === 'day_complete'
	);

	let showNoJobsWarning = $state(false);

	function handlePlayPause() {
		if ($isRunning || $isDayComplete) {
			pauseLiveSim();
		} else if ($isPaused) {
			resumeLiveSim();
		} else {
			if ($gameState.assignedJobs.length === 0) {
				showNoJobsWarning = true;
				return;
			}
			startLiveWeek();
		}
	}

	function confirmAdvanceAnyway() {
		showNoJobsWarning = false;
		startLiveWeek();
	}

	function cycleSpeed() {
		const next = $liveSim.speed === 1 ? 2 : $liveSim.speed === 2 ? 4 : 1;
		setSimSpeed(next as 1 | 2 | 4);
	}
</script>

<footer
	class="fixed right-0 bottom-0 left-0 z-40 border-t border-[var(--fm-footer-border)] bg-[var(--fm-footer-bg)] px-3 py-2 shadow-[0_-4px_24px_rgba(0,0,0,0.35)] sm:px-4"
>
	<div class="mx-auto flex max-w-[1920px] flex-wrap items-center justify-between gap-3">
		<div class="flex flex-wrap items-center gap-2 text-[12px] text-[var(--muted)]">
			<span class="font-semibold text-[var(--text)]" data-testid="tt-week-label">
				{$_('time.week', { values: { n: $absoluteWeek } })}
			</span>
			<span aria-hidden="true">·</span>
			{#key $absoluteWeek}
				{@const cal = deriveCalendar($absoluteWeek)}
				<span>
					Y{cal.year} M{cal.month} W{cal.weekInMonth} · {$_(`time.season.${cal.season}`)}
				</span>
			{/key}

			{#if $isLiveActive}
				<span aria-hidden="true">·</span>
				<span class="font-semibold text-[var(--accent)]">
					{$_('time.day', { values: { n: $liveSim.currentDay + 1 } })}
				</span>
				<span class="text-[10px] text-[var(--muted)]">
					{$_(`time.dayNames.${$liveSim.currentDay}`)}
				</span>
				<div
					class="h-1.5 w-20 overflow-hidden rounded-full bg-[var(--border)]"
					role="progressbar"
					aria-valuenow={$liveSim.currentDay}
					aria-valuemin={0}
					aria-valuemax={7}
				>
					<div
						class="h-full rounded-full bg-[var(--accent)] transition-all duration-300"
						style="width: {($liveSim.currentDay / 7) * 100}%"
					></div>
				</div>
			{/if}
		</div>

		<div class="flex flex-wrap items-center gap-2">
			{#if $isLiveActive}
				<button
					type="button"
					class="rounded-md border border-[var(--border)] bg-[var(--elevated)] px-2 py-1 text-[11px] font-semibold text-[var(--text)] hover:border-[var(--accent)]"
					onclick={cycleSpeed}
					title={$_('time.speed')}
				>
					{$liveSim.speed}x
				</button>
			{/if}

			<button
				type="button"
				class="rounded-md border border-[var(--border)] bg-[var(--elevated)] px-3 py-2 text-[12px] font-semibold text-[var(--text)] hover:border-[var(--accent)]"
				onclick={handlePlayPause}
			>
				{#if $isRunning}
					{$_('time.pause')}
				{:else if $isPaused || $isDayComplete}
					{$_('time.live')}
				{:else}
					{$_('time.live')}
				{/if}
			</button>

			<button
				type="button"
				class="fm26-continue"
				data-testid="tt-skip-week"
				disabled={$isLiveActive}
				onclick={async () => {
					await advanceWeekUiFlow();
				}}
			>
				{$_('time.skip')}
			</button>
		</div>
	</div>

	{#if showNoJobsWarning}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div
				class="max-w-sm rounded-xl border border-[var(--border)] bg-[var(--elevated)] p-6 shadow-2xl"
			>
				<h3 class="text-lg font-bold">{$_('tutorial.noJobsTitle')}</h3>
				<p class="mt-2 text-sm text-[var(--muted)]">{$_('tutorial.noJobsBody')}</p>
				<div class="mt-4 flex gap-3">
					<button
						class="flex-1 rounded-lg bg-[var(--surface)] px-3 py-2 text-sm"
						onclick={() => (showNoJobsWarning = false)}
					>
						{$_('tutorial.goBack')}
					</button>
					<button
						class="flex-1 rounded-lg bg-[var(--accent)] px-3 py-2 text-sm text-[#050608]"
						onclick={confirmAdvanceAnyway}
					>
						{$_('tutorial.advanceAnyway')}
					</button>
				</div>
			</div>
		</div>
	{/if}
</footer>
