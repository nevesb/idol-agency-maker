# Adoption Plan

> **Generated**: 2026-04-07
> **Project phase**: Production
> **Engine**: SvelteKit + TypeScript + Tauri 2 + Supabase
> **Template version**: CCGS v1.0+
> **Migration**: Content migrated from `nevesb/star-idol-agency` into CCGS structure

Work through these steps in order. Check off each item as you complete it.
Re-run `/adopt` anytime to check remaining gaps.

---

## Resolved by Migration

The following gaps from the original audit are **auto-resolved** by moving content
into the CCGS directory structure:

- [x] GDD directory alignment — GDDs now at `design/gdd/` (CCGS standard)
- [x] ADR directory alignment — ADR now at `docs/architecture/adr-001-stack-tecnologica.md`
- [x] `docs/architecture/` directory created
- [x] systems-index.md parenthetical status — fixed before migration

---

## Step 1: Fix Remaining Blocking Gap

### 1a. adr-001-stack-tecnologica.md — missing `## ADR Dependencies`

**Problem:** The ADR has no `## ADR Dependencies` section. This breaks dependency
ordering in `/architecture-review`.

**Fix:** Add section to `docs/architecture/adr-001-stack-tecnologica.md`:
```markdown
## ADR Dependencies

None — this is the foundational technology stack decision.
```

**Time:** 5 min
- [ ] `## ADR Dependencies` added to adr-001

---

## Step 2: Fix High-Priority Gaps

### 2a. adr-001 — missing `## Engine Compatibility`

**Problem:** No engine/framework compatibility section. Should document SvelteKit 5,
Svelte 5 (runes), Tauri 2, Supabase JS v2 version pins and breaking change risks.

**Time:** 15 min
- [ ] `## Engine Compatibility` added to adr-001

### 2b. contract-system.md — missing Acceptance Criteria

**Problem:** Core gameplay GDD with detailed formulas but no `## Acceptance Criteria`.
Stories cannot be generated from this system without them.

**Fix:** `/design-system retrofit design/gdd/contract-system.md` or manual edit

**Time:** 30 min
- [ ] Acceptance Criteria added to contract-system.md

### 2c. Infrastructure files still needed

These files don't exist yet and need to be bootstrapped:
- `docs/architecture/tr-registry.yaml` — maps GDD requirements to ADRs
- `docs/architecture/control-manifest.md` — flat rules sheet for programmers
- `docs/architecture/architecture-traceability.md` — persistent traceability matrix

**Fix:** Created in Step 3 via template skills.
- [ ] Infrastructure files bootstrapped

---

## Step 3: Bootstrap Infrastructure

### 3a. Register existing requirements (creates tr-registry.yaml)
Run `/architecture-review`
**Time:** 1 session
- [ ] tr-registry.yaml created

### 3b. Create control manifest
Run `/create-control-manifest`
**Time:** 30 min
- [ ] docs/architecture/control-manifest.md created

### 3c. Create sprint tracking file
Run `/sprint-plan update`
**Time:** 5 min
- [ ] production/sprint-status.yaml created

### 3d. Set authoritative project stage
Run `/gate-check Production`
**Time:** 5 min
- [ ] production/stage.txt written

---

## Step 4: Medium-Priority Gaps

### 4a. adr-001 — missing `## GDD Requirements Addressed`

**Problem:** No traceability from ADR to GDD requirements.

**Time:** 15 min
- [ ] Section added

### 4b. financial-reporting.md — missing Formulas, Edge Cases, Tuning Knobs

**Time:** 30 min
- [ ] Missing sections added

### 4c. ADR language alignment

**Problem:** adr-001 uses Portuguese headings. CCGS skills scan for English headings.

**Fix:** Translate section headings to English (content can stay in Portuguese).

**Time:** 15 min
- [ ] ADR headings translated

### 4d. Configure technical-preferences.md

**Problem:** `.claude/docs/technical-preferences.md` still has `[TO BE CONFIGURED]`
placeholders. Should reflect SvelteKit/TS stack decisions.

**Time:** 15 min
- [ ] Technical preferences populated

---

## Step 5: Optional Improvements

### 5a. message-types-catalog.md — reclassify as reference doc

**Time:** 5 min
- [ ] Reclassified or expanded

### 5b. Edge Cases in UI GDDs (11 files)

**Time:** 5 min per GDD (optional)
- [ ] Added when working on each UI system

---

## What to Expect from Existing Stories

No stories exist yet. When `/create-stories` runs after Steps 1-3, stories will
have full TR-ID traceability, ADR references, and acceptance criteria from the start.

---

## Re-run

Run `/adopt` again after completing Step 3 to verify all gaps are resolved.
