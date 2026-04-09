# ADR-015: Groups, Roster Balance & Idol Archetypes

## Status
Proposed

## Date
2026-04-09

## Last Verified
2026-04-09

## Decision Makers
user + architecture-review

## Summary
Groups, roster balance, and archetypes are tightly coupled systems that need a
unified state ownership model. This ADR defines the GroupsSlice, archetype
derivation as pure function, pairwise afinidade storage, and the formulas that
connect them (top-50% stats, sinergia, chemistry, pivô detection).

---

## Engine Compatibility

| Field | Value |
|-------|-------|
| Engine | SvelteKit 2.50 + Svelte 5 |
| Domain | Simulation / State / Data |
| Knowledge Risk | LOW |
| References Consulted | ADR-003 state schema, group-management.md, roster-balance.md, idol-archetypes-roles.md |
| Post-Cutoff APIs Used | None |
| Verification Required | structuredClone performance on GroupsSlice with 400 groups |

## ADR Dependencies

| Field | Value |
|-------|-------|
| Depends On | ADR-002 (pipeline phases for group updates), ADR-003 (state slices — extends with GroupsSlice), ADR-004 (events for group lifecycle) |
| Enables | Group management stories, roster balance UI, archetype-based scouting |
| Blocks | Group formation, group shows, roster analysis features |
| Ordering Note | ADR-003 must be Accepted (it is). This ADR extends the state schema. |

---

## Context

### Problem Statement
Three interrelated GDDs — group management, roster balance, and idol archetypes —
have no architectural coverage. They share data dependencies (archetypes feed group
sinergia; groups feed roster balance) and need coordinated state ownership. ADR-003
defines 18 state slices but none for groups or archetypes. Without this ADR,
developers must invent group state storage, archetype computation strategy, and
afinidade data structures ad hoc.

### Current State
- ADR-003 defines `RosterSlice` with idols and `FameSlice` with rankings
- No `GroupsSlice` exists in the state schema
- Archetypes are defined in GDD but have no architectural home
- Pairwise afinidade between idols has no storage strategy
- Group fame is independent of member fame (K-pop model) but FameSlice only tracks individual fame

### Constraints
- Groups contain 1-12 members; one idol can belong to multiple groups
- Stats aggregation uses top-50% rule (must be efficient for 400+ groups across 50 agencies)
- Afinidade is pairwise (O(N²) pairs) but sparse in practice
- Archetype derivation must be deterministic and pure (same stats → same archetype)
- Chemistry grows monthly; sinergia is derived from chemistry × complementaridade
- All formulas from GDDs are normative — implement exactly as specified

### Requirements
- State slice for groups with clear ownership
- Archetype derivation as cacheable pure function
- Pairwise afinidade storage that scales to 3000 idols
- Group performance formula (top-50% × sinergia) for show pipeline (ADR-007)
- Roster balance analysis with health indicators
- Crisis detection (patinho feio, leadership disputes) as deterministic checks
- Group fame tracked independently in FameSlice

---

## Decision

### 1. State Ownership

Extend ADR-003 with a new `GroupsSlice` and expand `FameSlice` to include group
rankings. Archetypes are **not stored in state** — they are derived on demand.

```
GameState (ADR-003 + this ADR)
├── roster: RosterSlice        # owns idols + pairwise afinidade
│   ├── idols: Map<id, IdolRuntime>
│   └── afinidade: SparseSymmetricMap<idolId, idolId, number>
├── groups: GroupsSlice        # NEW — owns group entities + chemistry
│   ├── groups: Map<id, Group>
│   └── groupStatCache: Map<id, CachedGroupStats>
├── fame: FameSlice            # EXTENDED — adds group rankings
│   ├── idolFame: Map<id, number>
│   ├── groupFame: Map<id, number>           # NEW
│   └── groupRankings: RankingEntry[]        # NEW
└── ... (other slices unchanged)
```

**Ownership rules:**
- `GroupsSlice` is **owned by the groups system**. Only the groups system writes
  to it. Readers: show pipeline, fame system, UI, rival AI.
- `afinidade` lives in `RosterSlice` because it's idol-to-idol, not group-specific.
  The same afinidade pair benefits multiple groups. Owner: stats system (writes on
  activity events). Readers: groups system (chemistry calc), happiness system.
- `groupFame` and `groupRankings` live in `FameSlice` because fame system owns all
  rankings. Groups system emits events; fame system processes them.
- **Archetypes** are NOT stored in any slice. They are derived by a pure function
  `deriveArchetypes(idol: IdolRuntime): ArchetypeResult` called on demand. The
  result is cheap to compute (~72 ops per idol) and cached in UI stores only.

### 2. Data Structures

#### Group Entity

```typescript
interface Group {
  id: string;
  agencyId: string;
  name: string;
  logoId: number;              // index into ~200 pre-generated logos
  isSolo: boolean;             // true if memberIds.length === 1

  // Membership
  memberIds: string[];         // 1-12 idol IDs, ordered by join date
  leaderId: string | null;     // null if solo act
  formedAtWeek: number;        // absolute week number
  lockedUntilWeek: number | null;  // pre-formed band lock

  // Chemistry (group-specific, grows over time)
  chemistry: number;           // 0.0-0.2
  complementaridade: number;   // 0.0-0.3 (cached, recomputed on membership change)

  // State
  state: 'active' | 'locked' | 'conflict' | 'dissolved';
  conflictType?: 'patinho-feio' | 'leadership-dispute';
  conflictMemberId?: string;   // idol involved in crisis
  conflictStartWeek?: number;

  // Tracking (for deterministic crisis detection)
  consecutiveLeaderFailures: number;  // show results < Success while group succeeds
  memberJoinWeeks: Record<string, number>;  // idolId → week they joined
}
```

#### Cached Group Stats

```typescript
interface CachedGroupStats {
  stats: Record<string, number>;  // attribute name → aggregated value
  pivots: Record<string, string[]>;  // attribute → idol IDs in top 50%
  nonPivotIds: string[];        // idols not pivot in any attribute
  cacheWeek: number;            // invalidate if stale
}
```

#### Afinidade Storage (Sparse Symmetric Map)

```typescript
// Key: canonical pair "min(idA,idB):max(idA,idB)" for symmetry
// Only pairs with afinidade != 0.10 (default) are stored
type AfinidadeMap = Map<string, number>;

function afinidadeKey(a: string, b: string): string {
  return a < b ? `${a}:${b}` : `${b}:${a}`;
}

function getAfinidade(map: AfinidadeMap, a: string, b: string): number {
  return map.get(afinidadeKey(a, b)) ?? 0.10;  // default for strangers
}
```

**Memory estimate:** ~20-50K active pairs × 40 bytes ≈ 0.8-2MB. Well within budget.

#### Archetype Result (Derived, Not Stored)

```typescript
type ArchetypeId =
  | 'center' | 'ace-vocal' | 'dance-ace' | 'visual-face'
  | 'variety-engine' | 'all-rounder' | 'reliable-veteran'
  | 'rising-trainee' | 'chaos-magnet' | 'fan-magnet'
  | 'crossover-actress' | 'digital-native';

interface ArchetypeResult {
  primary: ArchetypeId;              // always assigned
  secondary: ArchetypeId | null;     // if score > threshold × 0.7
  scores: Record<ArchetypeId, number>;  // for UI display
}
```

### 3. Key Formulas

#### Top-50% Stats Aggregation

```typescript
function computeGroupStats(
  members: IdolRuntime[],
  attributes: string[]
): Record<string, number> {
  const topN = Math.ceil(members.length / 2);
  const result: Record<string, number> = {};

  for (const attr of attributes) {
    const sorted = members
      .map(m => m.stats[attr])
      .sort((a, b) => b - a);          // descending
    const topSlice = sorted.slice(0, topN);
    result[attr] = topSlice.reduce((s, v) => s + v, 0) / topN;
  }
  return result;
}
// Duo (2 members): topN = 1 → max per attribute (maximum complementarity)
// 4 members: topN = 2 → avg of top 2
// 12 members: topN = 6 → avg of top 6
```

#### Pivô Detection

```typescript
function detectPivots(
  members: IdolRuntime[],
  attributes: string[]
): { pivots: Record<string, string[]>; nonPivotIds: string[] } {
  const topN = Math.ceil(members.length / 2);
  const pivotSet = new Set<string>();
  const pivots: Record<string, string[]> = {};

  for (const attr of attributes) {
    const ranked = members
      .map(m => ({ id: m.id, val: m.stats[attr] }))
      .sort((a, b) => b.val - a.val);
    pivots[attr] = ranked.slice(0, topN).map(r => r.id);
    pivots[attr].forEach(id => pivotSet.add(id));
  }

  const nonPivotIds = members
    .filter(m => !pivotSet.has(m.id))
    .map(m => m.id);

  return { pivots, nonPivotIds };
}
```

#### Sinergia

```typescript
function computeSinergia(group: Group): number {
  return group.complementaridade * group.chemistry;
}

// Group performance for shows (ADR-007 integration):
// performance = mean(top50%_individual_performance) × (1 + sinergia)
```

#### Chemistry Growth (Monthly)

```typescript
function updateChemistry(
  group: Group,
  leaderHealthy: boolean,
  conflictsThisMonth: number
): number {
  const GROWTH_BASE = 0.01;
  const LEADER_BONUS = 0.02;
  const CONFLICT_PENALTY = 0.05;

  let delta = GROWTH_BASE;
  if (leaderHealthy) delta += LEADER_BONUS;
  delta -= conflictsThisMonth * CONFLICT_PENALTY;

  return Math.min(Math.max(group.chemistry + delta, 0.0), 0.2);
}
```

#### Archetype Scoring

```typescript
const ARCHETYPE_THRESHOLD = 2.0;
const SECONDARY_MULT = 0.7;

interface ArchetypeReq {
  stat: string;
  min: number;
}

function scoreArchetype(
  idol: IdolRuntime,
  requirements: ArchetypeReq[]
): number {
  let allMet = true;
  let sum = 0;
  for (const req of requirements) {
    const ratio = Math.min(idol.stats[req.stat] / req.min, 1.5);
    if (idol.stats[req.stat] < req.min) allMet = false;
    sum += ratio;
  }
  return sum * (allMet ? 1.5 : 1.0);
}

function deriveArchetypes(idol: IdolRuntime): ArchetypeResult {
  const scores = Object.fromEntries(
    ARCHETYPE_DEFINITIONS.map(def => [
      def.id,
      scoreArchetype(idol, def.requirements)
    ])
  ) as Record<ArchetypeId, number>;

  const sorted = Object.entries(scores)
    .sort(([, a], [, b]) => b - a);

  const primary: ArchetypeId =
    sorted[0][1] >= ARCHETYPE_THRESHOLD
      ? sorted[0][0] as ArchetypeId
      : 'all-rounder';

  const secondary: ArchetypeId | null =
    sorted[1][1] >= ARCHETYPE_THRESHOLD * SECONDARY_MULT
      ? sorted[1][0] as ArchetypeId
      : null;

  return { primary, secondary, scores };
}
```

#### Group Composition Sinergia Bonus

```typescript
function compositionBonus(
  memberArchetypes: ArchetypeResult[]
): number {
  const CORE_FIVE: ArchetypeId[] = [
    'center', 'ace-vocal', 'dance-ace', 'visual-face', 'variety-engine'
  ];
  const primaries = memberArchetypes.map(a => a.primary);
  const uniquePrimaries = new Set(primaries);

  let bonus = 0;

  // Full core coverage
  if (CORE_FIVE.every(c => uniquePrimaries.has(c))) bonus += 0.15;

  // No center penalty
  if (!uniquePrimaries.has('center')) bonus -= 0.10;

  // Duplicate penalty (exclude all-rounder)
  const counts = new Map<ArchetypeId, number>();
  for (const p of primaries) {
    if (p !== 'all-rounder') {
      counts.set(p, (counts.get(p) ?? 0) + 1);
    }
  }
  for (const [, count] of counts) {
    if (count > 1) bonus -= 0.05 * (count - 1);
  }

  // Veteran stability
  if (uniquePrimaries.has('reliable-veteran')) bonus += 0.05;

  // Chaos Magnet variance (applied at show time with RNG, not here)
  // ± random(-0.20, +0.10) — handled by show pipeline (ADR-007)

  return bonus;
}
```

#### Roster Balance Score

```typescript
function computeRosterBalance(
  archetypeCoverage: number,  // count of distinct archetypes present
  trainees: number,
  rookies: number,
  ageStdDev: number
): number {
  const cobertura = (archetypeCoverage / 12) * 100;
  const pipeline = (Math.min(trainees + rookies, 4) / 4) * 100;
  const diversidade = Math.max(0, (1 - ageStdDev / 10)) * 100;

  return cobertura * 0.4 + pipeline * 0.3 + diversidade * 0.3;
}
```

#### Star Dependency Index

```typescript
function starDependency(
  revenueByIdol: Map<string, number>
): number {
  const sorted = [...revenueByIdol.values()].sort((a, b) => b - a);
  const total = sorted.reduce((s, v) => s + v, 0);
  if (total === 0) return 0;

  const top1Pct = sorted[0] / total;
  const top3Pct = sorted.slice(0, 3).reduce((s, v) => s + v, 0) / total;

  return top1Pct * 60 + top3Pct * 40;  // 0-100
}
```

### 4. Crisis Detection (Deterministic)

#### Patinho Feio Crisis

Checked at end-of-week (Phase 3) after show results are available:

```typescript
function checkPatinhoFeo(
  group: Group,
  cachedStats: CachedGroupStats,
  showResult: ShowResult | null,
  currentWeek: number
): SimEvent | null {
  if (group.isSolo || group.state === 'dissolved') return null;

  for (const idolId of cachedStats.nonPivotIds) {
    const joinWeek = group.memberJoinWeeks[idolId] ?? currentWeek;
    const weeksInGroup = currentWeek - joinWeek;

    if (
      weeksInGroup >= 4 &&
      showResult !== null &&
      (showResult.grade === 'D' || showResult.grade === 'F')
    ) {
      return {
        type: 'group:patinhoFeioCrisis',
        groupId: group.id,
        memberId: idolId,
      };
      // Effect handled by event consumers:
      //   happiness: -10 all members
      //   chemistry: -0.05
    }
  }
  return null;
}
```

#### Leadership Dispute

```typescript
function checkLeadershipDispute(
  group: Group,
  members: IdolRuntime[],
  currentWeek: number
): SimEvent | null {
  if (!group.leaderId || group.isSolo) return null;
  const leader = members.find(m => m.id === group.leaderId)!;

  for (const member of members) {
    if (member.id === group.leaderId) continue;

    // Path A: stat dominance + ambition
    const statsAbove = Object.keys(member.stats)
      .filter(attr => member.stats[attr] > leader.stats[attr]).length;
    const lowConsistencia = leader.stats.consistencia < 50;
    const highAmbicao = member.stats.ambicao > 14; // hidden stat

    if (statsAbove >= 3 && lowConsistencia && highAmbicao) {
      return {
        type: 'group:leadershipDispute',
        groupId: group.id,
        leaderId: group.leaderId,
        challengerId: member.id,
      };
    }
  }

  // Path B: consecutive leader failures (tracked in group entity)
  if (group.consecutiveLeaderFailures >= 3) {
    return {
      type: 'group:leadershipDispute',
      groupId: group.id,
      leaderId: group.leaderId,
      challengerId: null, // no specific challenger, general discontent
    };
  }

  return null;
}
```

### 5. Pipeline Integration (ADR-002 Phases)

| Phase | Group System Actions |
|-------|---------------------|
| Phase 1 (init) | — (no group actions at week start) |
| Phase 2 (daily) | Leader crisis check → emit `group:leaderCrisis` if leader wellness low |
| Phase 3 (end-of-week) | Recompute group stats cache. Check patinho feio post-show. Check leadership disputes. Update chemistry (monthly). Emit group events. |
| Phase 4 (report) | — (consumed by Moment Engine for headlines) |

**Show integration (ADR-007):** When a group performs, show pipeline calls
`computeGroupStats()` and applies `(1 + sinergia)` multiplier. The group
system provides the data; the show system owns the calculation.

### 6. Event Contracts (ADR-004 Integration)

```typescript
// New event types to register in ADR-004's discriminated union:
type GroupEvent =
  | { type: 'group:formed'; groupId: string; memberCount: number }
  | { type: 'group:dissolved'; groupId: string; lastFama: number }
  | { type: 'group:memberAdded'; groupId: string; memberId: string }
  | { type: 'group:memberRemoved'; groupId: string; memberId: string }
  | { type: 'group:leaderChanged'; groupId: string; newLeaderId: string }
  | { type: 'group:leaderCrisis'; groupId: string; leaderId: string }
  | { type: 'group:patinhoFeioCrisis'; groupId: string; memberId: string }
  | { type: 'group:leadershipDispute'; groupId: string; leaderId: string; challengerId: string | null }
  | { type: 'group:chemistryChanged'; groupId: string; newValue: number }
  | { type: 'idol:archetypeChanged'; idolId: string; from: ArchetypeId; to: ArchetypeId };
```

**Handler registration order** (extends ADR-004):
- State owner: groups system (processes group:* events, updates GroupsSlice)
- Derived: fame system (updates groupFame on group job/show results)
- Consumer: happiness system (applies -10/-5 penalties from crises)
- Terminal: news system (generates "group formed" / "leadership dispute" headlines)

---

## Alternatives Considered

### Alternative 1: Store Archetypes in State
- **Description**: Add archetypes to IdolRuntime as persisted fields
- **Pros**: No recomputation on read; simpler UI binding
- **Cons**: State bloat; must sync on every stat change; risk of stale data
- **Rejection Reason**: Archetype derivation is ~72 ops per idol (12 archetypes ×
  6 stat checks). At 3000 idols = ~216K ops ≈ <5ms. Pure function with UI-side
  caching is simpler and always consistent.

### Alternative 2: Afinidade Per-Group Instead of Per-Idol-Pair
- **Description**: Store afinidade inside Group entity per member pair
- **Pros**: Simpler data locality
- **Cons**: Same idol pair in 2 groups has 2 separate afinidade values (wrong —
  GDD says afinidade is idol-to-idol, not group-specific). Duplicate data.
- **Rejection Reason**: GDD is explicit: afinidade is pairwise between idols,
  not scoped to groups. One idol pair benefits all their shared groups.

### Alternative 3: Merge Groups Into RosterSlice
- **Description**: Put groups inside RosterSlice alongside idols
- **Pros**: One fewer slice; simpler delta projection
- **Cons**: RosterSlice becomes too large; violates single-owner principle (stats
  system owns roster, groups system owns groups). Any idol stat change marks
  the entire slice dirty including all groups.
- **Rejection Reason**: Separate slices enable fine-grained delta projection.
  Group changes (formation, chemistry) don't trigger roster delta.

---

## Consequences

### Positive
- Clear state ownership: GroupsSlice for groups, RosterSlice for afinidade,
  FameSlice for group rankings
- Archetypes as pure functions guarantee consistency — no stale state
- Sparse afinidade storage scales to 3000 idols without excessive memory
- Deterministic crisis detection enables reproducible saves
- Group performance integrates cleanly with ADR-007 show pipeline

### Negative
- New state slice increases delta projection complexity slightly
- Pairwise afinidade can grow large in long campaigns (mitigated by sparse storage)
- Archetype recomputation on every UI access (mitigated by UI-side memo/cache)

### Neutral
- Group fame independence (K-pop model) is a design choice from GDD, not
  an architectural trade-off

---

## Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Group stat cache invalidation missed | MEDIUM | MEDIUM | Invalidate on any membership or stat change; stale check by week number |
| Afinidade map grows unbounded in 20-year saves | LOW | LOW | Prune pairs with default value (0.10) at month boundary |
| Crisis detection non-deterministic | LOW | HIGH | All checks use only state + seeded RNG; unit test every path |
| Archetype threshold tuning causes mass reclassification | MEDIUM | LOW | Threshold is a tuning knob; GDD specifies default 2.0; adjustable |

---

## Performance Implications

| Metric | Budget | Notes |
|--------|--------|-------|
| Group stat aggregation (400 groups) | <2ms | Sort + average top 50% per attribute |
| Archetype derivation (3000 idols) | <5ms | Only on stat change (~300 idols/week) |
| Chemistry update (400 groups, monthly) | <1ms | Single arithmetic per group |
| Crisis detection (400 groups) | <1ms | 2 checks per group, early exit |
| Afinidade lookup | O(1) | Map.get with canonical key |
| Roster balance score | <1ms | 3 formula components, 1 agency |
| **Total Phase 3 budget** | **<5ms** | Within ADR-005 allocation |

---

## Migration Plan

1. Add `GroupsSlice` to GameState interface (ADR-003 extension)
2. Extend `FameSlice` with `groupFame` and `groupRankings`
3. Add `afinidade` sparse map to `RosterSlice`
4. Implement `deriveArchetypes()` pure function
5. Implement `computeGroupStats()` with cache
6. Register group event types in ADR-004 event union
7. Wire crisis detection into Phase 3 pipeline
8. Build roster balance analysis functions

**Rollback plan:** GroupsSlice is additive — removing it doesn't affect existing
slices. Groups feature can be disabled by skipping Phase 3 group processing.

---

## Validation Criteria

- [ ] Group created with 1-12 members; solo acts have no chemistry/sinergia
- [ ] Top-50% stats match GDD examples (duo = max, 12-member = top 6 avg)
- [ ] Pivô detection correct: idol in top ceil(N/2) for ≥1 attribute
- [ ] Patinho feio crisis fires when: not pivô + bad show + 4+ weeks in group
- [ ] Leadership dispute fires on: stat dominance path OR 3 consecutive failures
- [ ] Chemistry grows +0.01/month, +0.02 with healthy leader, -0.05 per conflict
- [ ] Sinergia = complementaridade × chemistry
- [ ] Group fame independent of member departure
- [ ] Archetypes derive correctly for all 12 types from GDD stat thresholds
- [ ] All-Rounder assigned when no archetype exceeds threshold
- [ ] Composition bonus: +0.15 (5 core), -0.10 (no center), -0.05 (dupes)
- [ ] Roster balance score in 0-100 range with correct weights (0.4/0.3/0.3)
- [ ] Star dependency index flags >60 as critical
- [ ] Afinidade defaults to 0.10 for unknown pairs
- [ ] All crisis events are deterministic (same state + seed = same result)

---

## GDD Requirements Addressed

| GDD Document | TR-ID | Requirement | How This ADR Satisfies It |
|-------------|-------|-------------|--------------------------|
| group-management.md | TR-groups-001 | Group creation 1-12 members | Group entity with memberIds array |
| group-management.md | TR-groups-002 | Top 50% stats aggregation | computeGroupStats() with topN = ceil(N/2) |
| group-management.md | TR-groups-003 | Duo max complementarity | topN = 1 for 2-member groups |
| group-management.md | TR-groups-004 | Pivô detection and patinho feio | detectPivots() + checkPatinhoFeo() |
| group-management.md | TR-groups-005 | Leader mechanics and disputes | checkLeadershipDispute() with 2 paths |
| group-management.md | TR-groups-006 | Independent group fame | groupFame in FameSlice, decoupled from members |
| group-management.md | TR-groups-007 | Sinergia from complementaridade × chemistry | computeSinergia() + monthly chemistry update |
| roster-balance.md | TR-roster-001 | Roster health indicators (6 metrics) | Health indicator thresholds codified |
| roster-balance.md | TR-roster-002 | Star dependency index | starDependency() formula: top1×60 + top3×40 |
| roster-balance.md | TR-roster-003 | Roster balance score | computeRosterBalance() with 0.4/0.3/0.3 weights |
| idol-archetypes-roles.md | TR-archetypes-001 | 12 auto-derived archetypes | deriveArchetypes() pure function |
| idol-archetypes-roles.md | TR-archetypes-002 | Primary + optional secondary | Threshold 2.0 primary, ×0.7 secondary |
| idol-archetypes-roles.md | TR-archetypes-003 | Group composition sinergia bonus | compositionBonus() with core-five/dupes/veteran/chaos |
| idol-archetypes-roles.md | TR-archetypes-004 | Dynamic archetype change on stat growth | Pure function re-derived on stat change |

---

## Related

- [ADR-002: Simulation Pipeline](adr-002-simulation-pipeline.md) — phase integration
- [ADR-003: Game State Schema](adr-003-game-state-schema.md) — extends with GroupsSlice
- [ADR-004: Event System](adr-004-event-system.md) — group event types
- [ADR-007: Show Pipeline](adr-007-show-pipeline.md) — consumes group performance data
- [ADR-009: Decision Catalog](adr-009-decision-catalog.md) — rival AI group decisions
