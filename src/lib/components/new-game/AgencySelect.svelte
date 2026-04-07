<script lang="ts">
	import type { PlayableAgency } from '$lib/simulation/agency-catalog';
	import { getMvpPlayableAgencies } from '$lib/simulation/agency-catalog';

	type Props = {
		selected: string | null;
		onselect: (agencyId: string) => void;
	};

	let { selected, onselect }: Props = $props();

	const agencies = getMvpPlayableAgencies();
</script>

<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
	{#each agencies as a (a.id)}
		<button
			type="button"
			class="rounded-xl border-2 p-4 text-left transition-all {selected === a.id
				? 'border-[var(--accent)] bg-[var(--accent)]/10 shadow-lg'
				: 'border-[var(--border)] bg-[var(--elevated)] hover:border-[var(--accent)]/50'}"
			onclick={() => onselect(a.id)}
		>
			<div class="flex items-center justify-between">
				<h3 class="text-base font-bold">{a.name}</h3>
				<span class="text-xs text-[var(--muted)]">{a.nameJp}</span>
			</div>
			<div class="mt-2 flex flex-wrap gap-2 text-xs">
				<span class="rounded bg-[var(--surface)] px-1.5 py-0.5 capitalize">{a.tier}</span>
				<span class="rounded bg-[var(--surface)] px-1.5 py-0.5">{a.regionLabel}</span>
				<span class="rounded bg-[var(--surface)] px-1.5 py-0.5">{a.focus}</span>
			</div>
			<p class="mt-2 text-xs text-[var(--muted)]">{a.description}</p>
			<div class="mt-3 flex justify-between text-xs text-[var(--muted)]">
				<span>¥{a.startingBudget.toLocaleString()}</span>
				<span>{a.rosterSize} idols</span>
			</div>
		</button>
	{/each}
</div>
