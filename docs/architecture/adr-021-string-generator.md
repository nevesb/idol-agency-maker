# ADR-021: Development-Time String Generator Pipeline

## Status
Accepted

## Date
2026-04-11

## Last Verified
2026-04-11

## Decision Makers
user + architecture-review

## Summary
All player-facing parameterizable strings (120 message types, news templates, dialogue
lines) are produced by a development-time generator that reads GDD catalogs and outputs
typed locale files. No LLM runs in production — all text is static, pre-authored, and
shipped with the game. This ADR defines the generator's input format, output schema, and
the string registry that enforces completeness across languages.

---

## Engine Compatibility

| Field | Value |
|-------|-------|
| Engine | SvelteKit 2.50 + Svelte 5 |
| Domain | Tooling / i18n / Build Pipeline |
| Knowledge Risk | LOW |
| Post-Cutoff APIs Used | None |
| Verification Required | None — offline tooling |

## ADR Dependencies

| Field | Value |
|-------|-------|
| Depends On | ADR-010 (i18n strategy — locale file format), ADR-014 (message types — defines the 120 message types) |
| Enables | All message implementation stories, news template authoring |
| Blocks | Message system stories (templates must exist before messages can render) |

---

## Context

### Problem Statement
The game has 120 message types (ADR-014), ~375 news templates (ADR-010), and
dialogue lines — all parameterizable, all needing translation into 3 languages
(EN/JA/PT). Manually maintaining locale JSON files is error-prone: missing keys,
mismatched parameters, stale translations. The game must ship with zero missing
strings and zero LLM calls in production.

### Constraints
- No LLM in production — all strings must be static at build time
- 3 languages from day one (EN, JA, PT) with future expansion
- Each string must be parameterizable (e.g. `{idolName}` interpolation)
- Type-safe: compile-time check that all params are provided
- Adding a new language = running the generator, not changing code

---

## Decision

### String Registry Format

Every translatable string in the game is registered in a **string registry file**
(`tools/string-registry/messages.yaml`) with this format:

```yaml
# Each entry has: ID, context, original text, and parameter slots
strings:
  - id: MSG-C01
    context: "Inbox message: contract expiring warning. Sent 4 weeks before expiration."
    original: "O contrato de {idolName} vence em {weeksLeft} semanas. Deseja renovar?"
    params:
      - name: idolName
        type: string
        description: "Idol's display name"
      - name: weeksLeft
        type: number
        description: "Weeks until contract expires"
    category: contracts
    priority: important

  - id: MSG-I14
    context: "Inbox message: idol injured. Urgent notification with injury type and recovery time."
    original: "{idolName} sofreu {injuryType}. Recuperação estimada: {recoveryWeeks} semanas."
    params:
      - name: idolName
        type: string
      - name: injuryType
        type: string
        description: "Localized injury type name"
      - name: recoveryWeeks
        type: number
    category: idols
    priority: urgent

  # ... 118 more entries
```

**Required fields per entry:**
1. **`id`** — Unique message ID (e.g. `MSG-C01`). Must match the GDD catalog.
2. **`context`** — Where and when this string appears. Gives translators enough
   information to choose the right tone, formality, and length.
3. **`original`** — The source text in Portuguese (primary development language).
   Parameters use `{paramName}` interpolation syntax.
4. **`params`** — List of parameter slots with name, type, and description.
5. **`category`** — Message category from GDD catalog.
6. **`priority`** — Visual priority (urgent/important/normal/info).

### Generator Pipeline

```
tools/string-registry/messages.yaml    ← Source of truth (authored by hand)
        │
        ▼
tools/generate-strings.ts              ← Generator script
        │
        ├──▶ src/lib/i18n/messages/en.json    ← English locale
        ├──▶ src/lib/i18n/messages/ja.json    ← Japanese locale
        ├──▶ src/lib/i18n/messages/pt.json    ← Portuguese locale
        └──▶ src/lib/types/message-keys.ts    ← TypeScript types
```

### Generator Script (`tools/generate-strings.ts`)

```typescript
// Input: reads string-registry/messages.yaml
// Output: produces locale files + TypeScript types
//
// Steps:
// 1. Parse YAML registry
// 2. Validate: every entry has id, context, original, params
// 3. For each supported locale:
//    a. Read existing translation file (if exists)
//    b. Merge: keep existing translations, flag new entries as UNTRANSLATED
//    c. Write locale JSON with structure: { "MSG-C01.title": "...", "MSG-C01.body": "..." }
// 4. Generate TypeScript types:
//    a. MessageTypeId union type from all IDs
//    b. MessageParams<T> mapped type: MSG-C01 → { idolName: string; weeksLeft: number }
//    c. Compile-time enforcement: bodyParams must match MessageParams<type>
// 5. Validation report: list UNTRANSLATED entries per locale

interface GeneratorConfig {
  registryPath: string;        // tools/string-registry/messages.yaml
  outputDir: string;           // src/lib/i18n/messages/
  typesOutputPath: string;     // src/lib/types/message-keys.ts
  supportedLocales: string[];  // ['en', 'ja', 'pt']
  primaryLocale: string;       // 'pt' (original text language)
}
```

### Generated TypeScript Types

```typescript
// Auto-generated by tools/generate-strings.ts — DO NOT EDIT

export type MessageTypeId =
  | 'MSG-W01' | 'MSG-W02' | ... | 'MSG-MR06';  // all 120 IDs

export type MessageParams = {
  'MSG-C01': { idolName: string; weeksLeft: number };
  'MSG-C02': { idolName: string; contractValue: number };
  'MSG-I14': { idolName: string; injuryType: string; recoveryWeeks: number };
  // ... all 120 entries
};

// Usage in code:
// const msg: GameMessage<'MSG-C01'> = {
//   type: 'MSG-C01',
//   bodyParams: { idolName: 'Suzuki', weeksLeft: 4 },  // type-checked!
// };
```

### Translation Workflow

1. **Developer** adds new message to `messages.yaml` with `original` in PT
2. **Developer** runs `npx tsx tools/generate-strings.ts`
3. Generator produces locale files with `UNTRANSLATED:` prefix for missing translations
4. **Translator** fills in EN and JA translations in the locale JSON files
5. Generator re-run validates completeness: `0 UNTRANSLATED` = ready to ship

### Adding a New Language

```bash
# 1. Add locale to config
# 2. Run generator — creates new locale file with all entries marked UNTRANSLATED
npx tsx tools/generate-strings.ts --add-locale ko

# 3. Translate all UNTRANSLATED entries
# 4. Re-run to validate
npx tsx tools/generate-strings.ts --validate
```

### CI Integration

```yaml
# GitHub Actions: fail build if any UNTRANSLATED entries exist
- name: Validate string completeness
  run: npx tsx tools/generate-strings.ts --validate --strict
```

---

## Consequences

### Positive
- Zero LLM in production — all strings are static, deterministic, and shippable
- Type-safe: compile-time check catches missing/wrong params before runtime
- Adding a language is mechanical (run generator, translate, done)
- String registry is the single source of truth — no drift between code and translations
- Context field gives translators enough info to produce accurate translations

### Negative
- Manual authoring of 120 × 3 = 360 string translations
- Registry must be kept in sync with GDD catalog (new message type = new registry entry)

---

## Performance Implications

| Metric | Budget |
|--------|--------|
| Generator run time | <5s for 120 entries |
| Locale file size (per language) | <50KB |
| String lookup at runtime | O(1) hash map (svelte-i18n) |

---

## GDD Requirements Addressed

This ADR extends ADR-014's coverage. No new TR-IDs — the string generator is
an implementation strategy for TR-messages-001 through TR-messages-005.

| Requirement | How This ADR Addresses It |
|-------------|--------------------------|
| TR-messages-001 (120 message types) | Registry covers all 120 types with params |
| ADR-010 (i18n strategy) | Generator produces locale files per ADR-010 format |
| ADR-014 (no LLM in production) | All strings are dev-time generated, static at runtime |

---

## Related

- [ADR-010: i18n Strategy](adr-010-i18n.md) — locale file format and svelte-i18n
- [ADR-014: Message Types](adr-014-message-types-inbox.md) — message taxonomy and inbox architecture
- [GDD: message-types-catalog.md](../../design/gdd/message-types-catalog.md) — 120 message definitions
