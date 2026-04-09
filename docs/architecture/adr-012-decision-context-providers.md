# ADR-012: Decision Context Providers

## Status
Accepted

## Date
2026-04-08

## ADR Dependencies

| Field | Value |
|-------|-------|
| **Depends On** | ADR-003 (state slices — the data source), ADR-009 (decision catalog — the data consumer) |
| **Enables** | Implementation of the NPC decision engine |
| **Blocks** | Any NPC decision implementation (code needs to know WHERE to read data from) |
| **Ordering Note** | Must be Accepted after ADR-003 and ADR-009 |

## Context

### Problem Statement

ADR-009 defines 52 decisions, each with a CONTEXT section listing what the NPC
evaluates. ADR-003 defines 18 state slices where all game data lives. But there
is no specification connecting the two:

- **Which slices does each decision read?**
- **How are snapshots assembled?** (full slice? filtered subset? derived view?)
- **What visibility rules apply?** (NPC can only see data their role should see)
- **What is the performance cost?** (assembling 52 contexts per agency per tick)

Without this ADR, each decision implementation would independently query game state,
leading to inconsistent data access patterns, redundant snapshot creation, and
potential data leaks (NPC reading data they shouldn't have access to).

### Design Principles

1. **Decisions are pure functions.** They receive a context object and return actions.
   They NEVER directly read game state. The context provider is the only bridge.

2. **Context is assembled ONCE per agency per tick.** Not per decision. One snapshot
   serves all decisions for that agency — avoids redundant structuredClone.

3. **Visibility is role-scoped.** A Vocal Coach's context doesn't include financial
   data. An Operations Director's context doesn't include idol hidden attributes.
   NPCs only see what their role would realistically know.

4. **Context is read-only.** Decisions cannot mutate the context. They return actions
   that the pipeline executes against the real state.

## Decision

### 1. Context Assembly: One Per Agency Per Tick

At the start of the Decision Phase (ADR-002), a single `AgencyContext` is assembled
for each of the 51 agencies. This is the ONLY time state slices are read:

```typescript
interface AgencyContext {
  // Identity
  agencyId: string;
  agencyTier: AgencyEconomyTier;
  week: number;
  seed: number;

  // Staff
  staff: StaffSnapshot[];             // all NPCs with their 19 attrs + assignments
  producerProfile: ProducerProfile;   // head producer traits
  producerTimeBudget: { total: number; consumed: number };

  // Strategy
  strategy: AgencyStrategy;

  // ---- DOMAIN SNAPSHOTS ----
  // Each domain snapshot is a FILTERED VIEW of the full state slice.
  // Only data relevant to this agency is included.

  roster: RosterView;
  economy: EconomyView;
  contracts: ContractView;
  schedule: ScheduleView;
  market: MarketView;
  scouting: ScoutingView;
  music: MusicView;
  shows: ShowView;
  fame: FameView;
  fanClubs: FanClubView;
  events: EventView;
  rivals: RivalView;
  facilities: FacilityView;
  news: NewsView;
  messages: MessageView;
}
```

### 2. Domain Views (filtered snapshots)

Each view is a **filtered, derived subset** of the full state slice. They contain
only what this agency can see:

```typescript
// ROSTER VIEW — idols this agency has contracted + visible market idols
interface RosterView {
  contracted: IdolSnapshot[];    // full stats for own idols
  // Each IdolSnapshot includes:
  //   - id, name, age, tier, archetype
  //   - visible stats (16)
  //   - hidden stats: ONLY if revealed through scouting/dialogue
  //   - wellness bars (4)
  //   - fatigue (from last show)
  //   - contract summary (salary, expiry, clauses)
  //   - devPlan (if active)
  //   - mastery table (per song)
  //   - performance history (last 12 weeks of job results)
  //   - afinidade with producer

  totalActive: number;
  rosterAssessment: RosterAssessment | null;  // cached from last monthly run
}

// ECONOMY VIEW — this agency's financial state
interface EconomyView {
  balanceYen: number;
  monthlyRevenue: { source: string; amount: number }[];     // last 3 months
  monthlyExpenses: { category: string; amount: number }[];   // last 3 months
  debtState: 'healthy' | 'difficulty' | 'crisis' | 'gameOver';
  staffBudget: { allocated: number; used: number; available: number };
  projections: { week: number; projectedBalance: number }[]; // next 12 weeks
}

// CONTRACT VIEW — this agency's contracts
interface ContractView {
  active: ContractSnapshot[];     // all active contracts with idol + clauses + expiry
  expiringSoon: ContractSnapshot[];  // contracts expiring within 4 weeks
  pendingNegotiations: NegotiationSnapshot[];  // active negotiations
  pendingBuyouts: BuyoutProposal[];  // incoming buyout proposals
}

// SCHEDULE VIEW — this agency's idols' schedules
interface ScheduleView {
  currentWeek: WeekSchedule[];   // per idol: 7 days × 2 slots
  nextWeeks: WeekSchedule[][];   // next 4 weeks preview (mutable until tick)
  pendingDecisions: string[];    // cargo functions awaiting player/NPC input
}

// MARKET VIEW — publicly available + scouted idols
interface MarketView {
  publicPool: MarketIdolSnapshot[];   // ~20% of total pool, basic info only
  scoutedPool: ScoutedIdolSnapshot[]; // idols scouted by this agency (more detail)
  recentTransfers: TransferRecord[];  // last 4 weeks of transfers (public knowledge)
  talentBoardResponses: TalentBoardResponse[];
}

// SCOUTING VIEW — this agency's scouting operations
interface ScoutingView {
  scouts: ScoutSnapshot[];           // hired scouts with skill, status, region
  activeMissions: MissionSnapshot[]; // ongoing missions
  completedReports: ScoutReport[];   // reports ready to read
  shortlist: ShortlistEntry[];       // candidates marked for follow-up
}

// MUSIC VIEW — this agency's music projects + charts
interface MusicView {
  activeProjects: MusicProjectSnapshot[];  // pipeline state per project
  catalogue: SongSnapshot[];               // finished songs with quality, play count
  chartPositions: ChartEntry[];            // this agency's songs on charts
  composerRelations: ComposerRelation[];   // used composers, availability, loyalty
  chartTrends: { genre: string; trending: 'up' | 'stable' | 'down' }[];
}

// SHOW VIEW — this agency's show state
interface ShowView {
  plannedShows: PlannedShow[];     // upcoming shows with venue, date, lineup
  showHistory: ShowResult[];       // last 12 shows with grade, revenue
  venueAvailability: Venue[];      // venues bookable
}

// FAME VIEW — public rankings
interface FameView {
  rankings: {
    individual: { idolId: string; position: number; fame: number; delta: number }[];
    groups: { groupId: string; position: number; fame: number; delta: number }[];
    agencies: { agencyId: string; position: number; fame: number }[];
  };
  agencyRankPosition: number;
}

// FAN CLUB VIEW — this agency's idol fan clubs
interface FanClubView {
  clubs: FanClubSnapshot[];        // per idol: size, mood, loyalty, toxicity, segments
  pendingDemands: FanDemand[];     // unaddressed fan requests
  recentEvents: FanEvent[];        // fan meetings, signings done recently
}

// EVENT VIEW — recent and active events
interface EventView {
  activeScandals: ScandalSnapshot[];     // unresolved scandals
  recentEvents: GameEventSnapshot[];     // last 4 weeks
  upcomingCalendarEvents: CalendarEvent[];  // seasonal, festivals, deadlines
}

// RIVAL VIEW — what this agency can see about rivals
interface RivalView {
  agencies: RivalSnapshot[];  // public info: name, tier, roster size, fame
  // NOTE: NO access to rival staff details, finances, or strategies
  // That info requires Intelligence Analyst to estimate
  recentActivity: RivalActivity[];  // public: hirings, releases, show announcements
  relationships: RivalRelationship[];  // this agency's history with each rival
}

// FACILITY VIEW — this agency's facilities
interface FacilityView {
  facilities: { type: string; level: number; cost: number; effect: string }[];
  upgradeCosts: { type: string; nextLevel: number; cost: number }[];
  maxByTier: number;  // how many facility slots the agency tier allows
}

// NEWS VIEW — recent news items
interface NewsView {
  recent: NewsItemSnapshot[];  // last 3 months
  unread: number;
}

// MESSAGE VIEW — inbox
interface MessageView {
  unread: MessageSnapshot[];
  pendingActions: PendingAction[];  // messages requiring response
}
```

### 3. Role-Scoped Context Filtering

Not every decision sees the full AgencyContext. Each **papel** (role) gets a
filtered view — their **RoleContext**:

```typescript
// Each role declares which domains it needs
const ROLE_CONTEXT_ACCESS: Record<Papel, (keyof AgencyContext)[]> = {
  head_producer:         ['staff', 'strategy', 'roster', 'economy', 'contracts',
                          'schedule', 'market', 'scouting', 'music', 'shows',
                          'fame', 'fanClubs', 'events', 'rivals', 'facilities',
                          'news', 'messages', 'producerProfile', 'producerTimeBudget'],
  // ^ Head Producer sees EVERYTHING (they're the boss)

  vice_producer:         ['staff', 'strategy', 'roster', 'economy', 'contracts',
                          'schedule', 'fame', 'events', 'facilities', 'messages'],
  // ^ Vice sees operational state but not detailed scouting or music pipeline

  talent_director:       ['roster', 'contracts', 'market', 'economy', 'fame',
                          'rivals', 'schedule'],

  chief_scout:           ['roster', 'scouting', 'market', 'economy', 'rivals'],

  development_director:  ['roster', 'schedule', 'fame', 'shows'],

  vocal_coach:           ['roster', 'schedule', 'shows', 'music'],
  dance_coach:           ['roster', 'schedule', 'shows', 'music'],
  acting_coach:          ['roster', 'schedule', 'shows'],

  music_director:        ['music', 'roster', 'economy', 'fame', 'fanClubs',
                          'schedule', 'rivals'],

  show_director:         ['shows', 'roster', 'music', 'schedule', 'economy',
                          'fame', 'fanClubs', 'facilities'],

  communications_director: ['fanClubs', 'events', 'roster', 'fame', 'news',
                            'rivals', 'economy'],

  operations_director:   ['economy', 'facilities', 'roster', 'fame', 'fanClubs',
                          'schedule', 'rivals', 'market'],

  wellness_director:     ['roster', 'schedule', 'events', 'facilities'],

  intelligence_analyst:  ['roster', 'economy', 'fame', 'rivals', 'shows',
                          'music', 'events', 'fanClubs'],
};
```

**Building a RoleContext:**

```typescript
function buildRoleContext(
  agencyCtx: AgencyContext,
  papel: Papel,
  npc: StaffMember
): RoleContext {
  const allowedDomains = ROLE_CONTEXT_ACCESS[papel];
  const filtered: Partial<AgencyContext> = {};

  for (const domain of allowedDomains) {
    filtered[domain] = agencyCtx[domain];
  }

  return {
    ...filtered,
    npc,
    effectiveAttrs: computeEffectiveAttrs(npc, papel),
    agencyId: agencyCtx.agencyId,
    week: agencyCtx.week,
    seed: agencyCtx.seed,
  } as RoleContext;
}
```

### 4. Hidden Attribute Visibility

Idol hidden stats (Temperamento, Ambição, Lealdade, Profissionalismo, Vida Pessoal, Consistência)
follow special visibility rules:

```typescript
interface IdolSnapshot {
  // Always visible
  id: string;
  name: string;
  age: number;
  tier: IdolTier;
  visibleStats: IdolVisibleStats;  // 16 stats, always readable
  wellness: WellnessState;         // 4 bars, always visible for contracted idols

  // Conditionally visible — hidden stats
  hiddenStats: {
    temperament?: number;       // revealed after 4+ weeks contracted OR dialogue
    ambition?: number;          // revealed after 8+ weeks contracted OR dialogue
    loyalty?: number;           // revealed after 12+ weeks contracted
    professionalism?: number;   // revealed after dialogue OR scandal
    personalLife?: number;      // revealed after scandal OR long contract
    consistency?: number;       // revealed after 12+ job results observed
  };
  // undefined = not yet revealed to this agency
  // number = revealed, NPC can use in decision flowcharts

  // For market/scouted idols: ALL hidden stats are undefined
  // For contracted idols: progressive reveal based on time + events
}
```

When ADR-009 flowcharts say "read Temperamento of idol", the context may have
`undefined` — the NPC handles this gracefully:
- If hidden stat is available → use in decision (better decisions)
- If undefined → fallback behavior (safe default, described in each flowchart)

### 5. Performance: Context Assembly Cost

Context assembly happens ONCE per agency per tick:

```
51 agencies × 1 context assembly each = 51 assemblies

Per assembly:
  - Read state slices: ~0.1ms (direct reference, no copy)
  - Build filtered views: ~0.2ms (create view objects with references)
  - Hidden stat visibility check: ~0.05ms (per idol)
  - Total per agency: ~0.5ms

  51 × 0.5ms = ~25ms total for all agencies

This happens BEFORE the Worker Pool distributes agencies.
The Orchestrator (ADR-002) builds all contexts, then sends each
agency's context to the pool worker that processes it.
```

### 6. Context Freshness

Context is a **snapshot at the start of the tick**. It does NOT update during
the tick. This means:

- Agency A's decisions are based on state BEFORE Agency B's decisions execute
- Two agencies cannot react to each other's decisions in the same tick
- This is intentional: prevents infinite loops and ensures determinism
- Cross-agency interactions are resolved in the Resolution Phase (ADR-002)

### 7. Decision Function Signature

Every decision function in ADR-009 receives a `TaskContext` that is a subset
of the `RoleContext`:

```typescript
// TaskContext = what a specific TASK within a cargo sees
interface TaskContext {
  // From RoleContext
  npc: StaffMember;
  effectiveAttr: number;        // primary attr for this task, after penalties
  searchDepth: number;          // derived from effectiveAttr

  // Domain views (only those this role has access to)
  // TypeScript enforces: you can't read economy if your role doesn't have access
  [domain: string]: DomainView;

  // Temporal
  seed: number;
  week: number;
  rng: SeededRNG;
}

// Example: Vocal Coach running "Conduct Training Session"
// TaskContext includes: roster, schedule, shows, music
// TaskContext does NOT include: economy, market, rivals, scouting
// If coach code tries to read ctx.economy → undefined (not in role scope)
```

### 8. Context Provider Registry

Maps each decision (from ADR-009) to its exact data needs:

```typescript
interface ContextRequirement {
  decision: string;              // e.g., "6.1.1 Conduct Vocal Training"
  papel: Papel;
  primaryAttr: StaffAttribute;
  secondaryAttrs: StaffAttribute[];
  domains: (keyof AgencyContext)[];
  // Specific data within each domain that this decision reads:
  dataNeeds: {
    roster?: 'contracted_only' | 'contracted_and_scouted' | 'all';
    economy?: 'balance_only' | 'full_breakdown' | 'projections';
    contracts?: 'expiring_only' | 'all_active' | 'with_negotiations';
    // ... etc
  };
}
```

**Complete mapping (all 52 decisions):**

| Decision | Papel | Primary Attr | Domains Read |
|----------|-------|-------------|-------------|
| 1.1.1 Hire Staff | Head Producer | Judging Idol Ability | staff, economy, market |
| 1.1.2 Fire Staff | Head Producer | Financial Acumen | staff, economy, roster |
| 1.1.3 Assign Staff | Head Producer | Judging Idol Ability | staff, roster, schedule |
| 1.1.4 Self-Assign | Head Producer | (varies) | staff, roster, economy |
| 1.2.1 Adjust Strategy | Head Producer | Industry Knowledge | strategy, economy, roster, fame |
| 1.3.1 Negotiate Budget | Head Producer | Authority | economy, staff, roster |
| 1.4.1 Idol Conversation | Head Producer | People Management | roster, contracts, events |
| 2.1.1 Cover Empty Post | Vice-Producer | Adaptability | staff, (varies by cargo) |
| 2.2.1 Recommend Action | Vice-Producer | Industry Knowledge | economy, roster, contracts, events |
| 3.1.1 Renew Contract | Talent Director | Industry Knowledge | contracts, roster, economy, fame |
| 3.1.2 Respond Buyout | Talent Director | Industry Knowledge | contracts, roster, economy, rivals |
| 3.1.3 Terminate Contract | Talent Director | Financial Acumen | contracts, roster, economy, market |
| 3.2.1 Assess Roster | Talent Director | Judging Idol Ability | roster, economy, fame, market |
| 3.3.1 List for Transfer | Talent Director | Financial Acumen | roster, market, economy, rivals |
| 4.1.1 Send Scout Mission | Chief Scout | Judging Idol Potential | scouting, roster, market |
| 4.2.1 Evaluate Candidates | Chief Scout | Judging Idol Ability | scouting, roster, economy, rivals |
| 5.1.1 Create Dev Plan | Dev Director | Judging Idol Potential | roster, schedule |
| 5.2.1 Assign Mentor | Dev Director | Mental Coaching | roster, schedule |
| 5.3.1 Project Timeline | Dev Director | Judging Idol Potential | roster |
| 6.1.1 Vocal Training | Vocal Coach | Vocal Technique | roster, schedule, shows |
| 6.1.2 Assess Vocal | Vocal Coach | Vocal Technique | roster |
| 7.1.1 Dance Training | Dance Coach | Dance Technique | roster, schedule, shows |
| 7.1.2 Group Choreo Prep | Dance Coach | Dance Technique | roster, shows, music |
| 7.1.3 Assess Dance | Dance Coach | Dance Technique | roster |
| 8.1.1 Acting Training | Acting Coach | Acting/Variety | roster, schedule |
| 8.1.2 TV Preparation | Acting Coach | Acting/Variety | roster, schedule |
| 8.1.3 Assess Acting | Acting Coach | Acting/Variety | roster |
| 9.1.1 Commission Music | Music Director | Musical Knowledge | music, roster, economy, fame |
| 9.1.2 Resolve Stall | Music Director | Musical Knowledge | music, roster, schedule, facilities |
| 9.2.1 Manage Composers | Music Director | Musical Knowledge | music, rivals, economy |
| 9.3.1 Plan Release | Music Director | Musical Knowledge | music, fame, economy, fanClubs |
| 10.1.1 Plan Show | Show Director | Stage Presence | shows, roster, economy, fame, fanClubs |
| 10.2.1 Select Packages | Show Director | Stage Presence | shows, economy, facilities |
| 10.3.1 Assign Lineup | Show Director | Dance Technique | shows, roster, music |
| 10.3.2 Mid-Show Rotation | Show Director | Stage Presence | shows, roster |
| 10.4.1 Build Setlist | Show Director | Musical Knowledge | shows, music, roster, fanClubs |
| 10.5.1 Assign Costumes | Show Director | Stage Presence | shows, roster, facilities |
| 10.5.2 Purchase Costumes | Show Director | Stage Presence | shows, economy, facilities |
| 11.1.1 Respond Scandal | Comms Director | Media Savvy | events, roster, fanClubs, fame |
| 11.1.2 PR Campaign | Comms Director | Media Savvy | roster, fame, economy, events |
| 11.2.1 Social Media | Comms Director | Media Savvy | roster, fanClubs, fame, news |
| 11.3.1 Fan Club Mgmt | Comms Director | Fan Psychology | fanClubs, roster, events, economy |
| 12.1.1 Adjust Budget | Ops Director | Financial Acumen | economy, roster, facilities |
| 12.1.2 Financial Alert | Ops Director | Financial Acumen | economy |
| 12.2.1 Upgrade Facility | Ops Director | Financial Acumen | facilities, economy, roster |
| 12.3.1 Produce Merch | Ops Director | Financial Acumen | economy, fanClubs, shows, roster |
| 12.4.1 Marketing Campaign | Ops Director | Media Savvy | economy, roster, fame, music, shows |
| 12.5.1 Plan Event | Ops Director | Industry Knowledge | economy, roster, fame, rivals |
| 13.1.1 Wellness Scan | Wellness Director | Mental Coaching | roster, schedule, events, facilities |
| 13.1.2 Wellness Session | Wellness Director | Mental Coaching | roster |
| 13.2.1 Injury Assessment | Wellness Director | Physical Training | roster, schedule, facilities |
| 14.1.1 Post-Mortem | Intel Analyst | Judging Idol Ability | roster, shows, economy |
| 14.2.1 Monitor Rivals | Intel Analyst | Industry Knowledge | rivals, roster, market |
| 14.3.1 Weekly Report | Intel Analyst | Judging Idol Ability | economy, roster, fame, shows, events |

## Consequences

### Positive
- Single point of context assembly — no redundant state reads
- Role-scoped filtering prevents data leaks between departments
- Hidden stat progressive reveal creates gameplay depth (longer contracts = more insight)
- Snapshot-at-tick-start eliminates race conditions between agencies
- Full traceability: every decision's data needs documented in one table

### Negative
- 25ms overhead for context assembly (within budget but not free)
- Views are snapshots — decisions can't see changes made earlier in the same tick
- ROLE_CONTEXT_ACCESS table must be maintained as new roles/domains are added

### Risks
- **Risk**: Context views become stale within long ticks (rival AI processing)
  - **Mitigation**: By design. Staleness within a single tick is acceptable.
    Cross-agency effects are resolved in Resolution Phase.
- **Risk**: New decisions added to ADR-009 without updating context mapping
  - **Mitigation**: Context Provider Registry is the checklist. Code review enforces.

## GDD Requirements Addressed

| GDD | Requirement | How |
|-----|------------|-----|
| staff-functional.md | Staff functions depend on NPC attributes | effectiveAttr computed per task from NPC attrs |
| staff-functional.md | NPCs see data relevant to their role | ROLE_CONTEXT_ACCESS filtering |
| idol-attribute-stats.md | Hidden stats gradually revealed | IdolSnapshot.hiddenStats with progressive unlock |
| agency-staff-operations.md | Delegation quality depends on attrs | Context provides all data NPC needs to match attr level |

## Checklist: Adding a New Decision to the Game

When a new decision pipeline is created (new NPC action, new player action, new
cargo, or new tarefa within an existing cargo), the following must be updated:

### 1. Design (before implementation)

| Step | Document | What to update |
|------|----------|----------------|
| **1a** | **GDD** (`design/gdd/[system].md`) | Define the mechanic that motivates this decision. Must include: rules, formulas, edge cases, tuning knobs, acceptance criteria. |
| **1b** | **ADR-009** (Decision Catalog) | Add the full decision entry: CONTEXT + SKILLS REQUIRED + FLOWCHART with 8-level behaviors per skill + OUTPUT typed action. |
| **1c** | **ADR-012** (this doc) — Context Provider mapping table | Add row: decision name → papel → primary attr → domains read. |
| **1d** | **ADR-012** — `ROLE_CONTEXT_ACCESS` | If the role needs access to a domain it didn't have before, add it to the role's domain list. |

### 2. Data model (if decision produces new action type or reads new data)

| Step | Document/Code | What to update |
|------|---------------|----------------|
| **2a** | **`AgencyAction` union type** | Add the new action type to the discriminated union. Every decision output must be a typed action. |
| **2b** | **ADR-003** (State Schema) — slice definitions | If the action affects a new kind of state: add field to existing slice or create new slice. |
| **2c** | **ADR-012** — domain view interfaces | If the decision needs data not yet in any view: add field to the relevant `*View` interface. |
| **2d** | **ADR-004** (Event System) — `SimEvent` union | If the decision emits a new event or reacts to a new event type: add to the event union. |

### 3. Staff & attributes (if new role or skill usage)

| Step | Document | What to update |
|------|----------|----------------|
| **3a** | **GDD `agency-staff-operations.md`** — staff attributes | If decision uses an attribute in a new way, document it in the "Impacto por Categoria" table. |
| **3b** | **ADR-012** — primary attr per decision | Ensure the task → primary attribute mapping is documented. |
| **3c** | **`draft-action-catalog.md`** — papel/cargo/tarefa structure | Add the new tarefa under the correct cargo and papel. |

### 4. Pipeline integration

| Step | Document/Code | What to update |
|------|---------------|----------------|
| **4a** | **ADR-002** (Simulation Pipeline) | If the decision runs at a specific phase (Phase 1/2/3/4), document when it executes. Most decisions run in Decision Phase (before pipeline), but some are reactive (mid-show rotations in Phase 2). |
| **4b** | **ADR-005** (Performance Budgets) | If the decision adds measurable CPU cost, account for it in the budget table. |
| **4c** | **Handler registration order** (ADR-004) | If the decision emits events, its handler must be registered in the correct order (owners before consumers). |

### 5. Traceability

| Step | Document | What to update |
|------|----------|----------------|
| **5a** | **TR Registry** (`docs/architecture/tr-registry.yaml`) | Add TR-IDs for the GDD requirements this decision addresses. |
| **5b** | **Control Manifest** (`docs/architecture/control-manifest.md`) | If the decision creates new required/forbidden patterns, regenerate manifest. |

### 6. Validation

| Step | Action |
|------|--------|
| **6a** | Write unit test for the decision flowchart (deterministic: same inputs + seed = same output). |
| **6b** | Verify context assembly includes the new data needs (no undefined reads). |
| **6c** | Verify the action type is handled in the execution phase (action → state mutation). |
| **6d** | Run `/architecture-review` in a fresh session to verify coverage. |

### Summary flow

```
New mechanic idea
  → GDD (design the rules)
  → ADR-009 (decision flowchart with 8-level behaviors)
  → ADR-012 (context mapping + role access)
  → AgencyAction type (new action)
  → SimEvent type (if emits events)
  → State slice (if new state needed)
  → TR Registry (traceability)
  → Unit test (determinism verification)
  → /architecture-review (coverage check)
```

If ANY step is skipped, the decision either:
- Can't access the data it needs (missing context mapping)
- Produces actions nobody handles (missing action type in executor)
- Isn't traceable to a GDD requirement (audit gap)
- Isn't testable (no determinism guarantee)

## Related Decisions

- [ADR-003](adr-003-game-state-schema.md) — state slices are the data source
- [ADR-009](adr-009-decision-catalog.md) — decisions are the data consumers
- [ADR-002](adr-002-simulation-pipeline.md) — context assembled by Orchestrator before Worker Pool
- [ADR-011](adr-011-multiplayer-ready.md) — visibility filter builds on role-scoped filtering
