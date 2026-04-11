# ADR-016: Dialogue System & Medical/Injury System

## Status
Accepted

## Date
2026-04-09

## Last Verified
2026-04-09

## Decision Makers
user + architecture-review

## Summary
Dialogue and medical systems are both player-initiated interactions that modify
idol wellness state. This ADR defines the dialogue reaction scoring formula,
promise tracking, medical injury/recovery pipeline, and their integration with
the wellness system (ADR-003) and event bus (ADR-004).

---

## Engine Compatibility

| Field | Value |
|-------|-------|
| Engine | SvelteKit 2.50 + Svelte 5 |
| Domain | Simulation / State |
| Knowledge Risk | LOW |
| Post-Cutoff APIs Used | None |

## ADR Dependencies

| Field | Value |
|-------|-------|
| Depends On | ADR-002 (pipeline phases), ADR-003 (wellness/roster slices), ADR-004 (events), ADR-009 (NPC decisions — Wellness Advisor) |
| Enables | Dialogue stories, medical system stories |
| Blocks | Dialogue UI, medical dashboard, injury mechanics |

---

## Context

### Problem Statement
Two gameplay systems — dialogue (player talks to idols) and medical (injury
tracking and recovery) — both modify idol wellness state but have no ADR
coverage. They share the wellness system as their primary output target and
both consume hidden stat data (Temperamento, Ambição, etc.) for their formulas.

### Requirements
- Dialogue: reaction score formula, affinity deltas, promise system, saturation penalty
- Medical: 7 injury types, recovery formula, re-injury risk, permanent damage, training load tracking
- Both integrate with wellness system via ADR-004 events
- **NPC parity rule**: Every dialogue/medical action the player can take, an NPC
  producer must also be able to take. NPC producers (rival agencies and delegated
  NPCs) use the same `computeReactionScore()` with tone chosen by their personality.
  NPC dialogue decisions and message responses must be declared in ADR-009.

---

## Decision

### Part A: Dialogue System

#### Reaction Score Formula

```typescript
interface DialogueContext {
  tone: 'encouraging' | 'neutral' | 'competitive' | 'aggressive' | 'calm';
  topic: string;
  idol: IdolRuntime;
  producerId: string;           // ID of the producer initiating dialogue
  producerTraits: string[];     // traits of the acting producer
  wellnessAdvisorLevel: 0 | 1 | 2 | 3;
}
// NOTE: producerId is the entity ID of whoever initiates the dialogue —
// this can be the human player's producer OR an NPC producer (rival agency
// or delegated NPC). Every action a player can do, an NPC must also be able
// to do (see ADR-009). NPC producers use the same dialogue system with
// tone selected by their personality profile.

function computeReactionScore(ctx: DialogueContext): number {
  const base = TONE_BASE[ctx.tone];  // e.g. encouraging=60, aggressive=40
  const typeMatch = TOPIC_MATCH[ctx.topic][ctx.idol.personality] ?? 0;

  // 6 personality modifiers from hidden stats
  const tempMod = ctx.idol.hiddenStats.temperamento > 14
    ? (ctx.tone === 'aggressive' ? -15 : 5)  // resists aggression
    : (ctx.tone === 'aggressive' ? 10 : 0);
  const loyaltyMod = ctx.idol.hiddenStats.lealdade > 12 ? 5 : 0;
  const profMod = ctx.idol.hiddenStats.profissionalismo > 14 ? 8 : 0;
  const wellnessMod = ctx.idol.wellness.happiness < 30 ? -10 : 0;
  const affinityMod = (getAffinity(ctx.idol.id, ctx.producerId) - 0.5) * 20;
  const relevanceMod = TOPIC_RELEVANCE[ctx.topic] ?? 0;

  return Math.max(0, Math.min(100,
    base + typeMatch + tempMod + loyaltyMod + profMod
    + wellnessMod + affinityMod + relevanceMod
  ));
}
```

#### Outcome Thresholds & Affinity Deltas

| Score Range | Outcome | Affinity Delta |
|------------|---------|----------------|
| ≥ 60 | Success | +5 to +10 |
| 40-59 | Partial | -2 to +2 |
| 20-39 | Fail | -5 to -10 |
| < 20 | Disaster | -10 to -15 |

#### Promise System

```typescript
interface Promise {
  id: string;
  idolId: string;
  description: string;
  deadlineWeek: number;    // 4-12 weeks from creation
  fulfilled: boolean;
  broken: boolean;
}
// Fulfilled: +8 affinity. Broken (deadline passed): -10 affinity.
```

#### Saturation Penalty
If same idol receives 2+ dialogues/week for 3+ consecutive weeks:
positive affinity deltas multiplied by `SATURATION_DECAY` (0.5, then 0.25, etc.)

#### Wellness Advisor Integration (ADR-009)
- Level 1: 70% prediction accuracy on reaction outcome
- Level 2: 85% accuracy + hidden stat hints
- Level 3: 95% accuracy + full hidden stat visibility
- Without advisor: -20% accuracy on predictions

### Part B: Medical System

#### 7 Injury Types

| Type | Trigger | Base Recovery (weeks) | Permanent Damage Risk |
|------|---------|----------------------|----------------------|
| Vocal strain | Vocal jobs > threshold | 2-4 | 25% → Vocal -5 |
| Muscle injury | Dance/physical jobs > threshold | 3-6 | 25% → Dança -5 |
| Mental exhaustion | Stress > 80 for 4+ weeks | 4-8 | 25% → Mentalidade -5 |
| Back injury | Show + poor posture (low Resistência) | 4-8 | 30% → Resistência -5 |
| Knee injury | Dance intensity + age > 25 | 6-12 | 35% → Dança -5 |
| Anxiety disorder | Happiness < 20 for 8+ weeks | 6-12 | 20% → Comunicação -5 |
| General fatigue | Training load > 120% for 3+ weeks | 1-3 | 10% → all physical -2 |

#### Recovery Formula

```typescript
function recoveryWeeks(
  baseWeeks: number,
  facilityLevel: 1 | 2 | 3,
  ptSkill: number,        // physiotherapist skill 0-100
  resilience: number      // idol Resistência stat
): number {
  const facilityMult = [1.0, 0.85, 0.70, 0.50][facilityLevel];
  const ptMult = 0.90 - (ptSkill / 100) * 0.30;  // 0.90 to 0.60
  const resFactor = 1.0 - resilience / 200;        // 1.0 to 0.50

  return Math.ceil(baseWeeks * facilityMult * ptMult * resFactor);
}
```

#### Re-Injury Risk

```typescript
function reinjuryChance(ptSkill: number): number {
  return 0.30 * (1 - ptSkill / 150);  // 30% base, reduced by PT skill
}
```

#### Training Load Tracking

```typescript
function trainingLoad(
  physicalJobs: number,
  trainingSessions: number
): number {
  const PHYSICAL_COST = 15;
  const TRAINING_COST = 10;
  const MAX_SAFE_LOAD = 100;

  return ((physicalJobs * PHYSICAL_COST) + (trainingSessions * TRAINING_COST))
    / MAX_SAFE_LOAD * 100;  // percentage
}
// > 100% for 3+ weeks → triggers General Fatigue
// > 120% → immediate injury risk check
```

#### Medical Dashboard State
- Green: training load < 80%, no injury history in 3 months
- Yellow: training load 80-100%, or recovering from injury
- Red: training load > 100%, or active injury, or re-injury risk > 20%

### Pipeline Integration

| Phase | Dialogue Actions | Medical Actions |
|-------|-----------------|-----------------|
| Phase 1 | — | — |
| Phase 2 | Process dialogue results (player input from previous tick) | Check training load daily; trigger injury if threshold exceeded |
| Phase 3 | Update affinity; check promise deadlines | Update recovery counters; check re-injury; permanent damage roll |
| Phase 4 | — | — |

### Event Contracts

```typescript
type DialogueEvent =
  | { type: 'dialogue:completed'; idolId: string; outcome: 'success' | 'partial' | 'fail' | 'disaster'; affinityDelta: number }
  | { type: 'dialogue:promiseMade'; idolId: string; promiseId: string; deadlineWeek: number }
  | { type: 'dialogue:promiseFulfilled'; idolId: string; promiseId: string }
  | { type: 'dialogue:promiseBroken'; idolId: string; promiseId: string };

type MedicalEvent =
  | { type: 'medical:injuryOccurred'; idolId: string; injuryType: string; recoveryWeeks: number }
  | { type: 'medical:recoveryComplete'; idolId: string; injuryType: string }
  | { type: 'medical:permanentDamage'; idolId: string; stat: string; loss: number }
  | { type: 'medical:reinjury'; idolId: string; injuryType: string }
  | { type: 'medical:trainingLoadCritical'; idolId: string; loadPercent: number };
```

---

## Consequences

### Positive
- All wellness-modifying systems now have explicit formulas and event contracts
- Hidden stat progressive reveal (ADR-012) integrates with dialogue prediction
- Medical injuries create meaningful scheduling constraints

### Negative
- Dialogue saturation penalty adds tracking complexity per idol
- 7 injury types require balancing across all job types

---

## Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Dialogue too punishing (disasters too frequent) | MEDIUM | MEDIUM | Tuning knobs on tone bases; playtest early |
| Injury permanent damage feels unfair | LOW | HIGH | 25% base chance is low; PT staff reduces further |
| Training load threshold too strict | MEDIUM | LOW | Threshold is tuning knob; default 100 is generous |

---

## Performance Implications

| Metric | Budget |
|--------|--------|
| Dialogue reaction score computation | <0.1ms per dialogue |
| Medical checks per idol per week | <0.01ms (threshold comparison) |
| Total medical processing (3000 idols) | <30ms (within Phase 3 budget) |

---

## GDD Requirements Addressed

| GDD Document | TR-ID | Requirement | How This ADR Satisfies It |
|-------------|-------|-------------|--------------------------|
| dialogue-system.md | TR-dialogue-001 | Reaction score formula with 6 personality modifiers | computeReactionScore() with hidden stats |
| dialogue-system.md | TR-dialogue-002 | 4 outcome thresholds (Success/Partial/Fail/Disaster) | Score ranges 60/40/20 with affinity deltas |
| dialogue-system.md | TR-dialogue-003 | Promise system with deadline and fulfillment | Promise interface with 4-12 week deadlines |
| dialogue-system.md | TR-dialogue-004 | Wellness Advisor prediction accuracy by level | 70%/85%/95% accuracy tiers |
| dialogue-system.md | TR-dialogue-005 | Saturation penalty for repeated dialogues | Multiplicative decay on positive deltas |
| dialogue-system.md | TR-dialogue-006 | PR Manager mitigation on negative outcomes | ×0.7 multiplier on negative affinity deltas |
| medical-system.md | TR-medical-001 | 7 injury types with specific triggers | Injury type table with trigger conditions |
| medical-system.md | TR-medical-002 | Recovery formula with facility/staff/stat multipliers | recoveryWeeks() with 3 multiplicative factors |
| medical-system.md | TR-medical-003 | Re-injury chance reduced by PT skill | reinjuryChance() formula: 30% × (1 - skill/150) |
| medical-system.md | TR-medical-004 | Permanent damage on forced work during recovery | -5 stat loss at 25% base chance |
| medical-system.md | TR-medical-005 | Training load tracking with 3-level dashboard | trainingLoad() → Green/Yellow/Red thresholds |
| medical-system.md | TR-medical-006 | Rehab training at 50% efficiency for mental stats | Recovery mode: mental training allowed at ×0.5 |

---

## Related

- [ADR-003: Game State Schema](adr-003-game-state-schema.md) — wellness slice
- [ADR-004: Event System](adr-004-event-system.md) — dialogue/medical events
- [ADR-009: Decision Catalog](adr-009-decision-catalog.md) — Wellness Advisor decisions
- [ADR-012: Context Providers](adr-012-decision-context-providers.md) — hidden stat reveal
