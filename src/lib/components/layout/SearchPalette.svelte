<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Modal from '$lib/components/ui/Modal.svelte';
	import { DOMAINS, type DomainPath } from '$lib/navigation/domains';

	type ExtraPath =
		| '/operacoes/resultados'
		| '/ajuda/glossario'
		| '/scouting'
		| '/noticias'
		| '/financas'
		| '/grupos'
		| '/definir';
	import { searchPaletteOpen } from '$lib/stores/search-palette';
	import { _ } from 'svelte-i18n';

	let q = $state('');

	function close() {
		searchPaletteOpen.set(false);
		q = '';
	}

	function go(path: DomainPath | ExtraPath) {
		goto(resolve(path as DomainPath));
		close();
	}

	function matches(d: (typeof DOMAINS)[number]): boolean {
		if (!q.trim()) return true;
		const s = q.toLowerCase();
		const label = $_(d.i18nKey).toLowerCase();
		return label.includes(s) || d.path.includes(s) || d.id.includes(s);
	}

	const extra: { path: ExtraPath; labelKey: string }[] = [
		{ path: '/operacoes/resultados', labelKey: 'search.weekResults' },
		{ path: '/ajuda/glossario', labelKey: 'search.glossary' },
		{ path: '/scouting', labelKey: 'search.scouting' },
		{ path: '/noticias', labelKey: 'search.news' },
		{ path: '/financas', labelKey: 'search.finance' },
		{ path: '/grupos', labelKey: 'search.groups' },
		{ path: '/definir', labelKey: 'search.settings' }
	];

	const list = $derived(DOMAINS.filter(matches));

	const extraFiltered = $derived(
		extra.filter((x) => {
			if (!q.trim()) return true;
			const s = q.toLowerCase();
			return $_(x.labelKey).toLowerCase().includes(s) || x.path.includes(s);
		})
	);
</script>

<Modal open={$searchPaletteOpen} onclose={close} title={$_('search.open')}>
	<div>
		<input
			class="mb-3 w-full rounded-lg border border-[var(--border)] bg-[var(--elevated)] px-3 py-2 text-sm"
			placeholder={$_('search.placeholder')}
			bind:value={q}
		/>
		{#if list.length === 0 && extraFiltered.length === 0}
			<p class="py-4 text-center text-sm text-[var(--muted)]">{$_('search.empty')}</p>
		{:else}
			<ul class="flex flex-col gap-1">
				{#each list as d (d.id)}
					<li>
						<button
							type="button"
							class="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-[var(--elevated)]"
							onclick={() => go(d.path)}
						>
							{$_(d.i18nKey)}
							<span class="ml-2 text-xs text-[var(--muted)]">{d.path}</span>
						</button>
					</li>
				{/each}
				{#each extraFiltered as x (x.path)}
					<li>
						<button
							type="button"
							class="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-[var(--elevated)]"
							onclick={() => go(x.path)}
						>
							{$_(x.labelKey)}
							<span class="ml-2 text-xs text-[var(--muted)]">{x.path}</span>
						</button>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</Modal>
