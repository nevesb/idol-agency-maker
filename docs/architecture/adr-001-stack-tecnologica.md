# ADR-001: Stack Tecnológica

> **Status**: Accepted
> **Date**: 2026-04-02
> **Author**: user + game-designer
> **Supersedes**: Recomendacao anterior de Godot 4 + C# (game-concept.md)

## Context

O Star Idol Agency e um management sim profundo (48 sistemas desenhados,
11.600 linhas de GDD) que precisa de:

1. UI extremamente densa (tabelas configuraveis, filtros, hover, tooltips, right-click)
2. Saves no servidor (Supabase)
3. Modelo de negocio F2P + assinatura premium
4. Autenticacao e billing
5. Distribuicao PC-first com possibilidade de web e mobile
6. Geracao de personagens via ComfyUI em servidor RunPod

O jogo e 95% UI densa e 5% visual 2D. Nao tem 3D, fisica ou real-time graphics.

## Decision

### Frontend: SvelteKit (TypeScript)

**Motivo:**
- Compila pra vanilla JS sem virtual DOM — mais rapido que React em tabelas densas
- Bundle ~50KB (vs ~150KB+ React)
- Reatividade nativa (assignment = update) — ideal pra estado de jogo complexo
- SSR built-in — util pra landing page e SEO
- TypeScript pra tipagem forte nos 48 sistemas interconectados

**Alternativas rejeitadas:**
- React/Next.js: overhead de virtual DOM em tabelas com 50+ linhas
- Vue/Nuxt: ecossistema menor pra aplicacoes desktop-like
- Godot 4: UI system inferior a HTML/CSS pra tabelas densas, server saves manual

### Desktop Wrapper: Tauri 2.0

**Motivo:**
- App nativo leve (~10MB vs ~300MB Electron)
- Rust backend — hot paths de simulacao podem ir pra Rust se necessario
- Auto-update built-in
- Seguranca sandboxed por padrao
- Steam integration possivel

**Alternativas rejeitadas:**
- Electron: pesado demais (300MB+, 500MB RAM)
- App web puro: sem Steam, sem offline, menos "game feel"
- Godot: requer reimplementar toda UI que web faz nativamente

### Backend: Supabase

**Motivo:**
- Auth pronto (email, Google, Discord, Steam OAuth custom)
- PostgreSQL com Row Level Security pra saves isolados
- Edge Functions em TypeScript/Deno pra logica server-side
- Storage pra world packs, sprites, imagens geradas
- Realtime pra leaderboards futuros
- Pricing previsivel, free tier generoso

**Alternativas rejeitadas:**
- Firebase: vendor lock-in Google, Firestore menos flexivel que Postgres
- Backend custom (Node/Express): overhead de manutencao
- PocketBase: escala limitada

### Simulacao: TypeScript em Web Workers

**Motivo:**
- Roda em thread separada, nao bloqueia UI
- Mesmo TypeScript do frontend — sem context switch de linguagem
- Performance suficiente pra 3.000 idols em <500ms
- Fallback pra Rust via Tauri commands se necessario

### Geracao de Personagens: ComfyUI + RunPod

**Motivo:**
- Geracao offline em batch (nao em tempo real)
- RunPod serverless GPU sob demanda
- ComfyUI permite workflows complexos (face consistency, aging, expressions)
- 8 idades × 3 expressoes = 24 imagens por idol
- Armazenamento em Supabase Storage / CDN
- Cliente carrega imagem correta por idade e humor da idol

### Ferramentas Offline: Python

**Motivo:**
- World Pack Generator (5.000+ idols determinísticos)
- Template Generator (news templates via LLM)
- Balance Simulator (validar curvas de crescimento)
- ComfyUI Orchestrator (gerar e gerenciar 120.000 imagens)
- Python e o melhor ecossistema pra tooling de dados e LLM

### CI/CD: GitHub Actions

**Motivo:**
- Build automatizado pra web (Vercel/Cloudflare) e desktop (Tauri)
- Testes automatizados (Vitest + Playwright)
- Deploy continuo

## Stack Completa

```
RUNTIME (Cliente)
├── UI Layer          → SvelteKit + TypeScript
├── Game Logic        → TypeScript (stores, state management)
├── Simulation Core   → TypeScript (Web Worker thread separada)
├── Visual Layer      → Imagens pre-geradas (ComfyUI) carregadas por CDN
├── Desktop Wrapper   → Tauri 2.0 (Rust)
└── Audio             → Web Audio API (BGM, SFX)

BACKEND (Supabase)
├── Auth              → Supabase Auth (email, Google, Discord)
├── Database          → PostgreSQL (saves, profiles, leaderboards)
├── Edge Functions    → Deno/TypeScript (save/load, validation, billing)
├── Storage           → Supabase Storage (world packs, imagens, templates)
└── Realtime          → Supabase Realtime (leaderboards futuros)

GERACAO DE PERSONAGENS
├── ComfyUI           → Workflows de geracao (face + aging + expressions)
├── RunPod            → GPU serverless pra batch generation
├── Python Orchestrator → Coordena fila, upload, validacao
└── CDN/Storage       → Imagens servidas ao cliente

FERRAMENTAS OFFLINE (Python)
├── world_generator   → Gera 5.000+ idols deterministicos
├── comfyui_pipeline  → Orquestra geracao de 120.000 imagens
├── template_generator→ News templates via LLM
├── balance_simulator → Valida curvas de crescimento
└── seed_validator    → Garante determinismo

BUILD / DISTRIBUICAO
├── Web               → Vercel ou Cloudflare Pages
├── Desktop (Steam)   → Tauri build (.exe/.dmg/.AppImage)
├── Desktop (direto)  → Download do site
├── Mobile (futuro)   → PWA ou Capacitor
└── CI/CD             → GitHub Actions
```

## Performance Implications

| Risco | Mitigacao |
|---|---|
| Web Worker TS nao roda 3.000 idols em <500ms | Profiling cedo. Fallback: hot paths pra Rust via Tauri |
| ComfyUI face consistency entre idades | Prototipar workflow com 10 idols antes de escalar |
| 120.000 imagens = custo de storage alto | Compressao WebP, resolucao otimizada (512×512), CDN com cache |
| Tauri 2.0 ainda evoluindo | SvelteKit funciona standalone na web — Tauri e opcional |
| Supabase free tier insuficiente | Plano Pro ($25/mes) cobre ate 8GB DB + 100GB storage |

## Consequences

- Todo o codigo sera TypeScript (frontend + simulacao + backend)
- Designers podem iterar UI com HTML/CSS (mais rapido que game engine)
- Saves sao server-side por padrao (offline cache via IndexedDB)
- Updates sao instantaneos na web (sem download)
- Imagens de idols sao pre-geradas e servidas como assets estaticos
- O jogo pode rodar no browser OU como app desktop — mesmo codigo

## ADR Dependencies

None — this is the foundational technology stack decision. All subsequent ADRs
depend on this one.

## Engine Compatibility

This project uses a web stack, not a traditional game engine. Version pins:

| Component | Version | Risk |
|---|---|---|
| SvelteKit | 2.50.x | LOW — stable, follows semver |
| Svelte | 5.54.x (runes) | MEDIUM — runes API stabilized in 5.x but still evolving |
| Tauri | 2.x | MEDIUM — v2 stable since late 2024, plugin ecosystem maturing |
| Supabase JS | 2.101.x | LOW — stable client SDK |
| TypeScript | 5.9.x | LOW — conservative compiler upgrades |
| Vitest | 4.1.x | LOW |
| Playwright | 1.58.x | LOW |

**Breaking change risks:**
- Svelte 5 runes: `$state()`, `$derived()`, `$effect()` are stable but migration
  from Svelte 4 patterns (reactive statements `$:`) may still appear in older code
- Tauri 2 plugin API: verify plugin compatibility when upgrading minor versions
- Supabase: RLS policy syntax stable; edge function runtime (Deno) may have
  breaking changes on Supabase platform updates

## GDD Requirements Addressed

This ADR addresses technical requirements from:

- **game-concept.md** — PC-first dense UI (§ Technical Considerations), offline-first
  saves, seed-deterministic world generation, 5,000+ idol simulation performance
- **save-load.md** — Cloud saves via Supabase, IndexedDB local cache, 8 save slots
- **week-simulation.md** — Web Worker simulation thread, <500ms for 3,000 idols
- **visual-generator.md** — ComfyUI portrait pipeline, RunPod GPU, CDN delivery
- **idol-database-generator.md** — Python world pack tooling, seeded RNG
- **settings-accessibility.md** — Web platform accessibility (ARIA, keyboard nav)
- **ui-information-architecture.md** — Dense FM26-style UI via HTML/CSS/Tailwind
