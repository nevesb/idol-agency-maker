# ADR-008: Music Production Architecture

## Status
Proposed

## Date
2026-04-09

## ADR Dependencies

| Field | Value |
|-------|-------|
| **Depends On** | ADR-002 (weekly tick), ADR-003 (MusicSlice), ADR-004 (events), ADR-007 (show pipeline consumes songs), ADR-009 (Music Director decisions), ADR-012 (context providers) |
| **Enables** | Music production epics, show pipeline (ADR-007 consumes finished songs) |
| **Blocks** | None |

## Context

### Problem Statement

Music production creates the songs that idols perform in shows (ADR-007) and
release on charts. The pipeline must model:

- **Composition** of 3 creative parts (Music, Lyrics, Arrangement) by NPCs and/or idols
- **Choreography** with specific formations per song part, designed for N idols
- **Recording** by the performing idols
- **Quality** that emerges from the creators' attributes, not from hardcoded weights

Composers (NPC freelancers), choreographers, and idols all share the same 19-attribute
model as agency staff (FM26 labels). Quality depends on these attributes.

## Decision

### 1. Song Structure

Every song is composed of **9 parts**. Each part has demands and quality set
during the creative and choreography phases:

```typescript
type SongPart =
  | 'intro' | 'verse_1' | 'pre_chorus' | 'chorus_1'
  | 'verse_2' | 'chorus_2' | 'bridge' | 'chorus_3' | 'ending';

interface SongComposition {
  songId: string;
  title: string;
  genre: string;
  type: 'original' | 'cover' | 'cover_as_is';

  // Quality per part (0-100, set during creative phase)
  // NOT hardcoded weights — quality distribution emerges from
  // WHERE the composer(s) focused their effort
  partQualities: Record<SongPart, {
    musicQuality: number;      // from music composition
    lyricsQuality: number;     // from lyrics
    arrangementQuality: number; // from arrangement
    overallQuality: number;     // weighted by composer focus
  }>;

  // Per-part demands (set during arrangement + choreography)
  partDemands: Record<SongPart, {
    vocalIntensity: number;    // 0-10 (from arrangement)
    danceIntensity: number;    // 0-10 (from choreography)
  }>;
}
```

**Quality weights are NOT hardcoded.** They emerge from the composition process:
- A composer who focuses on the chorus hook produces higher chorus quality
- A composer who creates a complex bridge produces higher bridge quality
- The player controls this INDIRECTLY by:
  - Choosing the genre/style (ballad = vocal-focused, dance = choreo-focused)
  - Choosing composers with specific strengths (vocalist → strong chorus lyrics)
  - Requesting emphasis during commission ("make the chorus the hook")
  - The choreographer's choices for which parts are dance-heavy

### 2. Composer NPC Attributes

Composer NPCs use the **same 19-attribute model** as agency staff (FM26 labels,
scale 1-20, shown to player as Elite/Outstanding/.../Unsuited):

```typescript
interface ComposerNPC {
  id: string;
  name: string;
  tier: IdolTier;

  // Same 19 attributes as staff, but only some are relevant:
  // COACHING (relevant for composers):
  vocalTechnique: number;      // quality of vocal melodies composed
  danceTechnique: number;      // understanding of dance-friendly arrangements
  stagePresence: number;       // composing for live performance impact

  // MENTAL:
  determination: number;       // consistency of quality, meets deadlines
  discipline: number;          // minimum quality floor
  adaptability: number;        // can compose outside comfort genre
  // motivating, peopleManagement, authority — less relevant for freelancers

  // KNOWLEDGE:
  musicalKnowledge: number;    // core: overall composition skill
  industryKnowledge: number;   // knows what charts want, trend awareness
  // Other knowledge attrs less relevant for composers

  // Composer-specific:
  specialties: CreativePart[]; // which of the 3 parts they can do
  preferredGenres: string[];   // genres where they're strongest
  maxConcurrent: number;       // F-D: 3, C-A: 2, S+: 1
  activeContracts: ComposerContract[];
  fee: number;                 // base fee per creative part
  royaltyExpectation: number;  // base royalty % they expect
  schedule: { weekFree: number };
}
```

**Quality of a composer's work** is derived from their attributes:

```
composition_quality_per_part =
  musicalKnowledge × 0.4           // core skill
  + genre_match_bonus × 0.2        // if composing in preferred genre: +bonus
  + discipline × 0.1               // consistency (minimum floor)
  + determination × 0.1            // effort (hit deadline = full quality)
  + part_specialty × 0.2           // some composers excel at choruses, others at bridges
  × random_variance(0.85, 1.15)    // seeded: same composer + seed = same range

// Where a composer "focuses" emerges from their strengths:
// Composer with high vocalTechnique → chorus and bridge get higher quality
// Composer with high danceTechnique → verses with dance breaks get higher quality
// This creates the non-hardcoded quality distribution across parts
```

### 3. Idol as Composer

Idols can compose any of the 3 creative parts. Their composition quality uses
their own attributes (the 16 visible stats map to composition ability):

```
idol_composition_quality =
  // For music composition:
  (idol.vocal × 0.3 + idol.communication × 0.2 + idol.aura × 0.2
   + idol.charisma × 0.1 + idol.mentality × 0.2)
  × mastery_factor                   // idol who has composed before gets bonus
  × random_variance(0.85, 1.15)

// For lyrics:
  (idol.communication × 0.4 + idol.charisma × 0.2 + idol.mentality × 0.2
   + idol.expression × 0.2)

// For arrangement:
  (idol.vocal × 0.3 + idol.dance × 0.2 + idol.adaptability × 0.2
   + idol.communication × 0.15 + idol.mentality × 0.15)
```

**Advantages of idol composer:**
- No fee (saves money)
- Authenticity bonus: fans value idol-written songs → +15% fan mood on release
- Creative control: idol writes what matches their voice/style

**Disadvantages:**
- Uses idol's schedule slot (can't do jobs while composing)
- Quality depends on idol stats (may be lower than specialist NPC)
- Idol Ambição oculto may affect quality (high ambition + low result = frustration)

### 4. Creative Pipeline: 3 Parts

An original song requires 3 creative contributions:

```typescript
type CreativePart = 'music_composition' | 'lyrics' | 'arrangement';

interface CreativeContribution {
  part: CreativePart;
  assignee: { type: 'npc_composer'; npcId: string }
           | { type: 'idol'; idolId: string };
  // Quality set per song part when delivered
  partQualities: Record<SongPart, number>;
  deliveryWeek: number;
  status: 'contracted' | 'in_progress' | 'delivered' | 'late';
  fee: number;
  royaltyPercent: number;
}
```

**Execution modes:**

```
PARALLEL (3 different assignees — any mix of NPC and idol):
  Week 1: Music + Lyrics + Arrangement all start simultaneously
  ~3 weeks to complete all
  Cost: 3× fees (if all NPCs)

SEQUENTIAL (1 assignee does all 3):
  Week 1-3: Music → Week 4-5: Lyrics → Week 6-7: Arrangement
  ~7 weeks total
  Cost: 1× fee (but higher per-part because one person does everything)

MIXED (2 assignees — e.g., NPC does music, idol does lyrics, NPC does arrangement):
  Music + Lyrics in parallel → Arrangement after music is done
  ~5 weeks total

IDOL-ONLY (1 or more idols compose everything):
  Same parallel/sequential rules but:
  - Zero fee (idol is contracted staff)
  - Uses idol schedule slots (opportunity cost: no jobs during composition)
  - 1 idol doing all 3 sequentially: ~7 weeks
  - 3 idols in parallel: ~3 weeks (but 3 idols blocked from jobs)
```

### 5. Cover Song Pipeline

```
COVER — Full Arrangement:
  → Only Arrangement part needed (music + lyrics exist from original)
  → 1 NPC or idol does arrangement (~2 weeks)
  → Arrangement quality determines how the cover differs from original

COVER — "As Is":
  → No creative phase
  → Performers interpret the original during Recording
  → Quality = avg(performer stats) × 0.7
  → Goes straight to choreography/recording
```

### 6. Composer Contracts

Composers are first-come-first-serve NPCs. Each contribution requires a contract:

```typescript
interface ComposerContract {
  composerId: string;
  projectId: string;
  creativePart: CreativePart;
  fee: number;                     // one-time upfront
  royaltyPercent: number;          // % of song revenue (ongoing)
  deliveryDeadline: number;        // week number (based on composer schedule)
  status: 'active' | 'delivered' | 'late' | 'cancelled';
}

// Booking process:
// 1. Check capacity: composer.activeContracts.length < maxConcurrent?
// 2. Check schedule: when is the composer free? (weekFree)
// 3. Negotiate: fee ± negotiation skill, royalty ± negotiation
// 4. Sign: deduct fee from budget, composer starts on weekFree
// 5. Delivery: composer delivers on deadline (or late with quality penalty)
```

### 7. Choreography

Choreography defines the **formation** for each part of each song, designed for
a specific number of idols. It can be done by:

- **Agency choreographer** (staff NPC with Dance Technique attr)
- **Freelance choreographer** (NPC from market, same 19-attr model as composers)
- **An idol** (uses idol's Dance Technique equivalent: dance stat)

#### 7a. Formation Types

Each part of a song has a formation. There are 5 formation types, each with
a minimum number of idols and specific position slot rules:

```typescript
type FormationType = 'line' | 'pairs' | 'v_shape' | 'circle' | 'scattered';

// Minimum idols per formation type:
const FORMATION_MINIMUMS: Record<FormationType, number> = {
  line: 1,
  pairs: 2,        // must be multiple of 2
  v_shape: 3,      // must be multiple of 3
  circle: 4,
  scattered: 2,
};

// Maximum positions per formation: 12 (hard cap)
const MAX_POSITIONS_PER_FORMATION = 12;
```

#### 7b. Position Slots Per Formation Type

Each formation type defines which stage placements are available and in what quantities:

```typescript
interface FormationSlots {
  front: { min: number; max: number };
  center: { min: number; max: number };
  mid: { min: number; max: number };
  side: { min: number; max: number };
  back: { min: number; max: number };
  groupingRule: string;  // constraint on how positions are filled
}

const FORMATION_SLOTS: Record<FormationType, FormationSlots> = {

  line: {
    // 1 front, 1-3 mid, rest are back
    front:  { min: 1, max: 1 },
    center: { min: 0, max: 0 },
    mid:    { min: 0, max: 3 },
    side:   { min: 0, max: 0 },
    back:   { min: 0, max: 8 },  // remaining go to back
    groupingRule: 'none',
  },

  pairs: {
    // Always in pairs (multiples of 2)
    front:  { min: 2, max: 2 },
    center: { min: 0, max: 4 },   // 0, 2, or 4
    mid:    { min: 0, max: 4 },   // 0, 2, or 4
    side:   { min: 0, max: 8 },   // 0, 2, 4, 6, or 8
    back:   { min: 0, max: 2 },
    groupingRule: 'all_placements_must_be_multiples_of_2',
  },

  v_shape: {
    // Always in trios (multiples of 3), no center
    front:  { min: 3, max: 3 },
    center: { min: 0, max: 0 },   // no center in V
    mid:    { min: 0, max: 3 },
    side:   { min: 0, max: 6 },   // 0, 3, or 6
    back:   { min: 0, max: 3 },
    groupingRule: 'all_placements_must_be_multiples_of_3',
  },

  circle: {
    // Encircling formation
    front:  { min: 1, max: 3 },
    center: { min: 0, max: 0 },   // no center (everyone is on the perimeter)
    mid:    { min: 0, max: 0 },
    side:   { min: 2, max: 6 },
    back:   { min: 1, max: 3 },
    groupingRule: 'none',
  },

  scattered: {
    // Free-form, most flexible
    front:  { min: 1, max: 3 },
    center: { min: 0, max: 4 },
    mid:    { min: 0, max: 6 },
    side:   { min: 0, max: 6 },
    back:   { min: 0, max: 3 },
    groupingRule: 'none',
  },
};
```

#### 7c. Choreography Per Song

The choreography defines a formation FOR EACH PART of the song. Different parts
can have different formations and different numbers of active idols:

```typescript
interface SongChoreography {
  songId: string;

  // Choreographer who designed this
  choreographer:
    | { type: 'staff'; npcId: string }       // agency choreographer
    | { type: 'freelancer'; npcId: string }  // hired freelancer
    | { type: 'idol'; idolId: string };      // idol designed the choreo

  // Quality of the choreography (from choreographer's Dance Technique)
  choreographyQuality: number;

  // Per-part formation
  partFormations: Record<SongPart, {
    formation: FormationType;
    activeIdolCount: number;         // how many idols are in this formation
    slots: FormationSlotAssignment[];  // which positions exist
    danceIntensity: number;          // 0-10, how demanding this part's choreo is
  }>;

  // Training difficulty: more unique formations = harder to learn
  // If all 9 parts use 'line': easy. If 5 different formations: hard.
  trainingDifficulty: number;  // computed from formation variety
}

interface FormationSlotAssignment {
  slotIndex: number;
  placement: 'front' | 'center' | 'mid' | 'side' | 'back';
  // The idol assigned to this slot is set in the show lineup (ADR-007)
  // The choreography defines the SLOTS, the lineup fills them with idols
}
```

**Training difficulty formula:**

```
uniqueFormations = count of distinct FormationType used across 9 parts
trainingDifficulty =
  uniqueFormations × 10           // base: each new formation adds 10
  + totalActiveIdols × 2          // more idols = more coordination
  + maxFormationTransitions × 5   // transitions between different formations mid-song

// Example:
// All 9 parts use 'line' → uniqueFormations = 1 → difficulty = 10 + N×2
// 5 different formations → uniqueFormations = 5 → difficulty = 50 + N×2 + transitions×5
// Higher difficulty = more rehearsal weeks needed before show
```

#### 7d. Choreography Interaction with ADR-007 (Show Pipeline)

ADR-007 uses the 3D lineup matrix: Song × Part × Idol → Position.
The choreography defines the SLOTS available. The lineup FILLS those slots:

```
Choreography says: "Chorus 1 uses V-shape with 6 idols:
  3 front slots, 3 side slots"

Show lineup fills: "Front slot 1 = Yui (vocalShare 0.4, danceShare 0.8)
                    Front slot 2 = Mei (vocalShare 0.3, danceShare 0.9)
                    Front slot 3 = Riko (vocalShare 0.2, danceShare 0.7)
                    Side slot 1 = Saki ...
                    Side slot 2 = Hana ...
                    Side slot 3 = Aya ..."

The remaining 2 idols (if group has 8) are NOT in this formation.
They go to 'rest' position: vocalShare 0.05, danceShare 0.0.
```

### 8. Recording Stage

Recording seals the performers and produces the final recorded song:

```typescript
interface RecordingSession {
  songId: string;
  performerIds: string[];          // idols who record
  recordingWeek: number;
  // All performers need a free agenda slot in the same week
  // Partial: if some unavailable → quality penalty
  partialPenalty: number;          // 1.0 - (absent / total × 0.10)
  recordingQuality: number;
}

// Quality:
// recording_quality = avg_per_idol(
//   idol.vocal × 0.4 + idol.expression × 0.3
//   + idol.communication × 0.2 + idol.charisma × 0.1
// ) × studio_facility_mult × partial_penalty
//
// studio_facility_mult: none: 0.6, level 1: 0.8, level 2: 1.0, level 3: 1.2
```

### 9. Full Pipeline State Machine

```typescript
interface MusicProject {
  id: string;
  agencyId: string;
  title: string;
  genre: string;
  songType: 'original' | 'cover' | 'cover_as_is';

  stage: 'creative' | 'choreography' | 'recording' | 'ready_for_release' | 'released' | 'cancelled';
  stalled: boolean;
  stallReason: string | null;

  // Creative phase
  creativeContributions: CreativeContribution[];
  creativeComplete: boolean;

  // Song (populated when creative phase completes)
  composition: SongComposition | null;

  // Choreography (optional — ballads may skip)
  choreography: SongChoreography | null;
  choreographyRequired: boolean;

  // Recording
  recording: RecordingSession | null;

  // Final quality
  finalQuality: number | null;

  // Release config
  releaseConfig: ReleaseConfig | null;
}
```

### 10. Final Quality

Quality is NOT a fixed weighted formula. It emerges from the parts:

```
// Each song part has quality from 3 sources:
part_quality(p) =
  creative_quality(p)       // from composition + lyrics + arrangement
  × choreography_match(p)   // how well choreo fits the part demands
  × recording_quality        // uniform across all parts

// Song overall quality = weighted average of part qualities
// BUT the weights are NOT hardcoded — they come from the COMPOSITION ITSELF:
// A chorus-heavy song (where the composer focused effort) naturally weights chorus more
// because chorus_quality > verse_quality → chorus contributes more to the average.

// Simple: overall = avg(part_qualities)
// The distribution of quality across parts IS the "weight" system.
// A song with amazing chorus and mediocre verses will score well in shows
// during chorus parts and poorly during verses — no artificial weights needed.

// For chart scoring, overall quality is just the average:
chart_quality = avg(part_quality for all 9 parts)

// For show scoring (ADR-007), each part is scored individually.
// The show's song_score uses ADR-007's part weights (chorus > verse > etc.)
// which reflect AUDIENCE IMPACT, not composition quality.
```

### 11. Weekly Tick Processing

```
For each MusicProject:

  IF stage == 'creative':
    For each creative contribution:
      If 'contracted' AND assignee has capacity → 'in_progress'
      If 'in_progress' → weeksWorked++
        If weeksWorked >= deliveryTime → 'delivered', compute quality
      If past deadline → 'late', quality × 0.9 per late week
    If ALL contributions delivered:
      composition = buildComposition(contributions)
      stage = choreographyRequired ? 'choreography' : 'recording'

  IF stage == 'choreography':
    Requirements: Dance Studio OR freelance choreographer OR idol with Dance > 50
    If resource available:
      weeksInChoreo++
      If done: build choreography (formations per part), compute trainingDifficulty
      stage = 'recording'
    Else: stalled

  IF stage == 'recording':
    If all performerIds have free slot this week → record, compute quality
    Elif some available → partial recording (penalty)
    Else → stalled

  IF stage == 'ready_for_release':
    Awaiting Music Director release plan (ADR-009 decision 9.3.1)
```

## Consequences

### Positive
- Quality emerges from creator attributes — no arbitrary weights
- Same attribute model for composers, choreographers, and staff (consistent)
- Idol composers create authenticity + economic tradeoffs
- Formation system creates visual variety and training depth
- Per-part choreography ties directly into ADR-007 show scoring

### Negative
- 19 attributes per composer NPC is more data to generate and manage
- Formation validation (min idols, multiples, max 12) adds complexity
- Training difficulty computation needs tuning

### Risks
- **Risk**: Too many formation types overwhelm the player
  - **Mitigation**: NPC choreographer auto-selects formations. Player can override.
- **Risk**: Idol composers always chosen to save money (dominates NPC composers)
  - **Mitigation**: Idol uses schedule slot (opportunity cost). NPC may be better quality.

## GDD Requirements Addressed

| GDD | Requirement | How |
|-----|------------|-----|
| music-production.md | 3 creative parts | Music + Lyrics + Arrangement pipeline |
| music-production.md | Parallel/sequential/mixed | Depends on number of assignees |
| music-production.md | Idol as composer | assignee type: 'idol', uses idol stats |
| music-production.md | Composer contracts | Fee + royalty + deadline + capacity |
| music-production.md | Song structure with parts | 9 parts: intro through ending |
| music-production.md | Choreography | Per-part formations with 5 types |
| music-production.md | Cover songs | arrangement only, or "as is" |
| stage-formations.md | Formation types | Line, Pairs, V-shape, Circle, Scattered |
| stage-formations.md | Min/max idols per formation | Defined with grouping rules |

## Related Decisions

- [ADR-007](adr-007-show-pipeline.md) — consumes songs; per-part demands drive show scoring
- [ADR-009](adr-009-decision-catalog.md) — Music Director decisions (9.1-9.3)
- [ADR-012](adr-012-decision-context-providers.md) — context for Music Director decisions
