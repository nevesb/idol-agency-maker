# ADR-007: Show Simulation Pipeline

## Status
Proposed

## Date
2026-04-07

## Engine Compatibility

| Field | Value |
|-------|-------|
| **Engine** | SvelteKit 2.50 + Svelte 5 |
| **Domain** | Simulation / Shows |
| **Knowledge Risk** | LOW |
| **References Consulted** | ADR-002, ADR-004, show-system.md, setlist-system.md, audience-system.md, stage-formations.md, costume-wardrobe.md, pre-show-briefing.md |
| **Post-Cutoff APIs Used** | None |
| **Verification Required** | Benchmark 12-member group show with 15-song setlist within 3ms/day budget |

## ADR Dependencies

| Field | Value |
|-------|-------|
| **Depends On** | ADR-002 (Phase 2 dispatches shows), ADR-003 (state slices), ADR-004 (event bus) |
| **Enables** | Show-related epics (setlist builder, rehearsals, audience, costumes) |
| **Blocks** | Performance Event (★) implementation |
| **Ordering Note** | None — can be implemented in parallel with other feature ADRs |

## Context

### Problem Statement

Performance Events (★) are the most complex single-tick computation in the game.
A show processes a setlist music-by-music through 3 multiplicative layers (execution,
context, moments), with an audience that reacts dynamically and intra-show fatigue
accumulating sequentially. Shows also involve costumes, formations, briefing modifiers,
stage production, and mid-show substitutions.

This ADR defines the pipeline that processes a show within the Phase 2 day-tick
budget (3ms per show-day).

## Decision

### Sequential Music Pipeline with Accumulated State

Shows are processed as a **sequential pipeline** — each music in the setlist is
processed in order, with state (fatigue, audience engagement) carrying forward.
This matches the GDD requirement that fatigue is a running accumulator.

```
Show Pipeline (per Performance Event ★):

┌─ PRE-SHOW ─────────────────────────────┐
│ 1. Load briefing modifiers (per idol)   │  // ADR-004: read from briefing result
│ 2. Load costume state (per idol)        │  // durability, visual_hype
│ 3. Load formation presets               │  // role assignments per music
│ 4. Initialize AudienceState             │  // from venue + fan club data
│ 5. Initialize fatigue = 0 per idol      │
└─────────────────────────────────────────┘
           │
           ▼
┌─ PER-MUSIC LOOP (sequential) ──────────┐
│ For each music in setlist:              │
│                                         │
│  Layer 1: EXECUTION                     │
│   stat_match × mastery × wellness ×     │
│   fatigue_mult × vocal_fit × trait_mod  │
│                                         │
│  Layer 2: CONTEXT                       │
│   briefing_mod × costume_mod ×          │
│   formation_role_fit × production_qual  │
│                                         │
│  Layer 3: MOMENT                        │
│   pacing_score × audience_energy ×      │
│   novelty × random_moment_chance        │
│                                         │
│  → music_score = L1 × L2 × L3          │
│  → update audience (engagement, energy) │
│  → update fatigue per idol              │
│  → emit('show:musicPerformed', ...)     │
│  → check substitution triggers          │
└─────────────────────────────────────────┘
           │
           ▼
┌─ POST-SHOW ────────────────────────────┐
│ 1. Compute show grade (avg of musics)   │
│ 2. Check encore (audience engagement)   │
│ 3. Settle revenue (tickets + merch)     │
│ 4. Apply XP gain per idol              │
│ 5. Apply wellness impact (fatigue→HP)   │
│ 6. Update fame                          │
│ 7. Fan conversion (audience → fans)     │
│ 8. Costume durability decrement         │
│ 9. emit('show:completed', ...)          │
└─────────────────────────────────────────┘
```

### Performance Budget

- Pre-show setup: <0.3ms
- Per-music loop: <0.1ms per music (15 songs × 0.1ms = 1.5ms)
- Post-show: <0.5ms
- **Total: ~2.3ms per show** (within 3ms/day budget)

For 12-member groups, Layer 1 iterates 12 idols per music:
12 idols × 15 songs × 3 layers = 540 multiplications — trivial for JS.

### Audience as In-Session Struct

`AudienceState` exists only during show processing and is discarded after settlement.
It is NOT part of the GameState slices (ADR-003). This avoids persisting transient
show simulation data.

```typescript
interface AudienceState {
  total: number;
  composition: { casual: number; dedicated: number; hardcore: number; general: number };
  engagement: number;      // 0-100, accumulates per music
  energy: number;          // 0-100, fluctuates per music
  emotionalState: 'cold' | 'warm' | 'hot' | 'euphoric';
  lightstickDistribution: Map<string, number>;  // idolId → normalized weight
}
```

## Alternatives Considered

### Alternative 1: Parallel music processing

- **Rejection Reason**: Fatigue is sequential (music N affects music N+1). Cannot parallelize.

### Alternative 2: Simplified show scoring (single formula, no per-music)

- **Rejection Reason**: GDD requires per-music feedback, Moment Engine needs per-music drama scores, and audience engagement must fluctuate throughout the show.

## Consequences

### Positive
- Faithful to GDD's music-by-music show experience
- Moment Engine gets rich per-music data for show headlines
- Audience energy creates emergent drama (cold start → gradual warmup → encore)

### Negative
- Most complex single-system computation in the game
- Sequential processing prevents optimization via parallelism

## GDD Requirements Addressed

| GDD System | Requirement | How This ADR Addresses It |
|------------|-------------|--------------------------|
| show-system.md | Per-music 3-layer pipeline | Sequential loop with L1×L2×L3 per music |
| show-system.md | Intra-show fatigue sequential | Running accumulator, not parallelizable |
| show-system.md | Mid-show substitution (max 2-3) | Check triggers after each music |
| audience-system.md | Mutable in-session AudienceState | Created at show start, discarded after settlement |
| setlist-system.md | Mastery table read per music | Layer 1 reads mastery level for stat_match |
| costume-wardrobe.md | Durability decrement per show | Post-show step decrements all equipped costumes |
| pre-show-briefing.md | Modifier clamped 0.85-1.15 | Layer 2 reads briefing_mod per idol |
| stage-formations.md | Role fit per music | Layer 2 reads formation role assignment |
| staff-functional.md | Production quality modifier | Layer 2 reads producao_total |

## Related Decisions

- [ADR-002](adr-002-simulation-pipeline.md) — Phase 2 dispatches shows
- [ADR-004](adr-004-event-system.md) — show events emitted to bus
- [ADR-005](adr-005-performance-budgets.md) — 3ms/day budget for shows
