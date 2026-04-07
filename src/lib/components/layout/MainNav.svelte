<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { DOMAINS, type DomainPath } from '$lib/navigation/domains';
	import { gameState } from '$lib/stores/game-state';
	import { _ } from 'svelte-i18n';

	function isActive(path: DomainPath): boolean {
		const p = page.url.pathname.replace(/\/$/, '') || '/';
		const norm = path.replace(/\/$/, '');
		return p === norm || p.startsWith(norm + '/');
	}

	let unreadCount = $derived($gameState.messages.filter((m) => !m.read).length);
</script>

<!-- FM26+: navegação horizontal superior (sem sidebar) -->
<nav
	class="fm26-nav flex min-w-0 flex-1 items-stretch overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
	aria-label="Main"
>
	<ul class="m-0 flex min-h-[44px] list-none items-stretch p-0">
		{#each DOMAINS as d (d.id)}
			<li class="flex shrink-0">
				<a
					href={resolve(d.path)}
					class="fm26-tab {isActive(d.path) ? 'fm26-tab-active' : ''}"
					data-sveltekit-preload-data="hover"
				>
					<span class="fm26-tab-digit" aria-hidden="true">{d.shortcutDigit}</span>
					<span class="fm26-tab-label">{$_(d.i18nKey)}</span>
				</a>
			</li>
		{/each}

		<li class="flex shrink-0">
			<a
				href={resolve('/mensagens')}
				class="fm26-tab relative {isActive('/mensagens') ? 'fm26-tab-active' : ''}"
				data-sveltekit-preload-data="hover"
			>
				<span class="fm26-tab-label">{$_('nav.mensagens')}</span>
				{#if unreadCount > 0}
					<span
						class="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold leading-none text-white"
					>
						{unreadCount > 99 ? '99+' : unreadCount}
					</span>
				{/if}
			</a>
		</li>
	</ul>
</nav>
