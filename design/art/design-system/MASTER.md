# Star Idol Agency — Design System: The Gentle Storybook

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Star Idol Agency
**Updated:** 2026-04-03
**Aesthetic:** Otome Pastel — Soft, Dusty, Watercolor
**North Star:** Dark mode = "The Gentle Evening Storybook" / Light mode = "The Paper Craft Atelier"

---

## Creative Direction

This is a management simulation about Japanese idol agencies. The UI must feel like a **beautiful storybook** — warm, dreamy, tactile. Like opening a hand-painted letter, not launching a tech product.

**Dark mode** feels like a gentle twilight evening in a cozy studio.
**Light mode** feels like a Japanese *zakka* shop — warm ivory, washi paper, watercolor accents.

### Core Principles

- **ALL colors are PASTEL** — soft, dusty, muted. NEVER neon, NEVER vivid, NEVER saturated
- **Watercolor feel** — everything looks painted, not digital
- **Breathing room** — generous whitespace, low information density
- **Tonal layering** — depth through color shifts, not hard lines or shadows
- **No-Line Rule** — boundaries defined by background shifts, never by solid borders

---

## Accent Colors (Shared Between Themes)

These accent hues are the same seed; their applied value shifts per theme.

| Role | Seed Hex | CSS Variable | Name |
|------|----------|--------------|------|
| Primary | `#D4A0B9` | `--color-primary` | Dusty Rose |
| Secondary | `#B8A9C9` | `--color-secondary` | Soft Lilac |
| Tertiary | `#D4C5A0` | `--color-tertiary` | Warm Cream |
| Success | `#A8D5BA` | `--color-success` | Sage Green |
| Danger | `#D4A0A0` | `--color-danger` | Muted Coral |
| Warning | `#D4BCA0` | `--color-warning` | Warm Peach |

---

## Dark Mode Tokens

North Star: "The Gentle Evening Storybook"

### Surfaces

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Base Background | `#1C1826` | `--color-bg-base` |
| Surface | `#1C162B` | `--color-surface` |
| Surface Container Low | `#151022` | `--color-surface-low` |
| Surface Container | `#1C162B` | `--color-surface-container` |
| Surface Container High | `#221C33` | `--color-surface-high` |
| Surface Container Highest | `#29213D` | `--color-surface-highest` |

### Text

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Text Primary | `#F0E8EC` | `--color-text` |
| Text Secondary | `#B8A0AC` | `--color-text-secondary` |
| Text Muted | `#8A7882` | `--color-text-muted` |

### Glass

| Role | Value |
|------|-------|
| Glass Fill | `rgba(212, 160, 185, 0.04)` |
| Glass Fill Hover | `rgba(212, 160, 185, 0.08)` |
| Glass Fill Active | `rgba(212, 160, 185, 0.12)` |
| Ghost Border | `rgba(212, 160, 185, 0.06)` |
| Backdrop Blur | `blur(12px)` |

### Elevation

| Level | Value |
|-------|-------|
| Ambient | `0 12px 32px rgba(28, 24, 38, 0.4)` |
| Soft Lift | `0 8px 24px rgba(28, 24, 38, 0.3)` |
| Focus Ring | `0 0 0 3px rgba(184, 169, 201, 0.3)` |

### Applied Accent Colors (Dark)

| Role | Hex | Name |
|------|-----|------|
| Primary on dark | `#EEB7D1` | Soft Dusty Rose |
| Primary container | `#6F465B` | Deep Rose |
| Secondary on dark | `#D0C0E1` | Pale Lilac |
| Secondary container | `#423651` | Deep Lilac |

---

## Light Mode Tokens

North Star: "The Paper Craft Atelier"

### Surfaces

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Base Background | `#FDF8F5` | `--color-bg-base` |
| Surface | `#FDF8F5` | `--color-surface` |
| Surface Container Low | `#F8F3F0` | `--color-surface-low` |
| Surface Container | `#F2EDE9` | `--color-surface-container` |
| Surface Container High | `#ECE7E3` | `--color-surface-high` |
| Surface Container Highest | `#E6E2DF` | `--color-surface-highest` |

### Text

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Text Primary | `#2A1E24` | `--color-text` |
| Text Secondary | `#6B5060` | `--color-text-secondary` |
| Text Muted | `#9B8890` | `--color-text-muted` |
| Text On Surface Variant | `#4F4448` | `--color-text-variant` |

### Glass (Light)

| Role | Value |
|------|-------|
| Glass Fill | `surface` at 80% opacity |
| Frosted Washi | `rgba(212, 160, 185, 0.05)` |
| Ghost Border | `rgba(211, 194, 200, 0.15)` |
| Backdrop Blur | `blur(16px)` |

### Elevation (Light)

| Level | Value |
|-------|-------|
| Ambient | `0 8px 24px rgba(42, 30, 36, 0.05)` |
| Card Lift | `0 4px 16px rgba(42, 30, 36, 0.04)` |
| Focus Ring | `0 0 0 3px rgba(125, 81, 104, 0.2)` |

### Applied Accent Colors (Light)

| Role | Hex | Name |
|------|-----|------|
| Primary on light | `#7D5168` | Deep Dusty Rose |
| Primary container | `#D4A0B9` | Dusty Rose |
| Secondary on light | `#67587C` | Muted Lilac |
| Secondary container | `#E8D5FF` | Pale Lavender |

---

## Typography

| Level | Font | Weight | Size | Tracking | Usage |
|-------|------|--------|------|----------|-------|
| Display | Plus Jakarta Sans | 700 | 48px | -0.02em | Logo, idol names, hero |
| Headline | Plus Jakarta Sans | 600 | 32px | -0.01em | Section headers |
| Title | Plus Jakarta Sans | 600 | 24px | 0 | Card headers |
| Body | DM Sans | 400 | 16px | 0 | All body text |
| Body Small | DM Sans | 400 | 14px | 0 | Secondary text |
| Label | Space Grotesk | 500 | 12px | +0.05em | Stats, data, metadata (uppercase) |
| Label Large | Space Grotesk | 500 | 14px | +0.02em | Data values |

**Google Fonts Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap');
```

**Notes:**
- Use primary color for Titles in both themes to create "narrative beats"
- Labels always uppercase with letter-spacing for an editorial feel
- Use Space Grotesk for all numerical data
- In light mode, use `on-surface-variant` `#4F4448` for long body text (warmer, less strain)

---

## Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` | Tight gaps |
| `--space-sm` | `8px` | Icon gaps, inline |
| `--space-md` | `16px` | Standard padding |
| `--space-lg` | `24px` | Section padding |
| `--space-xl` | `32px` | Large gaps |
| `--space-2xl` | `48px` | Section margins |
| `--space-3xl` | `64px` | Hero padding |

---

## Component Specs

### Buttons

```css
/* Primary — Subtle gradient, pill shape */
.btn-primary {
  background: linear-gradient(135deg, var(--color-primary), var(--primary-dim));
  color: var(--color-text-on-primary);
  padding: 12px 28px;
  border-radius: 9999px;
  font-weight: 600;
  font-family: 'Plus Jakarta Sans', sans-serif;
  transition: all 250ms ease;
  cursor: pointer;
  border: none;
}

/* Secondary — Ghost glass */
.btn-secondary {
  background: transparent;
  color: var(--color-primary);
  border: 1px solid var(--glass-ghost-border);
  padding: 12px 28px;
  border-radius: 9999px;
  font-weight: 500;
  transition: all 250ms ease;
  cursor: pointer;
}

/* Tertiary — Text only */
.btn-tertiary {
  background: transparent;
  color: var(--color-primary);
  border: none;
  padding: 12px 20px;
  font-weight: 500;
  cursor: pointer;
}
```

### Cards

```css
/* Dark: surface-container-high bg, no borders */
/* Light: surface-container-lowest (#FFF) on surface bg */
.card {
  background: var(--color-surface-high);
  border-radius: 12px;
  padding: 24px;
  transition: all 250ms ease;
}
```

No dividers inside cards — use `--space-lg` for content separation.

### Chips / Tags

```css
.chip {
  background: var(--secondary-container);
  color: var(--on-secondary-container);
  border-radius: 9999px;
  padding: 4px 12px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

### Input Fields

```css
.input {
  background: var(--color-surface-high);
  color: var(--color-text);
  padding: 12px 16px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-family: 'DM Sans', sans-serif;
  transition: all 250ms ease;
}

.input:focus {
  background: var(--color-surface-highest);
  outline: none;
  box-shadow: var(--focus-ring);
}
```

### Modals

```css
.modal-overlay {
  background: rgba(28, 24, 38, 0.6); /* dark */
  /* light: rgba(42, 30, 36, 0.3) */
  backdrop-filter: blur(8px);
}

.modal {
  background: var(--color-surface-container);
  border-radius: 24px;
  padding: 32px;
  box-shadow: var(--shadow-ambient);
  max-width: 520px;
}
```

---

## Game-Specific Components

### Tier Badges

| Tier | Color | Note |
|------|-------|------|
| SSS/SS/S | `#D4C5A0` Warm Cream | Subtle sparkle |
| A | `#D4A0B9` Dusty Rose | |
| B | `#B8A9C9` Soft Lilac | |
| C | `#A8D5BA` Sage Green | |
| D | `#8A7882` Mauve | |

### Wellness Bars

| Range | Color | Meaning |
|-------|-------|---------|
| > 66% | `#A8D5BA` Sage | Healthy |
| 33–66% | `#D4C5A0` Cream | Caution |
| < 33% | `#D4A0A0` Coral | Critical |

### Alert Cards (Left Border Accents)

| Type | Border Color |
|------|-------------|
| Danger/Stress | `#D4A0A0` Muted Coral |
| Warning/Expiry | `#D4C5A0` Warm Cream |
| Info/Growth | `#B8A9C9` Soft Lilac |
| Success | `#A8D5BA` Sage Green |

### Decorative Elements

- Ghostly sakura silhouettes at 3% opacity in dark mode
- Washi-tape inspired category tags in light mode
- Star/sparkle decorations near achievements (muted, not bright)
- All decorative elements respect `prefers-reduced-motion`

---

## Layout Architecture

### Screen Hierarchy (3 Layers)

1. **Portal** — Dashboard overview
2. **Domain Overview** — Category view (Roster, Market, Operations, etc.)
3. **Detail** — Individual entity (Idol profile, Event, Contract)

### Navigation

Top bar: `Portal` | `Roster` | `Market` | `Operations` | `Agency` | `Producer`
Active tab: dusty rose underline

### Theme Toggle

- Moon icon = dark mode, Sun icon = light mode
- Respects `prefers-color-scheme` by default
- User preference persisted in localStorage

### Responsive

- PC-first: 1920x1080
- Breakpoints: 1440px, 1024px, 768px, 375px

---

## Interaction Design

| State | Effect | Timing |
|-------|--------|--------|
| Hover | Subtle warmth increase, gentle lift | 250ms ease |
| Active | Slightly deeper tint (NOT bright) | 150ms |
| Focus | Soft lilac outline ring | instant |
| Page Enter | Subtle fade-up | 300ms |

**Dark mode:** hover increases blur or lightens surface-tint. Never use "glow" effects.
**Light mode:** hover slightly increases background saturation. Press adds subtle inner shadow.

---

## Anti-Patterns (FORBIDDEN)

- **Neon colors** of any kind (`#EC4899`, `#F751A1`, `#00FF00`, etc.)
- Hot pink, electric purple, bright gold, vivid anything
- Pure black `#000000` or pure grey
- Pure white `#FFFFFF` (use `#FDF8F5` in light, `#F0E8EC` in dark)
- Black drop shadows (use mauve-tinted ambient shadows)
- 100% opaque borders (use ghost borders or tonal shifts)
- Sharp 90-degree corners (minimum 12px radius)
- Horizontal divider lines inside cards
- "Glow" hover effects
- Cold blue/green tints
- Corporate SaaS / dashboard aesthetic
- High-contrast vivid accents on muted backgrounds
- Emojis as functional icons (use Lucide SVG)

---

## Pre-Delivery Checklist

- [ ] ALL colors are pastel/dusty/muted — zero neon, zero vivid
- [ ] No pure black, pure white, or pure grey
- [ ] Theme toggle works between dark and light
- [ ] Dark mode surfaces are warm mauve, not black
- [ ] Light mode surfaces are warm ivory/cream, not cold white
- [ ] Glass surfaces barely visible, warm-tinted
- [ ] Shadows are mauve-tinted ambient, never black
- [ ] No solid opaque borders (ghost borders or tonal shifts only)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states are subtle (250ms), never flashy
- [ ] Focus states visible (lilac ring) for keyboard nav
- [ ] `prefers-reduced-motion` and `prefers-color-scheme` respected
- [ ] Responsive tested at 1920, 1440, 1024, 768, 375
- [ ] All icons from Lucide SVG set
