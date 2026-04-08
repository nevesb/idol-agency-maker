# ADR-002: Simulation Pipeline & Threading

## Status
Accepted

## Date
2026-04-07

## Engine Compatibility

| Field | Value |
|-------|-------|
| **Engine** | SvelteKit 2.50 + Svelte 5 (Web Workers) |
| **Domain** | Simulation / Threading |
| **Knowledge Risk** | LOW — Web Workers are a stable web platform API |
| **References Consulted** | ADR-001, technical-preferences.md, week-simulation.md, staff-functional.md |
| **Post-Cutoff APIs Used** | None |
| **Verification Required** | Benchmark Worker Pool with 51 agencies on 4-core target hardware |

## ADR Dependencies

| Field | Value |
|-------|-------|
| **Depends On** | ADR-001 (Stack — mandates TypeScript + Web Workers) |
| **Enables** | ADR-003 (Game State Schema), ADR-005 (Performance Budgets), ADR-009 (Rival AI) |
| **Blocks** | All simulation-related epics |
| **Ordering Note** | Must be Accepted before any simulation code refactoring begins |

## Context

### Problem Statement

The game simulates 51 agencies (1 player + 50 rivals) each with a full staff
structure. Every agency function (coaching, PR, scouting, scheduling, contract
negotiation, music production, etc.) produces decisions each week — whether the
decision-maker is a human player or an NPC staff member.

**Key insight**: If the player has sufficient budget, they can delegate 100% of
their functions to NPC staff. In that mode, the player's agency runs identically
to a rival agency. Therefore **there is no "player pipeline" vs "AI pipeline"** —
there is ONE agency pipeline that processes all 51 agencies uniformly.

The only difference between player and rival is **who decides**: an NPC (via
attribute-based deterministic decision) or the player (via manual override that
pauses the pipeline).

### Constraints

- Web Workers communicate via `postMessage` (structured clone)
- SharedArrayBuffer requires COOP/COEP headers that break Supabase OAuth
- Simulation must be deterministic: same seed + same NPC attributes = same decisions
- All 51 agencies run the same pipeline — no simplified heuristics
- Player manual overrides interrupt the pipeline (pause until input received)
- Target: full week tick for 51 agencies in <500ms (Skip mode)

### Requirements

- Single unified `AgencyTick()` function for all 51 agencies
- NPC decisions are deterministic outputs based on NPC attributes + agency state
- Pipeline receives a list of NPC actions and executes them in order
- Player can override any function where no NPC is assigned (or override NPC)
- Live mode: 60fps during daily ticks
- Skip mode: <500ms for all 51 agencies

## Decision

### Unified Agency Pipeline with NPC Decision Layer

The simulation has two distinct phases per tick:

1. **Decision Phase**: Each agency's staff generates a list of actions
2. **Execution Phase**: The pipeline executes all actions in deterministic order

```
┌─────────────────────────────────────────────────────────┐
│  DECISION PHASE (per agency)                            │
│                                                         │
│  For each staff function in agency:                     │
│    if function.assignee == NPC:                         │
│      action = NPC.decide(npcAttributes, agencyState)    │
│    elif function.assignee == PLAYER:                    │
│      if pendingPlayerDecision exists:                   │
│        action = pendingPlayerDecision                   │
│      else:                                              │
│        action = PAUSE (wait for player input)           │
│    elif function.assignee == NONE (uncovered):          │
│      action = DEFAULT_ACTION (worst quality)            │
│                                                         │
│  Output: ActionList[] — ordered list of all decisions   │
│                                                         │
│  NOTE: For rival agencies AND fully-delegated player    │
│  agencies, this phase produces actions instantly with    │
│  zero pauses. Player agency pauses only on PLAYER       │
│  functions without pending decisions.                   │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  EXECUTION PHASE (universal — same for all 51)          │
│                                                         │
│  Phase 1: WEEK INIT                                     │
│    execute(actions.marketUpdates)                        │
│    execute(actions.scoutingResults)                      │
│    execute(actions.contractChecks)                       │
│    execute(actions.jobBoardRefresh)                      │
│                                                         │
│  Phase 2: DAILY PROCESSING (7 days)                     │
│    For each day:                                        │
│      execute(actions.jobAssignments[day])                │
│      execute(actions.trainingSlots[day])                 │
│      execute(actions.showPipeline[day])  // if ★ event  │
│      checkEventTriggers(agency)                         │
│                                                         │
│  Phase 3: END OF WEEK                                   │
│    execute(actions.statsTick)                            │
│    execute(actions.wellnessTick)                         │
│    execute(actions.fameTick)                             │
│    execute(actions.economySettlement)                    │
│    execute(actions.contractAdvancement)                  │
│    execute(actions.musicProduction)                      │
│    execute(actions.scoutingOrders)                       │
│    execute(actions.facilityInvestments)                  │
│    execute(actions.merchProduction)                      │
│                                                         │
│  Phase 4: REPORT                                        │
│    generateMoments(agency)                               │
│    generateNews(agency)                                  │
│    generateMessages(agency)  // only for player agency  │
└─────────────────────────────────────────────────────────┘
```

### 1. NPC Decision Engine

Each NPC staff member produces decisions based on their attributes. The decision
is deterministic: same NPC attributes + same agency state + same seed = same output.

```typescript
interface NPCDecision {
  functionKey: StaffFunction;
  actions: AgencyAction[];
  qualityMultiplier: number;  // derived from NPC skill
  confidence: number;         // how "optimal" the decision is
}

// NPC decision is a pure function — no side effects, no state mutation
function npcDecide(
  npc: StaffMember,
  functionKey: StaffFunction,
  agencyState: AgencySnapshot,
  seed: number
): NPCDecision {
  const rng = createRNG(seed ^ hashString(npc.id));

  switch (functionKey) {
    case 'scheduling':
      return decideSchedule(npc, agencyState, rng);
    case 'scouting':
      return decideScouting(npc, agencyState, rng);
    case 'contract_negotiation':
      return decideContracts(npc, agencyState, rng);
    case 'training':
      return decideTraining(npc, agencyState, rng);
    case 'music_production':
      return decideMusicProd(npc, agencyState, rng);
    case 'pr_management':
      return decidePR(npc, agencyState, rng);
    case 'show_planning':
      return decideShowPlanning(npc, agencyState, rng);
    case 'marketing':
      return decideMarketing(npc, agencyState, rng);
    case 'financial_management':
      return decideFinances(npc, agencyState, rng);
    case 'wellness_management':
      return decideWellness(npc, agencyState, rng);
    case 'facility_management':
      return decideFacilities(npc, agencyState, rng);
  }
}
```

**NPC skill affects decision quality:**

```typescript
function decideSchedule(npc: StaffMember, state: AgencySnapshot, rng: RNG): NPCDecision {
  const idols = state.roster;
  const jobs = state.availableJobs;

  // Higher skill = better matching algorithm
  // Low skill NPC: assigns randomly from top-10 idols to top-5 jobs
  // High skill NPC: optimizes stat-match across all idols × all jobs
  const searchDepth = Math.ceil(npc.skill / 10);  // 1-10
  const topIdols = rankIdolsByOverallScore(idols).slice(0, searchDepth * 5);
  const topJobs = rankJobsByValue(jobs).slice(0, searchDepth * 3);

  const assignments = greedyMatch(topIdols, topJobs, rng);

  return {
    functionKey: 'scheduling',
    actions: assignments.map(a => ({ type: 'assignJob', ...a })),
    qualityMultiplier: npc.skill / 100,
    confidence: searchDepth / 10,
  };
}
```

### 2. Player Override Mechanism

When a staff function is assigned to PLAYER (or unassigned and player wants
manual control), the pipeline pauses:

```typescript
interface PlayerOverrideRequest {
  agencyId: string;
  functionKey: StaffFunction;
  context: DecisionContext;    // what needs deciding + current state
  defaultAction?: AgencyAction[];  // NPC suggestion if staff exists
}

// In the simulation loop:
function gatherDecisions(agency: Agency, seed: number): ActionList {
  const actions: AgencyAction[] = [];

  for (const func of STAFF_FUNCTIONS) {
    const assignee = agency.staffAssignments[func];

    if (assignee?.type === 'npc') {
      const decision = npcDecide(assignee.npc, func, snapshot(agency), seed);
      actions.push(...decision.actions);

    } else if (assignee?.type === 'player') {
      const pending = getPendingPlayerDecision(agency.id, func);
      if (pending) {
        actions.push(...pending.actions);
      } else {
        // No player input = no action (skip this function for this week)
        // This is a valid choice — both NPCs and players can choose to do nothing.
        // In Live mode, the UI shows pending decisions the player can act on.
        // In Skip mode, missing input = no-op (the week advances without action).
        // No pause, no block — inaction has natural consequences
        // (empty agenda slots, missed opportunities, etc.)
      }

    } else {
      // Uncovered function — default action with penalty
      actions.push(...defaultAction(func, agency));
    }
  }

  // ActionList may have zero actions for some functions — that's valid.
  // Empty actions = the function was skipped this week (NPC chose inaction, or player didn't provide input).
  return { agencyId: agency.id, actions };
}
```

**In Skip mode**: If player has manual functions without pending input, those
functions produce zero actions (no-op). The week advances. Consequences of inaction
are natural: empty agenda slots mean idols rest (wellness recovers but no revenue),
unsigned contracts expire, unassigned jobs go to rivals. The player learns to
either delegate to NPCs or provide input before skipping.

**In Live mode**: Player sees pending decisions in the UI as they arise during
the week. They can act on them or ignore them. Ignored decisions = no action
taken for that function. No forced pauses — the player is always in control
of when to intervene.

**Urgent events** (scandals, burnout, buyout proposals) are the ONLY thing that
forces a pause — regardless of mode. These are not staff function decisions;
they are crises that require acknowledgment.

### 3. Worker Pool Architecture

Since all 51 agencies run the same pipeline, use a **Worker Pool** to distribute
agency processing across CPU cores:

```
┌─────────────────────────────────────────────────────────┐
│  MAIN THREAD (UI)                                       │
│  - Receives projections from Orchestrator Worker         │
│  - Sends player decisions                               │
└──────────────┬──────────────────────────────────────────┘
               │
      ┌────────▼────────┐
      │  ORCHESTRATOR    │  ← Coordinates phases, merges results
      │  WORKER          │  ← Owns authoritative GameState
      │                  │  ← Distributes agencies to pool
      └───┬────┬────┬───┘
          │    │    │
    ┌─────▼┐ ┌▼────▼┐ ┌▼─────┐
    │ Pool │ │ Pool │ │ Pool │   ← N workers (N = navigator.hardwareConcurrency - 1)
    │ W-1  │ │ W-2  │ │ W-3  │   ← Each processes a batch of agencies
    └──────┘ └──────┘ └──────┘   ← Stateless — receive snapshot, return actions+results
```

**Distribution strategy:**

```typescript
// Orchestrator distributes agencies across pool
function distributeAgencies(agencies: Agency[], poolSize: number): AgencyBatch[] {
  // Player agency always in batch 0 (processed first for pause handling)
  const batches: AgencyBatch[] = Array.from({ length: poolSize }, () => []);
  batches[0].push(agencies.find(a => a.isPlayer)!);

  // Distribute rivals round-robin by tier (heavier agencies spread evenly)
  const rivals = agencies.filter(a => !a.isPlayer).sort((a, b) => b.tier - a.tier);
  for (let i = 0; i < rivals.length; i++) {
    batches[i % poolSize].push(rivals[i]);
  }

  return batches;
}
```

**Pool Worker is stateless:**

```typescript
// pool-worker.ts — receives batch, returns results
self.onmessage = (e: MessageEvent<PoolTask>) => {
  const { agencies, globalState, phase, seed } = e.data;
  const results: AgencyTickResult[] = [];

  for (const agency of agencies) {
    // Decision phase — NPCs decide, player input applied if present, else no-op
    const decisions = gatherDecisions(agency, seed ^ agency.id);

    // Execution phase — same for all 51 agencies, no pauses
    const result = executeAgencyTick(agency, decisions, globalState, phase);
    results.push(result);
  }

  self.postMessage({ type: 'batchComplete', results });
};
```

### 4. Tick Execution Order

```
WEEK TICK:
  1. Orchestrator gathers global state snapshot
  2. Orchestrator distributes 51 agencies across pool workers
  3. Each pool worker:
     a. Decision Phase: NPCs generate actions for their agencies
     b. If player agency needs manual input → PAUSE
     c. Execution Phase: process all 4 phases for the batch
  4. Orchestrator merges all results
  5. Orchestrator resolves cross-agency interactions:
     - Buyout proposals (agency A → agency B's idol)
     - Job competition (multiple agencies assigned same job)
     - Scout/composer pool contention (first-come by tier)
  6. Orchestrator sends projection to UI
  7. Autosave
```

### 5. Cross-Agency Resolution

After all agencies tick independently, the Orchestrator resolves conflicts:

```typescript
interface CrossAgencyResolution {
  // Job competition: highest-performing idol wins
  resolveJobCompetition(results: AgencyTickResult[]): JobWinner[];

  // Buyout proposals: check if target agency accepts
  resolveBuyouts(proposals: BuyoutProposal[]): BuyoutResult[];

  // Resource contention: scouts and composers assigned by tier priority
  resolveResourceContention(bookings: ResourceBooking[]): ResourceAssignment[];

  // Market: all agencies see the same market state (snapshot from before tick)
  // No resolution needed — market updates applied post-tick
}
```

### 6. Determinism Guarantee

- Each agency receives: `agencySeed = weekSeed XOR agencyId`
- Each NPC receives: `npcSeed = agencySeed XOR hashString(npcId)`
- Pool workers process agencies in deterministic order (sorted by agencyId)
- Cross-agency resolution uses deterministic tie-breaking (agencyId)
- Same state + same seed = same ActionLists = same results, regardless of pool size

### 7. Performance Model

With unified pipeline (no heuristic shortcuts):

| Component | Per Agency | × 51 | Parallelized (4 workers) |
|-----------|-----------|------|--------------------------|
| Decision Phase | ~2ms | 102ms | ~26ms |
| Phase 1 (init) | ~0.5ms | 25ms | ~7ms |
| Phase 2 (7 days) | ~3ms | 153ms | ~39ms |
| Phase 3 (end-of-week) | ~2ms | 102ms | ~26ms |
| Phase 4 (report) | ~0.5ms | 25ms | ~7ms |
| **Total per agency** | **~8ms** | **407ms** | **~105ms** |
| Cross-agency resolution | — | — | ~15ms |
| State projection → UI | — | — | ~10ms |
| **Grand total** | | | **~130ms** |

With 4 pool workers on a 4-core machine, 51 agencies at ~8ms each = ~105ms
parallelized + 25ms overhead = **~130ms** (within 200ms target, well within 500ms limit).

### Key Interfaces

```typescript
// Staff function — one of 11 agency roles
type StaffFunction =
  | 'scheduling'
  | 'scouting'
  | 'contract_negotiation'
  | 'training'
  | 'music_production'
  | 'pr_management'
  | 'show_planning'
  | 'marketing'
  | 'financial_management'
  | 'wellness_management'
  | 'facility_management';

// Assignment: who handles this function?
type FunctionAssignment =
  | { type: 'npc'; npc: StaffMember }
  | { type: 'player' }
  | { type: 'none' };  // uncovered — default with penalty

// Universal action type — produced by NPC or player, executed by pipeline
type AgencyAction =
  | { type: 'assignJob'; idolId: string; jobId: string; day: number }
  | { type: 'assignTraining'; idolId: string; stat: string; day: number }
  | { type: 'assignRest'; idolId: string; day: number }
  | { type: 'proposeBuyout'; targetIdolId: string; offerYen: number }
  | { type: 'signContract'; idolId: string; clauses: ContractClauses }
  | { type: 'renewContract'; contractId: string; newClauses: ContractClauses }
  | { type: 'terminateContract'; contractId: string }
  | { type: 'hireScount'; scoutId: string }
  | { type: 'sendScoutMission'; scoutId: string; regionId: string }
  | { type: 'commissionMusic'; composerId: string; config: MusicConfig }
  | { type: 'planShow'; showConfig: ShowConfig }
  | { type: 'upgradeFacility'; facilityType: string }
  | { type: 'setMarketingBudget'; amount: number }
  | { type: 'produceMerch'; productConfig: MerchConfig }
  | { type: 'adjustStrategy'; changes: Partial<AgencyStrategy> }
  | { type: 'handleEvent'; eventId: string; response: EventResponse };

// Result of one agency's full weekly tick
interface AgencyTickResult {
  agencyId: string;
  actions: AgencyAction[];           // what was decided
  phaseResults: PhaseResult[];       // what happened
  events: SimEvent[];                // events emitted
  crossAgencyProposals: BuyoutProposal[];  // for resolution
  resourceBookings: ResourceBooking[];     // scouts, composers
}

// Main thread ↔ Orchestrator protocol
type OrchestratorCommand =
  | { type: 'startWeek'; seed: number }
  | { type: 'playerDecision'; functionKey: StaffFunction; actions: AgencyAction[] }
  | { type: 'pause' }
  | { type: 'resume' }
  | { type: 'skip' }
  | { type: 'setSpeed'; multiplier: 0.5 | 1 | 2 | 4 };

type OrchestratorEvent =
  | { type: 'playerOverrideRequest'; request: PlayerOverrideRequest }
  | { type: 'phaseComplete'; phase: number; snapshot: PhaseSnapshot }
  | { type: 'dayComplete'; day: number; results: DayResult[] }
  | { type: 'weekComplete'; report: WeekReport; state: GameState }
  | { type: 'urgentEvent'; event: UrgentEvent }
  | { type: 'saveReady'; envelope: SaveEnvelope };
```

### Architecture Diagram

```
SKIP MODE — UNIFIED PIPELINE:

  Orchestrator: snapshot global state
       │
       ├──► Pool W-1: [PlayerAgency, Rival-13, Rival-26, Rival-39]
       ├──► Pool W-2: [Rival-1, Rival-14, Rival-27, Rival-40, ...]
       ├──► Pool W-3: [Rival-2, Rival-15, Rival-28, Rival-41, ...]
       └──► Pool W-4: [Rival-3, Rival-16, Rival-29, Rival-42, ...]
                │           │           │           │
                ▼           ▼           ▼           ▼
           AgencyTick   AgencyTick  AgencyTick  AgencyTick
           (same code)  (same code) (same code) (same code)
                │           │           │           │
                └───────────┴───────────┴───────────┘
                                │
                    Orchestrator: merge results
                                │
                    Cross-agency resolution
                    (jobs, buyouts, resources)
                                │
                    State projection → UI
                    Autosave

  Target: ~130ms on 4-core machine

LIVE MODE:

  Same pipeline but day-by-day:
  ┌─ Day 1 ─┬─ Day 2 ─┬─ ... ─┬─ Day 7 ─┬─ End Week ─┐
  │ 51 tick  │ 51 tick  │       │ 51 tick  │ Phase 3+4  │
  │ ~15ms    │ ~15ms    │       │ ~15ms    │ ~40ms      │
  └──────────┴──────────┴───────┴──────────┴────────────┘

  Player manual functions → PAUSE when decision needed
  Player sees NPC suggestions as "default" they can override
```

## Alternatives Considered

### Alternative 1: Separate player pipeline + simplified rival heuristics (original ADR-002)

- **Description**: SimWorker runs full pipeline for player. RivalAIWorker runs simplified heuristics for 50 rivals.
- **Pros**: Simpler. Rivals are fast (80ms total). Less code in workers.
- **Cons**: Two codebases to maintain. Rivals make unrealistic decisions. Player can't delegate to NPCs using the same logic rivals use. If player automates everything, behavior differs from rivals doing the same thing.
- **Rejection Reason**: Breaks the core design principle — if the player can delegate 100% to NPCs, the NPC logic IS the rival AI logic. Maintaining two systems means they diverge over time and the simulation is unfair.

### Alternative 2: Single worker, sequential processing of all 51 agencies

- **Description**: One worker processes all agencies one by one.
- **Pros**: Simplest architecture. No inter-worker communication.
- **Cons**: 51 × 8ms = 408ms sequential. No parallelism. Leaves multi-core CPUs idle.
- **Rejection Reason**: Exceeds 200ms target. Wastes available CPU cores. Worker Pool adds moderate complexity for 3-4× speedup.

### Alternative 3: SharedArrayBuffer for shared state across pool

- **Description**: Pool workers share GameState via SharedArrayBuffer.
- **Pros**: Zero copy overhead. True parallel reads.
- **Cons**: Requires COOP/COEP headers (breaks Supabase OAuth). Complex Atomics-based synchronization. Race condition risk.
- **Rejection Reason**: COOP/COEP conflicts with Supabase Auth. Snapshot + merge is simpler and sufficient for 51 agencies.

## Consequences

### Positive
- One codebase for all agency processing — player and rivals are truly equal
- NPC delegation works identically for player and rivals
- Player can observe how NPCs make decisions and learn to optimize staff hiring
- Emergent gameplay: a "bad" NPC scout makes worse hires than a "good" one — for rivals too
- Worker Pool utilizes all CPU cores proportionally
- Deterministic regardless of pool size

### Negative
- Full pipeline per agency is heavier than heuristics (~8ms vs ~2ms)
- Worker Pool adds complexity (orchestrator, distribution, merging)
- Cross-agency resolution phase adds a synchronization point
- NPC decision functions must be well-calibrated per skill level

### Risks
- **Risk**: 8ms per agency is optimistic; complex agencies take longer
  - **Mitigation**: Budget is 500ms hard limit with 130ms estimate (73% headroom). Profile early.
- **Risk**: NPC decisions are too dumb or too smart
  - **Mitigation**: NPC search depth scales with skill attribute (1-10). Tunable. Playtest extensively.
- **Risk**: Player with all NPCs assigned sees no pause prompts and feels disengaged
  - **Mitigation**: Weekly report highlights NPC decisions with "override" buttons. Player can always take back control.

## GDD Requirements Addressed

| GDD System | Requirement | How This ADR Addresses It |
|------------|-------------|--------------------------|
| week-simulation.md | 4-phase pipeline | Universal AgencyTick with 4 phases for all 51 agencies |
| week-simulation.md | 50 agencies × 3000 idols in <500ms | Worker Pool parallelizes: ~130ms on 4 cores |
| week-simulation.md | Rival AI processes decisions | Same NPC decision engine used by rivals (100% NPC) |
| time-calendar.md | Live mode 60fps | Day ticks offloaded to workers; UI never blocks |
| time-calendar.md | Skip <200ms target | ~130ms with Worker Pool on 4 cores |
| time-calendar.md | Pause = zero CPU | Workers idle on pause |
| time-calendar.md | Priority events interrupt | Urgent events bubble up from pool → orchestrator → UI |
| staff-functional.md | PRODUCER_TIME_BUDGET 100 points/week | Part of decision phase — NPC allocates budget |
| staff-functional.md | Staff functions with executor state | FunctionAssignment determines NPC/player/none |
| staff-functional.md | NPC multi-role penalty | Same penalty applied to player's NPCs and rivals' NPCs |
| rival-agency-ai.md | 50 agencies with persistent state | RivalAgency processed by same AgencyTick |
| rival-agency-ai.md | Shared scout and composer pools | Cross-agency resolution handles contention |
| rival-agency-ai.md | Memory of player interactions | RivalMemory updated in AgencyTick post-resolution |
| save-load.md | Autosave <200ms | Post-tick delta save from orchestrator |

## Performance Implications

- **CPU**: N+1 workers (1 orchestrator + N pool). Pool uses all available cores. Idle during pause.
- **Memory**: ~20MB per pool worker (stateless — receives snapshot, discards after tick). Orchestrator holds full state (~150MB).
- **Load Time**: Pool workers created lazily on first week tick (+100ms one-time cost).
- **Network**: Zero — all computation local.

## Migration Plan

1. **Phase A — Define AgencyAction type**: Universal action union in `src/lib/simulation/actions.ts`
2. **Phase B — Extract NPC decision functions**: One `decide*()` per staff function in `src/lib/simulation/npc/`
3. **Phase C — Create AgencyTick**: Unified `agencyTick(agency, actions, globalState, phase)` function
4. **Phase D — Create Orchestrator Worker**: Distributes agencies, merges results, resolves cross-agency
5. **Phase E — Create Pool Workers**: Stateless workers that receive batches and return results
6. **Phase F — Wire Player Override**: Pause mechanism for manual functions
7. **Phase G — Benchmark**: Profile 51 agencies on 4-core target. Verify <200ms.

## Validation Criteria

- Skip mode: 51 agencies complete in <200ms on 4-core machine (p95)
- Skip mode: hard limit 500ms never exceeded (p99)
- Live mode: 60fps with zero frame drops during day ticks
- Same seed produces identical results with 1 pool worker and 4 pool workers
- Player agency with 100% NPC staff produces same decisions as equivalent rival
- Player override pauses correctly and resumes without losing state
- NPC skill 10 produces measurably better decisions than skill 50 (playtest verifiable)

## Related Decisions

- [ADR-001: Stack Tecnológica](adr-001-stack-tecnologica.md) — mandates TypeScript + Web Workers
- [ADR-009: Rival AI](adr-009-rival-ai.md) — **superseded by this ADR** (rivals use same pipeline)
- design/gdd/week-simulation.md — pipeline phases
- design/gdd/time-calendar.md — Live/Pause/Skip modes
- design/gdd/staff-functional.md — 11 staff functions, NPC delegation
- design/gdd/rival-agency-ai.md — rival agency requirements
