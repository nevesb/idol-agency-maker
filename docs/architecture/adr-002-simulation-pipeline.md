# ADR-002: Simulation Pipeline & Threading

## Status
Proposed

## Date
2026-04-07

## Engine Compatibility

| Field | Value |
|-------|-------|
| **Engine** | SvelteKit 2.50 + Svelte 5 (Web Workers) |
| **Domain** | Simulation / Threading |
| **Knowledge Risk** | LOW — Web Workers are a stable web platform API |
| **References Consulted** | ADR-001, technical-preferences.md |
| **Post-Cutoff APIs Used** | None — Web Workers, structuredClone, MessagePort are all stable |
| **Verification Required** | Benchmark dual-worker overhead vs single-worker on target hardware |

## ADR Dependencies

| Field | Value |
|-------|-------|
| **Depends On** | ADR-001 (Stack — mandates TypeScript + Web Workers) |
| **Enables** | ADR-003 (Game State Schema), ADR-005 (Performance Budgets) |
| **Blocks** | All simulation-related epics (week pipeline, rival AI, stats tick) |
| **Ordering Note** | Must be Accepted before any simulation code refactoring begins |

## Context

### Problem Statement

The week simulation pipeline processes 48 interconnected game systems in a strict
4-phase sequence. It must handle ~3,000 idols across 50 agencies within 500ms
(Skip mode) while maintaining 60fps UI responsiveness (Live mode). The current
codebase runs simulation in a single Web Worker. This ADR formalizes the threading
architecture and defines how to distribute work across multiple workers to meet
performance budgets.

### Constraints

- Web Workers communicate via `postMessage` (structured clone) — no shared memory
  without SharedArrayBuffer
- SharedArrayBuffer requires `Cross-Origin-Isolation` headers (COOP/COEP) which
  may break Supabase Auth and third-party CDN integrations
- Simulation must be deterministic: same seed → same result regardless of thread count
- Phase ordering is critical: Phase 1 → 2 → 3 → 4 must be sequential
- Within Phase 2, idol jobs are independent and parallelizable
- Rival AI (Phase 3, step 3.6) is independent per agency and parallelizable

### Requirements

- Skip mode: full week in <500ms (target <200ms) for 50 agencies × 3,000 idols
- Live mode: daily tick completes within 16ms frame budget (offloaded to worker)
- Rival AI: 50 agencies in <100ms total
- UI never blocks during simulation
- Deterministic results regardless of parallelization strategy

## Decision

### Dual-Worker Architecture with Task Offloading

Use **two persistent Web Workers** plus an optional **Worker Pool** for
CPU-intensive parallel phases:

```
┌─────────────────────────────────────────────────────┐
│  MAIN THREAD (UI)                                   │
│  - Svelte 5 components + stores                     │
│  - Receives simulation results via MessagePort      │
│  - Sends commands: startWeek, pause, resume, skip   │
│  - Never runs simulation logic                      │
│  └──────────┬───────────────┬──────────────────┘    │
└─────────────┼───────────────┼──────────────────────┘
              │               │
     ┌────────▼────────┐  ┌──▼───────────────────┐
     │  SIM WORKER      │  │  RIVAL-AI WORKER      │
     │  (primary)       │  │  (secondary)           │
     │                  │  │                        │
     │  Phase 1: Init   │  │  Receives:             │
     │  Phase 2: Daily  │  │  - 50 agency states    │
     │  Phase 3: End*   │  │  - Market state        │
     │  Phase 4: Report │  │  - Scout/composer pool  │
     │                  │  │                        │
     │  *Phase 3.6      │  │  Returns:              │
     │   offloaded ─────┼──│  - 50 agency decisions  │
     │   to RIVAL-AI    │  │  - Buyout proposals     │
     │                  │  │  - Contract changes     │
     └─────────────────┘  └────────────────────────┘
```

### Threading Model

**1. SimWorker (Primary)** — Owns the game state and orchestrates the pipeline:
- Executes Phase 1 (week init), Phase 2 (daily processing), Phase 3 (end-of-week
  except rival AI), and Phase 4 (report generation)
- Holds the authoritative `GameState` object in its scope
- Sends snapshots to UI via `postMessage` after each phase completes
- Deterministic execution order guaranteed by single-threaded JS within the worker

**2. RivalAIWorker (Secondary)** — Dedicated to rival agency processing:
- Receives a readonly snapshot of relevant state (50 agency objects, market pool,
  scout pool, composer pool) from SimWorker at Phase 3 step 3.6
- Processes all 50 agencies in parallel using cooperative scheduling (`setTimeout(0)`
  batches of 10 agencies to avoid long-task blocking)
- Returns an array of `RivalDecision[]` to SimWorker
- Communication via `MessageChannel` (direct worker-to-worker, bypasses main thread)

**3. Worker-to-Worker Communication**

SimWorker and RivalAIWorker communicate directly via `MessageChannel`:

```typescript
// Setup (main thread creates the channel, transfers ports)
const channel = new MessageChannel();
simWorker.postMessage({ type: 'init', rivalPort: channel.port1 }, [channel.port1]);
rivalWorker.postMessage({ type: 'init', simPort: channel.port2 }, [channel.port2]);

// SimWorker → RivalAIWorker (Phase 3.6)
rivalPort.postMessage({
  type: 'processWeek',
  agencies: structuredClone(rivalAgencies),
  market: structuredClone(marketSnapshot),
  scoutPool: structuredClone(scoutPool),
  composerPool: structuredClone(composerPool),
  week: currentWeek,
  seed: weekSeed
});

// RivalAIWorker → SimWorker (results)
simPort.postMessage({
  type: 'rivalResults',
  decisions: RivalDecision[],  // contracts, assignments, purchases
  buyoutProposals: BuyoutProposal[],  // for player urgent-event queue
  elapsedMs: number
});
```

**4. Main Thread ↔ SimWorker Protocol**

```typescript
// Commands (UI → SimWorker)
type SimCommand =
  | { type: 'startWeek'; agenda: WeekAgenda; seed: number }
  | { type: 'pause' }
  | { type: 'resume' }
  | { type: 'skip' }
  | { type: 'setSpeed'; multiplier: 0.5 | 1 | 2 | 4 }
  | { type: 'loadState'; state: GameState }
  | { type: 'saveRequest' }

// Events (SimWorker → UI)
type SimEvent =
  | { type: 'phaseComplete'; phase: 1 | 2 | 3 | 4; snapshot: PhaseSnapshot }
  | { type: 'dayComplete'; day: number; results: DayResult[] }
  | { type: 'weekComplete'; report: WeekReport; state: GameState }
  | { type: 'urgentEvent'; event: UrgentEvent }  // forces Pause
  | { type: 'saveReady'; envelope: SaveEnvelope }
  | { type: 'error'; error: SimError }
```

**5. Live Mode Execution**

In Live mode, SimWorker processes one day at a time with a timer:

```typescript
// Inside SimWorker
let dayTimer: number;
const dayInterval = BASE_DAY_MS / speedMultiplier;

function processNextDay() {
  const results = processDayTick(currentDay);
  postMessage({ type: 'dayComplete', day: currentDay, results });

  if (hasUrgentEvent(results)) {
    postMessage({ type: 'urgentEvent', event: extractUrgent(results) });
    // Pause — wait for resume command
    return;
  }

  currentDay++;
  if (currentDay > 7) {
    processEndOfWeek();  // Phase 3 + 4
  } else {
    dayTimer = setTimeout(processNextDay, dayInterval);
  }
}
```

**6. Skip Mode Execution**

In Skip mode, all 7 days + end-of-week process synchronously in a single burst:

```typescript
function processSkipWeek() {
  processPhase1();
  for (let day = 1; day <= 7; day++) {
    const results = processDayTick(day);
    if (hasUrgentEvent(results)) {
      postMessage({ type: 'urgentEvent', event: extractUrgent(results) });
      return;  // Pause, wait for resume, then continue from this day
    }
  }
  processEndOfWeek();  // Phase 3 + 4
}
```

**7. Determinism Guarantee**

- All random numbers derived from `weekSeed = masterSeed XOR absoluteWeek`
- SimWorker uses seeded PRNG (xoshiro256**) — same seed = same sequence
- RivalAIWorker receives its own deterministic sub-seed per agency:
  `agencySeed = weekSeed XOR agencyId`
- Phase ordering is fixed; within-phase parallelism produces same results
  because each idol/agency processes independently with its own sub-seed
- No `Math.random()` anywhere in simulation code

### Key Interfaces

```typescript
// Worker creation (main thread, on app init)
interface SimulationOrchestrator {
  simWorker: Worker;
  rivalWorker: Worker;
  channel: MessageChannel;

  startWeek(agenda: WeekAgenda): void;
  pause(): void;
  resume(): void;
  skip(): void;
  setSpeed(mult: number): void;

  onPhaseComplete: (phase: number, snapshot: PhaseSnapshot) => void;
  onDayComplete: (day: number, results: DayResult[]) => void;
  onWeekComplete: (report: WeekReport, state: GameState) => void;
  onUrgentEvent: (event: UrgentEvent) => void;
}

// Rival AI contract
interface RivalDecision {
  agencyId: number;
  contracts: ContractAction[];    // sign, renew, terminate
  assignments: JobAssignment[];   // idol → job mappings
  purchases: Purchase[];          // facilities, marketing
  musicOrders: MusicOrder[];      // composer commissions
}
```

### Architecture Diagram

```
SKIP MODE TIMELINE:
  ┌──────────────────────────────────────────────────────────┐
  │ SimWorker                                                │
  │ Phase1 ──► Phase2(7 days) ──► Phase3.1-3.5 ──┐          │
  │                                               │          │
  │                                    [offload]  ▼          │
  │                              ┌─────────────────────┐     │
  │                              │ RivalAIWorker        │     │
  │                              │ 50 agencies × 2ms    │     │
  │                              │ (batches of 10)      │     │
  │                              └──────────┬──────────┘     │
  │                                         │                │
  │ Phase3.7-3.8 ◄── merge rival results ◄──┘                │
  │ Phase4 (report) ──► postMessage(weekComplete) ──► UI     │
  └──────────────────────────────────────────────────────────┘
  Target: <200ms total

LIVE MODE TIMELINE:
  ┌─ Day 1 ─┬─ Day 2 ─┬─ ... ─┬─ Day 7 ─┬─ End of Week ─┐
  │ process  │ process  │       │ process  │ Phase 3+4     │
  │ ~16ms    │ ~16ms    │       │ ~16ms    │ + Rival AI    │
  └──────────┴──────────┴───────┴──────────┴───────────────┘
  Timer interval: BASE_DAY_MS / speedMultiplier
```

## Alternatives Considered

### Alternative 1: Single Web Worker (current implicit approach)

- **Description**: All simulation in one worker, including rival AI. Sequential processing.
- **Pros**: Simplest implementation. No inter-worker communication overhead. Already partially implemented.
- **Cons**: Rival AI (100ms) blocks Phase 3 progress. Total Skip time may exceed 500ms with growing complexity. Cannot leverage multi-core CPUs.
- **Rejection Reason**: Meets current budgets but leaves no headroom. As systems grow in complexity (shows, music production, audience), the single-thread ceiling will become a bottleneck.

### Alternative 2: SharedArrayBuffer for Zero-Copy State

- **Description**: Share game state between workers using SharedArrayBuffer + Atomics for lock-free reads.
- **Pros**: Eliminates structuredClone overhead (~5-15ms per full state transfer). True parallel access to game state.
- **Cons**: Requires `Cross-Origin-Isolation` headers (COOP/COEP) which **break Supabase Auth OAuth redirects** and may break CDN image loading. Complex concurrency model with potential for subtle bugs. Not supported in all deployment contexts (some CDNs, iframes).
- **Rejection Reason**: The COOP/COEP requirement conflicts with Supabase Auth (OAuth popup/redirect flow) and CDN integration. The engineering complexity of lock-free concurrent access to a 48-system game state is disproportionate to the performance gain for our workload.

### Alternative 3: Worker Pool (N workers for Phase 2 parallelism)

- **Description**: Spawn N workers (matching CPU cores), distribute idol-day processing across them.
- **Pros**: Maximum parallelism for Phase 2 (idol jobs are independent). Could reduce Phase 2 from 200ms to ~50ms on 4-core machines.
- **Cons**: High message overhead (structuredClone per idol batch × N workers). Complex coordination. Diminishing returns — Phase 2 is already the fastest phase. Overkill for current idol count.
- **Rejection Reason**: Phase 2 parallelism is a premature optimization. The dual-worker approach handles the actual bottleneck (rival AI offloading) with minimal complexity. Worker pool can be added later if profiling shows Phase 2 as a bottleneck.

## Consequences

### Positive
- Rival AI processing no longer blocks the main simulation pipeline
- UI remains responsive during all simulation modes (60fps guaranteed)
- Clear separation of concerns: SimWorker owns game state, RivalAIWorker is stateless
- Worker-to-worker MessageChannel avoids main thread involvement in hot path
- Deterministic results preserved via seeded PRNG per worker

### Negative
- Two workers = ~2× memory overhead for simulation code (both load the same TS modules)
- structuredClone of rival state adds ~5-10ms overhead per week tick
- Slightly more complex deployment and debugging (two worker entry points)
- Worker creation adds ~50-100ms to initial app startup

### Risks
- **Risk**: structuredClone overhead exceeds budget for large state transfers
  - **Mitigation**: Transfer only the minimal snapshot needed by RivalAIWorker (agency states + pools), not full GameState. Profile and optimize transferred data size.
- **Risk**: MessageChannel reliability across browsers
  - **Mitigation**: MessageChannel is well-supported (Chrome 2+, Firefox 41+, Safari 10.1+). Fallback: route through main thread if MessageChannel fails.
- **Risk**: Rival AI produces non-deterministic results due to async timing
  - **Mitigation**: RivalAIWorker processes agencies in deterministic order (sorted by agencyId) with per-agency sub-seeds. No timing-dependent logic.

## GDD Requirements Addressed

| GDD System | Requirement | How This ADR Addresses It |
|------------|-------------|--------------------------|
| week-simulation.md | 4-phase pipeline with budgets 50/200/200/50ms | SimWorker executes phases sequentially; rival AI offloaded to meet Phase 3 budget |
| week-simulation.md | 50 agencies × 3000 idols in Skip <500ms | Dual-worker: SimWorker handles player sim, RivalAIWorker handles 50 agencies in parallel batches |
| week-simulation.md | Rival AI: 50 agencies in <100ms | Dedicated RivalAIWorker with cooperative scheduling (batches of 10) |
| time-calendar.md | Live mode maintains 60fps | All simulation offloaded to workers; UI thread never runs sim logic |
| time-calendar.md | Skip processes full week in <200ms | Synchronous burst in SimWorker + parallel rival AI |
| time-calendar.md | Pause consumes zero CPU | Workers idle on pause; no timers running |
| time-calendar.md | Priority event queue interrupts Skip/Live | SimWorker checks for urgent events after each day; sends urgentEvent message |
| rival-agency-ai.md | 50 agencies in single sub-phase within 100ms | Dedicated RivalAIWorker processes all agencies with 2ms budget each |
| rival-agency-ai.md | Shared scout and composer pools | Pools passed as readonly snapshot to RivalAIWorker |
| save-load.md | Atomic autosave <200ms | SimWorker serializes state post-Phase 4; sends saveReady to main thread |

## Performance Implications

- **CPU**: Two workers utilize 2 CPU cores during simulation. Idle during Pause.
  - SimWorker: ~150ms burst (Skip) or ~16ms/day (Live)
  - RivalAIWorker: ~80-100ms burst during Phase 3.6
- **Memory**: ~30-50MB additional for second worker (shared code modules + rival state snapshot)
- **Load Time**: +50-100ms startup for worker instantiation. Mitigated by lazy init (create RivalAIWorker on first week tick, not on app load).
- **Network**: Zero impact — workers are local computation only

## Migration Plan

1. **Phase A — Extract SimulationOrchestrator interface**: Create `src/lib/workers/orchestrator.ts` that wraps current single-worker setup behind the new interface
2. **Phase B — Create RivalAIWorker**: Extract rival AI processing from `week-pipeline.ts` into `src/lib/workers/rival-ai.worker.ts`
3. **Phase C — Add MessageChannel**: Wire SimWorker → RivalAIWorker communication for Phase 3.6 offloading
4. **Phase D — Benchmark**: Profile Skip mode with dual workers vs single worker. Verify <200ms target.
5. **Phase E — Live mode timer**: Implement day-by-day timer with speed multiplier in SimWorker

## Validation Criteria

- Skip mode completes in <200ms (profiled on target PC hardware)
- Live mode maintains 60fps (no frame drops during daily ticks)
- Rival AI completes 50 agencies in <100ms (profiled)
- Same seed produces identical results with single-worker and dual-worker configurations
- Urgent events pause simulation within 1 frame of detection
- Memory overhead stays under 50MB for second worker

## Related Decisions

- [ADR-001: Stack Tecnológica](adr-001-stack-tecnologica.md) — mandates TypeScript + Web Workers
- design/gdd/week-simulation.md — primary GDD driving this decision
- design/gdd/time-calendar.md — Live/Pause/Skip mode requirements
- design/gdd/rival-agency-ai.md — rival AI performance requirements
