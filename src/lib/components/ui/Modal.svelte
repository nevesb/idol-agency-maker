<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		open: boolean;
		title?: string;
		onclose?: () => void;
		children?: Snippet;
	};

	let { open, title, onclose, children }: Props = $props();
</script>

{#if open}
	<div
		class="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-[12vh]"
		role="presentation"
		onclick={(e) => {
			if (e.target === e.currentTarget) onclose?.();
		}}
		onkeydown={(e) => {
			if (e.key === 'Escape') onclose?.();
		}}
	>
		<div
			class="max-h-[80vh] w-full max-w-lg overflow-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-xl"
			role="dialog"
			aria-modal="true"
			aria-labelledby={title ? 'modal-title' : undefined}
		>
			{#if title}
				<h2 id="modal-title" class="mb-3 text-lg font-semibold">{title}</h2>
			{/if}
			{@render children?.()}
		</div>
	</div>
{/if}
