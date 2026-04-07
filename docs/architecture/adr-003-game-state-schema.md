# ADR-003: Game State Schema & Persistence

## Status
Proposed

## Date
2026-04-07

## Engine Compatibility

| Field | Value |
|-------|-------|
| **Engine** | SvelteKit 2.50 + Svelte 5 |
| **Domain** | State Management / Persistence |
| **Knowledge Risk** | LOW — IndexedDB, structuredClone, Svelte 5 runes are stable |
| **References Consulted** | ADR-001, ADR-002, save-load.md GDD, existing src/lib/types/ |
| **Post-Cutoff APIs Used** | None |
| **Verification Required** | Benchmark structuredClone of full GameState (<15ms for 3000 idols) |

## ADR Dependencies

| Field | Value |
|-------|-------|
| **Depends On** | ADR-001 (Stack), ADR-002 (Simulation Pipeline — defines worker↔UI boundary) |
| **Enables** | ADR-004 (Event System), ADR-006 (UI Component Architecture) |
| **Blocks** | All epics that read/write game state (every system) |
| **Ordering Note** | Must be Accepted before any schema refactoring begins |

## Context

### Problem Statement

The game manages ~3,000 idols, 50 agencies, and 48 interconnected systems in a
single `GameStateV1` object. This state must be:
1. **Owned by SimWorker** — the authoritative copy lives in the simulation worker
2. **Projected to UI** — Svelte stores hold a readonly projection for rendering
3. **Persisted to IndexedDB** — autosave after each week tick (<200ms)
4. **Synced to Supabase** — cloud backup as compressed JSONB
5. **Versioned** — migration chain when schema changes between releases

The current `GameStateV1` (477 lines in `src/lib/types/simulation.ts`) is a flat
monolith — all state in one interface. This works but creates problems:
- Full state transfer between worker and UI is expensive (~10-15ms structuredClone)
- Autosave serializes everything even when only a few entities changed
- No clear ownership boundaries — any system can read/write any field
- Adding new systems requires modifying the root GameState interface

### Constraints

- Worker↔UI communication uses `postMessage` (structuredClone) — no shared memory
- IndexedDB is the primary local persistence layer (not SQLite — web platform)
- Supabase stores saves as compressed JSONB in `save_games` table
- Schema must support 20+ years (960 weeks) of gameplay data
- State must be deterministic: same seed + same actions = same state

### Requirements

- GameState transfer worker→UI in <15ms (structuredClone budget)
- Autosave (delta) in <200ms targeting IndexedDB
- Full save/load in <2s
- Support incremental schema migration (v1→v2→v3)
- Clear ownership: each subsystem knows which state slice it owns

## Decision

### Sliced State Architecture with Delta Projections

Decompose `GameStateV1` into **domain slices** owned by specific subsystems.
The SimWorker holds the full state; the UI receives **delta projections** after
each phase, not the entire state.

### 1. State Slices

```typescript
// Root state — composed of domain slices
interface GameState {
  version: number;
  meta: MetaSlice;
  agency: AgencySlice;
  roster: RosterSlice;        // ~3000 idols
  rivals: RivalsSlice;        // 50 agencies
  economy: EconomySlice;
  contracts: ContractsSlice;
  schedule: ScheduleSlice;
  fame: FameSlice;
  music: MusicSlice;
  market: MarketSlice;
  scouting: ScoutingSlice;
  events: EventsSlice;
  news: NewsSlice;
  messages: MessagesSlice;
  liveSim: LiveSimSlice;
  producer: ProducerSlice;
  staff: StaffSlice;
  strategy: StrategySlice;
}

// Example slice — each slice is self-contained
interface RosterSlice {
  idols: Map<string, IdolRuntime>;  // keyed by idol ID for O(1) lookup
  totalActive: number;
  // Only data owned by the roster system lives here
}

interface EconomySlice {
  balanceYen: number;
  tier: AgencyEconomyTier;
  ledger: LedgerEntry[];
  monthlyReports: MonthlyReport[];
  facilities: Facility[];
}

interface MetaSlice {
  seed: number;
  absoluteWeek: number;
  worldPackId: string;
  startingRegionId: string;
  saveDate?: string;
}
```

### 2. Worker→UI Delta Protocol

Instead of transferring the full GameState after each phase, SimWorker sends
**delta projections** — only the slices that changed:

```typescript
// SimWorker sends after each phase
interface StateProjection {
  type: 'stateProjection';
  phase: 1 | 2 | 3 | 4;
  // Only changed slices are included (undefined = no change)
  delta: {
    roster?: RosterSlice;
    economy?: EconomySlice;
    fame?: FameSlice;
    contracts?: ContractsSlice;
    events?: Partial<EventsSlice>;
    news?: Partial<NewsSlice>;
    messages?: Partial<MessagesSlice>;
    liveSim?: LiveSimSlice;
    market?: Partial<MarketSlice>;
    rivals?: RivalsSlice;
    // ... other slices as needed
  };
  // Always included for UI header
  meta: { absoluteWeek: number; balanceYen: number };
}

// UI applies deltas to its local store
function applyProjection(store: GameState, proj: StateProjection) {
  for (const [key, value] of Object.entries(proj.delta)) {
    if (value !== undefined) {
      store[key] = value;  // replace slice wholesale
    }
  }
  store.meta.absoluteWeek = proj.meta.absoluteWeek;
  store.agency.balanceYen = proj.meta.balanceYen;
}
```

**Phase-to-slice mapping** (which slices change in which phase):

| Phase | Slices Updated |
|-------|---------------|
| Phase 1 (init) | market, scouting, contracts |
| Phase 2 (daily) | roster (wellness), economy, events, news, messages |
| Phase 3 (end-of-week) | roster (stats), fame, rivals, economy, music, contracts |
| Phase 4 (report) | news, messages, liveSim |
| Full sync (load/start) | All slices |

### 3. Persistence Strategy

#### IndexedDB Structure

```
database: "star-idol-agency"
├── object store: "saves"
│   ├── key: "autosave"
│   ├── key: "slot-1"
│   ├── key: "slot-2"
│   └── key: "slot-3"
│
├── object store: "save-deltas"  (for incremental autosave)
│   └── key: "{saveId}-{sliceName}"  → serialized slice
│
└── object store: "settings"  (player-level, not per-save)
    └── key: "preferences" → { language, theme, volume, ... }
```

#### Autosave (Delta Strategy)

After each week tick, SimWorker tracks which slices were modified:

```typescript
// SimWorker maintains a dirty-tracking set
const dirtySlices = new Set<keyof GameState>();

// When any slice is modified during simulation:
function markDirty(slice: keyof GameState) {
  dirtySlices.add(slice);
}

// Autosave: only serialize dirty slices
function buildAutosaveDelta(): SaveDelta {
  const delta: Partial<Record<keyof GameState, unknown>> = {};
  for (const key of dirtySlices) {
    delta[key] = gameState[key];
  }
  dirtySlices.clear();
  return { version: gameState.version, meta: gameState.meta, slices: delta };
}
```

Typical delta size: 200-500KB (3-5 slices changed per week) vs 5-8MB full state.
IndexedDB write of 500KB completes in ~20-50ms.

#### Full Save

Serializes entire GameState as a single JSONB blob:
- Local: Stored in IndexedDB "saves" object store
- Cloud: Compressed (pako/gzip) and uploaded to Supabase `save_games` table

#### Load

1. Read full state from IndexedDB (or download from Supabase)
2. Check `version` field against current schema version
3. If version < current: run migration chain
4. Deserialize into GameState slices
5. Transfer to SimWorker via postMessage
6. SimWorker acknowledges; UI receives initial full projection

### 4. Schema Migration

```typescript
type Migration = (state: unknown) => unknown;

const migrations: Record<number, Migration> = {
  2: migrateV1toV2,  // e.g., add music slice
  3: migrateV2toV3,  // e.g., restructure contracts
  // ...
};

function migrateState(state: { version: number }): GameState {
  let current = state;
  while (current.version < CURRENT_VERSION) {
    const migrate = migrations[current.version + 1];
    if (!migrate) throw new Error(`No migration for v${current.version}→v${current.version + 1}`);
    current = migrate(current);
    current.version++;
  }
  return current as GameState;
}
```

Migrations run on the main thread at load time (before handing state to SimWorker).
Original save is preserved in a backup slot before migration begins.

### 5. Map vs Array for Collections

Large collections (idols, contracts, jobs) use `Map<string, T>` internally in
the SimWorker for O(1) lookups. When transferring to UI via postMessage, Maps
are automatically handled by structuredClone. For IndexedDB persistence, Maps
are serialized as arrays of `[key, value]` pairs:

```typescript
// Serialize for IndexedDB
function serializeSlice(slice: RosterSlice): SerializedRoster {
  return { idols: [...slice.idols.entries()], totalActive: slice.totalActive };
}

// Deserialize on load
function deserializeRoster(data: SerializedRoster): RosterSlice {
  return { idols: new Map(data.idols), totalActive: data.totalActive };
}
```

### 6. Svelte Store Integration

UI stores hold readonly projections of state slices:

```typescript
// src/lib/stores/game-state.ts
import { writable, derived } from 'svelte/store';

// Root store — updated by orchestrator when projection arrives
export const gameState = writable<GameState>(initialState);

// Derived stores for specific UI needs
export const balance = derived(gameState, s => s.economy.balanceYen);
export const currentWeek = derived(gameState, s => s.meta.absoluteWeek);
export const rosterCount = derived(gameState, s => s.roster.totalActive);
export const alerts = derived(gameState, s => s.messages.alerts);

// Slice-level derived stores (for components that need one slice)
export const rosterSlice = derived(gameState, s => s.roster);
export const economySlice = derived(gameState, s => s.economy);
```

Components subscribe to the smallest slice they need. Svelte 5 runes handle
granular reactivity — only components reading the changed slice re-render.

### Key Interfaces

```typescript
// State ownership contract
interface SliceOwnership {
  slice: keyof GameState;
  owner: string;           // system that writes this slice
  readers: string[];       // systems that read this slice
}

const OWNERSHIP: SliceOwnership[] = [
  { slice: 'roster',    owner: 'stats-system',     readers: ['ui', 'economy', 'fame', 'scouting'] },
  { slice: 'economy',   owner: 'economy-system',   readers: ['ui', 'contract', 'market'] },
  { slice: 'fame',      owner: 'fame-system',      readers: ['ui', 'scouting', 'rival-ai'] },
  { slice: 'contracts', owner: 'contract-system',   readers: ['ui', 'schedule', 'economy'] },
  { slice: 'schedule',  owner: 'schedule-system',   readers: ['ui', 'week-sim'] },
  { slice: 'music',     owner: 'music-system',      readers: ['ui', 'economy', 'fame'] },
  { slice: 'rivals',    owner: 'rival-ai-system',   readers: ['ui', 'market', 'news'] },
  { slice: 'market',    owner: 'market-system',     readers: ['ui', 'rival-ai', 'scouting'] },
  { slice: 'scouting',  owner: 'scouting-system',   readers: ['ui', 'market'] },
  { slice: 'events',    owner: 'event-system',      readers: ['ui', 'news', 'wellness'] },
  { slice: 'news',      owner: 'news-system',       readers: ['ui'] },
  { slice: 'messages',  owner: 'message-system',    readers: ['ui'] },
  { slice: 'staff',     owner: 'staff-system',      readers: ['ui', 'economy', 'shows'] },
  { slice: 'strategy',  owner: 'strategy-system',   readers: ['ui', 'all-systems'] },
  { slice: 'producer',  owner: 'meta',              readers: ['ui', 'contract', 'reputation'] },
  { slice: 'meta',      owner: 'time-system',       readers: ['all'] },
  { slice: 'agency',    owner: 'economy-system',    readers: ['ui', 'all-systems'] },
  { slice: 'liveSim',   owner: 'sim-orchestrator',  readers: ['ui'] },
];
```

## Alternatives Considered

### Alternative 1: Keep flat GameStateV1 monolith

- **Description**: Continue with the current single-interface approach. All state in one object.
- **Pros**: Simple. Already implemented. No migration needed.
- **Cons**: Full state transfer (~10-15ms) every phase. Autosave writes everything (~5MB). No ownership boundaries. Adding systems bloats the root interface.
- **Rejection Reason**: Doesn't scale. As more systems are added (shows, music production, costumes, dialogue), the monolith becomes a performance and maintainability bottleneck.

### Alternative 2: ECS (Entity Component System)

- **Description**: Decompose all state into entities with components. Pure data-oriented design.
- **Pros**: Maximum query flexibility. Natural parallelism. Cache-friendly for large collections.
- **Cons**: Massive refactor of existing codebase. ECS libraries for web (bitECS, etc.) add complexity. Overkill for a management sim where most state is UI-bound, not physics-bound. Poor ergonomics with TypeScript's type system for dynamic component queries.
- **Rejection Reason**: ECS is optimized for real-time simulations with homogeneous entity processing (physics, particles). This game's state is heterogeneous (idols have different data than agencies, songs, events). Domain slices better match the problem.

### Alternative 3: SQLite via sql.js (WASM)

- **Description**: Use SQLite compiled to WASM (sql.js) as the in-memory state store, matching the GDD's specification of SQLite saves.
- **Pros**: SQL queries for complex lookups. Matches GDD save format exactly. Transactional writes. Delta saves via WAL mode.
- **Cons**: ~1MB WASM bundle size. SQL query overhead for simple reads (~0.5ms per query vs ~0.001ms for Map.get). Cannot run in Web Worker without additional setup. structuredClone doesn't work with sql.js database objects — need custom serialization for worker transfer.
- **Rejection Reason**: The GDD specifies SQLite for saves, but the current implementation uses IndexedDB + JSONB (Supabase), which is simpler and already works. Migrating to sql.js adds complexity without clear benefit. If needed later, the sliced architecture makes it easy to swap the persistence layer without changing the state model.

## Consequences

### Positive
- Delta projections reduce worker→UI transfer from ~10-15ms to ~2-5ms per phase
- Delta autosave reduces write from ~5MB to ~200-500KB (~4× faster)
- Clear ownership boundaries prevent cross-system state corruption
- Adding new systems = adding a new slice (no modification to existing slices)
- Svelte derived stores enable granular reactivity (only changed slices trigger re-render)

### Negative
- Migration from GameStateV1 monolith requires careful refactoring
- Slice boundaries add indirection for cross-system reads
- Map serialization/deserialization adds a small overhead at save/load time
- More TypeScript types to maintain (one interface per slice)

### Risks
- **Risk**: structuredClone of Map objects is slower than plain objects in some browsers
  - **Mitigation**: Benchmark on target browsers. Fallback: convert Maps to plain objects before transfer.
- **Risk**: Delta tracking misses a dirty slice, causing stale UI
  - **Mitigation**: Full sync projection available at any time (weekComplete always sends full state). Delta is an optimization, not the only path.
- **Risk**: Schema migration chain grows long over 20+ updates
  - **Mitigation**: Periodic "squash" migrations that replace v1→v2→...→vN with a single v1→vN migration.

## GDD Requirements Addressed

| GDD System | Requirement | How This ADR Addresses It |
|------------|-------------|--------------------------|
| save-load.md | Autosave <200ms using delta-save strategy | Delta autosave writes only dirty slices to IndexedDB (~200-500KB) |
| save-load.md | Full save <2s, <50MB | Full GameState serialized as JSONB; compressed for cloud sync |
| save-load.md | Load <1.5s for 3000 idols + 50 agencies | Map-based slices with indexed lookups; deserialize in parallel |
| save-load.md | Version migration chain; original preserved | Migration functions per version; backup before migration |
| save-load.md | World pack ID validation on load | MetaSlice.worldPackId checked before deserialization |
| save-load.md | 2-copy backup rotation | IndexedDB stores current + previous autosave |
| week-simulation.md | Pipeline phases update different systems | Phase-to-slice mapping ensures only relevant slices are projected |
| time-calendar.md | Pause consumes zero CPU | No state changes during pause = no projections, no writes |
| agency-economy.md | 6 revenue + 11 expense categories | EconomySlice.ledger stores typed entries per category |
| happiness-wellness.md | 4 wellness bars per idol | RosterSlice.idols[].wellness: WellnessState |
| contract-system.md | 9 clause values per contract | ContractsSlice holds ActiveContract[] with typed clauses |
| fame-rankings.md | Rankings sorted monthly | FameSlice stores sorted snapshots updated at month boundary |

## Performance Implications

- **CPU**: Delta tracking adds ~0.1ms overhead per slice per tick (negligible)
- **Memory**: Sliced architecture uses same total memory as monolith; Maps add ~10% overhead for key storage
- **Load Time**: Deserialization of slices can be parallelized (~20% faster than monolith parse)
- **Network**: Cloud sync size unchanged (full state compressed to ~1MB)

## Migration Plan

1. **Phase A — Define slice interfaces**: Create `src/lib/types/slices/` with one file per slice. Keep GameStateV1 as compatibility alias.
2. **Phase B — Implement slice converters**: Functions to convert GameStateV1 ↔ sliced GameState. Both formats work during transition.
3. **Phase C — Update SimWorker**: SimWorker uses sliced state internally. Still sends full state to UI (backward compatible).
4. **Phase D — Add delta projections**: SimWorker tracks dirty slices and sends deltas. UI applies them.
5. **Phase E — Update persistence**: IndexedDB uses per-slice object stores for delta autosave.
6. **Phase F — Remove GameStateV1**: Once all systems use sliced state, remove the monolith interface.

## Validation Criteria

- structuredClone of delta projection <5ms (typical phase)
- Full state structuredClone <15ms
- Autosave (delta) <200ms to IndexedDB
- Full save <2s
- Load <1.5s for 3000 idols
- Same seed produces identical state across save/load cycles
- No data loss across 100 consecutive autosave/load cycles (fuzz test)

## Related Decisions

- [ADR-001: Stack Tecnológica](adr-001-stack-tecnologica.md) — IndexedDB + Supabase persistence
- [ADR-002: Simulation Pipeline](adr-002-simulation-pipeline.md) — worker↔UI boundary
- design/gdd/save-load.md — primary persistence GDD
- design/gdd/week-simulation.md — pipeline phases driving delta strategy
- src/lib/types/simulation.ts — current GameStateV1 to be migrated
