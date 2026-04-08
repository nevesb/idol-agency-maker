# ADR-008: Music Production Architecture

## Status
Proposed

## Date
2026-04-08

## ADR Dependencies

| Field | Value |
|-------|-------|
| **Depends On** | ADR-002 (weekly tick), ADR-003 (MusicSlice), ADR-004 (events), ADR-009 (Music Director decisions) |
| **Enables** | Music production epics, show pipeline (ADR-007 consumes finished songs) |
| **Blocks** | None |

## Context

### Problem Statement

Music production is the pipeline that creates the songs performed in shows and
released on charts. Each song has 3 creative parts (Composition, Lyrics, Arrangement)
that can be done by different NPCs in parallel — or sequentially by a single NPC.
After the creative phase, Choreography is designed for a specific number of idols,
and Recording seals the performers.

Composers are first-come-first-serve NPCs with contracts (royalties + delivery date).
Idols can substitute for any of the 3 creative NPC roles.

A cover song only requires Arrangement (or "as is" where performers decide during recording).

The finished song has a structure (Intro-Verse-PreChorus-Chorus-etc.) where each
part has a quality ranking that determines both the overall composition quality AND
the show performance (ADR-007 uses per-part weights).

## Decision

### 1. Song Structure: Parts and Quality

Every song — original or cover — is represented as a sequence of parts. Each part
has a quality score determined during the creative phase:

```typescript
type SongPart =
  | 'intro' | 'verse_1' | 'pre_chorus' | 'chorus_1'
  | 'verse_2' | 'chorus_2' | 'bridge' | 'chorus_3' | 'outro';

interface SongComposition {
  songId: string;
  title: string;
  genre: string;
  type: 'original' | 'cover' | 'cover_as_is';

  // Quality per part (0-100, set during creative phase)
  partQualities: Record<SongPart, number>;
  // Overall quality = weighted average of parts
  overallQuality: number;

  // Per-part demands (set during arrangement/composition)
  partDemands: Record<SongPart, {
    vocalIntensity: 'low' | 'medium' | 'high';
    danceIntensity: 'low' | 'medium' | 'high';
    primaryStat: 'vocal' | 'dance' | 'charisma' | 'expression';
  }>;
}

// Part weights for overall quality (same as show weights in ADR-007):
const PART_QUALITY_WEIGHTS: Record<SongPart, number> = {
  intro: 0.05,
  verse_1: 0.10,
  pre_chorus: 0.08,
  chorus_1: 0.18,  // hook — most important
  verse_2: 0.08,
  chorus_2: 0.15,
  bridge: 0.12,    // contrast point
  chorus_3: 0.16,  // climax
  outro: 0.08,
};
```

### 2. Creative Pipeline: 3 Parts (Composition, Lyrics, Arrangement)

An original song requires 3 creative contributions:

```typescript
type CreativePart = 'music_composition' | 'lyrics' | 'arrangement';

interface CreativeContribution {
  part: CreativePart;
  assignee: { type: 'npc_composer'; npcId: string }
           | { type: 'idol_composer'; idolId: string };
  quality: number;           // 0-100, set when contribution is delivered
  deliveryWeek: number;      // agreed deadline
  status: 'contracted' | 'in_progress' | 'delivered' | 'late';
  fee: number;               // one-time payment
  royaltyPercent: number;    // ongoing % of song revenue
}
```

**Parallel vs Sequential execution:**

```
PARALLEL (3 different assignees):
  Week 1: Music + Lyrics + Arrangement all start simultaneously
  Week 2-3: All 3 delivered (each takes 2-3 weeks)
  → Total: ~3 weeks to complete creative phase

SEQUENTIAL (1 assignee does all 3):
  Week 1-3: Music composition
  Week 4-5: Lyrics
  Week 6-7: Arrangement
  → Total: ~7 weeks to complete creative phase

MIXED (2 assignees):
  Week 1: Music starts (NPC A) + Lyrics starts (Idol)
  Week 2-3: Music delivered, Lyrics delivered
  Week 3-5: Arrangement (NPC A, now free)
  → Total: ~5 weeks

Decision by Music Director (ADR-009 decision 9.1.1):
  - Budget allows 3 assignees? → Parallel (fast, expensive)
  - Budget allows 2? → Mixed
  - Budget for 1 only? → Sequential (slow, cheap)
  - Idol can compose? → Replaces 1 NPC (saves fee, but idol needs schedule slot)
```

### 3. Cover Song Pipeline (simplified)

```
COVER — Full Arrangement:
  → Only Arrangement part needed (music + lyrics exist from original)
  → 1 NPC or idol does arrangement
  → ~2 weeks

COVER — "As Is":
  → No creative phase at all
  → Performers interpret the original during Recording
  → Quality depends on performers, not composers
  → arrangement_quality = avg(performer_vocal × 0.6 + performer_expression × 0.4)
  → 0 weeks creative phase, goes straight to choreography/recording
```

### 4. Composer Contracts

Composers are NPC freelancers. Each composition requires a contract:

```typescript
interface ComposerContract {
  composerId: string;
  projectId: string;
  creativePart: CreativePart;         // which of the 3 parts
  fee: number;                         // one-time upfront payment
  royaltyPercent: number;              // % of song revenue (ongoing)
  deliveryDeadline: number;            // week number
  status: 'active' | 'delivered' | 'late' | 'cancelled';
}

// Composer NPC
interface ComposerNPC {
  id: string;
  name: string;
  tier: IdolTier;
  specialties: CreativePart[];         // what they can do (some do all 3, some only lyrics)
  qualityBase: number;                 // 0-100, how good their work is
  speed: number;                       // weeks to deliver (2-4 based on tier and part)
  maxConcurrent: number;               // F-D: 3, C-A: 2, S+: 1
  activeContracts: ComposerContract[]; // current workload
  fee: number;                         // base fee (negotiable)
  royaltyExpectation: number;          // base royalty % they ask for
  schedule: { weekFree: number };      // when they next have capacity
}
```

**First-come-first-serve with negotiation:**

```
1. Agency identifies desired composer
2. Check capacity: activeContracts.length < maxConcurrent?
   → If no: composer is busy. Wait or find another.
3. Negotiate contract:
   → Fee: composer.fee × tier_mult × urgency_mult (rush = +30%)
   → Royalty: composer.royaltyExpectation ± negotiation (ADR-009 Music Director skill)
   → Deadline: composer.speed + queue position (if another project finishes soon)
4. Sign contract: deduct fee from agency budget
5. Composer works on the part
6. On delivery week: contribution.quality = composer.qualityBase × random(0.8, 1.2)
   → Seeded random: same composer + same seed = same quality range
```

### 5. Choreography Stage

Choreography is designed for a **specific number of idols** — not necessarily the
full group. This ties directly into ADR-007's escalação system:

```typescript
interface SongChoreography {
  songId: string;
  activeDancers: number;               // how many idols dance this choreo
  // Requirements per song part:
  partChoreography: Record<SongPart, {
    formation: 'line' | 'v_shape' | 'circle' | 'scattered' | 'pairs';
    intensity: 'low' | 'medium' | 'high';
    centerIdolId?: string;             // who should be center in this part
  }>;
  // Quality of the choreography itself
  choreographyQuality: number;         // 0-100, from choreographer NPC skill
}

// Key design: choreography for 5 in a group of 8 means:
// - 5 idols dance the full choreo (rotate per song in show)
// - 3 idols are in back_vocal/rest_position during this song
// - ADR-007 Show Director rotates WHO are the 5 and WHO are the 3
//   between songs to manage fatigue
```

**Choreography requires:**
- Dance Studio facility (level 1+) — without it, stage is stalled
- A choreographer NPC or staff member (quality = Dance Technique attr)
- Duration: 1-2 weeks (simple) to 3-4 weeks (complex multi-formation)

### 6. Recording Stage

Recording seals the performers and produces the final song:

```typescript
interface RecordingSession {
  songId: string;
  performerIds: string[];              // idols who record
  recordingWeek: number;
  // All performers need a free agenda slot in the same week
  // Partial recording: if some idols unavailable,
  //   recording happens with available members
  //   quality penalty: 1.0 - (absent / total × 0.10)
  recordingQuality: number;            // depends on performer stats + studio facility
}

// Recording quality formula:
// recording_quality = avg(performer_vocal × 0.4 + performer_expression × 0.3
//                         + performer_communication × 0.2 + performer_charisma × 0.1)
//                     × studio_facility_mult × partial_penalty
//
// studio_facility_mult: no studio: 0.6, level 1: 0.8, level 2: 1.0, level 3: 1.2
```

### 7. Full Pipeline State Machine

```typescript
interface MusicProject {
  id: string;
  agencyId: string;
  title: string;
  genre: string;
  songType: 'original' | 'cover' | 'cover_as_is';

  // Current stage
  stage: 'creative' | 'choreography' | 'recording' | 'ready_for_release' | 'released' | 'cancelled';
  stalled: boolean;
  stallReason: string | null;

  // Creative phase (3 parts)
  creativeContributions: CreativeContribution[];
  // True when all 3 parts (or just arrangement for cover) are delivered
  creativeComplete: boolean;

  // Song composition (populated when creative phase completes)
  composition: SongComposition | null;

  // Choreography (optional — ballads may skip)
  choreography: SongChoreography | null;
  choreographyRequired: boolean;       // false for ballads, acoustic, etc.

  // Recording
  recording: RecordingSession | null;

  // Final quality
  finalQuality: number | null;

  // Release config (set after recording, by Music Director ADR-009 9.3.1)
  releaseConfig: ReleaseConfig | null;
}
```

### 8. Quality Formula (Final)

```
// Creative quality = weighted combination of 3 contributions
creative_quality =
  music_composition.quality × 0.40
  + lyrics.quality × 0.25
  + arrangement.quality × 0.35

// Per-part quality derived from creative_quality with variance per part
// Better composers produce more consistent parts;
// Lower-tier composers have high variance (some parts great, others mediocre)
partQualities[part] = creative_quality × random(0.8, 1.2) × part_specialty_bonus

// If cover (arrangement only):
creative_quality = arrangement.quality

// If cover_as_is:
creative_quality = avg(performer_stats) × 0.7 (performers doing arrangement themselves)

// Choreography quality (0-100, from choreographer NPC)
// If no choreography (ballad): redistributed to other weights

// Final quality:
final_quality =
  creative_quality × 0.40
  + choreography_quality × 0.15         // 0 if N/A → redistributed
  + recording_quality × 0.30
  + production_polish × 0.15            // from studio facility level

// If choreography N/A:
final_quality =
  creative_quality × 0.50
  + recording_quality × 0.35
  + production_polish × 0.15
```

### 9. Weekly Tick Processing

During Phase 3 of the weekly tick, the music system processes all active projects:

```
For each MusicProject with stage != 'released' and stage != 'cancelled':

  IF stage == 'creative':
    For each creative contribution:
      If status == 'contracted' AND composer has capacity:
        status = 'in_progress'
      If status == 'in_progress':
        weeksWorked++
        If weeksWorked >= deliveryTime:
          status = 'delivered'
          quality = computeContributionQuality(composer, seed)
      If status == 'late' (past deadline):
        penalty: quality × 0.9 per late week
    If ALL contributions delivered:
      composition = buildComposition(contributions)
      stage = choreographyRequired ? 'choreography' : 'recording'

  IF stage == 'choreography':
    If Dance Studio exists AND choreographer available:
      weeksInChoreo++
      If weeksInChoreo >= choreoDuration:
        choreography = buildChoreography(choreographer, activeDancers, songParts)
        stage = 'recording'
    Else:
      stalled = true; stallReason = 'no_dance_studio' | 'no_choreographer'

  IF stage == 'recording':
    If all performerIds have free agenda slot this week:
      recording = recordSong(performers, studioLevel)
      finalQuality = computeFinalQuality(composition, choreography, recording)
      stage = 'ready_for_release'
    Elif some performers available:
      // Partial recording option (Music Director decides via ADR-009)
      recording = recordSong(availablePerformers, studioLevel, partial=true)
    Else:
      stalled = true; stallReason = 'idol_schedule_conflict'

  IF stage == 'ready_for_release':
    // Waiting for Music Director to plan release (ADR-009 decision 9.3.1)
    // No automatic processing — requires explicit release planning action
```

## Alternatives Considered

### Alternative 1: 4 sequential stages (original ADR-008)

- **Description**: Composition → Arrangement → Choreography → Recording, always sequential.
- **Rejection Reason**: Doesn't model the 3 creative parts (music, lyrics, arrangement) as
  separate contributions. Misses the parallel execution opportunity. Doesn't model
  composer contracts with royalties and delivery dates.

### Alternative 2: All creative work by a single "producer" NPC

- **Description**: One Music Producer NPC creates the entire song.
- **Rejection Reason**: Doesn't model the real idol industry where composers, lyricists,
  and arrangers are often different people. Misses the strategic depth of assembling
  the right creative team for each song.

## Consequences

### Positive
- 3-part creative system creates meaningful economic decisions (cost vs speed)
- Idols as composers adds depth (idol writes her own lyrics = authenticity bonus)
- Cover songs are simpler/cheaper — good for new agencies
- Choreography for N of M members ties directly into show fatigue system (ADR-007)
- Per-part quality creates variance in songs (strong chorus + weak bridge = interesting)
- Composer contracts create resource contention between agencies

### Negative
- Complex state machine with many transitions and stall conditions
- 3 separate contracts per song is more management overhead
- Partial recording penalty adds another edge case

### Risks
- **Risk**: Too many knobs (3 creative qualities + choreography + recording + production)
  - **Mitigation**: Player sees only final_quality. Parts are internal for Moment Engine.
- **Risk**: Composer pool exhaustion (all good composers booked by rivals)
  - **Mitigation**: Pool is ~50+ composers across tiers. Idol-as-composer is fallback.

## GDD Requirements Addressed

| GDD System | Requirement | How This ADR Addresses It |
|------------|-------------|--------------------------|
| music-production.md | Composition pipeline | 3 creative parts + choreography + recording |
| music-production.md | Parallel execution with multiple NPCs | 3 different assignees = parallel completion |
| music-production.md | Sequential if 1 NPC | 1 assignee does all 3 parts in sequence |
| music-production.md | Stalled tracking with reason | stalled bool + stallReason per stage |
| music-production.md | Choreography requires Dance Studio | Resource check in choreography stage |
| music-production.md | Choreography for specific N of idols | activeDancers field ties to ADR-007 rotation |
| music-production.md | Composer capacity shared across agencies | maxConcurrent with contract system |
| music-production.md | Composer contracts (royalties, deadline) | ComposerContract with fee + royalty + deadline |
| music-production.md | Cover needs only arrangement | cover type skips music+lyrics creative parts |
| music-production.md | Cover "as is" | cover_as_is skips entire creative phase |
| music-production.md | Song structure with parts | SongPart enum with per-part quality |
| music-production.md | Quality weighted formula | creative × 0.40 + choreo × 0.15 + recording × 0.30 + polish × 0.15 |
| music-production.md | Idol as composer | assignee type: 'idol_composer' replaces NPC |
| music-entities.md | Part demands (vocal/dance intensity) | partDemands per SongPart feeds ADR-007 |

## Related Decisions

- [ADR-004](adr-004-event-system.md) — stage stall and release events
- [ADR-005](adr-005-performance-budgets.md) — music processing within Phase 3 budget
- [ADR-007](adr-007-show-pipeline.md) — consumes finished songs; per-part demands drive show scoring
- [ADR-009](adr-009-decision-catalog.md) — Music Director decisions (9.1-9.3) drive all pipeline actions
