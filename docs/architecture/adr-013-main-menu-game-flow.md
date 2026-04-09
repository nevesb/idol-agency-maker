# ADR-013: Main Menu & Game Flow

## Status
Proposed

## Date
2026-04-09

## Last Verified
2026-04-09

## Decision Makers
user + architecture-review

## Summary
The main menu needs a defined route structure, campaign creation wizard, save slot
management, and auth integration. This ADR establishes the SvelteKit route groups,
wizard state machine, and save/load UI flow that bridges menu and gameplay.

---

## Engine Compatibility

| Field | Value |
|-------|-------|
| Engine | SvelteKit 2.50 + Svelte 5 |
| Domain | UI / Routing / Persistence |
| Knowledge Risk | LOW |
| References Consulted | SvelteKit route groups, Supabase Auth docs |
| Post-Cutoff APIs Used | Svelte 5 runes ($state, $derived) |
| Verification Required | Route group isolation, auth redirect flows |

## ADR Dependencies

| Field | Value |
|-------|-------|
| Depends On | ADR-001 (SvelteKit + Supabase stack), ADR-003 (state schema for save structure) |
| Enables | All UI epics (menu is the entry point) |
| Blocks | Main menu implementation stories |
| Ordering Note | Can be implemented immediately — all dependencies are Accepted |

---

## Context

### Problem Statement
The game needs a main menu that handles: new game creation (6-step wizard),
save/load management (1 auto + 3 manual slots), settings, and optional Supabase
authentication. ADR-001 chose SvelteKit but didn't specify route structure or
menu-to-gameplay transitions. Without this ADR, developers must invent routing
and state patterns ad hoc.

### Current State
No menu implementation exists. The GDD (`main-menu-flow.md`) defines a complete
6-step wizard, save slot mechanics, and auth integration. ADR-001 provides the
framework (SvelteKit routes, Supabase Auth) but no menu-specific architecture.

### Constraints
- SvelteKit route groups for menu/game separation (ADR-001)
- Supabase Auth for optional cloud saves (ADR-001)
- IndexedDB for offline-first persistence (ADR-003)
- No heavy simulation data loaded during menu (performance)
- Menu must work without authentication (auth is optional)

### Requirements
- 6-step campaign creation wizard with forward/backward navigation
- Save slot management: 1 autosave + 3 manual, with metadata display
- Cloud sync with conflict resolution (local vs. cloud)
- Language selection before game data loads
- Menu load <2s, wizard steps <100ms each (step 5 agency selection <500ms)
- Route-driven for browser back/forward support

---

## Decision

### Route Structure

```
src/routes/
├── (menu)/                    # Menu route group — no HUD, no sim
│   ├── +layout.svelte         # Full-screen menu layout, no nav bar
│   ├── +page.svelte           # Title screen (Continue/New/Load/Settings)
│   ├── new-game/
│   │   ├── +layout.svelte     # Wizard layout with step indicator
│   │   ├── step-1/+page.svelte   # Producer name, gender, birthday
│   │   ├── step-2/+page.svelte   # Background city selection
│   │   ├── step-3/+page.svelte   # Reputation tier selection
│   │   ├── step-4/+page.svelte   # Production styles + personality traits
│   │   ├── step-5/+page.svelte   # Agency selection (lazy loads world pack)
│   │   └── step-6/+page.svelte   # Summary + confirmation
│   ├── load-game/+page.svelte # Save slot list
│   └── settings/+page.svelte  # Pre-game settings
│
├── (game)/                    # Game route group — HUD, sim active
│   ├── +layout.svelte         # Game layout with nav, time controls
│   └── portal/+page.svelte    # Main dashboard (entry after menu)
```

**Key decisions:**
- Route groups `(menu)` and `(game)` isolate layouts — menu has no HUD, game has
  full navigation
- Wizard steps are individual routes for browser history support
- Settings is a route, not a modal, for direct-link support
- Auth modal overlays any menu page (not a separate route)

### Wizard State Machine

```
┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
│ Step 1   │──▶│ Step 2   │──▶│ Step 3   │──▶│ Step 4   │──▶│ Step 5   │──▶│ Step 6   │
│ Identity │   │ City     │   │ Tier     │   │ Styles   │   │ Agency   │   │ Confirm  │
└─────────┘   └─────────┘   └─────────┘   └─────────┘   └─────────┘   └─────────┘
     ◀──────────────◀──────────────◀──────────────◀──────────────◀────────────┘
                              (Back navigation allowed)
```

**State storage:** Svelte store (`$state` rune) persisted to `sessionStorage`.
- If user refreshes mid-wizard, state restores from sessionStorage
- If user navigates away and returns, wizard resumes at last step
- On "Iniciar Campanha" (step 6): create full GameState, write to IndexedDB,
  navigate to `/(game)/portal`

```typescript
interface WizardState {
  currentStep: 1 | 2 | 3 | 4 | 5 | 6;
  producer: {
    name: string;
    surname: string;
    pronoun: string;       // default: "[Surname]-san"
    gender: 'M' | 'F' | 'Other';
    birthdayMonth: number;
    birthdayDay: number;
  };
  city: CityId | null;      // Tokyo, Osaka, Fukuoka, Nagoya, Sapporo, Okinawa
  tier: ReputationTier | null;
  styles: StyleId[];         // 1-2 selected
  traits: TraitId[];         // exactly 2 selected
  agencyId: string | null;   // selected from world pack
}
```

**Validation per step:**
- Step 1: name ≥ 3 chars, surname ≥ 2 chars, gender selected
- Step 2: city selected
- Step 3: tier selected
- Step 4: 1-2 styles, exactly 2 traits
- Step 5: agency selected
- Step 6: all fields valid (summary display)

### Save Slot Management

```typescript
interface SaveSlotMetadata {
  slotId: 'auto' | 'manual-1' | 'manual-2' | 'manual-3';
  agencyName: string;
  agencyTier: string;
  currentWeek: number;
  savedAt: number;       // timestamp
  cloudSynced: boolean;
  version: string;       // game version for migration check
}
```

**Storage strategy:**
- **Primary**: IndexedDB (always available, offline-first)
- **Secondary**: Supabase `game_saves` table with RLS (requires auth)
- **Conflict resolution**: On load, if both local and cloud exist with different
  timestamps, show modal: "Use local save (newer) or cloud save (newer)?"
- **Autosave**: Triggered by simulation after each week tick (not menu concern —
  handled by ADR-002 pipeline)

### Auth Integration

```
User opens game
  → Menu loads (no auth required)
  → "New Game" → wizard completes → save to IndexedDB
  → Optional: "Create account?" prompt at step 6
    → If yes: Supabase Auth (email/Google/Discord)
    → If no: local-only save

User opens game later
  → If authenticated: load save list from both IndexedDB + Supabase
  → If not authenticated: load from IndexedDB only
  → "Log In" available from menu title screen
```

**Key rule:** Authentication is never required for gameplay. Cloud sync is a
convenience feature, not a gate.

### Transition to Gameplay

On "Iniciar Campanha" or "Load Game":
1. Create/deserialize GameState (ADR-003 schema)
2. Initialize SimOrchestrator in Web Worker (ADR-002)
3. Navigate to `/(game)/portal` with fade transition
4. Game layout takes over (HUD, nav bar, time controls appear)

---

## Alternatives Considered

### Alternative 1: Single-Page App with Modal Wizard
- **Description**: Menu and game in same route group, wizard as modal overlay
- **Pros**: Simpler routing, no route group setup
- **Cons**: Browser back button breaks, can't deep-link to wizard steps, heavy
  game bundle loaded for menu
- **Rejection Reason**: SvelteKit route groups provide clean separation for free

### Alternative 2: URL-Param Wizard State
- **Description**: Store wizard state in URL query params
- **Pros**: Fully shareable/bookmarkable wizard state
- **Cons**: Sensitive data in URL (name), overly long URLs, security concern
- **Rejection Reason**: sessionStorage is sufficient; wizard state is ephemeral

---

## Consequences

### Positive
- Clean separation between menu and game UI via route groups
- Wizard is resumable across page refreshes (sessionStorage)
- Auth is optional — no friction for single-player experience
- Route-driven menu supports browser navigation naturally

### Negative
- Route groups add structural complexity to `src/routes/`
- sessionStorage wizard state lost if browser tab closes (acceptable trade-off)

### Neutral
- Settings route vs. modal is a cosmetic choice; route chosen for consistency

---

## Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Auth flow confusion (when is login required?) | MEDIUM | LOW | Clear UI messaging: "Optional — for cloud saves" |
| Save conflict resolution confusing players | LOW | MEDIUM | Default to newest; modal only on ambiguous timestamps |
| Step 5 agency data too slow to load | LOW | MEDIUM | Preload world pack data on wizard entry |

---

## Performance Implications

| Metric | Budget |
|--------|--------|
| Menu title screen load | <2s (no game data) |
| Wizard step navigation | <100ms each |
| Step 5 agency load | <500ms (world pack lazy load) |
| Save slot list load | <500ms (IndexedDB + cloud) |
| Game state creation (step 6) | <1s |
| Transition to portal | <500ms (fade + initial render) |

---

## Migration Plan

1. Create route group structure `(menu)/` and `(game)/`
2. Implement title screen with static buttons
3. Build wizard flow step by step (1-6)
4. Integrate IndexedDB save/load
5. Add Supabase auth (optional layer)
6. Implement cloud sync + conflict resolution

**Rollback plan:** Menu is self-contained; can revert to any step without
affecting game systems.

---

## Validation Criteria

- [ ] Menu loads <2s without game data
- [ ] Wizard completes all 6 steps with validation
- [ ] Wizard state persists across page refresh (sessionStorage)
- [ ] Save/load works offline (IndexedDB only)
- [ ] Auth is optional — game playable without login
- [ ] Cloud sync with conflict resolution modal works
- [ ] Browser back/forward works in wizard
- [ ] Transition to portal creates valid GameState

---

## GDD Requirements Addressed

| GDD Document | TR-ID | Requirement | How This ADR Satisfies It |
|-------------|-------|-------------|--------------------------|
| main-menu-flow.md | TR-main-menu-001 | 6-step new game wizard | Route-per-step wizard with validation |
| main-menu-flow.md | TR-main-menu-002 | Title screen with Continue/New/Load/Settings | `(menu)/+page.svelte` with conditional Continue |
| main-menu-flow.md | TR-main-menu-003 | 1 autosave + 3 manual save slots | SaveSlotMetadata with 4 slot IDs |
| main-menu-flow.md | TR-main-menu-004 | Language selection before game data | Settings route accessible from title |
| main-menu-flow.md | TR-main-menu-005 | SvelteKit route groups for menu/game | `(menu)/` and `(game)/` route groups |
| main-menu-flow.md | TR-main-menu-006 | Supabase Auth with Google/Discord/email | Optional auth with cloud sync |
| main-menu-flow.md | TR-main-menu-007 | Agency roster init as player idols | Step 5 selection → GameState creation |

---

## Related

- [ADR-001: Stack Tecnológica](adr-001-stack-tecnologica.md)
- [ADR-003: Game State Schema](adr-003-game-state-schema.md)
- [ADR-006: UI Architecture](adr-006-ui-architecture.md)
- [ADR-010: i18n](adr-010-i18n.md)
