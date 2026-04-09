# ADR-018: Meta-Game, Planning Board, Player Events & Post-Debut Careers

## Status
Proposed

## Date
2026-04-09

## Last Verified
2026-04-09

## Decision Makers
user + architecture-review

## Summary
Four long-term progression systems — agency meta-game, planning board, player-created
events, and post-debut careers — operate on monthly/seasonal timescales above the
weekly simulation loop. This ADR defines their state integration with existing slices
and their pipeline timing (monthly Phase 3 processing).

---

## Engine Compatibility

| Field | Value |
|-------|-------|
| Engine | SvelteKit 2.50 + Svelte 5 |
| Domain | Simulation / Progression |
| Knowledge Risk | LOW |
| Post-Cutoff APIs Used | None |

## ADR Dependencies

| Field | Value |
|-------|-------|
| Depends On | ADR-002 (pipeline), ADR-003 (state schema), ADR-004 (events), ADR-008 (music for post-debut) |
| Enables | Meta-game, planning, custom events, post-debut career stories |
| Blocks | Long-term progression features |

---

## Decision

### State Integration

These systems add sub-structures to existing slices rather than creating new
top-level slices (following ADR-017 pattern):

```
AgencySlice (ADR-003)
├── tier: AgencyTier            # existing
├── metaGame: MetaGameState     # NEW — goals, reputation, tier progression
└── planningBoard: PlanningState  # NEW — seasonal plans, risk tracking

EconomySlice (ADR-003)
└── playerEvents: PlayerEvent[]   # NEW — festivals, tours, custom events

RosterSlice (ADR-003)
└── idols[].postDebut: PostDebutState | null  # NEW — ex-idol career tracking
```

### Part A: Agency Meta-Game (TR-meta-game-001..003)

```typescript
interface MetaGameState {
  reputation: number;           // composite score 0-100
  currentGoals: AgencyGoal[];   // 3-5 active goals per season
  completedGoals: string[];
  agencyTier: 'garage' | 'small' | 'mid' | 'large' | 'major' | 'elite';
  tierProgressPct: number;      // progress toward next tier
}

// Reputation formula:
// reputation = (goals_met / total × 0.4) + (best_ranking / 100 × 0.3)
//            + (years × 0.02 × 0.2) + (idols_developed / 20 × 0.1)
// Capped at 100.

// Tier progression: automatic based on sustained performance metrics.
// Demotion possible if metrics drop below threshold for 2+ seasons.
```

### Part B: Planning Board (TR-planning-001..003)

```typescript
interface PlanningState {
  seasonalPlan: SeasonalPlan | null;
  riskRegister: RiskEntry[];
  milestones: Milestone[];
}

interface SeasonalPlan {
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  year: number;
  focusAreas: string[];        // e.g. 'scouting', 'shows', 'music-release'
  budgetAllocation: Record<string, number>;  // category → %
}

interface RiskEntry {
  description: string;
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  mitigation: string;
  status: 'open' | 'mitigated' | 'occurred';
}
```

### Part C: Player-Created Events (TR-player-events-001..002)

```typescript
interface PlayerEvent {
  id: string;
  type: 'mini-live' | 'concert' | 'festival' | 'fan-meeting' | 'tour';
  scheduledWeek: number;
  venueCapacity: number;
  productionCost: number;
  guestIds: string[];          // invited idols from other agencies
  status: 'planning' | 'confirmed' | 'completed' | 'cancelled';
}

// Revenue: bilheteria - custo_producao - caches_convidados
// Fame gain: sucesso × visibilidade × participantes
// Guest acceptance: conditioned on event tier, availability, rival relations
```

### Part D: Post-Debut Careers (TR-post-debut-001..003)

```typescript
interface PostDebutState {
  careerType: 'solo-artist' | 'actress' | 'model' | 'trainer' | 'producer' | 'retired';
  graduationWeek: number;
  graduationType: 'simple' | 'special-show' | 'final-tour';
  postDebutFame: number;       // separate from active fame
  jobsGenerated: string[];     // IDs of jobs this ex-idol creates
}

// Ex-idols generate jobs for active idols (e.g. ex-idol becomes drama producer
// → creates drama job opportunities). 
// Graduation fame boost: Simple +50, Special Show +200-500, Final Tour +500-1000.
// Merch carryover: 3-month revenue from graduation products (ADR-017).
```

### Pipeline Timing

All four systems process **monthly** at end of week 4, Phase 3:
1. Meta-game: evaluate goal progress, update reputation, check tier progression
2. Planning: check milestone deadlines, update risk register
3. Player events: advance event planning state, settle completed events
4. Post-debut: generate new jobs from ex-idols, decay post-debut fame

---

## GDD Requirements Addressed

| GDD Document | TR-ID | Requirement | How This ADR Satisfies It |
|-------------|-------|-------------|--------------------------|
| agency-meta-game.md | TR-meta-game-001 | Reputation formula (goals/ranking/years/idols) | Composite score formula in MetaGameState |
| agency-meta-game.md | TR-meta-game-002 | Agency tier progression and demotion | agencyTier with sustained performance thresholds |
| agency-meta-game.md | TR-meta-game-003 | Season-scoped goals with evaluation | currentGoals evaluated monthly in Phase 3 |
| agency-planning-board.md | TR-planning-001 | Seasonal planning with budget allocation | SeasonalPlan with focusAreas and budgetAllocation |
| agency-planning-board.md | TR-planning-002 | Risk register with probability/impact | RiskEntry with 3-level probability × impact |
| agency-planning-board.md | TR-planning-003 | Milestone tracking with deadlines | Milestone array checked monthly |
| player-created-events.md | TR-player-events-001 | 5 event types with cost/scale/revenue | PlayerEvent type enum with economics |
| player-created-events.md | TR-player-events-002 | Guest acceptance based on tier and relations | Acceptance formula using fame tier + rival affinity |
| post-debut-career.md | TR-post-debut-001 | 3 graduation ceremony types with fame boosts | graduationType with +50/+500/+1000 fame |
| post-debut-career.md | TR-post-debut-002 | Ex-idols generate job opportunities | jobsGenerated created monthly from careerType |
| post-debut-career.md | TR-post-debut-003 | Post-debut fame tracking separate from active | postDebutFame with decay over time |

---

## Related

- [ADR-003: Game State Schema](adr-003-game-state-schema.md) — extends AgencySlice, EconomySlice, RosterSlice
- [ADR-017: Economy Extensions](adr-017-economy-extensions.md) — graduation merch carryover
