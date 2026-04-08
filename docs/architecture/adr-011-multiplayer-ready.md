# ADR-011: Multiplayer-Ready Architecture

## Status
Proposed

## Date
2026-04-08

## ADR Dependencies

| Field | Value |
|-------|-------|
| **Depends On** | ADR-002 (Pipeline), ADR-003 (State), ADR-004 (Events) |
| **Enables** | Future multiplayer implementation |
| **Blocks** | Nothing — this ADR adds abstractions, not features |
| **Ordering Note** | Should be Accepted before implementation begins, to avoid baking single-player assumptions into the codebase |

## Context

### Problem Statement

The game is designed as offline-first single-player. However, a future mode allows
2+ players to play online in the **same simulated world**, each controlling a
different agency. If the current architecture bakes single-player assumptions
(simulation always local, state always in a Web Worker, decisions always instant),
multiplayer will require a costly rewrite.

This ADR defines **architectural abstractions** that make the codebase multiplayer-
ready without implementing multiplayer. The goal: when multiplayer ships, it's a
new transport layer — not a rewrite of the simulation.

### Multiplayer Vision

- 2-4 players in the same world, each controlling one agency
- Same 50 NPC agencies exist alongside player agencies
- Simulation tick waits for ALL player decisions before processing
- One player's actions can affect others (buyout their idol, compete for same job)
- Turn-based (weekly): all players submit decisions → server processes week → results broadcast

### Design Principle

**The SimOrchestrator is transport-agnostic.** It receives `ActionList[]` from
agencies and produces `StateProjection[]`. It does not know or care whether:
- It runs in a Web Worker (single-player)
- It runs on a Supabase Edge Function (multiplayer)
- It runs in a test harness (CI)

## Decision

### 1. Transport Abstraction Layer

Define an interface that wraps how decisions arrive and projections are delivered:

```typescript
// The SimOrchestrator implements this — same code in all modes
interface SimulationHost {
  // Receive all decisions for a week tick
  receiveDecisions(decisions: AgencyDecisionBatch[]): void;

  // Process the week and return results
  processWeek(): WeekResult;

  // Get state projection for a specific agency (each player sees their own view)
  getProjection(agencyId: string): StateProjection;
}

// Transport layer adapters — only ONE is active at a time
interface TransportAdapter {
  // How decisions get to the SimulationHost
  submitDecisions(agencyId: string, actions: AgencyAction[]): Promise<void>;

  // How projections get to the client
  onProjection(callback: (projection: StateProjection) => void): void;

  // Lifecycle
  connect(): Promise<void>;
  disconnect(): void;
}
```

### 2. Transport Implementations

```
SINGLE-PLAYER (current — Web Worker):
┌──────────┐     postMessage      ┌──────────────────┐
│  Client   │ ──────────────────► │  SimWorker        │
│  (UI)     │                     │  (Web Worker)     │
│           │ ◄────────────────── │  SimOrchestrator  │
└──────────┘     postMessage      └──────────────────┘
  LocalTransportAdapter            SimulationHost

MULTIPLAYER (future — Server):
┌──────────┐                      ┌──────────────────┐
│ Client A  │ ──── WebSocket ───► │  Server           │
└──────────┘                      │  (Edge Function)  │
┌──────────┐                      │  SimOrchestrator  │
│ Client B  │ ──── WebSocket ───► │  (same code!)     │
└──────────┘                      └──────────────────┘
  RemoteTransportAdapter           SimulationHost

TEST (CI):
┌──────────────────┐
│  Test Harness     │
│  DirectTransport  │
│  SimOrchestrator  │  ← no workers, no network, synchronous
└──────────────────┘
```

### 3. Decision Submission Protocol

In single-player, decisions are instant (player acts, worker processes).
In multiplayer, decisions must be **batched per week** and wait for all players.

The abstraction that covers both:

```typescript
interface AgencyDecisionBatch {
  agencyId: string;
  playerId: string | 'npc';     // 'npc' for AI-controlled agencies
  week: number;
  actions: AgencyAction[];
  submittedAt: number;           // timestamp
  status: 'pending' | 'submitted' | 'timeout';
}

// Single-player: only 1 player batch + 50 NPC batches
// Multiplayer: 2-4 player batches + 47-49 NPC batches
// The SimOrchestrator doesn't distinguish — it just needs all 51 batches
```

### 4. Week Tick Lifecycle (transport-agnostic)

```
1. DECISION COLLECTION
   Single-player: player submits instantly, NPCs compute in pipeline
   Multiplayer:   all players submit via WebSocket, server waits with timeout

2. VALIDATION
   Each player's ActionList validated against their agency state
   Invalid actions rejected (prevents cheating in multiplayer)

3. PROCESSING
   SimOrchestrator.processWeek() — identical code in all modes
   Cross-agency resolution: buyouts, job competition, resource contention

4. PROJECTION
   Each player receives only THEIR agency's projection + public info
   Single-player: full state (you see everything)
   Multiplayer:   filtered view (fog of war on rival player agencies)

5. PERSISTENCE
   Single-player: autosave to IndexedDB
   Multiplayer:   server saves to Supabase, clients cache locally
```

### 5. State Visibility (Fog of War)

In single-player, the player sees everything (all 50 rivals, full market).
In multiplayer, each player has **filtered visibility**:

```typescript
interface VisibilityFilter {
  // What this player can see
  ownAgency: 'full';                    // always full access
  npcAgencies: 'partial';               // public info only (tier, roster size, fame)
  otherPlayerAgencies: 'partial';       // same as NPC — no peek at their decisions
  market: 'full';                       // everyone sees same market
  idolStats: 'scouted_only';           // only see stats of idols you've scouted
  rankings: 'full';                     // public info
  news: 'filtered';                     // see news relevant to you + public news
}

// The projection builder applies this filter:
function buildProjection(
  fullState: GameState,
  agencyId: string,
  filter: VisibilityFilter
): StateProjection {
  // In single-player: filter = FULL_VISIBILITY (see everything)
  // In multiplayer: filter = MULTIPLAYER_FILTER (fog of war)
}
```

### 6. What This Means for Current ADRs

**ADR-002 (Pipeline)**: No changes needed. The Worker Pool architecture already
separates orchestration from execution. Just ensure:
- `SimOrchestrator` is a pure class, not tightly coupled to Web Worker APIs
- Decision gathering is a function call, not a postMessage handler
- State projection is a return value, not a postMessage

**ADR-003 (State)**: Add to state slices:
- `playerId` field on each agency (null for single-player NPC agencies)
- Projection builder accepts a visibility filter
- No structural changes to slices themselves

**ADR-004 (Events)**: Events remain internal to SimOrchestrator. In multiplayer,
urgent events for player agencies are forwarded to the correct client:
- `urgent:buyout` targeting Player B → server sends to Client B
- Events targeting NPC agencies → resolved automatically (same as single-player)

**ADR-006 (UI)**: Add future-proof hooks:
- `TransportAdapter` injected at app startup (LocalTransport for now)
- UI components bind to stores, not to the transport directly
- Future: lobby screen, "waiting for other player" state, spectate mode

### 7. Implementation Rules (for current single-player development)

These rules prevent single-player assumptions from creeping in:

1. **SimOrchestrator must be importable as a plain class** — no `self.onmessage`
   at the top level. The Web Worker wrapper calls into the class.

2. **Never assume `agencyId === playerAgencyId`** — always pass agencyId explicitly.
   Multiple agencies can be player-controlled.

3. **State projections always go through `buildProjection()`** — even in single-
   player (where filter = FULL_VISIBILITY). This ensures the filter path is tested.

4. **Decision validation runs on all agencies** — not just NPCs. In multiplayer,
   player decisions need the same validation (prevents impossible actions).

5. **Cross-agency resolution (ADR-002 Phase 5) must be deterministic** — all
   clients must agree on the result. No client-side randomness in resolution.

6. **Autosave is triggered by the host, not the client** — in single-player the
   "host" is the Web Worker. In multiplayer it's the server. The client never
   writes state directly.

### Key Interfaces

```typescript
// App initialization — transport is injected
function initializeGame(mode: 'single' | 'multi'): TransportAdapter {
  if (mode === 'single') {
    return new LocalWorkerTransport();  // Web Worker
  } else {
    return new RemoteServerTransport(serverUrl, authToken);  // WebSocket
  }
}

// UI components don't know which transport is active
// They just call:
transport.submitDecisions(agencyId, actions);
// And listen:
transport.onProjection((proj) => gameState.set(applyProjection(proj)));
```

## Alternatives Considered

### Alternative 1: Don't prepare — rewrite later

- **Pros**: Zero complexity now. Ship single-player faster.
- **Cons**: Multiplayer rewrite estimated at 2-3 months. Single-player code will
  have deep assumptions (postMessage everywhere, direct state access, single
  agencyId hardcoded).
- **Rejection Reason**: The abstraction cost is minimal (one interface, one filter
  function). The rewrite cost of not doing it is high.

### Alternative 2: Build multiplayer now

- **Pros**: Ship complete. No technical debt.
- **Cons**: 3-4× development time. Server infrastructure cost. Netcode complexity.
  Player base may not justify multiplayer at launch.
- **Rejection Reason**: Premature. Validate single-player first. Multiplayer is a
  post-launch feature if demand exists.

### Alternative 3: Peer-to-peer (no server)

- **Pros**: No server cost. Players host directly.
- **Cons**: No authoritative state (cheating trivial). Host advantage.
  NAT traversal complexity. State sync is hard without authority.
- **Rejection Reason**: Management sim with hidden information (rival agency
  decisions) requires server authority. P2P leaks information.

## Consequences

### Positive
- Multiplayer can be added as a new transport layer, not a rewrite
- Test harness uses DirectTransport — tests run without workers or network
- Clear separation of simulation logic from communication layer
- Fog of war architecture enables future competitive multiplayer

### Negative
- Small abstraction overhead in single-player (projection filter always runs)
- Developers must follow 6 implementation rules even though multiplayer doesn't exist yet
- `buildProjection()` adds ~1-2ms to state transfer (filter evaluation)

### Risks
- **Risk**: Abstraction leaks — developers bypass TransportAdapter in single-player
  - **Mitigation**: Code review checks. Lint rule: no direct `worker.postMessage` outside TransportAdapter.
- **Risk**: Multiplayer requirements change significantly from what we predicted
  - **Mitigation**: The abstraction is minimal. SimulationHost interface is stable regardless of multiplayer design. Transport adapters are cheap to write.

## GDD Requirements Addressed

This ADR addresses no current GDD requirement — it is architecture preparation
for a future feature. When multiplayer is designed as a GDD, this ADR will be
the architectural foundation.

## Performance Implications

- **Single-player**: +1-2ms per tick for projection filtering (negligible vs 130ms total)
- **Multiplayer (future)**: Server processes same tick as Web Worker. Network latency
  is the bottleneck (~50-200ms round-trip), not simulation time.

## Migration Plan

1. **Phase A — Extract SimOrchestrator class**: Refactor current simulation code into
   a class that implements `SimulationHost`. Web Worker becomes a thin wrapper.
2. **Phase B — Create LocalWorkerTransport**: Wrap current postMessage pattern in
   TransportAdapter interface.
3. **Phase C — Add buildProjection()**: Filter function that returns full visibility
   in single-player. No functional change.
4. **Phase D — Add agencyId to all state access**: Ensure no code assumes "the player"
   is a single hardcoded agency.
5. **Phase E (future)**: Implement RemoteServerTransport + Supabase Edge Function host.

## Validation Criteria

- SimOrchestrator can be instantiated in a test without Web Worker or network
- Same SimOrchestrator code runs in Web Worker and in a Node.js test
- buildProjection(FULL_VISIBILITY) produces identical output to raw state
- No `postMessage` calls outside of LocalWorkerTransport
- agencyId is never hardcoded — always passed as parameter

## Related Decisions

- [ADR-002](adr-002-simulation-pipeline.md) — Pipeline must be transport-agnostic
- [ADR-003](adr-003-game-state-schema.md) — State slices need playerId field
- [ADR-004](adr-004-event-system.md) — Events routed to correct client in multiplayer
- [ADR-006](adr-006-ui-architecture.md) — UI binds to stores via TransportAdapter
