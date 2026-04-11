# ADR-014: Message Types & Inbox Delivery

## Status
Accepted

## Date
2026-04-09

## Last Verified
2026-04-09

## Decision Makers
user + architecture-review

## Summary
The game needs a structured inbox system delivering 120 message types across 13
categories to the player. This ADR defines the message taxonomy, priority system,
delivery rules, and inbox lifecycle — consuming events from ADR-004's event bus
as a terminal presentation handler.

---

## Engine Compatibility

| Field | Value |
|-------|-------|
| Engine | SvelteKit 2.50 + Svelte 5 |
| Domain | UI / State / Events |
| Knowledge Risk | LOW |
| References Consulted | ADR-004 event system, message-types-catalog.md |
| Post-Cutoff APIs Used | Svelte 5 runes ($state) |
| Verification Required | None — pure application-level architecture |

## ADR Dependencies

| Field | Value |
|-------|-------|
| Depends On | ADR-004 (event bus — messages are terminal consumers), ADR-003 (state schema — inbox stored in state) |
| Enables | Inbox UI implementation, notification system |
| Blocks | Message system stories |
| Ordering Note | ADR-004 must be Accepted first (it is). Messages are terminal handlers — never emit events. |

---

## Context

### Problem Statement
The GDD defines 120 message types (MSG-W01 through MSG-P03) that notify the
player of game events, request decisions, and deliver reports. These messages are
fundamentally different from ADR-004's internal events: events cascade between
systems synchronously; messages are stored for asynchronous player consumption.
Without a dedicated ADR, message structure and delivery rules would be ad hoc.

### Current State
ADR-004 already names `registerMessageHandlers` as a terminal handler in the
event dispatch chain. This ADR defines what those handlers produce and how the
inbox stores and surfaces messages.

### Constraints
- Messages are terminal consumers of ADR-004 events (never emit events)
- Inbox must persist across saves (stored in GameState via ADR-003)
- Urgent messages must interrupt Live/Skip mode (coordinated with ADR-004)
- Messages may require player action (CTA buttons)
- 3-month retention policy (soft — configurable)

### Requirements
- 120 message types across 13 categories with typed payloads
- 4 priority levels: Urgent (pauses sim), Important, Normal, Info
- 7 visual layouts for rendering
- Action-required messages track completion state
- Sender identification (system, staff, idol, rival)
- Search and filter in inbox UI

---

## Decision

### Message Architecture

Messages are the **player-facing presentation layer** of game events. The
relationship to ADR-004's event system:

```
SimEvent (ADR-004)              Message (ADR-014)
─────────────────               ─────────────────
Internal state cascade    →     Player notification
System ↔ System                 Game → Player
Synchronous, deterministic      Stored, async consumption
Dispatched in phase tick        Enqueued in inbox
Consumed by handlers            Read by player in UI
```

**One event can spawn zero, one, or many messages.** Not all events produce
messages — only events with player relevance.

### Message Type Structure

```typescript
interface GameMessage {
  id: string;                    // unique, e.g. "msg-2026w12-scandal-001"
  type: MessageTypeId;           // e.g. "MSG-E01"
  category: MessageCategory;     // 13 categories
  priority: MessagePriority;
  sender: MessageSender;
  
  // Content
  titleKey: string;              // i18n key for title
  bodyKey: string;               // i18n key for body template
  bodyParams: Record<string, string | number>;  // template interpolation
  attachments?: MessageAttachment[];  // idol refs, stat deltas, etc.
  
  // Action
  action?: MessageAction;        // CTA if decision required
  actionCompleted: boolean;      // tracks if player responded
  
  // Metadata
  week: number;                  // game week when created
  read: boolean;
  starred: boolean;
  expiresAtWeek?: number;        // auto-archive after this week
}

type MessageCategory =
  | 'onboarding' | 'contracts' | 'staff' | 'scouting' | 'jobs'
  | 'market' | 'idols' | 'finance' | 'scandals' | 'intelligence' | 'career';

type MessagePriority = 'urgent' | 'important' | 'normal' | 'info';

interface MessageSender {
  type: 'system' | 'staff' | 'idol' | 'rival' | 'owner';
  entityId?: string;   // staff/idol/rival ID for avatar display
  name: string;        // display name (localized)
}

interface MessageAction {
  type: 'approve-reject' | 'renew-dismiss' | 'negotiate' | 'acknowledge' | 'navigate';
  targetRoute?: string;   // navigate to this route on action
  payload?: unknown;       // action-specific data
}
```

### Priority → Delivery Rules

| Priority | Delivery | Sim Impact | Badge | Sound |
|----------|----------|-----------|-------|-------|
| 🔴 Urgent | Immediate overlay | Pauses Live/Skip | Red pulse | Alert chime |
| 🟡 Important | Inbox + badge | None | Yellow dot | Soft notification |
| 🟢 Normal | Inbox batch | None | Count increment | None |
| 🔵 Info | Inbox quiet | None | None | None |

**Urgent messages** use ADR-004's `urgent:*` event wrapper to force pause.
The message handler detects urgent events and both enqueues the message AND
triggers the UI overlay.

### Message Generation (Event → Message Mapping)

Messages are generated by terminal handlers registered in ADR-004's dispatch
chain. Handler registration follows ADR-004's ordering:

```typescript
// In registerMessageHandlers (ADR-004 Phase 3 — terminal)
function handleEvent(event: SimEvent, state: GameState): GameMessage[] {
  switch (event.type) {
    case 'contract:expiring':
      return [{
        type: 'MSG-C01',
        category: 'contracts',
        priority: 'important',
        sender: { type: 'staff', entityId: event.talentManagerId, name: '...' },
        titleKey: 'msg.contract.expiring.title',
        bodyKey: 'msg.contract.expiring.body',
        bodyParams: { idolName: event.idolName, weeksLeft: event.weeksLeft },
        action: { type: 'renew-dismiss' },
        // ...
      }];
    
    case 'scandal:triggered':
      return [{
        type: 'MSG-E01',
        category: 'scandals',
        priority: 'urgent',
        sender: { type: 'system', name: 'Sistema' },
        // ...
        action: { type: 'navigate', targetRoute: '/scandal/' + event.scandalId },
      }];
    
    // ... 55 more mappings
    default:
      return [];  // not all events produce messages
  }
}
```

### 13 Categories × 120 Types (Reference)

The full catalog is defined in `design/gdd/message-types-catalog.md`. This ADR
does not duplicate the catalog but establishes:

| Category | Count | Typical Priority | Typical Sender |
|----------|-------|-----------------|----------------|
| Onboarding | 3 | info | system |
| Contracts | 7 | important/urgent | staff (Talent Mgr) |
| Staff | 6 | normal/important | staff |
| Scouting | 5 | normal | staff (Scout) |
| Jobs | 8 | normal | staff |
| Market | 6 | important/urgent | staff/rival |
| Idols | 7 | normal/important | idol/staff |
| Finance | 5 | normal/important | system |
| Scandals | 4 | urgent | system |
| Intelligence | 3 | info/normal | staff (Analyst) |
| Career | 3 | normal | idol |

### Inbox State Slice

```typescript
interface InboxSlice {
  messages: GameMessage[];           // ordered newest-first
  unreadCount: number;               // computed
  urgentPending: GameMessage[];      // awaiting player acknowledgment
  
  // Retention
  retentionWeeks: number;            // default: 12 (3 months)
  
  // Filters (UI state, not persisted in save)
  activeFilter?: MessageCategory;
  showRead: boolean;
}
```

**Retention policy:** Messages older than `retentionWeeks` are auto-archived
at end-of-month processing. Starred messages are exempt from auto-archive.

### Content Generation Strategy — Development-Time String Generator

All parameterizable message strings are produced by a **development-time string
generator** (`tools/generate-strings.ts`). The generator:

1. Reads the message type catalog (`design/gdd/message-types-catalog.md`)
2. Extracts all 120 message type templates with their parameter slots
3. Produces typed locale files (`en.json`, `ja.json`, `pt.json`) per ADR-010
4. Generates a TypeScript `MessageKeys` type with all valid key + param combinations
5. Validates that every message type has templates in every supported language

**Why dev-time generation:**
- Adding a new language requires only running the generator with new translations —
  no code changes needed
- The generator enforces that all message types have complete coverage in all locales
- Type-safe: `bodyParams` must match the generated parameter slots at compile time
- The generator is reusable for any future parameterizable string system (news,
  dialogue, events)

**Running the generator:**
```bash
npx tsx tools/generate-strings.ts --catalog design/gdd/message-types-catalog.md --out src/lib/i18n/messages/
```

**No LLM in production.** All message strings are authored and generated at
development time. LLM is used only during development to assist with writing
templates — the final output is static locale files shipped with the game.

> **VERIFIED (2026-04-11):** Catalog audited against ADR-004 (33 events),
> ADR-009 (44 NPC decisions), and ADR-015/016/017/018 (56 events). Expanded
> from 57 to 120 message types across 13 categories. String generation
> pipeline defined in ADR-021.

---

## Alternatives Considered

### Alternative 1: Fold into ADR-004 as Amendment
- **Description**: Add message types to the event system ADR
- **Pros**: Single ADR for all cross-system communication
- **Cons**: ADR-004 grows to 600+ lines mixing architecture with UI feature spec.
  Messages are fundamentally different (stored, player-facing) vs. events
  (ephemeral, system-internal).
- **Rejection Reason**: Violates single-responsibility. ADR-004 answers "how
  systems talk"; this ADR answers "what the player sees in their inbox".

### Alternative 2: No ADR — Define in GDD Only
- **Description**: Keep message types as pure GDD spec, implement directly
- **Pros**: Less documentation overhead
- **Cons**: No architectural contract for message structure, priority delivery,
  or inbox lifecycle. Each developer interprets the GDD differently.
- **Rejection Reason**: Message system touches events (ADR-004), state (ADR-003),
  UI (ADR-006), and i18n (ADR-010) — needs explicit architectural integration.

---

## Consequences

### Positive
- Clear separation: events (internal) vs. messages (player-facing)
- Typed message structure prevents ad hoc string-based notifications
- Priority system integrates cleanly with ADR-004's urgent event mechanism
- i18n-ready from day one via template keys

### Negative
- 120 message types require significant template authoring work
- Each new game feature may require new message types (maintenance cost)

### Neutral
- Message handler is terminal — adding messages never affects game logic

---

## Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Message spam overwhelming inbox | MEDIUM | MEDIUM | Batch normal-priority per week; dedup similar messages |
| Urgent messages too frequent (annoying pauses) | LOW | HIGH | Cap urgent to 1 per phase; queue others as important |
| Template count grows beyond maintainability | LOW | LOW | Dev-time generator makes adding templates cheap; template registry tool |

---

## Performance Implications

| Metric | Budget |
|--------|--------|
| Message generation per week tick | <2ms (terminal handler) |
| Inbox render (50 messages visible) | <16ms (60fps) |
| Message search/filter | <50ms |
| Retention cleanup (monthly) | <5ms |

---

## Validation Criteria

- [ ] All 120 message types generate correctly from their trigger events
- [ ] Urgent messages pause Live/Skip mode within 1 frame
- [ ] Messages persist across save/load
- [ ] Inbox displays correct unread count
- [ ] Action-required messages track completion state
- [ ] 3-month auto-archive works; starred messages exempt
- [ ] Messages render in all 3 languages (EN/JA/PT)

---

## GDD Requirements Addressed

| GDD Document | TR-ID | Requirement | How This ADR Satisfies It |
|-------------|-------|-------------|--------------------------|
| message-types-catalog.md | TR-messages-001 | 120 message types across 13 categories | Typed GameMessage with MessageTypeId enum |
| message-types-catalog.md | TR-messages-002 | 4 priority levels with delivery rules | Priority enum with sim-impact rules |
| message-types-catalog.md | TR-messages-003 | Action-required messages with CTA | MessageAction interface with type + payload |
| message-types-catalog.md | TR-messages-004 | Sender identification (system/staff/idol/rival) | MessageSender with entityId for avatar |
| message-types-catalog.md | TR-messages-005 | 3-month retention with archive | retentionWeeks config + starred exemption |

---

## Related

- [ADR-004: Event System](adr-004-event-system.md) — messages consume events as terminal handlers
- [ADR-003: Game State Schema](adr-003-game-state-schema.md) — InboxSlice in state
- [ADR-006: UI Architecture](adr-006-ui-architecture.md) — inbox UI components
- [ADR-010: i18n](adr-010-i18n.md) — message templates in locale files
