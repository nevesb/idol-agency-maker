<script lang="ts">
	import { browser } from '$app/environment';
	import { resolve } from '$app/paths';
	import WeeklyScheduleGrid from '$lib/components/schedule/WeeklyScheduleGrid.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import DataTable from '$lib/components/ui/DataTable.svelte';
	import TutorialHint from '$lib/components/ui/TutorialHint.svelte';
	import { canIdolTakeJob } from '$lib/simulation/jobs';
	import { computeTalentAverage } from '$lib/simulation/stats';
	import { getActiveTutorialHints } from '$lib/simulation/tutorial';
	import { assignJob, gameState, unassignJob } from '$lib/stores/game-state';
	import { dismissTutorialHint, dismissedTutorialIds } from '$lib/stores/tutorial';
	import { onMount } from 'svelte';
	import { _ } from 'svelte-i18n';

	let hints = $derived(
		getActiveTutorialHints($gameState.absoluteWeek, '/operacoes', $dismissedTutorialIds)
	);

	const JOB_FILTER_KEY = 'sia_ops_job_filter';
	const COLS_KEY = 'sia_ops_columns_v1';

	type ColKey = 'day' | 'difficulty' | 'payment' | 'fame' | 'match' | 'best' | 'assigned';

	type BoardRow = {
		id: string;
		name: string;
		category: string;
		day: string;
		difficulty: string;
		payment: string;
		fame: string;
		match: string;
		best: string;
		assigned: string;
	};
	const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

	const defaultCols: Record<ColKey, boolean> = {
		day: true,
		difficulty: true,
		payment: true,
		fame: true,
		match: true,
		best: true,
		assigned: true
	};

	let selectedJobId = $state<string | null>(null);
	let jobFilter = $state('');
	let prefsHydrated = $state(false);
	let colVisibility = $state<Record<ColKey, boolean>>({ ...defaultCols });
	let ctxMenu = $state<{ x: number; y: number; jobId: string } | null>(null);

	function loadColPrefs(): Record<ColKey, boolean> {
		if (!browser) return { ...defaultCols };
		try {
			const raw = localStorage.getItem(COLS_KEY);
			if (!raw) return { ...defaultCols };
			const o = JSON.parse(raw) as Partial<Record<ColKey, boolean>>;
			return { ...defaultCols, ...o };
		} catch {
			return { ...defaultCols };
		}
	}

	onMount(() => {
		if (browser) {
			jobFilter = localStorage.getItem(JOB_FILTER_KEY) ?? '';
			colVisibility = loadColPrefs();
			prefsHydrated = true;
		}
		const closeCtx = () => (ctxMenu = null);
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') closeCtx();
		};
		window.addEventListener('click', closeCtx);
		window.addEventListener('keydown', onKey);
		return () => {
			window.removeEventListener('click', closeCtx);
			window.removeEventListener('keydown', onKey);
		};
	});

	$effect(() => {
		if (!browser || !prefsHydrated) return;
		localStorage.setItem(JOB_FILTER_KEY, jobFilter);
	});

	$effect(() => {
		if (!browser || !prefsHydrated) return;
		localStorage.setItem(COLS_KEY, JSON.stringify(colVisibility));
	});

	let selectedJob = $derived($gameState.jobBoard.find((j) => j.id === selectedJobId) ?? null);

	let tableRows = $derived(
		$gameState.jobBoard
			.filter((job) => {
				const q = jobFilter.trim().toLowerCase();
				if (!q) return true;
				return (
					job.name.toLowerCase().includes(q) ||
					job.category.toLowerCase().includes(q) ||
					String(job.difficulty).includes(q)
				);
			})
		.map((job): BoardRow => {
			const assigned = $gameState.assignedJobs.find((a) => a.jobId === job.id)?.idolId ?? '';
			const idol = assigned ? $gameState.idols.find((i) => i.id === assigned) : null;
			const eligible = $gameState.idols.filter((i) =>
				canIdolTakeJob(i, job) && i.activityState !== 'burnout' && i.activityState !== 'crisis'
			);
			let bestName = '—';
			let bestTa = -1;
			for (const i of eligible) {
				const ta = computeTalentAverage(i.visible);
				if (ta > bestTa) {
					bestTa = ta;
					bestName = i.nameRomaji;
				}
			}
			return {
				id: job.id,
				name: job.name,
				category: job.category,
				day: DAY_NAMES[job.scheduledDay] ?? '?',
				difficulty: String(job.difficulty),
				payment: `¥${job.paymentYen.toLocaleString()}`,
				fame: String(job.fameGain),
				match: eligible.length ? `${eligible.length} ok` : '—',
				best: bestName,
				assigned: idol?.nameRomaji ?? '—'
			};
		})
	);

	let tableColumns = $derived.by(() => {
		const out: { key: keyof BoardRow & string; label: string; width?: string }[] = [
			{ key: 'name', label: $_('ops.colName'), width: '20%' },
			{ key: 'category', label: $_('ops.colCategory') }
		];
		if (colVisibility.day) out.push({ key: 'day', label: 'Day' });
		if (colVisibility.difficulty) out.push({ key: 'difficulty', label: 'D' });
		if (colVisibility.payment) out.push({ key: 'payment', label: $_('ops.colPay') });
		if (colVisibility.fame) out.push({ key: 'fame', label: $_('ops.colFame') });
		if (colVisibility.match) out.push({ key: 'match', label: $_('ops.colMatch') });
		if (colVisibility.best) out.push({ key: 'best', label: $_('ops.colBest') });
		if (colVisibility.assigned) out.push({ key: 'assigned', label: $_('ops.colAssigned') });
		return out;
	});
</script>

{#each hints as hint (hint.id)}
	<TutorialHint messageKey={hint.message} ondismiss={() => dismissTutorialHint(hint.id)} />
{/each}

<div class="mb-4 flex flex-wrap items-center justify-between gap-2">
	<div>
		<h1 class="text-xl font-semibold">{$_('nav.operacoes')}</h1>
		<p class="mt-1 text-sm text-[var(--muted)]">{$_('domain.operacoes')}</p>
	</div>
	<a
		href={resolve('/operacoes/resultados')}
		class="rounded-md border border-[var(--border)] bg-[var(--elevated)] px-3 py-1.5 text-sm hover:border-[var(--accent)]"
		data-sveltekit-preload-data="hover"
	>
		{$_('results.title')}
	</a>
</div>

{#if ctxMenu}
	<div
		role="menu"
		tabindex="-1"
		class="fixed z-50 min-w-[10rem] rounded-md border border-[var(--border)] bg-[var(--surface)] py-1 text-sm shadow-lg"
		style:left="{ctxMenu.x}px"
		style:top="{ctxMenu.y}px"
		onclick={(e) => e.stopPropagation()}
		onkeydown={(e) => e.stopPropagation()}
	>
		<button
			type="button"
			class="block w-full px-3 py-1.5 text-left hover:bg-[var(--elevated)]"
			onclick={() => {
				selectedJobId = ctxMenu!.jobId;
				ctxMenu = null;
			}}
		>
			{$_('ops.ctxSelect')}
		</button>
		<button
			type="button"
			class="block w-full px-3 py-1.5 text-left hover:bg-[var(--elevated)]"
			onclick={() => {
				unassignJob(ctxMenu!.jobId);
				ctxMenu = null;
			}}
		>
			{$_('ops.ctxUnassign')}
		</button>
	</div>
{/if}

<div class="grid gap-4 xl:grid-cols-[2fr_1fr]">
	<Card title={$_('game.jobsBoard')}>
		<label class="mb-1 block text-xs text-[var(--muted)]" for="job-filter"
			>{$_('ops.filterLabelLocal')}</label
		>
		<input
			id="job-filter"
			type="search"
			class="mb-2 w-full max-w-md rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-1.5 text-sm"
			placeholder={$_('ops.filterPlaceholder')}
			bind:value={jobFilter}
			autocomplete="off"
		/>
		{#if jobFilter.trim()}
			<p class="mb-2 text-xs text-[var(--accent)]">{$_('ops.filterActive')}</p>
		{/if}
		<p class="mb-2 text-xs font-semibold text-[var(--muted)]">{$_('ops.columnsTitle')}</p>
		<div class="mb-3 flex flex-wrap gap-3 text-xs">
			{#each Object.keys(colVisibility) as ck (ck)}
				<label class="flex cursor-pointer items-center gap-1">
					<input
						type="checkbox"
						checked={colVisibility[ck as ColKey]}
						onchange={(e) => {
							colVisibility = {
								...colVisibility,
								[ck]: e.currentTarget.checked
							};
						}}
					/>
					{$_(`ops.colToggle.${ck}`)}
				</label>
			{/each}
		</div>
		<DataTable
			columns={tableColumns}
			rows={tableRows}
			emptyLabel={$_('ops.noJobs')}
			getRowKey={(r) => r.id}
			selectedKey={selectedJobId}
			onRowClick={(r) => {
				selectedJobId = r.id;
			}}
			onRowContextMenu={(row, ev) => {
				ctxMenu = { x: ev.clientX, y: ev.clientY, jobId: row.id };
			}}
		/>
	</Card>

	<div class="space-y-4">
		<Card title={$_('ops.panelTitle')}>
			{#if selectedJob}
				<p class="font-medium">{selectedJob.name}</p>
				<p class="mt-1 text-xs text-[var(--muted)]">
					{selectedJob.category} · D{selectedJob.difficulty}
					{#if selectedJob.competitive}
						· {$_('game.competitive')}
					{/if}
				</p>
				<p class="mt-2 text-sm">¥{selectedJob.paymentYen.toLocaleString()} · +{selectedJob.fameGain} fama</p>
			<label class="mt-3 block text-xs text-[var(--muted)]" for="panel-assign">{$_('game.assign')}</label>
			<select
				id="panel-assign"
				class="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-1.5 text-sm"
				value={$gameState.assignedJobs.find((a) => a.jobId === selectedJob.id)?.idolId ?? ''}
				onchange={(e) => {
					const v = e.currentTarget.value;
					if (v) assignJob(selectedJob!.id, v);
					else unassignJob(selectedJob!.id);
				}}
			>
				<option value="">{$_('game.unassigned')}</option>
				{#each $gameState.idols as i (i.id)}
					{@const blocked = i.activityState === 'burnout' || i.activityState === 'crisis'}
					<option value={i.id} disabled={blocked || !canIdolTakeJob(i, selectedJob)}>
						{i.nameRomaji}{blocked ? ` (${i.activityState})` : !canIdolTakeJob(i, selectedJob) ? ' (stats)' : ''}
					</option>
				{/each}
			</select>
				<p class="mt-3 text-xs text-[var(--muted)]">{$_('ops.checklistHint')}</p>
			{:else}
				<p class="text-sm text-[var(--muted)]">{$_('ops.selectJob')}</p>
			{/if}
		</Card>

		<Card title={$_('schedule.title')}>
			<WeeklyScheduleGrid
				game={$gameState}
				onAssign={(idolId, jobId, _slot) => assignJob(jobId, idolId)}
				onUnassign={(_idolId, _slot) => {
					const assignment = $gameState.assignedJobs[_slot];
					if (assignment) unassignJob(assignment.jobId);
				}}
			/>
		</Card>

		<Card title={$_('game.lastWeek')}>
			{#if $gameState.lastWeekLog}
				<ul class="max-h-48 space-y-1 overflow-y-auto text-xs">
					{#each $gameState.lastWeekLog.jobResults as r (r.jobId + r.idolId)}
						<li class="flex justify-between gap-2 border-b border-[var(--border)]/60 py-1">
							<span>{r.outcome}</span>
							<span class="text-[var(--muted)]">{r.performance.toFixed(2)}</span>
						</li>
					{/each}
				</ul>
			{:else}
				<p class="text-sm text-[var(--muted)]">{$_('game.noResultsYet')}</p>
			{/if}
		</Card>
	</div>
</div>
