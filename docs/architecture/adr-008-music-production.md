# ADR-008: Music Production Architecture

## Status
Proposed

## Date
2026-04-07

## ADR Dependencies

| Field | Value |
|-------|-------|
| **Depends On** | ADR-002, ADR-003 (MusicSlice), ADR-004 (events for stage progression) |
| **Enables** | Music production epics |
| **Blocks** | None |

## Context

Music production is a 4-stage Kanban pipeline (Composição → Arranjo → Coreografia →
Gravação) where each stage requires specific resources (composer NPC, arranger,
dance studio, idol agenda slots). Stages progress automatically each weekly tick
when resources are available; they stall when resources are missing.

Composers are shared NPCs with limited concurrent capacity across all agencies
(player + 50 rivals). This creates resource contention that must be modeled.

## Decision

### Stage-Based State Machine with Resource Locking

```typescript
interface MusicProject {
  id: string;
  agencyId: string;
  title: string;
  songType: 'original' | 'cover';
  stage: 'composition' | 'arrangement' | 'choreography' | 'recording';
  stalled: boolean;
  stallReason: string | null;

  // Per-stage quality (0-100, computed when stage completes)
  compositionQuality: number | null;
  arrangementQuality: number | null;
  choreographyQuality: number | null;
  recordingQuality: number | null;

  // Resource locks
  composerId: string | null;         // NPC composer assigned
  recordingIdolIds: string[];         // idols needed for recording session
  weeksInCurrentStage: number;

  // Release planning (set after recording completes)
  releaseConfig: ReleaseConfig | null;
}

// Composer NPC with capacity limits
interface ComposerNPC {
  id: string;
  name: string;
  tier: IdolTier;
  maxConcurrent: number;              // F-D: 3, C-A: 2, S+: 1
  activeProjects: string[];           // project IDs currently locked
  fama: number;                       // derived from chart history
  fee: number;                        // per-track cost
}
```

### Stage Progression (Phase 3 of Weekly Tick)

Each week, the music system iterates all active MusicProjects:

```
For each project:
  1. Check if current stage resources are available
     - composition: composerId locked AND composer not at capacity
     - arrangement: automatic (no external resource needed)
     - choreography: Dance Studio facility exists (level 1+)
     - recording: all recordingIdolIds have free agenda slot in same week
  2. If resources available:
     - Increment weeksInCurrentStage
     - If weeks >= stage duration: complete stage, compute quality, advance
  3. If resources NOT available:
     - Set stalled = true, stallReason = description
     - emit('music:stageStalled', { projectId, stage, reason })
```

### Composer Pool Contention

Composer booking is first-come-first-served within a single weekly tick:
1. Player agency books first (advantage of being the protagonist)
2. Rival agencies book in order of tier (elite first)
3. If composer at capacity, project stalls until a slot opens

```typescript
function bookComposer(composerId: string, projectId: string): boolean {
  const composer = composerPool.get(composerId);
  if (composer.activeProjects.length >= composer.maxConcurrent) return false;
  composer.activeProjects.push(projectId);
  return true;
}

function releaseComposer(composerId: string, projectId: string): void {
  const composer = composerPool.get(composerId);
  composer.activeProjects = composer.activeProjects.filter(p => p !== projectId);
}
```

### Quality Formula

```
quality_final = (composition × 0.40) + (arrangement × 0.15) +
                (choreography × 0.15) + (recording × 0.30)

// If choreography is N/A (solo ballad, no dance):
quality_final = (composition × 0.50) + (arrangement × 0.20) + (recording × 0.30)
```

### Release Pipeline

After recording completes, the project enters release planning:
- Set tracklist order (position affects chart entry score)
- Choose lead single
- Set release date (must be future week)
- Allocate marketing campaign (diminishing returns formula)
- Optional: pre-release hype activities (teaser, MV, press listening)

Release is processed on the scheduled week during Phase 3:
- emit('music:released', { songId, title, artistIds })
- Chart entry score computed from quality + hype + marketing
- Song enters Music Charts system for weekly scoring

## GDD Requirements Addressed

| GDD System | Requirement | How This ADR Addresses It |
|------------|-------------|--------------------------|
| music-production.md | 4 sequential stages | State machine with stage enum |
| music-production.md | Stalled tracking with reason | stalled bool + stallReason string |
| music-production.md | Choreography requires Dance Studio | Resource check in stage progression |
| music-production.md | Composer capacity shared across agencies | ComposerNPC.maxConcurrent with booking/release |
| music-production.md | Quality weighted sum of 4 stages | Formula with choreography N/A fallback |
| music-production.md | Marketing diminishing returns | Campaign formula applied at release |
| music-production.md | Pre-release hype bonuses stack to 1.5 cap | Additive hype stored on ReleaseConfig |

## Related Decisions

- [ADR-004](adr-004-event-system.md) — stage stall and release events
- [ADR-005](adr-005-performance-budgets.md) — music processing within Phase 3 budget
