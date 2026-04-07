<script lang="ts">
	import { _ } from 'svelte-i18n';

	type Props = {
		messageKey: string;
		ondismiss: () => void;
	};

	let { messageKey, ondismiss }: Props = $props();
</script>

<div
	class="relative rounded-lg border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-3 text-sm"
>
	<div class="flex items-start gap-3">
		<span class="text-lg">💡</span>
		<p class="flex-1">{$_(messageKey)}</p>
		<button
			type="button"
			class="shrink-0 rounded-md px-2 py-0.5 text-xs text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
			onclick={ondismiss}
		>
			✕
		</button>
	</div>
</div>
