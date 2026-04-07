<script lang="ts">
	import { resolve } from '$app/paths';
	import type { DomainPath } from '$lib/navigation/domains';
	import type { Snippet } from 'svelte';

	type Props = {
		label: string;
		value: string;
		/** Rotas internas (inclui subpaths como /operacoes/resultados). */
		href?: DomainPath | `/${string}`;
		onclick?: () => void;
		children?: Snippet;
	};

	let { label, value, href, onclick, children }: Props = $props();
</script>

{#if href}
	<a
		class="block rounded-lg border border-[var(--border)] bg-[var(--elevated)] p-3 transition hover:border-[var(--accent)] hover:bg-[var(--surface)]"
		href={resolve(href as DomainPath)}
	>
		<p class="text-xs font-medium text-[var(--muted)]">{label}</p>
		<p class="text-lg font-semibold tracking-tight">{value}</p>
		{@render children?.()}
	</a>
{:else}
	<button
		type="button"
		class="w-full rounded-lg border border-[var(--border)] bg-[var(--elevated)] p-3 text-left transition hover:border-[var(--accent)]"
		{onclick}
	>
		<p class="text-xs font-medium text-[var(--muted)]">{label}</p>
		<p class="text-lg font-semibold tracking-tight">{value}</p>
		{@render children?.()}
	</button>
{/if}
