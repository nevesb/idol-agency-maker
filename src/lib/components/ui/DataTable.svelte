<script lang="ts" generics="T extends Record<string, unknown>">
	type Props = {
		columns: { key: keyof T & string; label: string; width?: string }[];
		rows: T[];
		emptyLabel?: string;
		getRowKey?: (row: T) => string;
		selectedKey?: string | null;
		onRowClick?: (row: T) => void;
		/** P4-26 — menu de contexto (botão direito). */
		onRowContextMenu?: (row: T, ev: MouseEvent) => void;
	};

	let {
		columns,
		rows,
		emptyLabel = '—',
		getRowKey,
		selectedKey = null,
		onRowClick,
		onRowContextMenu
	}: Props = $props();
</script>

<div class="overflow-x-auto rounded-lg border border-[var(--border)]">
	<table class="w-full min-w-[32rem] border-collapse text-left text-sm">
		<thead
			class="bg-[var(--elevated)] text-xs font-semibold tracking-wide text-[var(--muted)] uppercase"
		>
			<tr>
				{#each columns as col (col.key)}
					<th class="border-b border-[var(--border)] px-3 py-2" style:width={col.width}
						>{col.label}</th
					>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#if rows.length === 0}
				<tr>
					<td class="px-3 py-6 text-center text-[var(--muted)]" colspan={columns.length}
						>{emptyLabel}</td
					>
				</tr>
			{:else}
				{#each rows as row, ri (ri)}
					<tr
						class="border-b border-[var(--border)] odd:bg-[var(--elevated)]/50 hover:bg-[var(--accent-muted)]/20 {onRowClick
							? 'cursor-pointer'
							: ''} {getRowKey && selectedKey === getRowKey(row)
							? 'bg-[var(--accent-muted)]/25'
							: ''}"
						onclick={() => onRowClick?.(row)}
						oncontextmenu={(e) => {
							if (!onRowContextMenu) return;
							e.preventDefault();
							onRowContextMenu(row, e);
						}}
					>
						{#each columns as col (col.key)}
							<td class="px-3 py-2 tabular-nums">{String(row[col.key] ?? '')}</td>
						{/each}
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
</div>
