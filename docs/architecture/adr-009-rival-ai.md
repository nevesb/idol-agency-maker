# ADR-009: Rival AI & NPC Architecture

## Status
Proposed

## Date
2026-04-07

## ADR Dependencies

| Field | Value |
|-------|-------|
| **Depends On** | ADR-002 (RivalAIWorker), ADR-003 (RivalsSlice), ADR-004 (rival events) |
| **Enables** | Rival AI epics, market competition epics |
| **Blocks** | None |

## Context

50 rival agencies make weekly decisions (contracts, assignments, purchases, music)
using simplified heuristics within 100ms total. They share the scout pool (500 NPCs)
and composer pool with the player. Their decisions must be deterministic (seeded)
and produce visible consequences (buyout proposals, market competition, news).

## Decision

### Heuristic Decision Engine in Dedicated Worker

Each rival agency processes a **5-step decision pipeline** per week:

```typescript
interface RivalDecisionPipeline {
  // Step 1: Evaluate roster (2ms budget covers all 5 steps per agency)
  evaluateRoster(agency: RivalAgency): RosterEvaluation;

  // Step 2: Market decisions (hire/fire/buyout)
  decideMarket(agency: RivalAgency, market: MarketSnapshot): MarketDecision[];

  // Step 3: Job assignments (top-5 idols × top-3 matching jobs)
  assignJobs(agency: RivalAgency, jobs: JobPosting[]): JobAssignment[];

  // Step 4: Invest (facilities, marketing, music commissions)
  decideInvestments(agency: RivalAgency): Investment[];

  // Step 5: React to events (scandals, wellness crises)
  reactToEvents(agency: RivalAgency, events: SimEvent[]): Reaction[];
}
```

### Heuristic Simplifications (vs. Player Pipeline)

| Decision | Player Pipeline | Rival AI Heuristic |
|----------|----------------|-------------------|
| Job assignment | Full performance formula, manual selection | `top5Idols.match(top3Jobs)` by stat overlap |
| Contract negotiation | 9 clauses × 3 rounds | Auto-accept if within 20% of market rate |
| Scouting | 5 pipeline methods, precision per scout | Random hire from available pool, weighted by tier |
| Music production | Full Kanban pipeline | Skip stages, instant quality = `composerTier × 0.7` |
| Show planning | Setlist builder, formations, costumes | Auto-generate setlist from top songs |
| Wellness management | Manual schedule adjustment | If wellness < 40%: cancel next week's jobs |

### Determinism

Each agency receives a sub-seed: `agencySeed = weekSeed XOR agencyId`
All random decisions (which idol to hire, which job to pick) use this seed
via the same PRNG as the player simulation.

### Agency Personality

Each rival has a fixed personality (from World Pack seed) that biases decisions:

```typescript
interface RivalPersonality {
  strategy: 'aggressive' | 'balanced' | 'conservative' | 'niche';
  focusGenre: string;           // prefer idols/jobs in this genre
  buyoutThreshold: number;      // willingness to spend on buyouts (0-1)
  riskTolerance: number;        // willingness to overwork idols (0-1)
  investmentRate: number;       // % of budget spent on facilities/marketing
}
```

### AI↔AI Interactions

- AI agencies trade idols between themselves (auto-resolved, no player involvement)
- AI agencies compete for the same jobs (highest-scoring idol wins)
- AI agencies compete for the same composers (tier priority)
- All resolved deterministically within the RivalAIWorker, returned as `RivalDecision[]`

### AI→Player Interactions

Buyout proposals and collab requests targeting the player's idols are returned
as `BuyoutProposal[]` and forwarded to the urgent event queue:

```typescript
interface BuyoutProposal {
  fromAgencyId: string;
  targetIdolId: string;
  offerYen: number;
  deadline: number;  // weeks to respond
}
// SimWorker wraps as: emit('urgent:buyout', { inner: proposal })
```

### Memory of Player

Each rival stores interaction history:
```typescript
interface RivalMemory {
  rejectedBuyouts: number;     // times player rejected their offers
  acceptedCollabs: number;
  stolenIdols: number;         // idols they lost to player
  relationship: number;        // -100 to +100, affects future offers
}
```

## GDD Requirements Addressed

| GDD System | Requirement | How This ADR Addresses It |
|------------|-------------|--------------------------|
| rival-agency-ai.md | 50 agencies in <100ms | Simplified heuristics, ~1.6ms per agency |
| rival-agency-ai.md | Full persistent state per agency | RivalAgency entity in RivalsSlice |
| rival-agency-ai.md | AI↔AI buyouts auto-resolved | Processed within RivalAIWorker |
| rival-agency-ai.md | AI→Player buyouts via urgent queue | BuyoutProposal forwarded to event bus |
| rival-agency-ai.md | Shared scout and composer pools | Pools passed as readonly snapshot |
| rival-agency-ai.md | 50 seed-defined agencies | Personality from World Pack seed |
| rival-agency-ai.md | Memory of player interactions | RivalMemory per agency |

## Related Decisions

- [ADR-002](adr-002-simulation-pipeline.md) — dedicated RivalAIWorker
- [ADR-005](adr-005-performance-budgets.md) — 80ms budget for 50 agencies
