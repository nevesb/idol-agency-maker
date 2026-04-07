<script lang="ts">
	import PortalOverview from '$lib/components/portal/PortalOverview.svelte';
	import PortalMessages from '$lib/components/portal/PortalMessages.svelte';
	import PortalCalendar from '$lib/components/portal/PortalCalendar.svelte';
	import PortalNews from '$lib/components/portal/PortalNews.svelte';
	import PortalAgenda from '$lib/components/portal/PortalAgenda.svelte';
	import PortalCompetitors from '$lib/components/portal/PortalCompetitors.svelte';
	import { _ } from 'svelte-i18n';

	type TabKey = 'overview' | 'messages' | 'calendar' | 'news' | 'agenda' | 'competitors';

	const TABS: TabKey[] = ['overview', 'messages', 'calendar', 'news', 'agenda', 'competitors'];

	let activeTab: TabKey = $state('overview');

	function switchTab(tab: string) {
		if (TABS.includes(tab as TabKey)) {
			activeTab = tab as TabKey;
		}
	}
</script>

<div class="space-y-4">
	<div>
		<h1 class="text-2xl font-bold tracking-tight">{$_('portal.title')}</h1>
		<p class="mt-1 text-[var(--muted)]">{$_('portal.subtitle')}</p>
	</div>

	<!-- Tab bar -->
	<div class="flex gap-1 overflow-x-auto border-b border-[var(--border)] pb-px" role="tablist">
		{#each TABS as tab (tab)}
			<button
				role="tab"
				aria-selected={activeTab === tab}
				class="shrink-0 rounded-t-lg px-4 py-2 text-sm font-medium transition-colors {activeTab === tab
					? 'border-b-2 border-[var(--accent)] bg-[var(--surface)] text-[var(--accent)]'
					: 'text-[var(--muted)] hover:bg-[var(--elevated)]/50 hover:text-[var(--text)]'}"
				onclick={() => (activeTab = tab)}
			>
				{$_(`portal.tab.${tab}`)}
			</button>
		{/each}
	</div>

	<!-- Tab content -->
	<div class="min-h-[24rem]">
		{#if activeTab === 'overview'}
			<PortalOverview onswitchtab={switchTab} />
		{:else if activeTab === 'messages'}
			<PortalMessages />
		{:else if activeTab === 'calendar'}
			<PortalCalendar />
		{:else if activeTab === 'news'}
			<PortalNews />
		{:else if activeTab === 'agenda'}
			<PortalAgenda />
		{:else if activeTab === 'competitors'}
			<PortalCompetitors />
		{/if}
	</div>
</div>
