<script lang="ts">
	import { resolve } from '$app/paths';
	import AlertBar from '$lib/components/ui/AlertBar.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import Tile from '$lib/components/ui/Tile.svelte';
	import TutorialHint from '$lib/components/ui/TutorialHint.svelte';
	import { deriveCalendar } from '$lib/simulation/calendar';
	import { getActiveTutorialHints } from '$lib/simulation/tutorial';
	import type { DomainPath } from '$lib/navigation/domains';
	import { gameState, markMessageRead } from '$lib/stores/game-state';
	import { dismissTutorialHint, dismissedTutorialIds } from '$lib/stores/tutorial';
	import type { GameMessage, NewsItem } from '$lib/types/simulation';
	import { _ } from 'svelte-i18n';

	type Props = {
		onswitchtab?: (tab: string) => void;
	};

	let { onswitchtab }: Props = $props();

	let hints = $derived(
		getActiveTutorialHints($gameState.absoluteWeek, '/portal', $dismissedTutorialIds)
	);

	function alertVariant(s: 'info' | 'warn' | 'critical'): 'info' | 'warning' | 'danger' {
		if (s === 'critical') return 'danger';
		if (s === 'warn') return 'warning';
		return 'info';
	}

	let avgStress = $derived(
		$gameState.idols.length === 0
			? '—'
			: String(
					Math.round(
						$gameState.idols.reduce((a, i) => a + i.wellness.stress, 0) / $gameState.idols.length
					)
				)
	);

	let jobsOkLastWeek = $derived(
		$gameState.lastWeekLog
			? String($gameState.lastWeekLog.jobResults.filter((r) => r.outcome === 'success').length)
			: '—'
	);

	let weekRevenue = $derived(
		$gameState.lastWeekLog
			? $gameState.lastWeekLog.jobResults.reduce((a, r) => a + r.revenueYen, 0)
			: null
	);

	let cal = $derived(deriveCalendar($gameState.absoluteWeek));

	let staffTip = $derived(
		$gameState.staffMembers[0]
			? $_('portal.staffAdvice', {
					values: { name: $gameState.staffMembers[0].name, role: $_($gameState.staffMembers[0].roleKey) }
				})
			: $_('portal.staffNone')
	);

	let recentMessages = $derived(
		[...$gameState.messages].sort((a, b) => b.week - a.week || b.day - a.day).slice(0, 5)
	);

	let recentNews = $derived(
		[...$gameState.newsHistory]
			.sort((a, b) => b.week - a.week || b.importance - a.importance)
			.slice(0, 5)
	);

	let newsIdx = $state(0);
	let newsTimer: ReturnType<typeof setInterval> | null = null;

	function startCarousel() {
		stopCarousel();
		if (recentNews.length <= 1) return;
		newsTimer = setInterval(() => {
			newsIdx = (newsIdx + 1) % recentNews.length;
		}, 5000);
	}
	function stopCarousel() {
		if (newsTimer) { clearInterval(newsTimer); newsTimer = null; }
	}

	$effect(() => {
		if (recentNews.length > 0) startCarousel();
		return () => stopCarousel();
	});

	function prevNews() {
		newsIdx = (newsIdx - 1 + recentNews.length) % recentNews.length;
		startCarousel();
	}
	function nextNews() {
		newsIdx = (newsIdx + 1) % recentNews.length;
		startCarousel();
	}

	const CATEGORY_COLORS: Record<string, string> = {
		job_result: 'bg-blue-500/20 text-blue-300',
		economy: 'bg-emerald-500/20 text-emerald-300',
		rival: 'bg-orange-500/20 text-orange-300',
		scandal: 'bg-rose-500/20 text-rose-300',
		award: 'bg-amber-500/20 text-amber-300',
		milestone: 'bg-violet-500/20 text-violet-300',
		system: 'bg-gray-500/20 text-gray-300'
	};

	const MSG_CATEGORY_COLORS: Record<string, string> = {
		urgent: 'bg-rose-500/20 text-rose-300',
		task: 'bg-amber-500/20 text-amber-300',
		info: 'bg-blue-500/20 text-blue-300',
		offer: 'bg-emerald-500/20 text-emerald-300'
	};

	function outletName(n: NewsItem): string {
		if (n.category === 'economy') return $_('portal.newsOutletBiz');
		if (n.category === 'scandal' || n.category === 'rival') return $_('portal.newsOutletIndie');
		return $_('portal.newsOutletMain');
	}

	let assignedJobsThisWeek = $derived($gameState.assignedJobs);

	let upcomingJobs = $derived(
		$gameState.jobBoard
			.filter((j) => assignedJobsThisWeek.some((a) => a.jobId === j.id))
			.slice(0, 5)
	);

	let competitiveJobs = $derived(
		$gameState.jobBoard.filter((j) => j.competitive).slice(0, 3)
	);

	const dayKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;

	let calendarDays = $derived(
		dayKeys.map((dk, i) => {
			const dayJobs = $gameState.jobBoard.filter(
				(j) =>
					j.scheduledDay === i &&
					assignedJobsThisWeek.some((a) => a.jobId === j.id)
			);
			return { dayKey: dk, jobs: dayJobs };
		})
	);

	let upcomingAgenda = $derived(
		assignedJobsThisWeek
			.map((a) => {
				const job = $gameState.jobBoard.find((j) => j.id === a.jobId);
				const idol = $gameState.idols.find((i) => i.id === a.idolId);
				return job && idol ? { job, idol, dayKey: dayKeys[job.scheduledDay] } : null;
			})
			.filter((x): x is NonNullable<typeof x> => x !== null)
			.sort((a, b) => a.job.scheduledDay - b.job.scheduledDay)
			.slice(0, 7)
	);

	let selectedMsg: GameMessage | null = $state(null);

	function openMessage(msg: GameMessage) {
		selectedMsg = msg;
		if (!msg.read) markMessageRead(msg.id);
	}
</script>

<div class="space-y-6">
	{#each hints as hint (hint.id)}
		<TutorialHint messageKey={hint.message} ondismiss={() => dismissTutorialHint(hint.id)} />
	{/each}

	<!-- Top tiles -->
	<div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
		<Tile label={$_('game.balance')} value={`¥${$gameState.balanceYen.toLocaleString()}`} href="/agencia" />
		<Tile label={$_('portal.tileJobsOk')} value={jobsOkLastWeek} href="/operacoes/resultados" />
		<Tile label={$_('portal.tileStressAvg')} value={avgStress} href="/roster" />
		<Tile label={$_('game.tier')} value={$_(`game.agencyTier.${$gameState.agencyTier}`)} href="/mercado" />
	</div>

	{#if $gameState.alerts.length > 0}
		<div class="space-y-2">
			{#each $gameState.alerts as a (a.id)}
				<AlertBar variant={alertVariant(a.severity)} message={a.message} href={a.href} />
			{/each}
		</div>
	{/if}

	<!-- Three-column layout -->
	<div class="grid gap-6 lg:grid-cols-[1fr_1.4fr_1fr]">
		<!-- LEFT: Mensagens -->
		<div class="space-y-4">
			<Card title={$_('portal.tab.messages')}>
				{#if recentMessages.length === 0}
					<p class="text-sm text-[var(--muted)]">{$_('portal.noMessages')}</p>
				{:else}
					<ul class="space-y-2">
						{#each recentMessages as msg (msg.id)}
							<li>
								<button
									class="w-full rounded-md border border-[var(--border)] bg-[var(--elevated)]/40 px-3 py-2 text-left transition-colors hover:bg-[var(--elevated)]"
									onclick={() => openMessage(msg)}
								>
									<div class="flex items-center gap-2 text-xs">
										<span class="font-medium text-[var(--muted)]">{msg.from}</span>
										<span class={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase ${MSG_CATEGORY_COLORS[msg.category] ?? ''}`}>
											{msg.category}
										</span>
										<span class="ml-auto text-[var(--muted)]">W{msg.week}D{msg.day + 1}</span>
									</div>
									<p class="mt-1 text-sm font-medium truncate {msg.category === 'urgent' ? 'text-rose-400' : ''} {!msg.read ? '' : 'opacity-60'}">
										{#if !msg.read}
											<span class="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]"></span>
										{/if}
										{msg.subject}
									</p>
								</button>
							</li>
						{/each}
					</ul>
					<button
						class="mt-2 text-xs text-[var(--accent)] underline decoration-dotted"
						onclick={() => onswitchtab?.('messages')}
					>
						{$_('portal.seeAll')} →
					</button>
				{/if}
			</Card>
		</div>

		<!-- CENTER: Notícias + Eventos + Mini Calendar -->
		<div class="space-y-4">
			<!-- News carousel -->
			<Card title={$_('portal.tab.news')}>
				{#if recentNews.length === 0}
					<p class="text-sm text-[var(--muted)]">{$_('portal.noNews')}</p>
				{:else}
					{@const currentNews = recentNews[newsIdx]}
					<div class="relative overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--elevated)]/30 p-4">
						<div class="flex items-center gap-2 text-xs text-[var(--muted)]">
							<span class="font-semibold">{outletName(currentNews)}</span>
							<span class={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase ${CATEGORY_COLORS[currentNews.category] ?? ''}`}>
								{currentNews.category.replace('_', ' ')}
							</span>
							<span class="ml-auto">W{currentNews.week}</span>
						</div>
						<p class="mt-2 text-sm font-medium leading-snug">{currentNews.text}</p>
						{#if recentNews.length > 1}
							<div class="mt-3 flex items-center justify-between">
								<button onclick={prevNews} class="rounded px-2 py-0.5 text-xs text-[var(--muted)] hover:bg-[var(--border)]">←</button>
								<div class="flex gap-1">
									{#each recentNews as _, i}
										<span class="inline-block h-1.5 w-1.5 rounded-full transition-colors {i === newsIdx ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'}"></span>
									{/each}
								</div>
								<button onclick={nextNews} class="rounded px-2 py-0.5 text-xs text-[var(--muted)] hover:bg-[var(--border)]">→</button>
							</div>
						{/if}
					</div>
					<button
						class="mt-2 text-xs text-[var(--accent)] underline decoration-dotted"
						onclick={() => onswitchtab?.('news')}
					>
						{$_('portal.viewAll')} →
					</button>
				{/if}
			</Card>

			<!-- Upcoming Events -->
			<Card title={$_('portal.upcomingEvents')}>
				{#if upcomingJobs.length === 0 && competitiveJobs.length === 0}
					<p class="text-sm text-[var(--muted)]">{$_('portal.noEventsThisWeek')}</p>
				{:else}
					<ul class="space-y-1.5 text-sm">
						{#each upcomingJobs as job (job.id)}
							<li class="flex items-center gap-2 rounded-md bg-[var(--elevated)]/40 px-2 py-1.5">
								<span class="text-xs font-medium text-[var(--muted)] uppercase">{$_(`time.dayNames.${job.scheduledDay}`)}</span>
								<span class="truncate">{job.name}</span>
								<span class="ml-auto rounded-full bg-blue-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-blue-300">{job.category}</span>
							</li>
						{/each}
					</ul>
					{#if competitiveJobs.length > 0}
						<h4 class="mt-3 text-xs font-semibold text-[var(--muted)] uppercase">{$_('portal.openCompetitions')}</h4>
						<ul class="mt-1 space-y-1 text-sm">
							{#each competitiveJobs as job (job.id)}
								<li class="flex items-center gap-2 rounded-md bg-orange-500/10 px-2 py-1">
									<span class="text-xs text-orange-300">{$_('game.competitive')}</span>
									<span class="truncate">{job.name}</span>
								</li>
							{/each}
						</ul>
					{/if}
				{/if}
			</Card>

			<!-- Mini Calendar -->
			<Card title={$_('portal.calendarTitle')}>
				<div class="grid grid-cols-7 gap-1 text-center text-xs">
					{#each dayKeys as dk (dk)}
						<div class="font-semibold text-[var(--muted)]">{$_(`schedule.dayShort.${dk}`)}</div>
					{/each}
					{#each calendarDays as day (day.dayKey)}
						<div class="min-h-[2.5rem] rounded border border-[var(--border)] bg-[var(--elevated)]/30 p-1">
							{#each day.jobs.slice(0, 2) as j (j.id)}
								<div class="truncate text-[10px] leading-tight text-[var(--text)]">{j.name}</div>
							{/each}
							{#if day.jobs.length > 2}
								<div class="text-[10px] text-[var(--muted)]">+{day.jobs.length - 2}</div>
							{/if}
						</div>
					{/each}
				</div>
			</Card>
		</div>

		<!-- RIGHT: Agenda + Rankings -->
		<div class="space-y-4">
			<!-- Quick stats -->
			{#if weekRevenue !== null}
				<Tile label={$_('portal.tileWeekRevenue')} value={`¥${weekRevenue.toLocaleString()}`} />
			{/if}

			<Card title={$_('portal.moodTitle')}>
				<p class="text-lg font-semibold capitalize text-[var(--text)]">
					{$_(`portal.mood.${$gameState.agencyMood}`)}
				</p>
				<p class="mt-1 text-xs text-[var(--muted)]">{$_('portal.moodHint')}</p>
			</Card>

			<!-- Agenda resumida -->
			<Card title={$_('portal.agendaSummary')}>
				{#if upcomingAgenda.length === 0}
					<p class="text-sm text-[var(--muted)]">{$_('portal.noEventsThisWeek')}</p>
				{:else}
					<ul class="space-y-1.5 text-xs">
						{#each upcomingAgenda as entry (`${entry.idol.id}-${entry.job.id}`)}
							<li class="flex items-center gap-2 rounded bg-[var(--elevated)]/40 px-2 py-1.5">
								<span class="font-semibold text-[var(--muted)] uppercase">{$_(`schedule.dayShort.${entry.dayKey}`)}</span>
								<span class="truncate">{entry.idol.nameRomaji}</span>
								<span class="ml-auto truncate text-[var(--muted)]">{entry.job.name}</span>
							</li>
						{/each}
					</ul>
				{/if}
			</Card>

			<!-- Rankings -->
			<Card title={$_('portal.rankings')}>
				<div class="overflow-x-auto">
					<table class="w-full text-xs">
						<thead>
							<tr class="text-left text-[var(--muted)]">
								<th class="pb-1 pr-2">{$_('portal.rank')}</th>
								<th class="pb-1 pr-2">{$_('nav.agencia')}</th>
								<th class="pb-1 pr-2">{$_('game.tier')}</th>
								<th class="pb-1 text-right">{$_('portal.budget')}</th>
							</tr>
						</thead>
						<tbody>
							<tr class="font-semibold text-[var(--accent)]">
								<td class="py-0.5 pr-2">—</td>
								<td class="py-0.5 pr-2 truncate max-w-[6rem]">{$gameState.agencyName}</td>
								<td class="py-0.5 pr-2 capitalize">{$_(`game.agencyTier.${$gameState.agencyTier}`)}</td>
								<td class="py-0.5 text-right">¥{$gameState.balanceYen.toLocaleString()}</td>
							</tr>
							{#each $gameState.rivals as rival, i (rival.id)}
								<tr class="text-[var(--text)]">
									<td class="py-0.5 pr-2">{i + 1}</td>
									<td class="py-0.5 pr-2 truncate max-w-[6rem]">{rival.name}</td>
									<td class="py-0.5 pr-2 capitalize">{$_(`game.agencyTier.${rival.tier}`)}</td>
									<td class="py-0.5 text-right">¥{rival.budgetYen.toLocaleString()}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</Card>

			<!-- Staff advice -->
			<Card title={$_('portal.staffAdviceTitle')}>
				<p class="text-sm">{staffTip}</p>
			</Card>

			<!-- Pending actions -->
			{#if $gameState.pendingActions.length > 0}
				<Card title={$_('portal.pendingTitle')}>
					<ul class="space-y-1.5 text-sm">
						{#each $gameState.pendingActions as p (p.id)}
							<li>
								<a
									href={resolve(p.href as DomainPath)}
									class="text-[var(--accent)] underline decoration-dotted hover:opacity-90"
									data-sveltekit-preload-data="hover"
								>
									{p.title}
								</a>
							</li>
						{/each}
					</ul>
				</Card>
			{/if}
		</div>
	</div>
</div>

<!-- Message modal -->
<Modal open={selectedMsg !== null} title={selectedMsg?.subject} onclose={() => (selectedMsg = null)}>
	{#if selectedMsg}
		<div class="space-y-3">
			<div class="flex items-center gap-2 text-xs text-[var(--muted)]">
				<span class="font-medium">{selectedMsg.from}</span>
				<span class={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase ${MSG_CATEGORY_COLORS[selectedMsg.category] ?? ''}`}>
					{selectedMsg.category}
				</span>
				<span class="ml-auto">W{selectedMsg.week} D{selectedMsg.day + 1}</span>
			</div>
			<p class="text-sm leading-relaxed">{selectedMsg.body}</p>
			<div class="flex flex-wrap gap-2 pt-2">
				{#if selectedMsg.actionUrl}
					<a
						href={selectedMsg.actionUrl}
						class="rounded-md bg-[var(--accent)] px-3 py-1.5 text-xs font-medium text-white hover:opacity-90"
						data-sveltekit-preload-data="hover"
					>
						{$_('messages.goTo')}
					</a>
				{/if}
				{#if selectedMsg.category === 'offer'}
					<button class="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:opacity-90">
						{$_('messages.accept')}
					</button>
					<button class="rounded-md bg-rose-600 px-3 py-1.5 text-xs font-medium text-white hover:opacity-90">
						{$_('messages.reject')}
					</button>
				{/if}
				<button
					class="rounded-md bg-[var(--elevated)] px-3 py-1.5 text-xs font-medium text-[var(--muted)] hover:bg-[var(--border)]"
					onclick={() => (selectedMsg = null)}
				>
					{$_('messages.understood')}
				</button>
			</div>
		</div>
	{/if}
</Modal>
