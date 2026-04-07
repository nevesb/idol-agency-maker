<script lang="ts">
	type Variant = 'info' | 'success' | 'warning' | 'danger';

	type Props = {
		variant?: Variant;
		message: string;
		actionLabel?: string;
		onaction?: () => void;
		href?: string;
	};

	let { variant = 'info', message, actionLabel, onaction, href }: Props = $props();

	const styles: Record<Variant, string> = {
		info: 'border-blue-500/40 bg-blue-500/10 text-blue-100',
		success: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-100',
		warning: 'border-amber-500/40 bg-amber-500/10 text-amber-100',
		danger: 'border-rose-500/40 bg-rose-500/10 text-rose-100'
	};
</script>

<div
	class="flex flex-wrap items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm {styles[
		variant
	]}"
	role="status"
>
	{#if href}
		<a href={href} class="underline decoration-dotted hover:opacity-90">{message}</a>
	{:else}
		<span>{message}</span>
	{/if}
	{#if actionLabel && onaction}
		<button
			type="button"
			class="rounded-md bg-white/10 px-2 py-1 text-xs font-medium hover:bg-white/20"
			onclick={onaction}
		>
			{actionLabel}
		</button>
	{/if}
</div>
