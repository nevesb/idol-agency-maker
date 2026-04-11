# Save/Load System

> **Status**: Designed
> **Author**: user + game-designer
> **Last Updated**: 2026-03-30
> **Implements Pillar**: Infraestrutura — necessário pra tudo funcionar

## Overview

O Save/Load System serializa e restaura o estado completo do jogo: todas idols
(stats, wellness, contratos, finanças pessoais), agências (roster, orçamento,
facilities), rankings, charts de música, entidades de mídia, calendário, news
feed, e estado da agência do jogador. Autosave confiável garante que o
jogador pode fechar o jogo a qualquer momento sem perder progresso. O estado é
armazenado em IndexedDB (persistência local, ADR-001/003), com JSONB serialization
e delta saves via structuredClone. Cloud save sincroniza com Supabase Storage.

## Player Fantasy

Infraestrutura invisível. O jogador sente confiança de que seu progresso está
seguro. Fechar o app no meio de uma semana e reabrir exatamente onde parou.
A única interação visível é escolher slot de save ou ver
"salvando..." brevemente após cada semana.

## Detailed Design

### Core Rules

#### 1. Autosave

- **Trigger**: Autosave no fim de cada semana processada (após relatório)
- **Frequência**: A cada tick semanal (obrigatório, não opcional)
- **Indicador visual**: Ícone discreto "salvando..." por <1 segundo
- **Crash recovery**: Se o app fecha durante processamento da semana,
  restaura o estado do início da semana (antes do processamento)

#### 2. Slots de Save

Todos os jogadores têm acesso completo:

- **Autosave**: 1 slot (overwrite automático após cada semana)
- **Save manual**: 3 slots adicionais (total: 4 slots)
- **Quick save/load**: Sim
- **Export save**: Sim (backup externo)
- **Cloud save (cross-device)**: Sim, sync automático (requer conta logada)

#### 3. O que é Salvo (estado completo)

```
SaveState {
  // Meta
  version:        string    // Versão do jogo (pra migração)
  save_date:      datetime  // Quando foi salvo
  world_pack_id:  string    // Qual World Pack está usando
  game_week:      uint16    // Semana atual do jogo
  game_year:      uint8     // Ano atual

  // Agência do Jogador
  player_agency: {
    name, tier, budget, reputation,
    facilities: {type: level}[],
    roster: idol_id[],
    groups: group_id[],
    goals_current: goal[],
    goals_history: goal_result[]
  }

  // Todas Idols (~3000 ativas + debutadas recentes)
  idols: {
    id, current_stats[12], wellness_bars[4],
    contract: {clauses, start, end, agency_id},
    personal_finance: {savings, debt, goals, manager},
    fame, ranking_position,
    state: "active"|"burnout"|"crisis"|"debuted",
    history: event_log[]  // últimos 6 meses de eventos
  }[]

  // Agências Rivais (50)
  rival_agencies: {
    id, tier, budget, strategy, roster: idol_id[],
    facilities, reputation
  }[]

  // Rankings
  rankings: {
    individual: {idol_id, fame, position}[],
    groups: {group_id, fame, position}[],
    agencies: {agency_id, fame, position}[]
  }

  // Music Charts
  music_charts: {
    songs: {id, title, artist, position, weeks_in_chart, revenue}[],
    composers: {id, available, commissions_active}[]
  }

  // Media Entities
  media: {
    entities: {id, audience, shows: {id, audience, guests_this_month}[]}[]
  }

  // Calendário e Mercado
  calendar: {
    current_week, current_month, current_season,
    upcoming_events: event[],
    market: {available_idols: idol_id[], pending_proposals: proposal[]}
  }

  // News Feed (últimos 3 meses)
  news_feed: news_item[]

  // Player meta
  player_reputation: float,
  player_affinities: {idol_id: affinity_value}[]
}
```

#### 4. Arquitetura: Híbrido Client-First

```
CLIENT (dispositivo do jogador):
  ├── Simulação inteira roda local (toda lógica do jogo)
  ├── Save local (IndexedDB, funciona 100% offline — ADR-001/003)
  ├── Jogo funciona sem internet
  └── Performance: zero latência, zero custo de servidor

SERVIDOR (leve, só metadados):
  ├── Autenticação de conta (Supabase Auth)
  ├── Cloud save sync -- upload/download via Supabase Storage (requer conta)
  ├── Leaderboards globais (ranking de agências entre jogadores)
  ├── Catálogo de World Packs da comunidade
  └── Achievements e estatísticas agregadas
```

**Justificativa**: Estado do jogo é massivo (~6MB por jogador). Server-side
pra simulação seria proibitivamente caro ($5K-50K/mês). Client-first mantém
custo de servidor em $100-500/mês pra escala inicial.

#### 5. Formato de Armazenamento

- **IndexedDB** como formato local principal (ADR-001/003 — web-native, funciona
  offline, suporta Tauri e browser sem dependência nativa)
- Save = objeto JSONB serializado em IndexedDB object store
- Chaves: idol_id, agency_id, song_id pra lookups eficientes
- Delta saves via `structuredClone` — só grava entidades modificadas desde o
  último save (reduz I/O significativamente)
- **Cloud sync** (requer conta): Upload do save serializado (~1MB comprimido) via
  Supabase Storage após cada semana se online. Download ao logar em dispositivo novo

#### 6. Performance Budget

| Operação | Target PC | Target mínimo |
|---|---|---|
| **Autosave** (incremental) | <150ms | <100ms |
| **Save completo** (novo slot) | <2s | <1s |
| **Load** (iniciar jogo) | <1.5s | <1s |
| **Tamanho do save** | <50MB | <100MB |

- Autosave usa **delta save**: só grava o que mudou desde o último save
- Save completo grava tudo (usado pra novo slot ou export)
- Load carrega tudo em memória no boot

#### 6. Migração de Versão

Quando o jogo atualiza e o formato do save muda:
- Save inclui `version` field
- Ao carregar, se version < current: roda migration scripts
- Migrations são incrementais (v1→v2→v3, não v1→v3 direto)
- Se migration falha: save original preservado, erro reportado

### States and Transitions

| Estado | Descrição | Transição |
|---|---|---|
| **Idle** | Nenhuma operação de save/load em curso | → Saving, → Loading |
| **Saving** | Gravando estado no IndexedDB | → Idle (sucesso), → Error |
| **Loading** | Lendo estado do IndexedDB | → Idle (sucesso), → Error |
| **Migrating** | Convertendo save de versão antiga | → Loading (migrou), → Error |
| **Error** | Falha na operação | → Idle (retry ou abort) |

### Interactions with Other Systems

| Sistema | Direção | O que flui |
|---|---|---|
| **Todos os sistemas de dados** | ← lê estado | Serializa estado de: Stats, Wellness, Fame, Economy, Contract, Schedule, Charts, Media, Finance |
| **Week Simulation** | ← trigger | Autosave dispara após cada semana processada |
| **Time/Calendar** | ← lê | Semana/mês/ano atual pra metadados do save |
| **Idol Database** | ← referência | World Pack ID pra validar compatibilidade |
| **UI** | ↔ interface | Tela de save/load mostra slots, datas, progresso |

## Formulas

#### Estimativa de Tamanho do Save

```
tamanho_base = (num_idols × BYTES_PER_IDOL) + (num_agencies × BYTES_PER_AGENCY)
             + rankings + charts + media + calendar + news_feed

BYTES_PER_IDOL = ~2KB (stats + wellness + contract + finance + history)
BYTES_PER_AGENCY = ~500B (tier + budget + roster refs + facilities)

Exemplo: 3000 idols × 2KB + 50 agencies × 500B + overhead
       = 6MB + 25KB + ~5MB overhead ≈ 11MB (sem compressão)
       Com compressão SQLite: ~5-8MB
```

#### Delta Save (incremental)

```
delta = entidades_modificadas_esta_semana

tamanho_delta = num_modified × avg_bytes_per_entity
  Típico: ~200-500 entidades modificadas/semana
  tamanho_delta ≈ 200-500KB (muito rápido de gravar)
```

## Edge Cases

- **App fecha durante autosave**: IndexedDB usa transações atômicas — o write
  ou completa ou não acontece. Sem corrupção parcial
- **Save de versão muito antiga (5+ versions atrás)**: Migrations rodam
  em sequência. Se migration intermediária falha, save original preservado
- **Save com World Pack diferente do instalado**: Erro claro -- "Este save
  usa World Pack X mas você tem Y instalado. Instale o pack correto"
- **Storage cheio no dispositivo**: Detecta antes de tentar salvar. Avisa
  jogador pra liberar espaço. Não perde o save atual
- **Save corrompido**: Checksum validation no load. Se falha, tenta
  restaurar do autosave anterior (backup rotativo de 2 saves)
- **Jogador tenta carregar save de outro jogador**: Funciona (saves são
  portáveis). Útil pra compartilhar challenges ou debug

## Dependencies

**Hard:**
- Todos sistemas de dados (Stats, Wellness, Fame, Economy, Contract,
  Schedule, Charts, Media, Finance, Calendar, Market, Rival AI)

**Soft:**
- Week Simulation — trigger de autosave
- UI — tela de save/load

**Depended on by:**
Nenhum sistema depende deste pra funcionar -- é infraestrutura de
persistência.

## Tuning Knobs

| Knob | Default | Range | Efeito |
|---|---|---|---|
| `AUTOSAVE_FREQUENCY` | Toda semana | Toda semana / Todo mês | Frequência de autosave |
| `AUTOSAVE_MAX_MS` | 150ms | 100-500ms | Budget de performance (ADR-005) |
| `SAVE_SLOTS` | 4 (1 auto + 3 manual) | 2-10 | Total de slots de save |
| `NEWS_HISTORY_MONTHS` | 3 | 1-12 | Meses de news feed no save |
| `IDOL_HISTORY_MONTHS` | 6 | 3-12 | Meses de event log por idol |
| `BACKUP_ROTATION` | 2 saves | 1-3 | Backups de autosave pra recovery |
| `MAX_SAVE_SIZE_MB` | 50 | 20-100 | Alerta se save passar desse tamanho |

## Acceptance Criteria

1. Autosave completa em <200ms no PC após cada semana
2. Load restaura estado idêntico ao momento do save (determinístico)
3. App fechado abruptamente não corrompe o save (WAL atomicity)
4. Migração de versão funciona pra saves até 5 versões atrás
5. Save/load de ~3000 idols + 50 agências em <1.5s no PC
6. Save file <50MB com compressão
7. Delta save (incremental) <500KB e <500ms
8. Todos os jogadores têm 4 slots (1 autosave + 3 manuais)
9. Save corrompido detectado por checksum, fallback pra backup
10. Save de World Pack incompatível gera erro claro

## Open Questions

- Cloud save: sincronizar saves entre dispositivos?
  Requer backend. Feature pós-lançamento
- Save sharing: permitir compartilhar saves como "challenges"?
  ("Comece com este save e veja se chega ao #1 em 5 anos")
- Replay data: salvar seed de random pra permitir replay de semanas
  passadas? Caro em storage mas permite feature de "rever a semana"
