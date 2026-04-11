# ADR-020: Tutorial/Onboarding & Settings/Accessibility

## Status
Accepted

## Date
2026-04-09

## Last Verified
2026-04-09

## Decision Makers
user + architecture-review

## Summary
Tutorial and settings are meta-systems outside the core game loop. This ADR
defines the progressive tutorial trigger system, settings persistence strategy,
and accessibility features (theme, text scaling, notifications, key remapping).

---

## Engine Compatibility

| Field | Value |
|-------|-------|
| Engine | SvelteKit 2.50 + Svelte 5 |
| Domain | UI / Meta |
| Knowledge Risk | LOW |
| Post-Cutoff APIs Used | Svelte 5 runes for reactive settings |

## ADR Dependencies

| Field | Value |
|-------|-------|
| Depends On | ADR-001 (SvelteKit), ADR-006 (UI architecture), ADR-013 (settings accessible from main menu) |
| Enables | Tutorial stories, settings/accessibility stories |
| Blocks | Onboarding flow, accessibility compliance |

---

## Decision

### Part A: Tutorial/Onboarding (TR-tutorial-001..002)

#### Progressive Hint System

The tutorial is **not a linear sequence** but a context-triggered hint system.
Hints fire once per game when the player first encounters a mechanic:

```typescript
interface TutorialState {
  completedHints: Set<string>;   // hint IDs already shown
  enabled: boolean;              // player can disable all hints
  difficulty: 'guided' | 'standard' | 'expert';  // controls hint frequency
}

interface TutorialHint {
  id: string;                    // e.g. 'first-job-assign', 'first-contract'
  triggerCondition: (state: GameState) => boolean;
  screen: string;                // route where hint appears
  content: { titleKey: string; bodyKey: string };  // i18n keys
  highlightSelector?: string;    // CSS selector to highlight UI element
}

// Example triggers:
// 'first-job-assign' → player opens job board AND has ≥1 idol with no job
// 'first-contract-expiry' → any contract expires for the first time
// 'first-show' → player schedules first show
```

**Pipeline integration:** Tutorial state is persisted in save data. Hint
checking runs in UI layer (not simulation) — checks on route navigation and
after state projection updates. Never interrupts simulation.

### Part B: Settings & Accessibility (TR-settings-001..005)

#### Settings Architecture

```typescript
interface GameSettings {
  // Display
  theme: 'light' | 'dark' | 'system';
  textScale: number;             // 0.8 to 1.5 (multiplier)
  animationsEnabled: boolean;
  
  // Audio
  masterVolume: number;          // 0-100
  musicVolume: number;
  sfxVolume: number;
  notificationSounds: boolean;
  
  // Gameplay
  language: 'en' | 'ja' | 'pt';
  simulationSpeed: 'normal' | 'fast' | 'fastest';
  autosaveEnabled: boolean;
  confirmBeforeSkip: boolean;
  
  // Accessibility
  highContrast: boolean;
  reducedMotion: boolean;
  screenReaderMode: boolean;
  keyRemapping: Record<string, string>;  // actionId → key
  
  // Cloud
  cloudSyncEnabled: boolean;
  notificationsEnabled: boolean;
}
```

**Persistence:**
- Settings stored in `localStorage` (not in save file — shared across saves)
- Applied immediately on change (no restart required, per GDD)
- Language change triggers `svelte-i18n` locale switch (ADR-010)
- Theme change applies Tailwind dark/light class on `<html>`

**Key remapping:**
```typescript
const DEFAULT_KEYS: Record<string, string> = {
  'macro-1': '1',        // Portal
  'macro-2': '2',        // Roster
  'macro-3': '3',        // Market
  'macro-4': '4',        // Operations
  'macro-5': '5',        // Agency
  'macro-6': '6',        // Producer
  'search': 'Ctrl+K',
  'pause': 'Space',
  'skip-week': 'Enter',
  'quick-save': 'Ctrl+S',
};
// Player can remap any action to any single key or key combo
```

**Accessibility features:**
- High contrast: increases border/text contrast ratios to WCAG AAA
- Reduced motion: disables transitions, animations, auto-scroll
- Screen reader mode: adds ARIA live regions to simulation updates
- Text scale: CSS custom property `--text-scale` applied to root

---

## GDD Requirements Addressed

| GDD Document | TR-ID | Requirement | How This ADR Satisfies It |
|-------------|-------|-------------|--------------------------|
| tutorial-onboarding.md | TR-tutorial-001 | Progressive context-triggered hints | TutorialHint with triggerCondition per mechanic |
| tutorial-onboarding.md | TR-tutorial-002 | 3 difficulty levels controlling hint frequency | TutorialState.difficulty: guided/standard/expert |
| settings-accessibility.md | TR-settings-001 | Theme toggle (light/dark) without restart | Tailwind dark class + immediate CSS swap |
| settings-accessibility.md | TR-settings-002 | Language selection (EN/JA/PT) without restart | svelte-i18n locale switch (ADR-010) |
| settings-accessibility.md | TR-settings-003 | Key remapping for all actions | keyRemapping Record with DEFAULT_KEYS fallback |
| settings-accessibility.md | TR-settings-004 | Text scaling for accessibility | CSS --text-scale custom property; 0.8-1.5 range |
| settings-accessibility.md | TR-settings-005 | High contrast and reduced motion modes | WCAG AAA contrast + prefers-reduced-motion support |

---

## Related

- [ADR-006: UI Architecture](adr-006-ui-architecture.md) — component patterns
- [ADR-010: i18n](adr-010-i18n.md) — language switching
- [ADR-013: Main Menu](adr-013-main-menu-game-flow.md) — settings route
