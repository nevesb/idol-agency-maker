<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import IdolAvatar from '$lib/components/ui/IdolAvatar.svelte';
	import TutorialHint from '$lib/components/ui/TutorialHint.svelte';
	import {
		SCOUTING_PIPELINES,
		type ScoutingPipeline,
		type ScoutingPipelineInfo
	} from '$lib/simulation/scouting';
	import { getActiveTutorialHints } from '$lib/simulation/tutorial';
	import { gameState, startScoutMission, signScoutedIdol } from '$lib/stores/game-state';
	import { dismissTutorialHint, dismissedTutorialIds } from '$lib/stores/tutorial';
	import { _ } from 'svelte-i18n';

	let hints = $derived(
		getActiveTutorialHints($gameState.absoluteWeek, '/scouting', $dismissedTutorialIds)
	);

	const REGIONS = [
		{ id: 'tokyo', label: 'Tokyo' },
		{ id: 'osaka', label: 'Osaka' },
		{ id: 'fukuoka', label: 'Fukuoka' },
		{ id: 'sapporo', label: 'Sapporo' },
		{ id: 'nagoya', label: 'Nagoya' }
	];

	const PIPELINE_ICONS: Record<ScoutingPipeline, string> = {
		street: '🔍',
		audition: '🎤',
		transfer: '💼'
	};

	const PIPELINE_I18N: Record<ScoutingPipeline, string> = {
		street: 'scouting.street',
		audition: 'scouting.audition',
		transfer: 'scouting.transfer'
	};

	let selectedPipeline = $state<ScoutingPipelineInfo | null>(null);
	let selectedScoutId = $state('');
	let selectedRegionId = $state('');
	let launchMessage = $state('');

	function handleLaunch() {
		if (!selectedPipeline || !selectedScoutId || !selectedRegionId) return;

		const before = $gameState.balanceYen;
		startScoutMission(selectedPipeline.id, selectedScoutId, selectedRegionId);
		const after = $gameState.balanceYen;

		if (after < before) {
			launchMessage = $_('scouting.missionLaunched');
			selectedPipeline = null;
			selectedScoutId = '';
			selectedRegionId = '';
			setTimeout(() => (launchMessage = ''), 3000);
		} else {
			launchMessage = $_('scouting.insufficientFunds');
			setTimeout(() => (launchMessage = ''), 3000);
		}
	}

	function costEstimate(p: ScoutingPipelineInfo): string {
		return `¥${p.costRange[0].toLocaleString()} – ¥${p.costRange[1].toLocaleString()}`;
	}
</script>

{#each hints as hint (hint.id)}
	<TutorialHint messageKey={hint.message} ondismiss={() => dismissTutorialHint(hint.id)} />
{/each}

<h1 class="text-xl font-semibold">{$_('scouting.title')}</h1>
<p class="mt-1 text-sm text-[var(--muted)]">{$_('scouting.subtitle')}</p>

<div class="mt-6 grid gap-6 lg:grid-cols-3">
	<!-- LEFT: Pipeline selection -->
	<div class="space-y-4">
		<Card title={$_('scouting.pipelines')}>
			<div class="space-y-3">
				{#each SCOUTING_PIPELINES as p (p.id)}
					<button
						type="button"
						class="w-full rounded-lg border p-3 text-left transition-colors {selectedPipeline?.id === p.id
							? 'border-[var(--accent)] bg-[var(--accent)]/10'
							: 'border-[var(--border)] bg-[var(--elevated)]/40 hover:border-[var(--accent)]/50'}"
						onclick={() => (selectedPipeline = p)}
					>
						<div class="flex items-center gap-2 font-medium">
							<span>{PIPELINE_ICONS[p.id]}</span>
							<span>{$_(PIPELINE_I18N[p.id])}</span>
						</div>
						<div class="mt-1 text-xs text-[var(--muted)]">{p.description}</div>
						<div class="mt-2 flex flex-wrap gap-3 text-xs">
							<span>{$_('scouting.cost')}: {costEstimate(p)}</span>
							<span>{$_('scouting.precision')}: {p.precisionRange[0]}–{p.precisionRange[1]}%</span>
							<span>{$_('scouting.duration')}: {p.durationWeeks[0]}–{p.durationWeeks[1]}w</span>
						</div>
					</button>
				{/each}
			</div>
		</Card>

		<Card title={$_('scouting.scouts')}>
			{#if $gameState.scoutPool.length === 0}
				<p class="text-sm text-[var(--muted)]">{$_('scouting.noScouts')}</p>
			{:else}
				<ul class="space-y-2 text-sm">
					{#each $gameState.scoutPool as scout (scout.id)}
						<li>
							<button
								type="button"
								class="w-full rounded-lg border p-2 text-left transition-colors {selectedScoutId === scout.id
									? 'border-[var(--accent)] bg-[var(--accent)]/10'
									: 'border-[var(--border)] hover:border-[var(--accent)]/50'}"
								onclick={() => (selectedScoutId = scout.id)}
							>
								<div class="font-medium">{scout.name}</div>
								<div class="text-xs text-[var(--muted)]">
									{$_('scouting.skill')}: {scout.skill} · {scout.specialty} · {scout.regionId}
								</div>
							</button>
						</li>
					{/each}
				</ul>
			{/if}
		</Card>
	</div>

	<!-- CENTER: Mission launcher -->
	<div class="space-y-4">
		<Card title={$_('scouting.launchMission')}>
			<div class="space-y-4">
				{#if !selectedPipeline}
					<p class="text-sm text-[var(--muted)]">{$_('scouting.selectPipeline')}</p>
				{:else}
					<div class="rounded-lg border border-[var(--border)] bg-[var(--elevated)]/40 p-3 text-sm">
						<div class="font-medium">{$_(PIPELINE_I18N[selectedPipeline.id])}</div>
						<div class="mt-1 text-xs text-[var(--muted)]">
							{$_('scouting.cost')}: {costEstimate(selectedPipeline)} ·
							{$_('scouting.precision')}: {selectedPipeline.precisionRange[0]}–{selectedPipeline.precisionRange[1]}%
						</div>
					</div>
				{/if}

				{#if !selectedScoutId}
					<p class="text-sm text-[var(--muted)]">{$_('scouting.selectScout')}</p>
				{:else}
					{@const scout = $gameState.scoutPool.find((s) => s.id === selectedScoutId)}
					{#if scout}
						<div class="rounded-lg border border-[var(--border)] bg-[var(--elevated)]/40 p-3 text-sm">
							<div class="font-medium">{scout.name}</div>
							<div class="text-xs text-[var(--muted)]">
								{$_('scouting.skill')}: {scout.skill} · {scout.specialty}
							</div>
						</div>
					{/if}
				{/if}

				<div>
					<label class="block text-sm font-medium" for="region-select">{$_('scouting.region')}</label>
					<select
						id="region-select"
						class="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
						bind:value={selectedRegionId}
					>
						<option value="">{$_('scouting.selectRegion')}</option>
						{#each REGIONS as r (r.id)}
							<option value={r.id}>{r.label}</option>
						{/each}
					</select>
				</div>

				<button
					type="button"
					class="w-full rounded-md border border-[var(--border)] bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-40"
					disabled={!selectedPipeline || !selectedScoutId || !selectedRegionId}
					onclick={handleLaunch}
				>
					{$_('scouting.launchMission')}
				</button>

				{#if launchMessage}
					<p class="text-center text-sm font-medium text-[var(--accent)]">{launchMessage}</p>
				{/if}
			</div>
		</Card>
	</div>

	<!-- RIGHT: Active missions + Reports -->
	<div class="space-y-4">
		<Card title={$_('scouting.activeMissions')}>
			{#if $gameState.activeScoutMissions.length === 0}
				<p class="text-sm text-[var(--muted)]">{$_('scouting.noMissions')}</p>
			{:else}
				<ul class="space-y-3">
					{#each $gameState.activeScoutMissions as mission (mission.id)}
						{@const scout = $gameState.scoutPool.find((s) => s.id === mission.scoutId)}
						<li class="rounded-lg border border-[var(--border)] bg-[var(--elevated)]/40 p-3">
							<div class="flex items-center justify-between text-sm">
								<span class="font-medium">{scout?.name ?? mission.scoutId}</span>
								<span class="text-xs text-[var(--muted)]">{mission.regionId}</span>
							</div>
							<div class="mt-2">
								<div class="flex justify-between text-xs text-[var(--muted)]">
									<span>{$_('scouting.precision')}: {mission.precision}%</span>
									<span>{$_('scouting.weeksLeft', { values: { n: mission.duration } })}</span>
								</div>
							<div class="mt-1 h-2 w-full rounded-full bg-[var(--border)]">
								<div
									class="h-full rounded-full bg-[var(--accent)] transition-all"
									style="width: {Math.max(0, Math.min(100, ((4 - mission.duration) / 4) * 100))}%"
								></div>
							</div>
							</div>
						</li>
					{/each}
				</ul>
			{/if}
		</Card>

		<Card title={$_('scouting.reports')}>
			{#if $gameState.scoutReports.length === 0}
				<p class="text-sm text-[var(--muted)]">{$_('scouting.noReports')}</p>
			{:else}
				<div class="space-y-4">
					{#each $gameState.scoutReports as report (report.id)}
						{@const scout = $gameState.scoutPool.find((s) => s.id === report.scoutId)}
						<div class="rounded-lg border border-[var(--border)] bg-[var(--elevated)]/40 p-3">
							<div class="flex items-center justify-between text-sm">
								<span class="font-medium">{scout?.name ?? report.scoutId}</span>
								<span class="text-xs text-[var(--muted)]">{report.regionId} · W{report.week}</span>
							</div>

							{#if report.discoveredIdols.length === 0}
								<p class="mt-2 text-xs text-[var(--muted)]">{$_('scouting.noReports')}</p>
							{:else}
								<div class="mt-2 space-y-2">
									<div class="text-xs font-medium text-[var(--muted)]">{$_('scouting.discovered')}</div>
									{#each report.discoveredIdols as idol (idol.id)}
										<div
											class="flex items-center justify-between rounded-md border border-[var(--border)] bg-[var(--surface)] p-2"
										>
											<div class="flex items-center gap-2">
												<IdolAvatar {idol} size="sm" />
												<div>
													<div class="text-sm font-medium">{idol.nameRomaji}</div>
													<div class="text-xs text-[var(--muted)]">
														{$_('scouting.potential')}: {idol.potential} · {idol.age}y ·
														V{idol.visible.vocal}/D{idol.visible.dance}/A{idol.visible.acting}
													</div>
												</div>
											</div>
											<button
												type="button"
												class="rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium hover:border-[var(--accent)]"
												onclick={() => signScoutedIdol(report.id, idol.id)}
											>
												{$_('scouting.sign')}
											</button>
										</div>
									{/each}
								</div>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		</Card>
	</div>
</div>
