<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import type { MessageCategory } from '$lib/types/simulation';
	import { gameState, markMessageRead, markAllMessagesRead } from '$lib/stores/game-state';
	import { _ } from 'svelte-i18n';

	type FilterKey = 'all' | 'unread' | 'urgent' | 'task' | 'info';

	let activeFilter: FilterKey = $state('all');
	let expandedId: string | null = $state(null);

	const FILTERS: { key: FilterKey; i18n: string }[] = [
		{ key: 'all', i18n: 'inbox.filterAll' },
		{ key: 'unread', i18n: 'inbox.filterUnread' },
		{ key: 'urgent', i18n: 'inbox.filterUrgent' },
		{ key: 'task', i18n: 'inbox.filterTasks' },
		{ key: 'info', i18n: 'inbox.filterInfo' }
	];

	const CATEGORY_STYLES: Record<MessageCategory, string> = {
		urgent: 'border-l-rose-500 text-rose-400',
		task: 'border-l-amber-500',
		info: 'border-l-blue-500',
		offer: 'border-l-emerald-500'
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

	function toggleExpand(id: string): void {
		if (expandedId === id) {
			expandedId = null;
		} else {
			expandedId = id;
			const msg = $gameState.messages.find((m) => m.id === id);
			if (msg && !msg.read) markMessageRead(id);
		}
	}
</script>

<div class="flex items-center justify-between">
	<div>
		<h1 class="text-xl font-semibold">{$_('nav.mensagens')}</h1>
		<p class="mt-1 text-sm text-[var(--muted)]">
			{$_('inbox.subtitle')}
			{#if unreadCount > 0}
				<span class="ml-2 rounded-full bg-rose-500/20 px-2 py-0.5 text-xs font-semibold text-rose-300">
					{$_('inbox.unreadCount', { values: { n: unreadCount } })}
				</span>
			{/if}
		</p>
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

<div class="mt-4 flex flex-wrap gap-2">
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

<div class="mt-6 space-y-3">
	{#if filtered.length === 0}
		<Card title={$_('inbox.empty')}>
			<p class="text-sm text-[var(--muted)]">{$_('inbox.emptyHint')}</p>
		</Card>
	{:else}
		{#each filtered as msg (msg.id)}
			<button
				class="w-full cursor-pointer rounded-lg border border-[var(--border)] border-l-4 bg-[var(--elevated)] p-3 text-left transition-colors hover:bg-[var(--elevated)]/80 {CATEGORY_STYLES[msg.category] ?? ''} {msg.read ? 'opacity-60' : ''}"
				onclick={() => toggleExpand(msg.id)}
			>
				<div class="flex items-center justify-between text-xs text-[var(--muted)]">
					<span class="font-medium">{msg.from}</span>
					<span>W{msg.week} D{msg.day + 1}</span>
				</div>
				<h3 class="mt-1 text-sm font-semibold {msg.category === 'urgent' ? 'text-rose-400' : ''}">
					{#if !msg.read}
						<span class="mr-1.5 inline-block h-2 w-2 rounded-full bg-[var(--accent)]"></span>
					{/if}
					{msg.subject}
				</h3>

				{#if expandedId === msg.id}
					<p class="mt-2 text-sm text-[var(--text)]">{msg.body}</p>
					{#if msg.actionUrl}
						<a
							href={msg.actionUrl}
							class="mt-2 inline-block text-xs text-[var(--accent)] underline decoration-dotted"
							data-sveltekit-preload-data="hover"
							onclick={(e) => e.stopPropagation()}
						>
							Ver detalhes →
						</a>
					{/if}
				{/if}
			</button>
		{/each}
	{/if}
</div>
