<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { goto } from '$app/navigation';
	import { startNewGame } from '$lib/stores/game-state';
	import AgencySelect from '$lib/components/new-game/AgencySelect.svelte';
	import { getMvpPlayableAgencies } from '$lib/simulation/agency-catalog';
	import type { ManagementTraitId, ProducerProfile } from '$lib/types/simulation';
	import { fade } from 'svelte/transition';

	const TRAITS: { id: ManagementTraitId; icon: string; jp: string }[] = [
		{ id: 'aggressive', icon: '⚔️', jp: '攻撃的' },
		{ id: 'cautious', icon: '🛡️', jp: '慎重' },
		{ id: 'visionary', icon: '🔮', jp: '先見' },
		{ id: 'pragmatic', icon: '📊', jp: '実利的' },
		{ id: 'charismatic', icon: '✨', jp: '魅力的' }
	];

	let step = $state(1);

	let name = $state('');
	let sex = $state<'male' | 'female' | 'other'>('other');
	let birthMonth = $state(4);
	let birthDay = $state(1);
	let selectedTraits = $state<ManagementTraitId[]>([]);
	let selectedAgencyId = $state<string | null>(null);
	let selectedAgency = $derived(
		selectedAgencyId
			? (getMvpPlayableAgencies().find((a) => a.id === selectedAgencyId) ?? null)
			: null
	);

	function toggleTrait(t: ManagementTraitId) {
		if (selectedTraits.includes(t)) {
			selectedTraits = selectedTraits.filter((x) => x !== t);
		} else if (selectedTraits.length < 2) {
			selectedTraits = [...selectedTraits, t];
		}
	}

	const nameValid = $derived(name.trim().length >= 3 && name.trim().length <= 24);
	const canStep2 = $derived(selectedTraits.length === 2);

	function onStart() {
		if (!selectedAgency) return;
		const profile: ProducerProfile = {
			name: name.trim(),
			sex,
			birthday: { month: birthMonth, day: birthDay },
			managementTraits: selectedTraits as [ManagementTraitId, ManagementTraitId]
		};
		startNewGame(selectedAgency.name, undefined, {
			worldPack: 'embedded_sample',
			startingRegionId: selectedAgency.regionId,
			producerProfile: profile,
			selectedAgencyId: selectedAgency.id
		});
		goto('/portal');
	}
</script>

<div class="mx-auto max-w-2xl px-4 py-12">
	<!-- Step indicator -->
	<div class="mb-8 flex items-center justify-center gap-2 text-sm text-[var(--muted)]">
		{#each [1, 2, 3, 4] as s}
			<span
				class="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors
					{s === step
					? 'bg-[var(--accent)] text-white'
					: s < step
						? 'bg-[var(--accent)]/30 text-[var(--accent)]'
						: 'bg-[var(--surface)] text-[var(--muted)]'}"
			>
				{s}
			</span>
			{#if s < 4}
				<div
					class="h-0.5 w-8 transition-colors {s < step
						? 'bg-[var(--accent)]'
						: 'bg-[var(--border)]'}"
				></div>
			{/if}
		{/each}
	</div>

	<!-- Step 1: Basic Info -->
	{#if step === 1}
		<div in:fade={{ duration: 200 }}>
			<h1 class="text-2xl font-bold">{$_('newGame.step1Title')}</h1>

			<div class="mt-6 space-y-5">
				<div>
					<label for="producer-name" class="block text-sm font-medium"
						>{$_('newGame.nameLabel')}</label
					>
					<input
						id="producer-name"
						type="text"
						maxlength={24}
						bind:value={name}
						placeholder={$_('newGame.namePlaceholder')}
						class="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--elevated)] px-3 py-2 text-sm
							focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
					/>
					{#if name.length > 0 && !nameValid}
						<p class="mt-1 text-xs text-red-400">{$_('newGame.nameValidation')}</p>
					{/if}
				</div>

				<div>
					<span class="block text-sm font-medium">{$_('newGame.sexLabel')}</span>
					<div class="mt-1 flex gap-2">
						{#each ['male', 'female', 'other'] as s}
							<button
								type="button"
								class="rounded-lg border px-4 py-2 text-sm transition-all
									{sex === s
									? 'border-[var(--accent)] bg-[var(--accent)]/10 font-semibold text-[var(--accent)]'
									: 'border-[var(--border)] bg-[var(--elevated)] hover:border-[var(--muted)]'}"
								onclick={() => (sex = s as 'male' | 'female' | 'other')}
							>
								{$_(`newGame.${s}`)}
							</button>
						{/each}
					</div>
				</div>

				<div>
					<span class="block text-sm font-medium">{$_('newGame.birthdayLabel')}</span>
					<div class="mt-1 flex items-center gap-3">
						<div class="flex items-center gap-1.5">
							<label for="birth-month" class="text-xs text-[var(--muted)]"
								>{$_('newGame.monthLabel')}</label
							>
							<select
								id="birth-month"
								bind:value={birthMonth}
								class="rounded-lg border border-[var(--border)] bg-[var(--elevated)] px-2 py-1.5 text-sm"
							>
								{#each Array.from({ length: 12 }, (_, i) => i + 1) as m}
									<option value={m}>{m}</option>
								{/each}
							</select>
						</div>
						<div class="flex items-center gap-1.5">
							<label for="birth-day" class="text-xs text-[var(--muted)]"
								>{$_('newGame.dayLabel')}</label
							>
							<select
								id="birth-day"
								bind:value={birthDay}
								class="rounded-lg border border-[var(--border)] bg-[var(--elevated)] px-2 py-1.5 text-sm"
							>
								{#each Array.from({ length: 31 }, (_, i) => i + 1) as d}
									<option value={d}>{d}</option>
								{/each}
							</select>
						</div>
					</div>
				</div>
			</div>

			<div class="mt-8 flex justify-end">
				<button
					type="button"
					disabled={!nameValid}
					class="rounded-lg bg-[var(--accent)] px-6 py-2 text-sm font-semibold text-white transition-opacity disabled:opacity-40"
					onclick={() => (step = 2)}
				>
					{$_('newGame.next')}
				</button>
			</div>
		</div>
	{/if}

	<!-- Step 2: Management Traits -->
	{#if step === 2}
		<div in:fade={{ duration: 200 }}>
			<h1 class="text-2xl font-bold">{$_('newGame.step2Title')}</h1>
			<p class="mt-1 text-sm text-[var(--muted)]">{$_('newGame.traitsHint')}</p>
			<p class="mt-0.5 text-xs text-[var(--muted)]">
				{$_('newGame.traitsTitle')} ({selectedTraits.length}/2)
			</p>

			<div class="mt-6 grid gap-3">
				{#each TRAITS as t}
					{@const selected = selectedTraits.includes(t.id)}
					{@const disabled = !selected && selectedTraits.length >= 2}
					<button
						type="button"
						class="group relative flex items-start gap-4 rounded-xl border-2 p-4 text-left transition-all
							{selected
							? 'border-[var(--accent)] bg-[var(--accent)]/10 shadow-md shadow-[var(--accent)]/10'
							: disabled
								? 'cursor-not-allowed border-[var(--border)] bg-[var(--surface)] opacity-50'
								: 'border-[var(--border)] bg-[var(--elevated)] hover:border-[var(--accent)]/50 hover:shadow-sm'}"
						onclick={() => toggleTrait(t.id)}
					>
						<span class="mt-0.5 text-2xl leading-none">{t.icon}</span>
						<div class="min-w-0 flex-1">
							<div class="flex items-baseline gap-2">
								<span class="font-semibold">{$_(`newGame.trait.${t.id}.label`)}</span>
								<span class="text-xs text-[var(--muted)]">{t.jp}</span>
							</div>
							<p class="mt-1 text-xs leading-relaxed text-[var(--muted)]">
								{$_(`newGame.trait.${t.id}.desc`)}
							</p>
						</div>
						{#if selected}
							<span
								class="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent)] text-[10px] text-white"
								>✓</span
							>
						{/if}
					</button>
				{/each}
			</div>

			<div class="mt-8 flex justify-between">
				<button
					type="button"
					class="rounded-lg border border-[var(--border)] px-6 py-2 text-sm hover:bg-[var(--surface)]"
					onclick={() => (step = 1)}
				>
					{$_('newGame.back')}
				</button>
				<button
					type="button"
					disabled={!canStep2}
					class="rounded-lg bg-[var(--accent)] px-6 py-2 text-sm font-semibold text-white transition-opacity disabled:opacity-40"
					onclick={() => (step = 3)}
				>
					{$_('newGame.next')}
				</button>
			</div>
		</div>
	{/if}

	<!-- Step 3: Agency Selection -->
	{#if step === 3}
		<div in:fade={{ duration: 200 }}>
			<h1 class="text-2xl font-bold">{$_('newGame.agencyTitle')}</h1>
			<p class="mt-1 text-sm text-[var(--muted)]">{$_('newGame.agencyHint')}</p>

			<div class="mt-6">
				<AgencySelect
					selected={selectedAgencyId}
					onselect={(id) => (selectedAgencyId = id)}
				/>
			</div>

			<div class="mt-8 flex justify-between">
				<button
					type="button"
					class="rounded-lg border border-[var(--border)] px-6 py-2 text-sm hover:bg-[var(--surface)]"
					onclick={() => (step = 2)}
				>
					{$_('newGame.back')}
				</button>
				<button
					type="button"
					disabled={!selectedAgencyId}
					class="rounded-lg bg-[var(--accent)] px-6 py-2 text-sm font-semibold text-white transition-opacity disabled:opacity-40"
					onclick={() => (step = 4)}
				>
					{$_('newGame.next')}
				</button>
			</div>
		</div>
	{/if}

	<!-- Step 4: Confirmation -->
	{#if step === 4}
		<div in:fade={{ duration: 200 }}>
			<h1 class="text-2xl font-bold">{$_('newGame.step3Title')}</h1>
			<p class="mt-1 text-sm text-[var(--muted)]">{$_('newGame.summary')}</p>

			<div class="mt-6 space-y-4">
				<div class="rounded-xl border border-[var(--border)] bg-[var(--elevated)] p-5">
					<h3 class="text-lg font-semibold">{name}</h3>
					<div class="mt-2 flex gap-4 text-sm text-[var(--muted)]">
						<span>{$_(`newGame.${sex}`)}</span>
						<span>{$_('newGame.birthdayLabel')}: {birthMonth}/{birthDay}</span>
					</div>
					<div class="mt-3 flex flex-wrap gap-2">
						{#each selectedTraits as tid}
							{@const t = TRAITS.find((x) => x.id === tid)}
							{#if t}
								<span
									class="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent)]/10 px-3 py-1 text-sm font-medium text-[var(--accent)]"
								>
									{t.icon}
									{$_(`newGame.trait.${t.id}.label`)}
									<span class="text-xs opacity-70">({t.jp})</span>
								</span>
							{/if}
						{/each}
					</div>
				</div>

				{#if selectedAgency}
					<div class="rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/5 p-5">
						<div class="flex items-center justify-between">
							<h3 class="text-lg font-semibold">{selectedAgency.name}</h3>
							<span class="text-sm text-[var(--muted)]">{selectedAgency.nameJp}</span>
						</div>
						<div class="mt-2 flex flex-wrap gap-2 text-xs">
							<span class="rounded bg-[var(--surface)] px-1.5 py-0.5 capitalize">{selectedAgency.tier}</span>
							<span class="rounded bg-[var(--surface)] px-1.5 py-0.5">{selectedAgency.regionLabel}</span>
							<span class="rounded bg-[var(--surface)] px-1.5 py-0.5">{selectedAgency.focus}</span>
						</div>
						<div class="mt-2 flex justify-between text-xs text-[var(--muted)]">
							<span>¥{selectedAgency.startingBudget.toLocaleString()}</span>
							<span>{selectedAgency.rosterSize} idols</span>
						</div>
					</div>
				{/if}
			</div>

			<div class="mt-8 flex justify-between">
				<button
					type="button"
					class="rounded-lg border border-[var(--border)] px-6 py-2 text-sm hover:bg-[var(--surface)]"
					onclick={() => (step = 3)}
				>
					{$_('newGame.back')}
				</button>
				<button
					type="button"
					class="rounded-lg bg-[var(--accent)] px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-[var(--accent)]/20 transition-transform hover:scale-[1.02] active:scale-[0.98]"
					onclick={onStart}
				>
					{$_('newGame.startCampaign')}
				</button>
			</div>
		</div>
	{/if}
</div>
