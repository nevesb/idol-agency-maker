<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		text: string;
		children?: Snippet;
	};

	let { text, children }: Props = $props();
</script>

<span class="inline-flex" title={text}>
	{@render children?.()}
</span>
