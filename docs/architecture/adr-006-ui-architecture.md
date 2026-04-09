# ADR-006: UI Component Architecture

## Status
Proposed

## Date
2026-04-07

## Engine Compatibility

| Field | Value |
|-------|-------|
| **Engine** | SvelteKit 2.50 + Svelte 5 (runes) |
| **Domain** | UI / Presentation |
| **Knowledge Risk** | MEDIUM — Svelte 5 runes are post-training-cutoff for many LLMs |
| **References Consulted** | ADR-001, ADR-003, ui-information-architecture.md, ui-dashboard.md |
| **Post-Cutoff APIs Used** | Svelte 5 runes ($state, $derived, $effect), Svelte 5 snippets |
| **Verification Required** | Verify rune reactivity performance with 3000-idol table rendering |

## ADR Dependencies

| Field | Value |
|-------|-------|
| **Depends On** | ADR-001 (Stack), ADR-003 (State slices define what stores expose) |
| **Enables** | All UI epics, ADR-010 (i18n hooks into component layer) |
| **Blocks** | UI implementation stories |
| **Ordering Note** | Should be Accepted before any new UI components are built |

## Context

### Problem Statement

The game requires FM26-style dense UI: sortable/filterable tables with 50+ rows,
multi-panel layouts, hover tooltips, right-click context menus, keyboard navigation,
and real-time data binding to simulation state. The UI must update reactively when
the SimWorker sends state projections without re-rendering the entire page.

Current code has 21 Svelte components and 20 routes. This ADR formalizes the
component architecture, data binding strategy, and routing conventions before
the remaining 60+ wireframes are implemented.

### Requirements

- Portal loads in <1s with data from 13 systems (TR-ui-dash-001)
- Tables with 20+ rows load in <500ms (TR-ui-jobs-001)
- Column config, filter/sort state persists per-screen per-save (TR-ui-ia-004, TR-ui-ia-005)
- Universal search Ctrl+K (TR-ui-ia-003)
- Keyboard traversal in all tables (TR-ui-ia-009)
- Right-click context menus on all entities (TR-ui-ia-010)
- Avatar with tier-colored border on every idol mention (TR-ui-ia-006, TR-ui-ia-007)

## Decision

### Layered Component Architecture

```
src/
├── routes/
│   ├── (menu)/              # Menu group — no game nav
│   │   ├── +page.svelte     # Title screen
│   │   ├── new-game/        # 6-step wizard
│   │   └── auth/            # Login flow
│   └── (game)/              # Game group — with nav bar
│       ├── +layout.svelte   # MainNav + StatusBar + Breadcrumbs
│       ├── portal/          # Dashboard (6 tabs)
│       ├── roster/          # Roster + [id] profile
│       ├── market/
│       ├── scouting/
│       ├── operations/
│       ├── agency/
│       ├── groups/
│       ├── producer/
│       ├── finances/
│       ├── settings/
│       └── help/
├── lib/
│   ├── components/
│   │   ├── ui/              # Base components (atomic)
│   │   │   ├── DataTable.svelte
│   │   │   ├── Modal.svelte
│   │   │   ├── Card.svelte
│   │   │   ├── Avatar.svelte
│   │   │   ├── Tooltip.svelte
│   │   │   ├── ContextMenu.svelte
│   │   │   ├── AlertBar.svelte
│   │   │   ├── SearchPalette.svelte
│   │   │   └── KeyboardHint.svelte
│   │   ├── domain/          # Domain-specific composed components
│   │   │   ├── IdolCard.svelte
│   │   │   ├── IdolRow.svelte
│   │   │   ├── JobRow.svelte
│   │   │   ├── ContractPanel.svelte
│   │   │   ├── WellnessBars.svelte
│   │   │   ├── StatsRadar.svelte
│   │   │   └── ...
│   │   └── layout/          # Global layout components
│   │       ├── MainNav.svelte
│   │       ├── StatusBar.svelte
│   │       ├── Breadcrumbs.svelte
│   │       └── SidePanel.svelte
│   ├── stores/              # Svelte stores (readonly projections)
│   │   ├── game-state.ts    # Root store + slice derivations
│   │   ├── ui-state.ts      # UI-only state (selected tab, filters)
│   │   └── preferences.ts   # Persisted user preferences
│   └── actions/             # Svelte actions (use:directive)
│       ├── tooltip.ts
│       ├── contextmenu.ts
│       ├── keyboard-nav.ts
│       └── click-outside.ts
```

### 1. Component Tiers

| Tier | Directory | Purpose | Rules |
|------|-----------|---------|-------|
| **Atomic** | `ui/` | Reusable primitives | No domain logic. No store imports. Props only. |
| **Domain** | `domain/` | Game-specific composed | May import stores. Domain-typed props. |
| **Layout** | `layout/` | Global chrome | Fixed across all game routes. |
| **Page** | `routes/` | Route entry points | Orchestrate domain components. Minimal logic. |

### 2. DataTable — Core Dense UI Component

The DataTable is the most complex and reused component (roster, job board,
rankings, history, market, scouting results). It must support:

```typescript
interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  // Features
  sortable?: boolean;
  filterable?: boolean;
  selectable?: boolean;        // checkbox per row
  multiSelect?: boolean;       // Ctrl+Click, Ctrl+A
  configurable?: boolean;      // add/remove/reorder columns
  // Keyboard
  keyboardNav?: boolean;       // ↑/↓ navigate, Enter open
  // Persistence
  persistKey?: string;         // key for saving column/filter state
  // Virtualization
  virtualScroll?: boolean;     // for 100+ rows
  rowHeight?: number;
  // Events
  onRowClick?: (item: T) => void;
  onRowDoubleClick?: (item: T) => void;
  onRowContextMenu?: (item: T, event: MouseEvent) => void;
  onSelectionChange?: (items: T[]) => void;
}

interface ColumnDef<T> {
  key: string;
  label: string;
  width?: string;
  sortFn?: (a: T, b: T) => number;
  filterFn?: (item: T, query: string) => boolean;
  render?: Snippet<[T]>;       // Svelte 5 snippet for custom cell rendering
  visible?: boolean;           // toggleable by user
}
```

**Virtual scrolling** enabled for tables with 100+ rows (roster ~50 player idols,
but idol database ~3000). Only renders visible rows + buffer.

### 3. Data Binding Strategy

```
SimWorker ──postMessage──► Orchestrator ──► gameState (writable store)
                                                │
                                    ┌───────────┼───────────┐
                                    ▼           ▼           ▼
                              rosterSlice  economySlice  fameSlice
                              (derived)    (derived)     (derived)
                                    │           │           │
                                    ▼           ▼           ▼
                              RosterPage   AgencyPage   RankingsPage
                              (subscribes) (subscribes)  (subscribes)
```

**Rules:**
- Pages subscribe to the **smallest slice** they need (not the root store)
- Components receive data via **props**, not store subscriptions
- Only page-level components (`+page.svelte`) subscribe to stores
- Domain components are pure: same props → same render

### 4. UI-Only State

State that exists only in the UI (not in simulation) is managed separately:

```typescript
// src/lib/stores/ui-state.ts
interface UIState {
  // Per-screen state
  activeTab: Record<string, string>;       // screen → active tab id
  tableConfigs: Record<string, TableConfig>; // persistKey → columns/filters/sort
  expandedPanels: Record<string, boolean>;

  // Global UI state
  searchOpen: boolean;
  contextMenu: { x: number; y: number; items: MenuItem[] } | null;
  modalStack: ModalConfig[];
  sidePanel: { component: Component; props: Record<string, unknown> } | null;
}
```

**Persistence**: `tableConfigs` saved to IndexedDB alongside game state (per-save).
Other UI state is ephemeral (reset on page navigation).

### 5. Keyboard Architecture

```typescript
// Global keyboard handler in (game)/+layout.svelte
const GLOBAL_SHORTCUTS: Record<string, () => void> = {
  '1': () => goto('/portal'),
  '2': () => goto('/roster'),
  '3': () => goto('/market'),
  '4': () => goto('/scouting'),
  '5': () => goto('/operations'),
  '6': () => goto('/agency'),
  'ctrl+k': () => openSearch(),
  'space': () => toggleSimulation(),
  '?': () => showKeyboardHints(),
  'escape': () => closeTopModal(),
};

// Per-component keyboard (via action)
// <div use:keyboardNav={{ onEnter, onArrowUp, onArrowDown }}>
```

### 6. Route Groups

SvelteKit route groups separate menu and game layouts:

- `(menu)` — No game nav bar, no status bar, no time controls. Full-screen.
- `(game)` — MainNav + StatusBar + Breadcrumbs. All game screens.

Transition: menu → game uses a fade animation. Game → game uses instant navigation.

### 7. Context Menu Pattern

Every entity (idol, agency, job, news, song) supports right-click:

```typescript
interface ContextMenuItem {
  label: string;
  icon?: string;
  shortcut?: string;
  action: () => void;
  disabled?: boolean;
  separator?: boolean;
}

// Each entity type defines its menu items
function idolContextMenu(idol: IdolRuntime): ContextMenuItem[] {
  return [
    { label: 'View Profile', shortcut: 'Enter', action: () => goto(`/roster/${idol.id}`) },
    { label: 'Assign to Job', action: () => openJobAssignment(idol.id) },
    { label: 'View Contract', action: () => openContractPanel(idol.id) },
    { separator: true },
    { label: 'Compare...', shortcut: 'C', action: () => openComparison(idol.id) },
    { label: 'Follow', action: () => toggleFollow(idol.id) },
  ];
}
```

### 8. Drilldown Pattern — Every Number Is Explorable

**Core UI principle:** Every number, score, status, or summary displayed in a card
or table MUST be explorable. The player should never see a number and wonder
"where does this come from?" without being able to find out.

There are 3 levels of drilldown:

```
Level 0: THE NUMBER
  "Revenue: ¥8.5M"
  → Player sees the value. Wants to know more.

Level 1: TOOLTIP (hover/tap)
  → Hover over ¥8.5M → tooltip shows breakdown:
    "Jobs: ¥5.2M | Royalties: ¥1.8M | Merch: ¥1.0M | Events: ¥0.5M"
  → Quick context without leaving the screen.

Level 2: MODAL (click)
  → Click ¥8.5M → modal opens with:
    - Full breakdown by source
    - Trend chart (last 4 weeks)
    - Top-3 idols by revenue contribution
    - "View full report →" link
  → Deep context while keeping current screen as backdrop.

Level 3: NAVIGATION (link in modal or direct)
  → "View full report →" → navigates to /finances with the relevant tab active
  → Full screen dedicated to this data.
```

**Implementation:**

```typescript
// Every data value in the UI can declare its drilldown chain
interface DrilldownConfig {
  // Level 1: tooltip content (always available)
  tooltip: string | (() => TooltipContent);

  // Level 2: modal on click (optional — some values are self-explanatory)
  modal?: {
    title: string;
    component: Component;  // Svelte component to render in modal
    props: Record<string, unknown>;
  };

  // Level 3: navigation target (optional — for full-page deep dive)
  navigateTo?: {
    href: string;
    tab?: string;          // activate specific tab on target page
    highlight?: string;    // highlight specific element on target page
  };
}

// Usage in components:
// <DataValue value={revenue} drilldown={revenueDrilldown} />
// → renders: ¥8.5M with hover tooltip, click opens modal, modal has "see more" link
```

**DataValue component (atomic):**

```typescript
interface DataValueProps {
  value: string | number;
  format?: 'currency' | 'percent' | 'number' | 'stars' | 'label';
  trend?: 'up' | 'down' | 'stable';  // optional arrow indicator
  drilldown?: DrilldownConfig;
  // Visual
  color?: 'default' | 'positive' | 'negative' | 'warning';
  size?: 'sm' | 'md' | 'lg';
}

// Renders as:
// ¥8.5M ▲  (clickable, hoverable, colored by trend)
```

**Rules for drilldown:**

1. **Every numeric value in a Card must have at least Level 1 (tooltip).**
   No unexplained numbers. Tooltip shows the formula or breakdown.

2. **Aggregated values (totals, averages, scores) must have Level 2 (modal).**
   The modal shows what the aggregate is composed of.

3. **Entity references (idol name, agency name, song name) must have Level 3 (navigation).**
   Click an idol name anywhere → goes to idol profile.
   This overlaps with the Context Menu pattern — right-click gives options,
   left-click goes to the primary destination.

4. **Star ratings (mastery, staff attributes) must have Level 1 (tooltip).**
   Hover shows the label (Elite, Outstanding, etc.) and what it means for this context.

5. **Status labels (Designed, Active, Stalled) must have Level 1 (tooltip).**
   Hover explains what the status means and what caused it.

**Drilldown in DataTable:**

```typescript
interface ColumnDef<T> {
  key: string;
  label: string;
  // ... existing props ...

  // Drilldown per cell
  drilldown?: (item: T) => DrilldownConfig;
  // Example: in job history table, the "Performance" column:
  // drilldown: (job) => ({
  //   tooltip: `${job.gradeLetter} (${job.performance.toFixed(2)})`,
  //   modal: { component: PostMortemModal, props: { jobId: job.id } },
  //   navigateTo: { href: `/operations/results`, highlight: job.id }
  // })
}
```

**Drilldown in Cards:**

Cards are the primary container for summary data. Every card section should be
designed with drilldown in mind:

```
┌─────────────────────────────────────────┐
│  Agency Overview Card                    │
│                                          │
│  Revenue: ¥8.5M ▲  ← hover: breakdown   │
│                      ← click: modal      │
│  Expenses: ¥6.2M ▼  ← hover: by category│
│  Balance: ¥15.3M    ← hover: trend 4wk  │
│                                          │
│  Top Idol: Yui (¥3.2M)  ← click: profile│
│  Staff: 8/10 filled     ← click: /staff  │
│  Mood: ☀ Otimista       ← hover: why     │
│                                          │
│  [View Full Report →]    ← /finances     │
└─────────────────────────────────────────┘
```

Every item in the card is interactive. The card is never a dead-end —
it's always an entry point to deeper information.

### Key Interfaces

```typescript
// Avatar — used everywhere an idol is mentioned
interface AvatarProps {
  idolId: string;
  size: 16 | 24 | 40 | 80 | 160;  // px
  tier?: IdolTier;                   // border color
  blurred?: boolean;                 // unscouted
  showName?: boolean;
}

// WellnessBars — compact 4-bar display
interface WellnessBarsProps {
  wellness: WellnessState;
  showValues?: boolean;              // numeric on hover
  compact?: boolean;                 // single-line mode
}

// SearchPalette — Ctrl+K universal search
interface SearchPaletteProps {
  categories: SearchCategory[];      // idol, staff, job, screen, glossary
  onSelect: (result: SearchResult) => void;
}
```

## Alternatives Considered

### Alternative 1: Server-side rendering with SvelteKit load functions

- **Description**: Use SvelteKit's `+page.server.ts` load functions to fetch game data from Supabase on navigation.
- **Pros**: Standard SvelteKit pattern. Works for multiplayer/web scenarios.
- **Cons**: Game state lives in SimWorker, not on server. Adding server round-trips adds latency. The game is offline-first — server is optional.
- **Rejection Reason**: Game state is client-side (SimWorker). Server load functions are used only for auth and cloud save — not for game data. Pages bind to local stores.

### Alternative 2: Canvas-based UI (Pixi.js / custom renderer)

- **Description**: Render the entire UI on a 2D canvas for maximum performance.
- **Pros**: Full control over rendering. No DOM overhead for 3000-row tables.
- **Cons**: Lose all HTML/CSS benefits (accessibility, text selection, browser devtools, responsive layout). Massive development effort to rebuild table, form, and text components. Breaks Svelte's reactivity model.
- **Rejection Reason**: ADR-001 chose SvelteKit specifically because "95% UI densa e 5% visual 2D." DOM-based UI with virtual scrolling handles the scale. Canvas would be a regression.

### Alternative 3: Headless UI library (Melt UI / Bits UI)

- **Description**: Use a headless component library for complex interactions (datatable, combobox, modal).
- **Pros**: Accessible by default. Well-tested keyboard navigation. Less custom code.
- **Cons**: Additional dependency. May not support the exact FM26-style dense table we need. Styling integration with Tailwind varies.
- **Rejection Reason**: Not rejected — **recommended for evaluation** during implementation. If Melt UI or Bits UI covers DataTable needs, adopt it. Custom implementation only where libraries fall short.

## Consequences

### Positive
- Clear component hierarchy prevents spaghetti UI code
- DataTable component reused across 10+ screens
- Virtual scrolling handles 3000-idol database view
- Keyboard-first design satisfies FM26-inspired dense UI requirements
- Store-per-slice prevents unnecessary re-renders

### Negative
- DataTable is complex to implement (sorting, filtering, virtualizing, persisting)
- Keyboard shortcut conflicts must be managed carefully across screens
- Context menu implementation requires portal rendering (outside component tree)

### Risks
- **Risk**: Virtual scrolling breaks accessibility (screen readers)
  - **Mitigation**: Provide "load all" option for accessibility mode. Use ARIA roles for virtual list.
- **Risk**: 13-system Portal dashboard is slow to render
  - **Mitigation**: Each Portal tab is a separate component. Only active tab renders. Inactive tabs are lazy.

## GDD Requirements Addressed

| GDD System | Requirement | How This ADR Addresses It |
|------------|-------------|--------------------------|
| ui-information-architecture.md | PC 1920×1080 dense UI | Tailwind responsive grid, DataTable with configurable columns |
| ui-information-architecture.md | Universal search Ctrl+K | SearchPalette component in global layout |
| ui-information-architecture.md | Table column config per-screen per-save | DataTable persistKey + UIState.tableConfigs in IndexedDB |
| ui-information-architecture.md | Keyboard traversal in all tables | DataTable keyboardNav + use:keyboard-nav action |
| ui-information-architecture.md | Right-click context menu on entities | ContextMenu component + per-entity menu factories |
| ui-information-architecture.md | Avatar with tier border on every idol mention | Avatar component with tier-colored border |
| ui-dashboard.md | Portal loads in <1s from 13 systems | Slice-derived stores; lazy tab rendering |
| ui-dashboard.md | 3-column layout 25%/45%/30% | Tailwind grid in portal +page.svelte |
| ui-job-board.md | Table 20+ rows loads in <500ms | DataTable with virtual scroll when >100 rows |
| ui-idol-profile.md | Profile navigable by keyboard | Tab navigation via use:keyboard-nav |
| main-menu-flow.md | Route groups separate menu from game | (menu)/ and (game)/ SvelteKit groups |

## Performance Implications

- **CPU**: Virtual scrolling eliminates DOM node creation for off-screen rows
- **Memory**: ~50MB for UI DOM/Svelte (within 512MB budget)
- **Load Time**: Lazy tab rendering in Portal keeps initial render <500ms
- **Network**: Zero — all data from local stores

## Migration Plan

1. **Phase A — Route groups**: Restructure routes into `(menu)/` and `(game)/` groups
2. **Phase B — DataTable**: Build the core DataTable component with sort/filter/keyboard/persist
3. **Phase C — Avatar & WellnessBars**: Atomic components used everywhere
4. **Phase D — Context menus**: Global ContextMenu + per-entity menu factories
5. **Phase E — SearchPalette**: Ctrl+K universal search
6. **Phase F — Migrate existing pages**: Refactor 20 existing routes to use new component architecture

## Validation Criteria

- Roster table renders 50 idols in <200ms
- Idol database table virtualizes 3000 rows with <50ms scroll response
- Portal dashboard loads all 6 tabs lazily in <1s total
- All DataTable instances support keyboard navigation
- Column config persists across save/load cycles
- Context menu appears within 100ms of right-click

## Related Decisions

- [ADR-001: Stack Tecnológica](adr-001-stack-tecnologica.md) — SvelteKit + Tailwind
- [ADR-003: Game State Schema](adr-003-game-state-schema.md) — store-per-slice binding
- design/gdd/ui-information-architecture.md — primary UI GDD
- design/gdd/ui-dashboard.md — Portal requirements
