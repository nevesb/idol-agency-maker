# ADR-004: Event System & Cross-System Integration

## Status
Accepted

## Date
2026-04-07

## Engine Compatibility

| Field | Value |
|-------|-------|
| **Engine** | SvelteKit 2.50 + Svelte 5 |
| **Domain** | Cross-system Communication / Event Architecture |
| **Knowledge Risk** | LOW — TypeScript typed events, no platform-specific APIs |
| **References Consulted** | ADR-001, ADR-002, ADR-003 |
| **Post-Cutoff APIs Used** | None |
| **Verification Required** | None |

## ADR Dependencies

| Field | Value |
|-------|-------|
| **Depends On** | ADR-002 (Pipeline phases define when events fire), ADR-003 (State slices define what events carry) |
| **Enables** | ADR-007 (Show Pipeline), ADR-009 (Rival AI) |
| **Blocks** | Any epic involving cross-system triggers (events, wellness cascades, contract reactions) |
| **Ordering Note** | Must be Accepted before implementing any system that reacts to another system's output |

## Context

### Problem Statement

The game has 48 systems that constantly read each other's state and react to
each other's outputs. Examples:
- Burnout (wellness) must pause the simulation (time system) and cancel agenda slots (schedule)
- A scandal (event generator) must update fame, wellness, fan clubs, and news simultaneously
- A contract expiry (contract system) must trigger market availability, rival AI evaluation, and player notification
- A job result (week sim) must update stats, economy, fame, fan clubs, and generate news

Without a formal integration architecture, systems either:
1. Directly call each other (tight coupling, untestable, circular dependencies)
2. All read/write the monolithic state (no clear data flow, race conditions)

This ADR defines how systems communicate: the event types, the dispatch mechanism,
and the ordering guarantees within the simulation pipeline.

### Constraints

- All events fire within the SimWorker — no cross-thread event dispatch
- Events must be deterministic: same state + same seed = same events in same order
- Phase ordering (ADR-002) constrains when events can fire and be processed
- Some events require immediate response (urgent events → pause), others are batched

### Requirements

- Type-safe event definitions (discriminated union, not string-based)
- Events carry enough data for consumers to act without reading global state
- Urgent events interrupt Live/Skip mode within the current day tick
- All events are logged for the Moment Engine (Phase 4 headline selection)
- Fan-out: one event can trigger reactions in multiple systems
- No circular event chains within a single tick (prevents infinite loops)

## Decision

### Typed Event Bus with Phase-Scoped Dispatch

Use a **synchronous, typed event bus** within SimWorker. Events are dispatched
during simulation phases and consumed immediately by registered handlers.
No async, no queuing — deterministic execution order guaranteed by handler
registration order.

### 1. Event Type Hierarchy

```typescript
// All events are a discriminated union
type SimEvent =
  // === Wellness Events ===
  | { type: 'idol:burnout'; idolId: string; stressLevel: number }
  | { type: 'idol:crisis'; idolId: string; happinessLevel: number; weeksUnhappy: number }
  | { type: 'idol:injury'; idolId: string; injuryType: string; severity: number }
  | { type: 'idol:recovered'; idolId: string; from: 'burnout' | 'injury' }

  // === Contract Events ===
  | { type: 'contract:expiring'; contractId: string; idolId: string; weeksRemaining: number }
  | { type: 'contract:expired'; contractId: string; idolId: string }
  | { type: 'contract:signed'; contractId: string; idolId: string; agencyId: string }
  | { type: 'contract:terminated'; contractId: string; idolId: string; reason: string }
  | { type: 'contract:renewalDemand'; contractId: string; idolId: string }

  // === Job Events ===
  | { type: 'job:completed'; jobId: string; idolId: string; performance: number;
      grade: string; revenue: number; fameDelta: number; factors: string[] }
  | { type: 'job:failed'; jobId: string; idolId: string; reason: string }
  | { type: 'job:blocked'; idolId: string; day: number; reason: 'exclusivity' | 'burnout' | 'injury' }

  // === Scandal/Event Events ===
  | { type: 'scandal:triggered'; scandalType: string; idolId: string;
      severity: 'light' | 'medium' | 'grave'; triggers: string[];
      fameDelta: number; wellnessDelta: Partial<WellnessState> }
  | { type: 'event:positive'; eventType: string; idolId: string;
      fameDelta: number; wellnessDelta: Partial<WellnessState> }
  | { type: 'group:conflict'; groupId: string; involvedIds: string[];
      conflictType: string; chemistryDelta: number }

  // === Fame Events ===
  | { type: 'fame:tierChange'; idolId: string; oldTier: string; newTier: string }
  | { type: 'fame:monthlyUpdate'; rankings: { idolId: string; position: number; delta: number }[] }

  // === Market Events ===
  | { type: 'market:buyoutProposal'; fromAgencyId: string; idolId: string; offerYen: number }
  | { type: 'market:idolAvailable'; idolId: string; reason: 'expired' | 'terminated' | 'entry' }
  | { type: 'market:idolAbandoned'; idolId: string }

  // === Economy Events ===
  | { type: 'economy:monthlyReport'; report: MonthlyReport }
  | { type: 'economy:debtStateChange'; oldState: string; newState: string }
  | { type: 'economy:facilityUpgraded'; facilityType: string; newLevel: number }

  // === Music Events ===
  | { type: 'music:released'; songId: string; title: string; artistIds: string[] }
  | { type: 'music:chartEntry'; songId: string; position: number }
  | { type: 'music:stageStalled'; projectId: string; stage: string; reason: string }

  // === Show Events ===
  | { type: 'show:completed'; showId: string; grade: string; audienceSize: number;
      revenue: number; idolPerformances: { idolId: string; score: number }[] }
  | { type: 'show:cancelled'; showId: string; reason: string }

  // === Rival Events ===
  | { type: 'rival:action'; agencyId: string; action: string; targetId?: string }

  // === Urgent Events (force Pause) ===
  | { type: 'urgent:scandal'; inner: SimEvent & { type: `scandal:${string}` } }
  | { type: 'urgent:burnout'; inner: SimEvent & { type: 'idol:burnout' } }
  | { type: 'urgent:buyout'; inner: SimEvent & { type: 'market:buyoutProposal' } }
  | { type: 'urgent:crisis'; inner: SimEvent & { type: 'idol:crisis' } };
```

### 2. Event Bus Implementation

```typescript
type EventHandler<T extends SimEvent = SimEvent> = (event: T) => void;

class SimEventBus {
  // Handlers registered per event type, in deterministic order
  private handlers = new Map<string, EventHandler[]>();

  // Event log for Moment Engine (Phase 4)
  private weekLog: SimEvent[] = [];

  // Urgent event queue (checked after each day tick)
  private urgentQueue: SimEvent[] = [];

  // Circuit breaker: max events per tick prevents infinite loops
  private tickEventCount = 0;
  private readonly MAX_EVENTS_PER_TICK = 500;

  on<T extends SimEvent['type']>(
    type: T,
    handler: EventHandler<Extract<SimEvent, { type: T }>>
  ): void {
    const list = this.handlers.get(type) ?? [];
    list.push(handler as EventHandler);
    this.handlers.set(type, list);
  }

  emit(event: SimEvent): void {
    if (++this.tickEventCount > this.MAX_EVENTS_PER_TICK) {
      throw new Error(`Event loop exceeded ${this.MAX_EVENTS_PER_TICK} events per tick`);
    }

    // Log for Moment Engine
    this.weekLog.push(event);

    // Check if urgent
    if (event.type.startsWith('urgent:')) {
      this.urgentQueue.push(event);
    }

    // Dispatch to handlers synchronously, in registration order
    const handlers = this.handlers.get(event.type) ?? [];
    for (const handler of handlers) {
      handler(event);
    }
  }

  // Called after each day in Live/Skip mode
  hasUrgentEvents(): boolean {
    return this.urgentQueue.length > 0;
  }

  drainUrgentEvents(): SimEvent[] {
    const events = [...this.urgentQueue];
    this.urgentQueue = [];
    return events;
  }

  // Called at start of each week tick
  resetWeek(): void {
    this.weekLog = [];
    this.urgentQueue = [];
    this.tickEventCount = 0;
  }

  // Called by Moment Engine in Phase 4
  getWeekLog(): readonly SimEvent[] {
    return this.weekLog;
  }
}
```

### 3. Handler Registration Order (Determinism)

Systems register handlers at SimWorker initialization in a **fixed order**
matching the pipeline's dependency chain:

```typescript
// SimWorker init — registration order matters for determinism
function registerAllHandlers(bus: SimEventBus, state: GameState) {
  // 1. State ownership updates (owners first)
  registerWellnessHandlers(bus, state);    // reacts to jobs, scandals
  registerStatsHandlers(bus, state);       // reacts to jobs, training
  registerEconomyHandlers(bus, state);     // reacts to jobs, contracts
  registerContractHandlers(bus, state);    // reacts to wellness, time
  registerFameHandlers(bus, state);        // reacts to jobs, scandals

  // 2. Derived/reactive systems (consumers second)
  registerScheduleHandlers(bus, state);    // reacts to burnout, injury
  registerFanClubHandlers(bus, state);     // reacts to jobs, scandals, fame
  registerMarketHandlers(bus, state);      // reacts to contracts, fame
  registerEventGeneratorHandlers(bus, state); // reacts to wellness thresholds

  // 3. Presentation systems (last — consume, never produce game state changes)
  registerNewsHandlers(bus, state);        // reacts to everything → news items
  registerMessageHandlers(bus, state);     // reacts to everything → inbox messages
  registerMomentEngineHandlers(bus, state); // reads week log → headlines
}
```

### 4. Event Flow Examples

**Scandal triggers cascade:**
```
Day tick → EventGenerator checks triggers
  → emit('scandal:triggered', { severity: 'medium', ... })
    → WellnessHandler: update stress/happiness
    → FameHandler: update fame points
    → FanClubHandler: update mood/loyalty
    → NewsHandler: generate news item
    → MessageHandler: send inbox notification
    → emit('urgent:scandal', { inner: scandalEvent })
      → SimWorker checks urgentQueue → pauses simulation
```

**Job completion cascade:**
```
Day tick → process job → compute performance
  → emit('job:completed', { performance, grade, revenue, ... })
    → EconomyHandler: add revenue to ledger
    → StatsHandler: apply XP growth
    → FameHandler: update fame delta
    → FanClubHandler: update mood based on grade
    → NewsHandler: generate result news
    → MomentEngine: log for headline selection
```

### 5. No Circular Chains Rule

Within a single emit() call stack, handlers may emit new events (cascading).
The circuit breaker (MAX_EVENTS_PER_TICK = 500) prevents infinite loops.

Design rule: **Presentation handlers (news, messages, moment engine) must NEVER
emit events.** They are terminal consumers. Only state-owning systems may emit.

### 6. Phase-Scoped Event Timing

| Phase | Who Emits | Who Consumes |
|-------|-----------|-------------|
| Phase 1 | Market, Contract, Scouting | Messages, News |
| Phase 2 | Job processor, Event generator | Wellness, Stats, Economy, Fame, FanClub, Schedule, News, Messages |
| Phase 3 | Stats tick, Wellness tick, Fame tick, Economy, Rival AI | News, Messages, Market |
| Phase 4 | Moment Engine | (no consumers — terminal) |

Events from Phase 2 cannot affect Phase 1 outputs (already committed).
Events from Phase 3 cannot retroactively change Phase 2 results.
This matches the pipeline ordering guarantee from ADR-002.

### Key Interfaces

```typescript
// Each system implements this interface
interface SimSystem {
  readonly name: string;
  readonly ownedSlice: keyof GameState;
  register(bus: SimEventBus): void;  // register handlers
  tick?(phase: number): void;         // optional per-phase logic
}

// System registration is centralized
const SYSTEMS: SimSystem[] = [
  wellnessSystem, statsSystem, economySystem,
  contractSystem, fameSystem, scheduleSystem,
  fanClubSystem, marketSystem, eventGenerator,
  newsSystem, messageSystem, momentEngine
];
```

## Alternatives Considered

### Alternative 1: Direct function calls between systems

- **Description**: Systems import and call each other directly (e.g., `wellnessSystem.applyStress(idol, 20)`).
- **Pros**: Simple, explicit, easy to trace in debugger.
- **Cons**: Tight coupling. Circular imports. Can't add new consumers without modifying the producer. Hard to test systems in isolation.
- **Rejection Reason**: With 48 systems, direct calls create a dependency graph that becomes unmaintainable. Adding a new system (e.g., dialogue) that reacts to scandals requires modifying the scandal generator.

### Alternative 2: Global state mutation (current approach)

- **Description**: Systems read and write the GameState directly during their tick. No explicit events.
- **Pros**: Simple mental model. Already partially implemented.
- **Cons**: No clear data flow. Hard to know "why" a value changed. Can't add reactive behaviors without polling. No event log for Moment Engine.
- **Rejection Reason**: The Moment Engine (GDD requirement) needs an event log to select headlines. Without events, Phase 4 has to diff the entire state before/after to detect what happened — expensive and lossy.

### Alternative 3: Async message queue (pub/sub)

- **Description**: Events enqueued and processed asynchronously with priority ordering.
- **Pros**: Decoupled timing. Natural priority handling for urgent events.
- **Cons**: Non-deterministic ordering (depends on queue drain timing). Harder to reason about cascades. Adds latency. Overkill for synchronous single-threaded worker execution.
- **Rejection Reason**: SimWorker is single-threaded JavaScript. Async adds complexity with zero benefit — synchronous dispatch is deterministic and fast.

## Consequences

### Positive
- Type-safe events prevent typos and missing fields at compile time
- Adding a new consumer = registering a handler (no modification to producers)
- Moment Engine gets a complete event log for free
- Clear data flow: follow the event type to understand all side effects
- Testable: mock the bus, emit events, assert handler behavior

### Negative
- Handler registration order is a hidden dependency (must be documented)
- Cascading events can be hard to trace without tooling
- MAX_EVENTS_PER_TICK circuit breaker adds a failure mode (crash on pathological state)

### Risks
- **Risk**: Event cascade causes performance spike in a single day tick
  - **Mitigation**: Profile worst-case scandal + burnout cascade. Budget: <5ms per cascade.
- **Risk**: New developer registers handler in wrong order, breaking determinism
  - **Mitigation**: Registration order is centralized in one function. Code comment documents the order invariant. CI test verifies registration order.

## GDD Requirements Addressed

| GDD System | Requirement | How This ADR Addresses It |
|------------|-------------|--------------------------|
| event-scandal-generator.md | Deterministic triggers evaluated per idol per day | EventGenerator checks triggers in day tick, emits typed scandal events |
| event-scandal-generator.md | Reads 8+ source systems requiring unified interface | Handlers registered on bus; EventGenerator reads state slices, emits events consumed by all |
| happiness-wellness.md | Burnout triggers urgent pause event | `idol:burnout` → wrapped as `urgent:burnout` → SimWorker pauses |
| happiness-wellness.md | Happiness <20 for 4 weeks fires rescission demand | WellnessHandler emits `contract:renewalDemand` after counter reaches 4 |
| week-simulation.md | Moment Engine selects top 5 headlines | MomentEngine reads `bus.getWeekLog()` in Phase 4, ranks by dramaticity |
| time-calendar.md | Priority event queue interrupts Skip/Live | Urgent events in `urgentQueue`, checked after each day tick |
| contract-system.md | Expiry check fires renewal warning 4 weeks before | ContractHandler emits `contract:expiring` during Phase 1 check |
| news-feed.md | News generated from events, not hardcoded | NewsHandler subscribes to all event types, generates templated news items |
| message-types-catalog.md | 11 system sources enqueue messages during tick | MessageHandler subscribes to relevant events, creates inbox messages |
| rival-agency-ai.md | AI→Player buyouts via urgent-event queue | RivalAI results include buyout proposals → `urgent:buyout` events |

## Performance Implications

- **CPU**: Event dispatch is synchronous function calls — ~0.01ms per event.
  Worst case (50 events/day × 7 days × 3000 idols): unlikely to exceed 2ms.
- **Memory**: Week log stores ~200-500 events per week (~50KB). Cleared weekly.
- **Load Time**: Zero — event bus is instantiated in worker init.
- **Network**: Zero — all events are in-worker.

## Migration Plan

1. **Phase A — Create event types**: `src/lib/simulation/events.ts` with the SimEvent union type
2. **Phase B — Create SimEventBus**: `src/lib/simulation/event-bus.ts`
3. **Phase C — Register handlers**: Add `register()` to each existing system file
4. **Phase D — Emit events**: Replace direct state mutations with emit calls where cross-system communication occurs
5. **Phase E — Moment Engine**: Phase 4 reads weekLog for headline selection (replacing current approach)
6. **Phase F — Remove direct cross-system calls**: Audit and eliminate remaining tight coupling

## Validation Criteria

- Same seed produces identical weekLog (event-by-event comparison)
- Scandal cascade completes in <5ms
- Circuit breaker never triggers during normal gameplay (500 events/tick is generous)
- All 48 systems communicate only via event bus (no direct imports between systems)
- Moment Engine produces meaningful headlines from weekLog

## Related Decisions

- [ADR-002: Simulation Pipeline](adr-002-simulation-pipeline.md) — phase ordering constrains event timing
- [ADR-003: Game State Schema](adr-003-game-state-schema.md) — state slices define event payloads
- design/gdd/event-scandal-generator.md — deterministic trigger system
- design/gdd/happiness-wellness.md — wellness cascades
- design/gdd/week-simulation.md — Moment Engine
- design/gdd/news-feed.md — event-driven news generation
