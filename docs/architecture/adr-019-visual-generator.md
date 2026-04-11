# ADR-019: Visual Generator Pipeline

## Status
Accepted

## Date
2026-04-09

## Last Verified
2026-04-09

## Decision Makers
user + architecture-review

## Summary
The procedural visual generator creates unique idol portraits from a modular
part system. This ADR defines the seed-to-visual pipeline, age bracket
progression, part composition rules, and the offline generation + CDN delivery
strategy (ComfyUI → RunPod → Supabase Storage, per ADR-001).

---

## Engine Compatibility

| Field | Value |
|-------|-------|
| Engine | Python (offline tooling) + Supabase Storage (CDN) |
| Domain | Asset Pipeline / Generation |
| Knowledge Risk | MEDIUM — ComfyUI pipeline is external tooling |
| Post-Cutoff APIs Used | None |

## ADR Dependencies

| Field | Value |
|-------|-------|
| Depends On | ADR-001 (ComfyUI + RunPod + Supabase Storage), ADR-003 (idol visual_seed in RosterSlice) |
| Enables | Idol portrait display, profile UI, scouting UI |
| Blocks | Visual asset production pipeline |

---

## Decision

### Pipeline Architecture

```
Offline Generation (Python)
┌─────────────┐     ┌──────────┐     ┌───────────────┐     ┌──────────┐
│ World Pack   │────▶│ ComfyUI  │────▶│ RunPod        │────▶│ Supabase │
│ (idol seeds) │     │ Pipeline │     │ (5-10s/image) │     │ Storage  │
└─────────────┘     └──────────┘     └───────────────┘     └──────────┘
                                                                 │
Game Runtime (download once, cache locally)                       ▼
┌─────────────┐     ┌──────────────┐     ┌──────────┐     ┌──────────────┐
│ idol.visual  │────▶│ CDN URL from │────▶│ Local    │────▶│ <img> in UI  │
│ _seed        │     │ Supabase     │     │ Cache    │     │ (Avatar comp)│
└─────────────┘     └──────────────┘     └──────────┘     └──────────────┘
```

### Generation Spec

- **Modular system**: 13+ part categories (face_shape, skin_tone, eye_shape,
  eye_color, hair_style, hair_color, nose, mouth, accessories, etc.)
- **Deterministic**: `PRNG(visual_seed)` → consistent part selection every run
- **Uniqueness**: 13 categories × 10+ variants each → >10B combinations
- **24 images per idol**: 8 age brackets × 3 expressions (happy/serious/sad)
- **Age brackets**: 8, 12, 15, 18, 24, 27, 30, 35
- **Consistency**: IP-Adapter weight 0.6-0.8 for cross-age face similarity;
  cosine similarity >0.7 target across ages

### ComfyUI Pipeline Parameters

```python
GENERATION_CONFIG = {
    "ksampler_steps": 30,
    "cfg_scale": 7.5,
    "ip_adapter_weight": 0.7,    # face consistency
    "age_lora_strength": 0.8,    # age bracket progression
    "resolution": (512, 512),     # base; upscale to 1024 post-gen
    "batch_size": 24,             # all images for 1 idol
}
```

### Scale & Cost

| Phase | Idols | Images | Time | Cost |
|-------|-------|--------|------|------|
| MVP | 100 | 2,400 | ~4-7h | ~$25-50 |
| Vertical Slice | 500 | 12,000 | ~2-3d | ~$120-240 |
| Alpha | 2,000 | 48,000 | ~5-7d | ~$480-960 |
| Full Vision | 5,000 | 120,000 | ~10-14d | ~$1.2K-2.4K |

### Runtime Integration

At game runtime, the visual generator is **not invoked** — all portraits are
pre-generated and served from Supabase Storage CDN.

### Portrait Caching Strategy

Portraits are **downloaded once and cached locally** on the user's machine.
They must never be re-downloaded after the first fetch.

```typescript
// Cache layers (checked in order):
// 1. In-memory LRU cache (hot — current roster, ~50-200 images)
// 2. IndexedDB blob store (warm — all previously loaded portraits)
// 3. Supabase Storage CDN (cold — first-time download only)

interface PortraitCache {
  get(key: string): Promise<Blob | null>;   // checks memory → IndexedDB
  put(key: string, blob: Blob): Promise<void>;  // writes to both layers
  preload(idolIds: string[]): Promise<void>;     // batch download for new idols
}

function portraitUrl(idolId: string, ageBracket: number, expression: string): string {
  return `${SUPABASE_STORAGE_URL}/portraits/${idolId}/${ageBracket}_${expression}.webp`;
}

// The Avatar component calls PortraitCache.get() first.
// On cache miss: fetch from CDN, store in IndexedDB + memory, display.
// On cache hit: display immediately from local storage (no network).
//
// Tauri desktop: can also use filesystem cache under app data directory
// for even faster access than IndexedDB.
//
// Preloading: When a new world pack is loaded or new idols are scouted,
// batch-download all their portraits in the background to avoid visible
// loading states during gameplay.
```

**Key rule:** After initial download, portraits work fully offline. No network
required to display any previously loaded idol portrait.

---

## GDD Requirements Addressed

| GDD Document | TR-ID | Requirement | How This ADR Satisfies It |
|-------------|-------|-------------|--------------------------|
| visual-generator.md | TR-visual-gen-001 | 13+ modular part categories for >10B combinations | Part category system with PRNG selection |
| visual-generator.md | TR-visual-gen-002 | Deterministic: PRNG(seed) → same visual every run | visual_seed in idol data; offline generation |
| visual-generator.md | TR-visual-gen-003 | 8 age brackets with cross-age consistency | IP-Adapter + Age LoRA; cosine similarity >0.7 |
| visual-generator.md | TR-visual-gen-004 | Aging visual scales with stats (higher Visual → better parts) | Part quality selection weighted by Visual stat |

---

## Related

- [ADR-001: Stack Tecnológica](adr-001-stack-tecnologica.md) — ComfyUI + RunPod + Supabase
- [ADR-006: UI Architecture](adr-006-ui-architecture.md) — Avatar component
