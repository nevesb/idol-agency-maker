<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		class?: string;
		title?: string;
		children?: Snippet;
	};

	let { class: className = '', title, children }: Props = $props();
</script>

<div
	class="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm {className}"
	role="article"
>
	{#if title}
		<h3 class="mb-2 text-sm font-semibold text-[var(--muted)]">{title}</h3>
	{/if}
	{@render children?.()}
</div>
