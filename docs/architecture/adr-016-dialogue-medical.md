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
  tone: 'calm' | 'assertive' | 'aggressive';  // GDD: Calmo, Assertivo, Agressivo
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

// TONE_BASE values (from GDD dialogue-system.md):
//   calm=50, assertive=45, aggressive=35
const TONE_BASE: Record<DialogueContext['tone'], number> = {
  calm: 50, assertive: 45, aggressive: 35
};

function computeReactionScore(ctx: DialogueContext): number {
  const base = TONE_BASE[ctx.tone];
  const typeMatch = TOPIC_MATCH[ctx.topic][ctx.idol.personality] ?? 0;

  // Temperamento modifier (GDD: >14 resists aggressive, <6 volatile)
  const temp = ctx.idol.hiddenStats.temperamento;
  const tempMod = temp > 14
    ? (ctx.tone === 'aggressive' ? -15 : 5)
    : temp < 6
      ? Math.random() * 20 - 10  // volatile: random -10 to +10
      : (ctx.tone === 'aggressive' ? 10 : 0);

  // Lealdade modifier (GDD: >14 → +5, <8 → -5)
  const lealdade = ctx.idol.hiddenStats.lealdade;
  const loyaltyMod = lealdade > 14 ? 5 : (lealdade < 8 ? -5 : 0);

  // Profissionalismo modifier (GDD: only for Disciplinar topic)
  //   >14 → -5 (already knows, feels infantilized)
  //   8-14 → +5 (accepts feedback)
  //   <8 → -5 (resists correction)
  //   Non-Disciplinar → 0
  const prof = ctx.idol.hiddenStats.profissionalismo;
  const profMod = ctx.topic === 'disciplinar'
    ? (prof > 14 ? -5 : (prof >= 8 ? 5 : -5))
    : 0;

  // Wellness modifier (GDD: 4 cumulative branches)
  let wellnessMod = 0;
  if (ctx.idol.wellness.happiness > 60) wellnessMod += 5;
  if (ctx.idol.wellness.happiness < 30) wellnessMod -= 5;
  if (ctx.idol.wellness.stress > 70) wellnessMod -= 5;
  if (ctx.idol.wellness.motivation < 30) wellnessMod -= 3;

  // Affinity modifier (GDD: discrete thresholds on 0-100 scale)
  const affinity = getAffinity(ctx.idol.id, ctx.producerId);  // 0-100
  const affinityMod = affinity > 70 ? 10 : (affinity < 40 ? -10 : 0);

  const relevanceMod = TOPIC_RELEVANCE[ctx.topic] ?? 0;

  const raw = base + typeMatch + tempMod + loyaltyMod + profMod
    + wellnessMod + affinityMod + relevanceMod;

  // PR Manager mitigation: negative affinity deltas × 0.7 (except Disaster)
  // Applied at outcome resolution, not here — see outcome processing below.

  return Math.max(0, Math.min(100, raw));
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
positive affinity deltas multiplied by `(1 - SATURATION_PENALTY × consecutive_weeks)`.
`SATURATION_PENALTY = 0.2` per consecutive week (GDD dialogue-system.md).
Resets after 1 week without max-out.

#### Wellness Advisor Integration (ADR-009)
- Level 1: 70% prediction accuracy on reaction outcome
- Level 2: 85% accuracy + hidden stat hints
- Level 3: 95% accuracy + full hidden stat visibility
- Without advisor: -20% accuracy on predictions

### Part B: Medical System

#### 7 Injury Types

| Type | Trigger (from GDD medical-system.md) | Base Recovery | Permanent Damage Risk |
|------|---------------------------------------|---------------|----------------------|
| Distensão Muscular | Resistência < 40 AND physical job AND weeks_without_rest ≥ 2 | 2-4 weeks | 25% × severity → Resistência -5 |
| Lesão Vocal | Vocal-intensive shows ≥ 2 AND (Vocal < 50 OR Saúde < 40) | 3-5 weeks | 25% × severity → Vocal -5 |
| Fratura por Estresse | Resistência < 30 AND intense choreo ≥ 3/4 weeks AND weeks_without_rest ≥ 3 | 4-8 weeks | 25% × severity → Resistência -5 |
| Fadiga Crônica | Saúde < 30 for 4+ weeks | 3-6 weeks | 25% × severity → all physical -2 |
| Colapso Mental | Stress = 100 (automatic) | 4-8 weeks | 25% × severity → Mentalidade -5 |
| Entorse de Tornozelo | During show with intense choreo AND Resistência < 50 | 2-4 weeks | 25% × severity → Dança -5 |
| Tendinite | Same physical job type for 5+ weeks AND Resistência < 45 | 3-6 weeks | 25% × severity → affected stat -5 |

Permanent damage uses a **severity-based formula** (GDD medical-system.md):
- `PERMANENT_DAMAGE_CHANCE = 0.25` (25% base)
- `chance = PERMANENT_DAMAGE_CHANCE × severity_mult` where Light=0.5, Medium=1.0, Severe=1.5
- Affected stat is injury-specific (see table above)

#### Recovery Formula

```typescript
function recoveryWeeks(
  baseWeeks: number,
  facilityLevel: 0 | 1 | 2 | 3,  // 0 = no Medical Center
  ptSkill: number,                 // physiotherapist skill 0-100
  resilience: number               // idol Resistência stat
): number {
  // Facility multiplier: discrete brackets (GDD medical-system.md)
  const facilityMult = [1.0, 0.85, 0.70, 0.50][facilityLevel];

  // PT staff multiplier: discrete brackets (GDD medical-system.md)
  //   No PT: 1.0, skill 1-30: 0.90, 31-60: 0.80, 61-80: 0.70, 81-100: 0.60
  const ptMult = ptSkill === 0 ? 1.0
    : ptSkill <= 30 ? 0.90
    : ptSkill <= 60 ? 0.80
    : ptSkill <= 80 ? 0.70
    : 0.60;

  const resFactor = 1.0 - resilience / 200;  // 1.0 to 0.50

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
  trainingSessions: number,
  resistencia: number        // idol Resistência stat
): number {
  const PHYSICAL_COST = 15;
  const TRAINING_COST = 10;
  // Per-idol max safe load (GDD medical-system.md):
  //   max_safe_load = Resistência × 0.5 + 20
  //   Resistência 80 → max_load=60; Resistência 30 → max_load=35
  const maxSafeLoad = resistencia * 0.5 + 20;

  return ((physicalJobs * PHYSICAL_COST) + (trainingSessions * TRAINING_COST))
    / maxSafeLoad * 100;  // percentage
}
// > 100% for 3+ weeks → triggers Fadiga Crônica
// > 120% → immediate injury risk check
```

#### Medical Dashboard State (GDD medical-system.md)
- Green: training load < 80%, no injury triggers active, no recent injuries
- Yellow: 1+ injury trigger partially active (e.g. Resistência < 40 but has rest), OR returning from injury (re-injury window)
- Red: 2+ injury triggers simultaneously active, OR Saúde < 25, OR 4+ weeks without rest with physical jobs

#### Rehab Training (GDD medical-system.md)
During recovery, only mental stats may be trained at ×0.5 efficiency:
- **Allowed**: Comunicação, Foco, Aura, Carisma, Mentalidade
- **Blocked**: Vocal, Dança, Resistência, Atuação, Variedade
- Requires Medical Center Lv 2+ AND Physical Therapist present

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
