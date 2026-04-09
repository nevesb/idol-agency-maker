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
| **References Consulted** | ADR-002, ADR-004, ADR-008, ADR-009, show-system.md, setlist-system.md, audience-system.md, stage-formations.md, costume-wardrobe.md, pre-show-briefing.md, music-entities.md |
| **Post-Cutoff APIs Used** | None |
| **Verification Required** | Benchmark 12-member group show with 15-song setlist within 3ms/day budget |

## ADR Dependencies

| Field | Value |
|-------|-------|
| **Depends On** | ADR-002 (Phase 2 dispatches shows), ADR-003 (state slices), ADR-004 (event bus), ADR-008 (song structure + part demands), ADR-009 (Show Director decisions) |
| **Enables** | Show-related epics (setlist builder, rehearsals, audience, costumes) |
| **Blocks** | Performance Event (★) implementation |
| **Ordering Note** | ADR-008 must define SongComposition and partDemands first |

## Context

### Problem Statement

Performance Events (★) are the most complex single-tick computation in the game.
A show processes a setlist music-by-music, part-by-part, with an audience that
reacts dynamically and fatigue accumulating across songs.

**Key design principles:**

1. **No idol substitution mid-show.** The group enters and performs together until
   the end. What changes between songs (and within songs) is the **position** each
   idol occupies — who sings lead, who dances front, who rests behind.

2. **Fatigue comes from the SONG, not from the position.** A ballad costs very
   little fatigue even for the center. A high-energy dance track costs a lot for
   everyone. Each song part has its own vocal_load and dance_load defined by the
   composition (ADR-008) and choreography.

3. **The show lineup is a 3D matrix:** Song × Idol × Part → Position.
   Every position has both vocal and dance components. What changes per position
   is how much of each the idol contributes.

4. **Solo shows are viable.** A solo idol can perform 10 songs if the songs are
   designed to be manageable (light vocal + light dance). The system must support
   1-idol shows and 12-idol group shows with the same data model.

## Decision

### 1. Position Model

Every idol in every part of every song occupies a **position**. A position
defines HOW MUCH vocal and dance the idol performs in that moment:

```typescript
interface Position {
  // How much of the vocal this idol handles (0.0 = silent, 1.0 = solo vocal)
  // Sum of all idol vocal_share in one part should = 1.0
  vocalShare: number;

  // How much of the dance choreography (0.0 = standing still, 1.0 = full choreo)
  danceShare: number;

  // Stage placement (affects audience engagement weight)
  stagePlacement: 'center' | 'front' | 'mid' | 'back' | 'side';
}
```

The **actual fatigue cost** is then:

```
fatigue_for_idol_in_part =
  (song_part.vocalIntensity × position.vocalShare) +
  (song_part.danceIntensity × position.danceShare)
```

This means:
- **Ballad, center position, vocalShare 1.0, danceShare 0.0:**
  fatigue = (low_vocal × 1.0) + (zero_dance × 0.0) = very low
- **Dance track, front dancer, vocalShare 0.1, danceShare 1.0:**
  fatigue = (low_vocal × 0.1) + (high_dance × 1.0) = high
- **Solo bridge with only instrumental:**
  fatigue = (zero_vocal × 0.0) + (high_dance × 1.0) = moderate-high (dance solo)
- **Rest position (back, minimal everything):**
  fatigue = (any_vocal × 0.05) + (any_dance × 0.05) = near zero

### 2. Song Part Demands (from ADR-008)

Each song's composition and choreography define per-part demands:

```typescript
// From ADR-008 SongComposition.partDemands
interface PartDemands {
  vocalIntensity: number;    // 0-10 (0 = instrumental, 10 = belting chorus)
  danceIntensity: number;    // 0-10 (0 = standing, 10 = full choreography)
}

// Examples:
// Soft ballad verse:    { vocalIntensity: 3, danceIntensity: 0 }
// Power ballad chorus:  { vocalIntensity: 8, danceIntensity: 1 }
// Dance track chorus:   { vocalIntensity: 5, danceIntensity: 9 }
// Instrumental bridge:  { vocalIntensity: 0, danceIntensity: 7 } (dance solo)
// Quiet intro:          { vocalIntensity: 1, danceIntensity: 0 }
// Full energy finale:   { vocalIntensity: 9, danceIntensity: 9 }
```

These values are set when the song is composed (arrangement) and choreographed
(ADR-008 creative pipeline). They are **properties of the song**, not of the show.

### 3. Show Lineup: The 3D Matrix

The lineup is the complete assignment of every idol to a position in every part
of every song:

```typescript
interface ShowLineup {
  showId: string;
  // 3D matrix: song → part → idol → position
  assignments: SongLineup[];
}

interface SongLineup {
  songId: string;
  songIndex: number;  // order in setlist
  // For each part of this song, each idol's position
  parts: PartLineup[];
}

interface PartLineup {
  part: SongPart;  // 'intro' | 'verse_1' | 'chorus_1' | etc.
  // Each idol's position in this part
  positions: Map<string, Position>;  // idolId → Position
  // NOTE: sum of all vocalShare should ≈ 1.0
  // NOTE: sum of all danceShare can vary (choreo for N of M members)
}
```

**For a solo show:** the Map has 1 entry per part. The solo idol has
vocalShare: 1.0 and danceShare: 1.0 (or 0.0 for non-dance parts).

**For a group show:** each member has their own Position per part.
The choreography determines how many are actively dancing (danceShare > 0)
vs resting (danceShare ≈ 0.05 = minimal movement at back).

### 4. Within-Song Rotations

The choreography can define rotations WITHIN a song:

```
Song "Starlight Dreams" (group of 6):
  Verse 1:  Yui center (vocal 0.7), Mei front-dance (dance 0.8), others mid
  Chorus 1: Mei center (dance 0.9), Yui back (vocal 0.3, rest), Riko lead-vocal (vocal 0.6)
  Verse 2:  Riko center (vocal 0.6), Yui mid (vocal 0.2, dance 0.3), Mei back (rest)
  Chorus 2: ALL front (vocal 0.16 each, dance 0.5 each) — unity moment
  Bridge:   Instrumental — Saki dance solo (dance 1.0, vocal 0.0), all others back
  Chorus 3: Yui + Mei center duo (vocal 0.4 each, dance 0.5 each), others support
```

This is all encoded in the PartLineup — each part can have completely different
positions for each idol. The matrix IS the choreography.

### 5. Between-Song Rotations

Between songs, the Show Director (ADR-009 decision 10.3.2) can modify the lineup
for the NEXT song based on accumulated fatigue:

```
After song 3, Show Director reads:
  Yui:  fatigue 28 (was center/lead in songs 1-3)
  Mei:  fatigue 22 (was front-dance in songs 1-3)
  Riko: fatigue 8  (was back/support in songs 1-3)

Song 4 is a high-energy dance track. Planned lineup had Yui center again.
Show Director (attr: Stage Presence ≥ 15) decides:
  → Swap Yui to back for song 4 (rest, fatigue cost ~2)
  → Move Riko to center for song 4 (she's fresh, fatigue only 8)
  → Yui returns to center for song 5 (recovered enough)

Modified lineup applied to song 4's PartLineup.
```

The rotation does NOT change who is on stage — only positions within the lineup.

### 6. Show Pipeline (Processing)

```
Show Pipeline (per Performance Event ★):

┌─ PRE-SHOW ───────────────────────────────────────────────┐
│ 1. Load briefing modifiers (per idol) — ADR-009           │
│ 2. Load costume state (per idol, per setlist block)       │
│ 3. Load show lineup (3D matrix from ADR-009 10.3.1)      │
│ 4. Initialize AudienceState (venue + fan club data)       │
│ 5. Initialize fatigue = 0 per idol                        │
│ 6. Load song demands (partDemands from ADR-008 for each   │
│    song in setlist)                                       │
└───────────────────────────────────────────────────────────┘
           │
           ▼
┌─ PER-SONG LOOP (sequential) ─────────────────────────────┐
│ For each song in setlist:                                 │
│                                                           │
│  0. BETWEEN-SONG ADJUSTMENT (except first song)           │
│     → Read Show Director mid-show decision (ADR-009 10.3.2)│
│     → If rotation decided: modify lineup for this song    │
│     → Small recovery for idols in rest last song: −2 fat  │
│                                                           │
│  FOR EACH PART of the song:                               │
│                                                           │
│    1. READ PART DEMANDS from song composition             │
│       → vocalIntensity (0-10)                             │
│       → danceIntensity (0-10)                             │
│                                                           │
│    2. READ LINEUP for this song × this part               │
│       → Each idol's Position: vocalShare, danceShare,     │
│         stagePlacement                                    │
│                                                           │
│    3. COMPUTE PERFORMANCE PER IDOL                        │
│                                                           │
│       vocal_score = idol.vocal × mastery × vocal_fit      │
│                     × (1 - fatigue_penalty)               │
│                     × briefing_mod × costume_vocal_mod    │
│       Weighted by: position.vocalShare                    │
│                                                           │
│       dance_score = idol.dance × mastery × expression     │
│                     × (1 - fatigue_penalty)               │
│                     × briefing_mod × costume_visual_mod   │
│       Weighted by: position.danceShare                    │
│                                                           │
│       presence_score = idol.charisma × idol.aura          │
│                        × stagePlacement_mult              │
│       (center: ×1.5, front: ×1.2, mid: ×1.0,            │
│        back: ×0.6, side: ×0.7)                           │
│                                                           │
│       idol_part_score = (vocal_score × vocalShare         │
│                         + dance_score × danceShare)       │
│                         × presence_mult                   │
│                         × production_quality              │
│                         × trait_modifiers                 │
│                                                           │
│    4. APPLY CONTEXT MODIFIERS (show-wide)                 │
│       → pacing_score (energy transition from previous song)│
│       → audience_energy (current audience state)          │
│       → novelty (song play_count decay)                   │
│       → random_moment_chance (seeded: viral moment?)      │
│                                                           │
│    5. ACCUMULATE PART SCORES                              │
│       → part_score = sum(idol_part_scores) / normalizer   │
│                                                           │
│  → song_score = weighted_sum(part_scores)                 │
│    Weights: chorus > bridge > verse > intro/outro         │
│    (Same weights as ADR-008 PART_QUALITY_WEIGHTS)         │
│                                                           │
│  POST-SONG:                                               │
│  → Update audience (engagement, energy, emotional state)  │
│                                                           │
│  → Apply fatigue PER IDOL:                                │
│    For each part this idol participated in:               │
│      fatigue += partDemands.vocalIntensity                │
│                 × position.vocalShare × VOCAL_FATIGUE_RATE│
│               + partDemands.danceIntensity                │
│                 × position.danceShare × DANCE_FATIGUE_RATE│
│                                                           │
│    VOCAL_FATIGUE_RATE = 0.3 (vocal tires slower)          │
│    DANCE_FATIGUE_RATE = 0.5 (physical tires faster)       │
│                                                           │
│    Examples with these rates:                             │
│    Ballad center (vocal 8, share 1.0, dance 0, share 0): │
│      fatigue += 8 × 1.0 × 0.3 + 0 = 2.4 per part        │
│      9 parts → ~21.6 total. Very manageable.              │
│                                                           │
│    Dance track front (vocal 3, share 0.2, dance 9, 1.0): │
│      fatigue += 3×0.2×0.3 + 9×1.0×0.5 = 0.18 + 4.5      │
│      = 4.68 per part. 9 parts → ~42.                      │
│      After 3 such songs: fatigue ~126. Very tired.        │
│                                                           │
│    Rest position (vocal 3, share 0.05, dance 9, 0.05):   │
│      fatigue += 3×0.05×0.3 + 9×0.05×0.5 = 0.045 + 0.225 │
│      = 0.27 per part. 9 parts → ~2.4.                    │
│      Near zero — effective rest.                          │
│                                                           │
│  → Compute fatigue_penalty for next song:                 │
│    fatigue < 30:  penalty 0.00 (fresh)                    │
│    fatigue 30-50: penalty 0.05                            │
│    fatigue 50-70: penalty 0.15                            │
│    fatigue 70-90: penalty 0.30                            │
│    fatigue > 90:  penalty 0.50                            │
│                                                           │
│  → emit('show:songPerformed', { songId, scores, fatigue })│
│  → Costume durability −1 per song worn                    │
│                                                           │
│  → IS THIS AN MC/INTERLUDE SLOT?                          │
│    If yes: all idols fatigue −5 (rest during MC)          │
│    Costume change if planned for this slot                │
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
│ 3. Apply XP per idol per song:                            │
│    xp = idol_song_score × SHOW_XP_FACTOR                  │
│    (Higher contribution = more XP. Rest position = low XP) │
│                                                           │
│ 4. Apply wellness impact:                                 │
│    Each idol:                                             │
│      health −= total_fatigue × 0.3                        │
│      stress += total_fatigue × 0.2                        │
│      motivation += (grade_mult − 0.5) × 10                │
│    (Good grade boosts motivation. Bad grade lowers it.)    │
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

### 7. Solo Show Support

A solo idol performing 10 songs uses the same 3D matrix, but with only 1 idol:

```
Solo show example — idol Yui, 10 songs:

Song 1 (uptempo pop):
  Verse 1:  { vocalShare: 1.0, danceShare: 0.6, stage: 'center' }
  Chorus 1: { vocalShare: 1.0, danceShare: 0.8, stage: 'center' }
  ...
  Fatigue per song: moderate (vocal 6 × 1.0 × 0.3 + dance 7 × 0.7 × 0.5 = 4.25/part)
  9 parts ≈ 38 fatigue. After 3 songs: ~114. Needs recovery.

Song 4 (ballad — designed light):
  All parts: { vocalShare: 1.0, danceShare: 0.0, stage: 'center' }
  partDemands: { vocalIntensity: 4, danceIntensity: 0 }
  Fatigue per song: 4 × 1.0 × 0.3 × 9 = 10.8. Recovery opportunity.

Song 5 (acoustic, sitting on stool):
  All parts: { vocalShare: 1.0, danceShare: 0.0, stage: 'center' }
  partDemands: { vocalIntensity: 3, danceIntensity: 0 }
  Fatigue: 8.1. Further recovery.

→ A well-designed solo setlist alternates heavy and light songs.
   The Music Director's (ADR-009) job is to compose songs with varied demands
   so the idol can sustain a full show.
```

### 8. Fatigue as Emergent from Song Design

**There are no fixed fatigue costs per position.** All fatigue emerges from:

```
fatigue = Σ (song_part.vocalIntensity × idol.vocalShare × VOCAL_FATIGUE_RATE
            + song_part.danceIntensity × idol.danceShare × DANCE_FATIGUE_RATE)
          for all parts of the song
```

This means:
- **Identical position, different songs = different fatigue.**
  Center in a ballad ≠ center in a dance anthem.
- **Same song, different positions = different fatigue.**
  Lead vocal in a chorus (vocal high, dance low) ≠ front dancer in a chorus (vocal low, dance high).
- **Song design IS fatigue design.**
  The Music Director (ADR-009) and the composer control how demanding each song is.
  A smart A&R creates a diverse catalogue: some light songs, some heavy,
  specifically so the Show Director can build setlists that manage fatigue.
- **Solo shows require lighter songs.**
  If all 10 songs are high-energy dance tracks, even a top idol can't sustain it.
  The A&R must create ballads and acoustic numbers for solo setlists.

### 9. Audience Dynamics

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

// Audience energy follows song demands:
// High danceIntensity song → audience energy rises
// Ballad → audience energy dips (but engagement can rise via emotion)
// Bad performance → energy drops sharply
// Encore → energy floor 70 (fans are already hyped)

// Emotional state transitions:
// cold → warm: engagement > 30
// warm → hot: engagement > 60 AND energy > 50
// hot → euphoric: engagement > 80 AND last song was S-grade
// Any → cold: if 2 consecutive songs scored D or F
```

### 10. Part Weights for Song Score

```
Part weights (sum = 1.0):
  intro:       0.05
  verse_1:     0.10
  pre_chorus:  0.08
  chorus_1:    0.18   (hook — highest weight)
  verse_2:     0.08
  chorus_2:    0.15
  bridge:      0.12   (contrast — key moment for drama)
  chorus_3:    0.16   (climax)
  outro:       0.08

Chorus total ≈ 49%. The chorus performances matter most.
```

## Performance Budget

- Pre-show setup: <0.3ms
- Per-song: ~0.15ms (parts × idols × computations)
  - 15 songs × 0.15ms = 2.25ms
- Post-show: <0.5ms
- **Total: ~3ms per show** (within budget)

For 12-member groups: 12 idols × 9 parts × score computation per song.
15 songs = ~1,620 score computations total — trivial for JS.

## Tuning Knobs

| Knob | Default | Range | Effect |
|------|---------|-------|--------|
| `VOCAL_FATIGUE_RATE` | 0.3 | 0.1-0.5 | How fast vocal effort tires idols |
| `DANCE_FATIGUE_RATE` | 0.5 | 0.2-0.8 | How fast physical effort tires idols |
| `FATIGUE_PENALTY_THRESHOLDS` | [30,50,70,90] | adjustable | When penalties kick in |
| `FATIGUE_PENALTY_VALUES` | [0,0.05,0.15,0.30,0.50] | adjustable | How much fatigue hurts |
| `MC_REST_RECOVERY` | 5 | 2-10 | Fatigue recovered during MC/interlude |
| `ENCORE_BASE_CHANCE` | 0.3 | 0.1-0.6 | Base probability of encore trigger |
| `STAGE_PLACEMENT_MULT` | center:1.5, front:1.2, mid:1.0, back:0.6, side:0.7 | adjustable | Audience engagement by placement |

## Alternatives Considered

### Alternative 1: Fixed fatigue cost per position (original ADR-007 v2)

- **Description**: center = 12 fatigue, lead_vocal = 10, rest = 1, regardless of song.
- **Rejection Reason**: A ballad center costs the same as a dance anthem center, which
  is wrong. Fatigue must come from the song's demands, not from the position label.
  Songs are the unit of design; positions are just how idols distribute the work.

### Alternative 2: Idol substitution mid-show

- **Rejection Reason**: Not realistic for idol industry. Groups perform together.
  What changes is roles/positions, not who is on stage.

### Alternative 3: 2D lineup (Song × Idol → fixed role per song)

- **Description**: Each idol has one role for the entire song.
- **Rejection Reason**: Misses within-song rotations (center changes between verse
  and chorus). The choreography IS the within-song position changes. The 3D matrix
  (Song × Part × Idol → Position) captures this accurately.

## Consequences

### Positive
- Fatigue is physically accurate (depends on actual demands, not labels)
- Same model works for solo and group shows
- Song design directly creates show-level strategy (light vs heavy songs)
- Within-song rotations are part of the choreography, not a separate mechanic
- A&R and Show Director roles are deeply connected (song design enables show quality)

### Negative
- 3D matrix is large (15 songs × 9 parts × 12 idols = 1,620 positions)
- Complex to visualize in UI (needs good abstraction for player)
- Tuning 2 fatigue rates + 5 penalty thresholds is delicate

### Risks
- **Risk**: 3D lineup matrix is too complex for NPC Show Director to fill
  - **Mitigation**: ADR-009 10.3.1 builds lineup based on templates and heuristics.
    NPC fills "center" and "rest" broadly; per-part detail comes from choreography.
- **Risk**: Player overwhelmed by per-part position setting
  - **Mitigation**: UI shows per-SONG lineup. Per-part is auto-filled from choreography.
    Player only overrides at song level ("Yui is center for this song").
    Within-song rotations come from the choreography design, not manual player input.

## GDD Requirements Addressed

| GDD System | Requirement | How This ADR Addresses It |
|------------|-------------|--------------------------|
| show-system.md | Per-music multi-layer pipeline | Sequential per-part loop with score computation |
| show-system.md | Intra-show fatigue sequential | Fatigue from song demands × position shares |
| show-system.md | Show revenue settlement | Post-show: tickets + merch − production |
| audience-system.md | Mutable in-session AudienceState | Created at show start, discarded after |
| audience-system.md | Engagement fluctuates per song | Updated after each song |
| audience-system.md | Encore trigger | Post-show chance based on engagement |
| setlist-system.md | Mastery read per music | Performance calculation uses mastery |
| stage-formations.md | Positions per idol per music | 3D lineup matrix |
| stage-formations.md | Choreography for N of M members | danceShare = 0 for resting members |
| costume-wardrobe.md | Durability decrement per song | −1 per song worn |
| pre-show-briefing.md | Modifier per idol | Applied in performance calculation |
| music-entities.md | Song structure with parts | 9 parts with per-part demands |
| music-entities.md | vocal_fit from tessitura | Applied to vocal_score calculation |
| staff-functional.md | Production quality | production_quality modifier from packages |

## Related Decisions

- [ADR-002](adr-002-simulation-pipeline.md) — Phase 2 dispatches shows
- [ADR-004](adr-004-event-system.md) — show events emitted to bus
- [ADR-005](adr-005-performance-budgets.md) — 3ms/day budget
- [ADR-008](adr-008-music-production.md) — song structure, part demands, choreography
- [ADR-009](adr-009-decision-catalog.md) — Show Director decisions (10.1-10.5)
