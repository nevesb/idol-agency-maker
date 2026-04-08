# ADR-007: Show Simulation Pipeline

## Status
Proposed

## Date
2026-04-08

## Engine Compatibility

| Field | Value |
|-------|-------|
| **Engine** | SvelteKit 2.50 + Svelte 5 |
| **Domain** | Simulation / Shows |
| **Knowledge Risk** | LOW |
| **References Consulted** | ADR-002, ADR-004, ADR-009, show-system.md, setlist-system.md, audience-system.md, stage-formations.md, costume-wardrobe.md, pre-show-briefing.md, music-entities.md |
| **Post-Cutoff APIs Used** | None |
| **Verification Required** | Benchmark 12-member group show with 15-song setlist within 3ms/day budget |

## ADR Dependencies

| Field | Value |
|-------|-------|
| **Depends On** | ADR-002 (Phase 2 dispatches shows), ADR-003 (state slices), ADR-004 (event bus), ADR-009 (Show Director decisions) |
| **Enables** | Show-related epics (setlist builder, rehearsals, audience, costumes) |
| **Blocks** | Performance Event (★) implementation |
| **Ordering Note** | None — can be implemented in parallel with other feature ADRs |

## Context

### Problem Statement

Performance Events (★) are the most complex single-tick computation in the game.
A show processes a setlist music-by-music through 3 multiplicative layers, with an
audience that reacts dynamically and intra-show fatigue accumulating sequentially.

**Key design principle:** There is NO idol substitution mid-show. The group enters
and performs together until the end. What changes between songs is the **escalação**
— who sings lead vocal, who dances in front, who rests in a support position behind.
Within a song, the choreography may have planned rotations (center swaps between
verse and chorus). Between songs, roles can change completely to manage fatigue.

The Show Director NPC (or player) can make these role rotations during the show,
based on the ADR-009 decision flowcharts (10.3.1 and 10.3.2).

## Decision

### Sequential Music Pipeline with Role-Based Escalação

Shows are processed as a **sequential pipeline** per music. Each idol has an
**escalação** (role assignment) per music that determines their contribution and
fatigue cost. Roles rotate between songs — NOT idols themselves.

### 1. Song Structure and Positions

Each song has a structure of parts, each with different demands:

```
Song Structure: Intro → Verse → Pre-Chorus → Chorus → Verse → Chorus → Bridge → Chorus → Outro

Each part classifies demands:
  - Vocal intensity: low / medium / high (Chorus = high, Verse = medium, Bridge = high)
  - Dance intensity: low / medium / high (Intro choreo = high, Ballad verse = low)
  - Stage position: front / mid / back (affects visibility × audience engagement)
```

### 2. Role Positions Per Song

Each idol is assigned ONE of these roles per song in the escalação:

```typescript
type SongRole =
  | 'center'          // Front center. Max vocal + dance exposure. Fatigue: HIGH.
  | 'lead_vocal'      // May be front or mid. Primary singing. Vocal fatigue: HIGH, dance: LOW.
  | 'front_dance'     // Front row dancing. Dance fatigue: HIGH, vocal: LOW (backing).
  | 'support'         // Mid row. Moderate vocal + dance. Fatigue: MEDIUM.
  | 'back_vocal'      // Back row. Backing vocals only. Fatigue: LOW.
  | 'rest_position';  // Back/sides. Minimal choreo, light backing. Fatigue: MINIMAL.
                       // Used for fatigue recovery between demanding songs.

// Fatigue cost per role per song:
const FATIGUE_COST: Record<SongRole, number> = {
  center: 12,
  lead_vocal: 10,
  front_dance: 10,
  support: 6,
  back_vocal: 3,
  rest_position: 1,
};
```

### 3. Escalação: Role Assignments Per Music

The escalação is a **2D matrix**: songs × idols → role.

```typescript
interface ShowEscalacao {
  showId: string;
  // One entry per song in the setlist
  songAssignments: SongAssignment[];
}

interface SongAssignment {
  songId: string;
  songIndex: number;           // position in setlist
  // Role for each idol in this song
  roles: Map<string, SongRole>;  // idolId → role
  // Within-song rotations (planned in choreography)
  intraRotations?: IntraSongRotation[];
}

// Within a single song, the choreography may swap positions
// Example: verse has Yui center, chorus has Mei center
interface IntraSongRotation {
  part: 'verse' | 'pre_chorus' | 'chorus' | 'bridge' | 'outro';
  swaps: { idolId: string; fromRole: SongRole; toRole: SongRole }[];
}
```

### 4. Choreography Is Designed for N Idols

A song's choreography specifies how many idols perform the dance:

```typescript
interface SongChoreography {
  songId: string;
  activeDancers: number;       // e.g., 5 dancers for a group of 8
  totalMembers: number;        // group size
  // Idols not in active choreo go to back_vocal or rest_position
  // This creates natural fatigue rotation:
  // Song 1: A,B,C,D,E dance → F,G,H rest
  // Song 2: A,B,F,G,H dance → C,D,E rest (C,D,E recover)
}
```

This is a key fatigue management tool: for a group of 8 with 5-dancer choreos,
each idol can rest for ~3/8 of the songs if rotated properly.

### 5. Show Pipeline (Processing)

```
Show Pipeline (per Performance Event ★):

┌─ PRE-SHOW ───────────────────────────────────────────────┐
│ 1. Load briefing modifiers (per idol) — ADR-009 10.x.x   │
│ 2. Load costume state (per idol, per block if changes)    │
│ 3. Load escalação (from ADR-009 10.3.1 output)           │
│ 4. Initialize AudienceState (venue + fan club data)       │
│ 5. Initialize fatigue = 0 per idol                        │
│ 6. Load intra-song rotations (from choreography)          │
└───────────────────────────────────────────────────────────┘
           │
           ▼
┌─ PER-MUSIC LOOP (sequential) ────────────────────────────┐
│ For each song in setlist:                                 │
│                                                           │
│  0. BETWEEN-SONG ROTATION CHECK (except first song)       │
│     → Read mid-show rotation decisions (ADR-009 10.3.2)   │
│     → If rotation triggered: swap roles in escalação       │
│     → Rotated idol gets small fatigue benefit (−2)         │
│                                                           │
│  1. READ ESCALAÇÃO for this song                          │
│     → Each idol's role: center/lead_vocal/front_dance/    │
│       support/back_vocal/rest_position                    │
│                                                           │
│  FOR EACH PART of the song (Intro→Verse→...→Outro):      │
│                                                           │
│    2. CHECK INTRA-SONG ROTATIONS                          │
│       → If choreography specifies rotation for this part: │
│         swap roles (e.g., center changes for chorus)      │
│                                                           │
│    3. Layer 1: EXECUTION (per idol)                       │
│       → Compute performance based on role:                │
│         Center: Vocal×0.3 + Dance×0.3 + Charisma×0.2     │
│                 + Aura×0.1 + Expression×0.1               │
│         Lead Vocal: Vocal×0.5 + Communication×0.2         │
│                     + Expression×0.2 + Charisma×0.1       │
│         Front Dance: Dance×0.5 + Expression×0.2           │
│                      + Stamina×0.2 + Aura×0.1             │
│         Support: avg(Vocal, Dance, Expression) × 0.8      │
│         Back Vocal: Vocal×0.6 + Communication×0.4 × 0.5   │
│         Rest Position: minimal contribution × 0.2          │
│       → Apply: mastery × wellness × fatigue_mult × vocal_fit │
│       → Apply trait modifiers (Clutch in finale, etc.)    │
│                                                           │
│    4. Layer 2: CONTEXT (show-wide modifiers)              │
│       → briefing_mod (per idol, from pre-show)            │
│       → costume_mod (visual_hype from equipped costume)   │
│       → formation_role_fit (how well idol fits their role)│
│       → production_quality (sound × light × stage)        │
│                                                           │
│    5. Layer 3: MOMENT (emergent drama)                    │
│       → pacing_score (energy transition from previous song)│
│       → audience_energy (current audience state)          │
│       → novelty (song play_count decay)                   │
│       → random_moment_chance (seeded: viral moment?)      │
│                                                           │
│  → part_score = avg(idol_scores) for all idols in this part│
│  → song_score accumulates part scores (weighted by part    │
│    importance: Chorus > Verse > Bridge > Intro/Outro)     │
│                                                           │
│  POST-SONG:                                               │
│  → Update audience (engagement, energy, emotional state)  │
│  → Apply fatigue: idol.fatigue += FATIGUE_COST[role]      │
│  → Compute fatigue_mult for next song:                    │
│    fatigue < 30: ×1.0 (fresh)                             │
│    fatigue 30-50: ×0.95 (slightly tired)                  │
│    fatigue 50-70: ×0.85 (noticeably tired)                │
│    fatigue 70-90: ×0.70 (exhausted)                       │
│    fatigue > 90: ×0.50 (barely performing)                │
│  → emit('show:musicPerformed', { songId, scores, fatigue })│
│  → Costume durability −1 per song worn                     │
│                                                           │
│  → IS THIS AN MC/INTERLUDE SLOT?                          │
│    If yes: all idols fatigue −5 (rest during MC)          │
│    Costume change if planned for this MC slot              │
└───────────────────────────────────────────────────────────┘
           │
           ▼
┌─ ENCORE CHECK ────────────────────────────────────────────┐
│ encore_chance = audience.engagement × audience.hardcore%   │
│                 × venue_mult × ENCORE_BASE_CHANCE          │
│ If encore triggered:                                      │
│   → Process encore songs with current fatigue (no reset)  │
│   → Audience in 'euphoric' state = max engagement         │
│   → Fatigue very high = real risk of poor performance     │
│     (genuine drama: exhausted but fans demand more)       │
└───────────────────────────────────────────────────────────┘
           │
           ▼
┌─ POST-SHOW ───────────────────────────────────────────────┐
│ 1. Compute show grade:                                    │
│    show_score = weighted_avg(song_scores)                  │
│    Weights: opener×1.2, closer×1.3, encore×1.5, rest×1.0 │
│    Grade: S (>0.90), A (>0.80), B (>0.70), C (>0.60),    │
│           D (>0.45), F (<0.45)                            │
│                                                           │
│ 2. Settle revenue:                                        │
│    tickets = venue.capacity × fill_rate × ticket_price    │
│    merch_show = fan_club.size × show_merch_rate × grade   │
│    revenue = tickets + merch_show − production_cost       │
│                                                           │
│ 3. Apply XP per idol:                                     │
│    xp = performance × SHOW_XP_FACTOR × role_mult          │
│    role_mult: center ×1.5, lead_vocal ×1.3, front ×1.2,  │
│              support ×1.0, back ×0.7, rest ×0.3           │
│                                                           │
│ 4. Apply wellness impact:                                 │
│    Each idol: health −= fatigue × 0.3                     │
│               stress += fatigue × 0.2                     │
│               motivation += (grade_mult − 0.5) × 10       │
│    (Good grade = motivation up. Bad grade = motivation down)│
│                                                           │
│ 5. Update fame: per idol + per group                      │
│    fame_delta = grade × visibility × audience_size_factor  │
│                                                           │
│ 6. Fan conversion:                                        │
│    new_casuals = audience.general × conversion_rate × grade│
│    → Added to idol/group fan clubs                        │
│                                                           │
│ 7. emit('show:completed', { showId, grade, revenue, ... })│
└───────────────────────────────────────────────────────────┘
```

### 6. Fatigue as Core Show Mechanic

Fatigue is the central tension of a show. The player/Show Director must balance:
- **Star exposure** (best idols in center/lead = higher score per song)
- **Fatigue management** (best idols tire fastest if never rotated)
- **Audience engagement** (audience wants the stars, but tired stars perform worse)

The optimal strategy is NOT "best idol always center" — it's strategic rotation
that keeps stars fresh for the most important songs (opener, closer, encore).

```
Example: 8-member group, 10-song show
  BAD strategy: Yui (best) center for all 10 songs
    → Fatigue: 12×10 = 120. By song 7: ×0.50 multiplier. Grade: C.
  
  GOOD strategy: Yui center for songs 1,2 (opener), rest 3,4,5, center 8,9,10 (closer+encore)
    → Songs 1-2: fatigue 24. ×1.0. Peak performance.
    → Songs 3-5: fatigue 27 (rest_position 1×3). Recovery.
    → Songs 8-10: fatigue 63 (24+3+12×3). ×0.85. Still strong for closer.
    → Grade: A- (opener and closer were great, mid was decent with other members).
```

### 7. Audience Dynamics

`AudienceState` is transient — created at show start, discarded after settlement.

```typescript
interface AudienceState {
  total: number;
  composition: { casual: number; dedicated: number; hardcore: number; general: number };
  engagement: number;      // 0-100, accumulates per song
  energy: number;          // 0-100, fluctuates based on song energy
  emotionalState: 'cold' | 'warm' | 'hot' | 'euphoric';
  lightstickDistribution: Map<string, number>;  // idolId → share (sum = 1.0)
}

// Audience energy transitions:
// High-energy song → energy rises
// Ballad → energy dips (but engagement can rise via emotion)
// Bad performance → energy drops sharply
// Encore → energy floor 70 (fans are already hyped)

// Emotional state transitions:
// cold → warm: when engagement > 30
// warm → hot: when engagement > 60 AND energy > 50
// hot → euphoric: when engagement > 80 AND high-energy song scored S
// Any → cold: if 2+ consecutive songs scored D or F
```

### 8. Within-Song Part Weighting

Not all parts of a song contribute equally to the song score:

```
Part weights (sum = 1.0):
  Intro:       0.05 (first impression, brief)
  Verse 1:     0.10 (build)
  Pre-Chorus:  0.08 (transition)
  Chorus 1:    0.18 (hook — highest weight)
  Verse 2:     0.08 (development)
  Chorus 2:    0.15 (reinforcement)
  Bridge:      0.12 (contrast — key moment for drama)
  Chorus 3:    0.16 (climax)
  Outro:       0.08 (landing)
```

The Chorus is worth ~49% of the song score. This means:
- Lead Vocal and Center during Chorus matter MOST
- A rotation that puts the best vocalist as Lead Vocal for Chorus
  but rests her during Verses is an advanced strategy

## Performance Budget

- Pre-show setup: <0.3ms
- Per-song: ~0.15ms (parts loop × roles × 3 layers)
  - 15 songs × 0.15ms = 2.25ms
- Post-show: <0.5ms
- **Total: ~3ms per show** (within budget)

For 12-member groups: 12 idols × 9 parts × 3 layers = 324 multiplications per song.
15 songs = 4,860 multiplications total — trivial for JS.

## Alternatives Considered

### Alternative 1: Idol substitution mid-show (original ADR-007)

- **Description**: Replace an idol with a backup member between songs.
- **Rejection Reason**: Not realistic for idol industry. Groups enter and perform
  together. What changes is ROLE (who sings lead, who dances front), not WHO is on
  stage. Substitution is for sports, not concerts.

### Alternative 2: Simplified show scoring (single formula, no per-music)

- **Rejection Reason**: GDD requires per-music feedback, Moment Engine needs per-music
  drama scores, and audience engagement must fluctuate throughout the show. Per-part
  scoring enables the intra-song rotation mechanic.

### Alternative 3: Parallel music processing

- **Rejection Reason**: Fatigue is sequential (music N affects music N+1). Audience
  state carries forward. Cannot parallelize.

## Consequences

### Positive
- Fatigue rotation creates deep tactical gameplay (FM match engine equivalent)
- Per-part scoring enables rich Moment Engine data (specific chorus, bridge moments)
- Audience dynamics create emergent drama (cold start → warmup → encore)
- NPC Show Director (ADR-009) can automate rotations for delegated shows
- Choreography designed for N of M members enables natural rest cycles

### Negative
- Most complex single-system computation in the game
- Escalação matrix (songs × members × parts) requires careful UI representation
- Sequential processing prevents parallelism optimization

### Risks
- **Risk**: Per-part scoring may be over-detailed for player perception
  - **Mitigation**: UI shows per-SONG results. Per-part is internal for Moment Engine.
    Player sees "Chorus was the highlight" without seeing the part-by-part math.
- **Risk**: Fatigue tuning is hard to balance
  - **Mitigation**: FATIGUE_COST and fatigue_mult thresholds are tuning knobs.
    Playtesting will adjust. Start conservative (lower fatigue) and increase.

## GDD Requirements Addressed

| GDD System | Requirement | How This ADR Addresses It |
|------------|-------------|--------------------------|
| show-system.md | Per-music 3-layer pipeline | Sequential per-part loop with L1×L2×L3 |
| show-system.md | Intra-show fatigue sequential | Running accumulator per idol with role-based cost |
| show-system.md | Show revenue settlement | Post-show: tickets + merch − production |
| show-system.md | XP gain per idol per music | Role-weighted XP in post-show |
| audience-system.md | Mutable in-session AudienceState | Created at show start, discarded after |
| audience-system.md | Engagement delta per music | Updated after each song based on score + energy |
| audience-system.md | Encore trigger | Post-show chance based on engagement × hardcore% |
| setlist-system.md | Mastery table read per music | Layer 1 reads mastery for stat_match |
| setlist-system.md | Pacing score between songs | Layer 3 reads energy_transition_quality |
| stage-formations.md | Role fit per idol per music | Layer 2: formation_role_fit modifier |
| stage-formations.md | Choreography for N of M members | activeDancers < totalMembers = rest rotation |
| costume-wardrobe.md | Durability decrement per song | −1 durability per song worn |
| costume-wardrobe.md | Costume changes in MC slots | Swap costume_mod during MC interlude |
| pre-show-briefing.md | Modifier clamped 0.85-1.15 | Layer 2: briefing_mod per idol |
| staff-functional.md | Production quality modifier | Layer 2: producao_total from packages |
| music-entities.md | Song structure parts | Intro→Verse→...→Outro with per-part weights |
| music-entities.md | vocal_fit discrete lookup | Layer 1: tessitura compatibility check |

## Related Decisions

- [ADR-002](adr-002-simulation-pipeline.md) — Phase 2 dispatches shows
- [ADR-004](adr-004-event-system.md) — show events emitted to bus
- [ADR-005](adr-005-performance-budgets.md) — 3ms/day budget for shows
- [ADR-009](adr-009-decision-catalog.md) — Show Director decisions (10.1-10.5)
  define escalação, rotations, setlist, costumes
