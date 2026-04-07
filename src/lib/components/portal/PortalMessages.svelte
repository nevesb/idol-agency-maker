<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import type { GameMessage, MessageCategory } from '$lib/types/simulation';
	import { gameState, markMessageRead, markAllMessagesRead } from '$lib/stores/game-state';
	import { _ } from 'svelte-i18n';

	type FilterKey = 'all' | 'unread' | 'urgent' | 'task' | 'info' | 'offer';

	let activeFilter: FilterKey = $state('all');
	let selectedId: string | null = $state(null);

	const FILTERS: { key: FilterKey; i18n: string }[] = [
		{ key: 'all', i18n: 'inbox.filterAll' },
		{ key: 'unread', i18n: 'inbox.filterUnread' },
		{ key: 'urgent', i18n: 'inbox.filterUrgent' },
		{ key: 'task', i18n: 'inbox.filterTasks' },
		{ key: 'info', i18n: 'inbox.filterInfo' },
		{ key: 'offer', i18n: 'messages.filterOffers' }
	];

	const CATEGORY_STYLES: Record<MessageCategory, string> = {
		urgent: 'border-l-rose-500',
		task: 'border-l-amber-500',
		info: 'border-l-blue-500',
		offer: 'border-l-emerald-500'
	};

	const CATEGORY_BADGE: Record<MessageCategory, string> = {
		urgent: 'bg-rose-500/20 text-rose-300',
		task: 'bg-amber-500/20 text-amber-300',
		info: 'bg-blue-500/20 text-blue-300',
		offer: 'bg-emerald-500/20 text-emerald-300'
	};

	function matchesFilter(msg: { read: boolean; category: MessageCategory }): boolean {
		if (activeFilter === 'all') return true;
		if (activeFilter === 'unread') return !msg.read;
		return msg.category === activeFilter;
	}

	let filtered = $derived(
		[...$gameState.messages]
			.filter(matchesFilter)
			.sort((a, b) => {
				if (a.read !== b.read) return a.read ? 1 : -1;
				return b.week - a.week || b.day - a.day;
			})
	);

	let unreadCount = $derived($gameState.messages.filter((m) => !m.read).length);

	let selectedMsg = $derived(
		selectedId ? $gameState.messages.find((m) => m.id === selectedId) ?? null : null
	);

	function selectMessage(id: string) {
		selectedId = id;
		const msg = $gameState.messages.find((m) => m.id === id);
		if (msg && !msg.read) markMessageRead(id);
	}
</script>

<div class="flex items-center justify-between">
	<div>
		<h2 class="text-lg font-semibold">{$_('portal.tab.messages')}</h2>
		{#if unreadCount > 0}
			<span class="rounded-full bg-rose-500/20 px-2 py-0.5 text-xs font-semibold text-rose-300">
				{$_('inbox.unreadCount', { values: { n: unreadCount } })}
			</span>
		{/if}
	</div>
	{#if unreadCount > 0}
		<button
			class="rounded-md bg-[var(--elevated)] px-3 py-1.5 text-xs font-medium text-[var(--muted)] hover:bg-[var(--border)]"
			onclick={() => markAllMessagesRead()}
		>
			{$_('inbox.markAllRead')}
		</button>
	{/if}
</div>

<!-- Filters -->
<div class="mt-3 flex flex-wrap gap-2">
	{#each FILTERS as f (f.key)}
		<button
			class="rounded-full px-3 py-1 text-xs font-medium transition-colors {activeFilter === f.key
				? 'bg-[var(--accent)] text-white'
				: 'bg-[var(--elevated)] text-[var(--muted)] hover:bg-[var(--border)]'}"
			onclick={() => (activeFilter = f.key)}
		>
			{$_(f.i18n)}
			{#if f.key === 'unread' && unreadCount > 0}
				<span class="ml-1 text-[10px]">({unreadCount})</span>
			{/if}
		</button>
	{/each}
</div>

<!-- Two-panel layout -->
<div class="mt-4 grid gap-4 lg:grid-cols-[2fr_3fr]" style="min-height: 28rem;">
	<!-- Left: message list -->
	<div class="overflow-y-auto rounded-lg border border-[var(--border)] bg-[var(--surface)]" style="max-height: 32rem;">
		{#if filtered.length === 0}
			<div class="flex h-full items-center justify-center p-6">
				<p class="text-sm text-[var(--muted)]">{$_('inbox.empty')}</p>
			</div>
		{:else}
			{#each filtered as msg (msg.id)}
				<button
					class="w-full border-b border-[var(--border)] border-l-4 px-3 py-2.5 text-left transition-colors hover:bg-[var(--elevated)]/60 {CATEGORY_STYLES[msg.category] ?? ''} {selectedId === msg.id ? 'bg-[var(--elevated)]' : ''} {msg.read ? 'opacity-60' : ''}"
					onclick={() => selectMessage(msg.id)}
				>
					<div class="flex items-center gap-2">
						{#if !msg.read}
							<span class="inline-block h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]"></span>
						{:else}
							<span class="inline-block h-2 w-2 shrink-0"></span>
						{/if}
						<span class="text-xs font-medium text-[var(--muted)]">{msg.from}</span>
						<span class={`ml-auto shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase ${CATEGORY_BADGE[msg.category] ?? ''}`}>
							{msg.category}
						</span>
					</div>
					<p class="mt-0.5 truncate text-sm {!msg.read ? 'font-semibold' : ''} {msg.category === 'urgent' ? 'text-rose-400' : ''}">
						{msg.subject}
					</p>
					<span class="text-[10px] text-[var(--muted)]">W{msg.week} D{msg.day + 1}</span>
				</button>
			{/each}
		{/if}
	</div>

	<!-- Right: message detail -->
	<div class="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4" style="max-height: 32rem; overflow-y: auto;">
		{#if selectedMsg}
			<div class="flex items-center gap-2 text-xs text-[var(--muted)]">
				<span class="font-semibold text-[var(--text)]">{selectedMsg.from}</span>
				<span class={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase ${CATEGORY_BADGE[selectedMsg.category] ?? ''}`}>
					{selectedMsg.category}
				</span>
				<span class="ml-auto">W{selectedMsg.week} D{selectedMsg.day + 1}</span>
			</div>
			<h3 class="mt-3 text-base font-semibold">{selectedMsg.subject}</h3>
			<p class="mt-3 text-sm leading-relaxed text-[var(--text)]">{selectedMsg.body}</p>

			{#if selectedMsg.relatedIdolId}
				<a
					href={`/roster/${selectedMsg.relatedIdolId}`}
					class="mt-3 inline-block text-xs text-[var(--accent)] underline decoration-dotted"
					data-sveltekit-preload-data="hover"
				>
					Ver idol →
				</a>
			{/if}

			<div class="mt-4 flex flex-wrap gap-2 border-t border-[var(--border)] pt-3">
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
				{#if selectedMsg.category === 'urgent' || selectedMsg.category === 'info'}
					<button
						class="rounded-md bg-[var(--elevated)] px-3 py-1.5 text-xs font-medium text-[var(--muted)] hover:bg-[var(--border)]"
						onclick={() => (selectedId = null)}
					>
						{$_('messages.understood')}
					</button>
				{/if}
			</div>
		{:else}
			<div class="flex h-full items-center justify-center">
				<p class="text-sm text-[var(--muted)]">{$_('messages.noSelection')}</p>
			</div>
		{/if}
	</div>
</div>
