# ADR-005: Performance Budget Allocation

## Status
Proposed

## Date
2026-04-07

## Engine Compatibility

| Field | Value |
|-------|-------|
| **Engine** | SvelteKit 2.50 + Svelte 5 |
| **Domain** | Performance / All Systems |
| **Knowledge Risk** | LOW |
| **References Consulted** | ADR-001, ADR-002, ADR-003, ADR-004, technical-preferences.md |
| **Post-Cutoff APIs Used** | None |
| **Verification Required** | Benchmark all budgets on target PC hardware (mid-range 2024 laptop) |

## ADR Dependencies

| Field | Value |
|-------|-------|
| **Depends On** | ADR-002 (pipeline phases), ADR-003 (state transfer costs), ADR-004 (event dispatch costs) |
| **Enables** | All implementation epics (every system must stay within its budget) |
| **Blocks** | None — advisory, not blocking |
| **Ordering Note** | Should be Accepted before first sprint to set expectations |

## Context

### Problem Statement

The game processes 48 systems, ~3,000 idols, and 50 agencies every week tick.
Without explicit budgets per system, individual systems can silently consume the
entire frame/tick budget, causing stutters (Live mode) or unacceptable Skip times.

This ADR allocates time budgets per system per pipeline phase, based on the
constraints defined in GDDs and ADR-002.

### Constraints

- **Skip mode total**: <500ms (target <200ms) — from week-simulation.md
- **Live mode frame**: 16.6ms at 60fps — UI must never drop frames
- **Live day tick**: must complete within one frame or be offloaded to worker
- **Autosave**: <200ms — from save-load.md
- **State transfer**: <15ms per structuredClone — from ADR-003
- **Memory ceiling**: 512MB total — from technical-preferences.md
- **Target hardware**: Mid-range 2024 laptop (4-core, 16GB RAM, Chrome/Safari)

## Decision

### Budget Tables

#### Skip Mode — Weekly Tick Budget (target: <200ms, hard limit: 500ms)

| Phase | System | Budget | Notes |
|-------|--------|--------|-------|
| **Phase 1** | Market update | 10ms | Pool refresh, proposals |
| | Scouting results | 5ms | Report generation |
| | Contract checks | 5ms | Expiry, warnings |
| | Job board refresh | 5ms | Generate new jobs |
| **Phase 1 total** | | **25ms** | |
| **Phase 2** | Day ticks (7 days) | 70ms | 10ms/day × 7 |
| | — Job processing | 5ms/day | Performance formula per idol |
| | — Event generator | 2ms/day | Deterministic trigger checks |
| | — Show pipeline | 3ms/day | If Performance Event scheduled |
| **Phase 2 total** | | **70ms** | |
| **Phase 3** | Stats tick | 10ms | Growth/decay for ~3000 idols |
| | Wellness tick | 5ms | 4 bars × ~3000 idols |
| | Fame update | 5ms | Sort ~3000 idols |
| | Economy settlement | 5ms | Ledger entries |
| | Contract advancement | 3ms | Advance dates |
| | Music charts (monthly) | 5ms | Only on week 4 |
| | **Rival AI** (offloaded) | **80ms** | 50 agencies × ~1.6ms (parallel in RivalAIWorker) |
| | News generation | 5ms | Template rendering |
| | Fan clubs | 3ms | Mood/loyalty updates |
| | Other systems | 4ms | Staff, strategy, planning, merch, medical |
| **Phase 3 total** | | **45ms** (+80ms parallel in RivalAIWorker) |
| **Phase 4** | Moment Engine | 5ms | Rank weekLog, select top 5 |
| | Report assembly | 3ms | Build WeekReport |
| | State projection | 7ms | structuredClone delta → UI |
| **Phase 4 total** | | **15ms** | |
| | | | |
| **SimWorker total** | | **155ms** | Sequential phases |
| **RivalAIWorker** | | **80ms** | Parallel with Phase 3 |
| **Effective total** | | **~155ms** | (rival AI overlaps with Phase 3) |
| **Headroom** | | **45ms** | Until 200ms target |

#### Live Mode — Per-Day Tick Budget

| Component | Budget | Notes |
|-----------|--------|-------|
| Day tick (SimWorker) | <10ms | Job processing + event checks for active idols |
| State delta → UI | <3ms | Only changed idol wellness/job results |
| UI render | <6ms | Svelte reactive update |
| **Total per day** | **<16ms** | Fits in one 60fps frame with 3ms headroom |

Between days: timer interval based on speed multiplier (no CPU usage).

#### Autosave Budget

| Operation | Budget | Notes |
|-----------|--------|-------|
| Dirty slice serialization | 50ms | ~200-500KB of changed slices |
| IndexedDB write | 100ms | Async, doesn't block sim |
| Cloud sync (if online) | async | Non-blocking, fires post-write |
| **Total** | **<150ms** | Well within 200ms target |

#### Memory Budget

| Component | Budget | Notes |
|-----------|--------|-------|
| SimWorker — GameState | 150MB | ~3000 idols × ~50KB each (stats, history, wellness) |
| SimWorker — Code | 20MB | Simulation modules |
| RivalAIWorker — Snapshot | 30MB | 50 agency states + pools |
| RivalAIWorker — Code | 15MB | Shared modules (deduplicated via browser cache) |
| UI — Store projection | 80MB | Readonly copy of GameState in main thread |
| UI — DOM/Svelte | 50MB | Components, virtual nodes |
| UI — Assets (portraits) | 100MB | Lazy-loaded, LRU cache |
| **Total** | **~445MB** | Under 512MB ceiling |

#### Startup Budget

| Operation | Budget | Notes |
|-----------|--------|-------|
| App shell render | 200ms | SvelteKit SSR/hydration |
| SimWorker creation | 50ms | Instantiate + load modules |
| RivalAIWorker creation | 0ms | Lazy — created on first week tick |
| Load save from IndexedDB | 500ms | Deserialize + migrate if needed |
| World Pack load | 300ms | Idle idols, media entities, events |
| Transfer state to SimWorker | 15ms | structuredClone |
| Initial UI projection | 10ms | First render with game data |
| **Total (Continue)** | **~1.1s** | Under 1.5s target |
| **Total (New Game)** | **~1.5s** | Includes World Pack processing |

### Budget Enforcement

#### Profiling Points

Each system wraps its tick in a timing probe:

```typescript
function profiledTick(systemName: string, fn: () => void): void {
  const start = performance.now();
  fn();
  const elapsed = performance.now() - start;

  if (elapsed > BUDGETS[systemName]) {
    console.warn(`⚠️ ${systemName}: ${elapsed.toFixed(1)}ms (budget: ${BUDGETS[systemName]}ms)`);
  }

  // Accumulate for weekly profiling report
  tickProfile[systemName] = (tickProfile[systemName] ?? 0) + elapsed;
}
```

#### CI Performance Gate

Automated benchmark runs on every PR that touches `src/lib/simulation/`:
- Generate a test GameState with 3000 idols + 50 agencies
- Run 10 week ticks in Skip mode
- Assert: p95 < 300ms (1.5× target, allowing CI hardware variance)
- Assert: no single system exceeds 2× its budget

#### Dev-Mode HUD (optional)

In development, a performance overlay shows per-phase timing:
```
Skip: 167ms [P1: 22ms | P2: 65ms | P3: 42ms+AI:78ms | P4: 13ms]
Save: 89ms | Delta: 312KB | Dirty: 4 slices
```

### Scaling Strategy

When the game grows beyond current budgets:

| Threshold | Action |
|-----------|--------|
| Skip > 300ms | Profile hottest system. Optimize algorithm. |
| Skip > 400ms | Consider Worker Pool (ADR-002 Alternative 3) for Phase 2 |
| Skip > 500ms (hard limit) | Reduce rival AI agency count or simplify heuristics |
| Memory > 450MB | Implement idol history pruning (keep 3 months instead of 6) |
| Day tick > 12ms | Defer non-essential computations to end-of-week |

## Alternatives Considered

### Alternative 1: No explicit budgets (profile and optimize reactively)

- **Pros**: Less upfront planning. Fix problems when they appear.
- **Cons**: Performance regressions creep in unnoticed. No CI gate. No shared team expectations.
- **Rejection Reason**: With 48 systems and multiple contributors, implicit budgets lead to tragedy of the commons — each system "only takes 5ms" until the total is 500ms.

### Alternative 2: Strict per-system budget with hard enforcement (kill if exceeded)

- **Pros**: Guaranteed performance. Forces optimization.
- **Cons**: Killing a system mid-tick corrupts state. Over-engineering for a single-player game.
- **Rejection Reason**: Warn + log is sufficient. Hard kills risk data corruption. The CI gate catches regressions before merge.

## Consequences

### Positive
- Every system has a measurable target from day one
- CI catches performance regressions before merge
- Clear scaling strategy when budgets are exceeded
- Dev-mode HUD enables rapid profiling during implementation

### Negative
- Budgets are estimates — may need adjustment after real profiling
- CI benchmark adds ~30s to PR pipeline
- Some budgets are generous (headroom) — may encourage lazy optimization

### Risks
- **Risk**: Real hardware is slower than estimates
  - **Mitigation**: Budget allocates only 155ms of 500ms hard limit (69% headroom)
- **Risk**: Monthly processing (charts, rankings) spikes on week 4
  - **Mitigation**: Music charts and fame rankings have separate 5ms budgets only on week 4; Skip total may reach ~170ms on month-end weeks

## GDD Requirements Addressed

| GDD System | Requirement | How This ADR Addresses It |
|------------|-------------|--------------------------|
| week-simulation.md | Skip <500ms (target <200ms) | Total budget 155ms with 45ms headroom |
| week-simulation.md | Phase budgets 50/200/200/50ms | Refined to 25/70/45+80/15ms |
| week-simulation.md | Rival AI: 50 agencies in <100ms | Budgeted 80ms in parallel RivalAIWorker |
| time-calendar.md | Live mode 60fps | Day tick <10ms + delta <3ms + render <6ms = <16ms |
| time-calendar.md | Pause = zero CPU | No timers, no ticks during pause |
| save-load.md | Autosave <200ms | Budgeted 150ms (serialize + IndexedDB write) |
| save-load.md | Load <1.5s | Budgeted 1.1s (Continue) / 1.5s (New Game) |

## Performance Implications

This ADR IS the performance implications document. All budgets above are the
authoritative allocation. Systems must be implemented to fit within them.

## Migration Plan

1. **Phase A — Add profiling wrappers**: Wrap each system's tick function with `profiledTick`
2. **Phase B — CI benchmark**: Add GitHub Actions step that runs 10 week ticks and asserts budgets
3. **Phase C — Dev HUD**: Optional overlay component showing per-phase timing
4. **Phase D — Monthly review**: Review actual timings vs budgets after first 3 sprints; adjust allocations

## Validation Criteria

- Skip mode p95 < 200ms on target hardware
- Skip mode p99 < 300ms on target hardware
- No system exceeds 2× its budget at p95
- Live mode: 0 frame drops during day ticks at 60fps
- Autosave < 200ms at p95
- Memory < 450MB after 100 week ticks

## Related Decisions

- [ADR-002: Simulation Pipeline](adr-002-simulation-pipeline.md) — phase structure
- [ADR-003: Game State Schema](adr-003-game-state-schema.md) — delta transfer costs
- [ADR-004: Event System](adr-004-event-system.md) — event dispatch costs
- design/gdd/week-simulation.md — source performance requirements
- design/gdd/time-calendar.md — Live/Skip mode requirements
- design/gdd/save-load.md — persistence performance requirements
