<script lang="ts">
	type Props = {
		idol: {
			id: string;
			nameRomaji: string;
			nameJp?: string;
			gender?: string;
			visualSeed?: number;
			visible?: { visual?: number };
		};
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
		showName?: boolean;
	};

	let { idol, size = 'md', showName = false }: Props = $props();

	const SIZES = { xs: 32, sm: 48, md: 64, lg: 96, xl: 128 };
	const px = $derived(SIZES[size]);

	function hashCode(s: string): number {
		let h = 0;
		for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
		return Math.abs(h);
	}

	const hash = $derived(hashCode(idol.id));
	const hue1 = $derived(hash % 360);
	const hue2 = $derived((hash * 7 + 137) % 360);
	const hue3 = $derived((hash * 13 + 211) % 360);
	const initials = $derived(
		idol.nameRomaji
			.split(' ')
			.map((w) => w[0])
			.join('')
			.slice(0, 2)
			.toUpperCase()
	);

	const visualStat = $derived(idol.visible?.visual ?? 50);
	const glowIntensity = $derived(Math.min(visualStat / 100, 1));
</script>

<div class="relative inline-flex flex-col items-center gap-1" style="--avatar-size: {px}px">
	<div
		class="relative flex items-center justify-center overflow-hidden rounded-full"
		style="
			width: {px}px; height: {px}px;
			background: linear-gradient(135deg, hsl({hue1}, 70%, 25%) 0%, hsl({hue2}, 80%, 15%) 50%, hsl({hue3}, 60%, 20%) 100%);
			box-shadow: 0 0 {8 * glowIntensity}px hsl({hue1}, 70%, 50%, {0.3 * glowIntensity}),
						inset 0 -2px 8px rgba(0,0,0,0.3);
		"
	>
		<div
			class="absolute inset-0 opacity-20"
			style="
				background: radial-gradient(circle at 30% 20%, hsl({hue1}, 80%, 60%) 0%, transparent 50%),
							radial-gradient(circle at 70% 80%, hsl({hue2}, 80%, 60%) 0%, transparent 50%);
			"
		></div>
		{#if visualStat > 70}
			<div class="absolute right-0 top-0 opacity-70" style="font-size: {Math.max(px * 0.2, 8)}px">
				✦
			</div>
		{/if}
		<span
			class="relative z-10 font-bold tracking-wide text-white/90"
			style="font-size: {Math.max(px * 0.35, 10)}px; text-shadow: 0 1px 3px rgba(0,0,0,0.5);"
		>
			{initials}
		</span>
		<div
			class="absolute inset-0 rounded-full"
			style="
				border: {Math.max(px * 0.04, 2)}px solid {idol.gender === 'female'
				? 'rgba(255,182,193,0.4)'
				: idol.gender === 'male'
					? 'rgba(135,206,250,0.4)'
					: 'rgba(200,200,200,0.3)'};
			"
		></div>
	</div>
	{#if showName}
		<span
			class="text-center text-xs leading-tight text-[var(--text)]"
			style="max-width: {px + 16}px"
		>
			{idol.nameRomaji}
		</span>
	{/if}
</div>
