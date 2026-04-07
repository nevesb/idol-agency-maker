<script lang="ts">
	import type { GameStateV1, IdolRuntime } from '$lib/types/simulation';
	import { wellnessColorClass } from '$lib/simulation/economy';
	import { _ } from 'svelte-i18n';

	type Props = {
		game: GameStateV1;
		onAssign?: (idolId: string, jobId: string, slot: number) => void;
		onUnassign?: (idolId: string, slot: number) => void;
	};

	let { game, onAssign, onUnassign }: Props = $props();

	const dayKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
	const SHIFTS = ['AM', 'PM'] as const;
	const TOTAL_SLOTS = 14;

	function jobName(jobId: string): string {
		return game.jobBoard.find((j) => j.id === jobId)?.name ?? jobId.slice(0, 10);
	}

	function slotsForIdol(idolId: string): (string | null)[] {
		const jobs = game.assignedJobs.filter((a) => a.idolId === idolId);
		const slots = Array<string | null>(TOTAL_SLOTS).fill(null);
		for (const a of jobs) {
			const job = game.jobBoard.find((j) => j.id === a.jobId);
			if (job) {
				const daySlot = job.scheduledDay * 2;
				if (slots[daySlot] === null) {
					slots[daySlot] = a.jobId;
				} else if (daySlot + 1 < TOTAL_SLOTS && slots[daySlot + 1] === null) {
					slots[daySlot + 1] = a.jobId;
				}
			}
		}
		return slots;
	}

	function isIdolBlocked(idol: IdolRuntime): boolean {
		return idol.activityState === 'burnout' || idol.activityState === 'crisis';
	}

	function wellnessColor(idol: IdolRuntime): string {
		const avg = Math.round(
			(idol.wellness.physical + idol.wellness.happiness + idol.wellness.motivation + (100 - idol.wellness.stress)) / 4
		);
		return wellnessColorClass(avg);
	}

	function loadLevel(idolId: string): string {
		const count = game.assignedJobs.filter((a) => a.idolId === idolId).length;
		if (count >= 5) return 'overloaded';
		if (count >= 3) return 'heavy';
		if (count >= 1) return 'light';
		return 'idle';
	}

	let draggedJobId = $state<string | null>(null);

	function handleDragStart(e: DragEvent, jobId: string) {
		draggedJobId = jobId;
		e.dataTransfer?.setData('text/plain', jobId);
	}

	function handleDrop(e: DragEvent, idolId: string, slot: number) {
		e.preventDefault();
		const jobId = e.dataTransfer?.getData('text/plain') ?? draggedJobId;
		if (jobId && onAssign) {
			onAssign(idolId, jobId, slot);
		}
		draggedJobId = null;
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
	}
</script>

<div class="overflow-x-auto text-xs">
	<div class="mb-1 grid min-w-[42rem] grid-cols-[6rem_repeat(14,1fr)] gap-px text-center">
		<div></div>
		{#each dayKeys as dk (dk)}
			<div class="col-span-2 border-b border-[var(--border)] pb-1 font-semibold text-[var(--muted)]">
				{$_(`schedule.dayShort.${dk}`)}
			</div>
		{/each}
		<div></div>
		{#each dayKeys as _dk, _i}
			{#each SHIFTS as shift}
				<div class="text-[0.55rem] text-[var(--muted)]">{shift}</div>
			{/each}
		{/each}
	</div>

	{#each game.idols as idol (idol.id)}
		{@const color = wellnessColor(idol)}
		{@const load = loadLevel(idol.id)}
		{@const blocked = isIdolBlocked(idol)}
		<div class="mb-px grid min-w-[42rem] grid-cols-[6rem_repeat(14,1fr)] gap-px {blocked ? 'opacity-40' : ''}">
			<div class="flex items-center gap-1 pr-1 text-[0.65rem] font-medium" title={blocked ? `${idol.activityState} — cannot work` : ''}>
				<span
					class="inline-block h-2 w-2 rounded-full"
					class:bg-green-500={color === 'green'}
					class:bg-yellow-500={color === 'yellow'}
					class:bg-red-500={color === 'red'}
					class:bg-purple-500={color === 'purple'}
				></span>
				<span class="truncate" title={idol.nameRomaji}>{idol.nameRomaji}</span>
				{#if blocked}
					<span class="text-red-400" title={idol.activityState}>⛔</span>
				{:else if load === 'overloaded'}
					<span class="text-red-400" title="Overloaded">!</span>
				{/if}
			</div>
			{#each slotsForIdol(idol.id) as jobId, slotIdx (slotIdx)}
				<button
					type="button"
					role="gridcell"
					tabindex="-1"
					class="min-h-[1.8rem] rounded border px-0.5 py-0.5 text-left text-[0.55rem] leading-tight transition-colors {blocked ? 'cursor-not-allowed' : 'cursor-pointer'} {jobId ? 'border-blue-800 bg-blue-900/20' : 'border-[var(--border)] bg-[var(--elevated)]'}"
					disabled={blocked}
					ondragover={blocked ? undefined : handleDragOver}
					ondrop={blocked ? undefined : (e) => handleDrop(e, idol.id, slotIdx)}
					onclick={() => {
						if (!blocked && jobId && onUnassign) onUnassign(idol.id, slotIdx);
					}}
				>
					{#if jobId}
						<span
							role="img"
							aria-label="Drag job"
							class={blocked ? '' : 'cursor-grab'}
							draggable={!blocked}
							ondragstart={blocked ? undefined : (e) => handleDragStart(e, jobId)}
						>
							{jobName(jobId)}
						</span>
					{/if}
				</button>
			{/each}
		</div>
	{/each}
</div>
