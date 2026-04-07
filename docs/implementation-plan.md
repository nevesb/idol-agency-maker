# Implementation Plan — Star Idol Agency

> **Last Updated**: 2026-04-02
> **Stack**: SvelteKit + Tauri 2.0 + Supabase + TypeScript Web Workers + ComfyUI/RunPod
> **Source**: 49 GDD systems (docs/gdd/)

Este documento mapeia cada sistema do GDD em tarefas concretas de implementacao.
Cada tarefa tem: ID, nome, GDD fonte, dependencias, complexidade (S/M/L).

---

## Phase 0 — Infrastructure Setup

Nenhuma dependencia de GDD. Setup tecnico puro.

| ID | Tarefa | Complexidade | Deps | Descricao |
|---|---|---|---|---|
| P0-01 | Init SvelteKit project | S | — | `pnpm create svelte@latest`, TypeScript, ESLint, Prettier |
| P0-02 | Configurar Tailwind CSS | S | P0-01 | Tema base (light/dark), cores do jogo, tipografia |
| P0-03 | Init Tauri 2.0 wrapper | M | P0-01 | `pnpm tauri init`, configurar window size 1920x1080, icone |
| P0-04 | Criar projeto Supabase | S | — | Criar projeto no Supabase dashboard, configurar env vars |
| P0-05 | Supabase Auth setup | M | P0-04 | Email + Google + Discord providers. Login/logout flow |
| P0-06 | Supabase DB schema base | M | P0-04 | Tabelas: profiles, save_games, subscriptions |
| P0-07 | Supabase Storage buckets | S | P0-04 | Buckets: world-packs, idol-images, templates |
| P0-08 | CI/CD — GitHub Actions | M | P0-01 | Workflows: test, build-web, build-desktop (Tauri) |
| P0-09 | Vitest + testing setup | S | P0-01 | Configurar Vitest pra unit tests do simulation engine |
| P0-10 | Playwright setup | M | P0-01 | E2E tests basicos (login, navegacao) |
| P0-11 | Init Python tools dir | S | — | `tools/` com pyproject.toml, venv, deps base |
| P0-12 | Estrutura de diretorios | S | P0-01 | Criar dirs: lib/components, lib/simulation, lib/data, routes/ |
| P0-13 | Layout global + Nav Bar | M | P0-01, P0-02 | Top nav com 6 dominios (Portal/Roster/Mercado/Operacoes/Agencia/Produtor) |
| P0-14 | Sistema de routing | M | P0-13 | Routes pra cada dominio + submenus. Breadcrumbs |
| P0-15 | Shared components base | M | P0-02 | DataTable, Tile, Card, Modal, AlertBar, Tooltip componentes reutilizaveis |
| P0-16 | Keyboard shortcuts system | S | P0-01 | Hotkeys globais (1-6 nav, Ctrl+K search, Space play/pause) |
| P0-17 | Search universal (UI) | M | P0-15 | Ctrl+K abre search overlay. Inicialmente busca por nome/menu |
| P0-18 | Bookmarks system | S | P0-16 | Shift+1-12 bookmarks configuraveis. Salvo em localStorage |
| P0-19 | i18n setup | M | P0-01 | svelte-i18n ou paraglide-js. Arquivos EN/JA/PT |
| P0-20 | Theme system (light/dark) | S | P0-02 | CSS variables toggle. Salvo em localStorage |

---

## Phase 1 — Foundation (MVP Foundation Layer)

GDD: idol-attribute-stats.md, idol-database-generator.md, time-calendar.md

| ID | Tarefa | GDD Source | Complexidade | Deps | Descricao |
|---|---|---|---|---|---|
| P1-01 | TypeScript types: Idol | idol-attribute-stats.md | M | P0-12 | Interface Idol com 12 attrs visiveis, 5 ocultos, TA, PT, tier, wellness, state |
| P1-02 | TypeScript types: todos | Varios GDDs | L | P1-01 | Interfaces: Agency, Contract, Job, Staff, Group, FanClub, NewsArticle, etc. |
| P1-03 | Stats system — growth formulas | idol-attribute-stats.md | M | P1-01 | Implementar: crescimento = base × tier × disciplina × idade × estado × fonte |
| P1-04 | Stats system — decay formulas | idol-attribute-stats.md | M | P1-03 | Decaimento por idade: Resistencia/Visual/Danca apos pico |
| P1-05 | Stats system — tier calculation | idol-attribute-stats.md | S | P1-01 | PT → tier (F-SSS) com ranges da tabela |
| P1-06 | Stats system — burnout duration | idol-attribute-stats.md | S | P1-01 | Formula: ceil(8 - (media_resiliencia/100 × 7)) |
| P1-07 | Stats system — personality labels | idol-attribute-stats.md | M | P1-01 | Derivar rotulo (ex: "Estrela Disciplinada") da combinacao de 5 ocultos |
| P1-08 | Time/Calendar system | time-calendar.md | M | P0-12 | Week counter, month/season/year derivados. Live/Pause/Skip states |
| P1-09 | Time controls UI | time-calendar.md | S | P1-08, P0-13 | Botoes Play/Pause/Skip no rodape. Space toggle |
| P1-10 | World Pack Generator (Python) | idol-database-generator.md | L | P0-11, P1-01 | Script Python: seed → 5.000 idols deterministicos com stats, backgrounds, visual_seeds |
| P1-11 | World Pack — stat distributions | idol-database-generator.md | M | P1-10 | Validar: ~30% F, ~25% E, ~20% D, ~12% C, ~7% B, ~3.5% A, etc. |
| P1-12 | World Pack — agency generation | idol-database-generator.md | M | P1-10 | Gerar 50 agencias rivais com tier, estrategia, roster inicial, dono NPC |
| P1-13 | World Pack — 5yr pre-simulation | idol-database-generator.md | L | P1-10 | Simular 5 anos offline pra gerar estado inicial maduro |
| P1-14 | World Pack loader (client) | idol-database-generator.md | M | P1-10, P0-07 | Carregar World Pack do Supabase Storage. Parse e indexar |
| P1-15 | Seed determinism tests | idol-database-generator.md | M | P1-10 | Testes automatizados: mesma seed = mesmos idols, sempre |

---

## Phase 2 — Core Systems (MVP Core Layer)

GDD: agency-economy.md, contract-system.md, happiness-wellness.md, fame-rankings.md, market-transfer.md

| ID | Tarefa | GDD Source | Complexidade | Deps | Descricao |
|---|---|---|---|---|---|
| P2-01 | Economy — agency budget | agency-economy.md | M | P1-08 | Saldo, receita, despesa. Tick mensal pra salarios |
| P2-02 | Economy — revenue sources | agency-economy.md | M | P2-01 | Jobs, royalties, merch, endorsements, transferencias |
| P2-03 | Economy — expenses | agency-economy.md | M | P2-01 | Salarios, facilities, scouting, producao, marketing |
| P2-04 | Economy — agency tiers | agency-economy.md | M | P2-01 | 5 tiers (Garagem→Elite), condicoes de promocao/rebaixamento |
| P2-05 | Contract — data model | contract-system.md | M | P1-01 | 9 clausulas negociaveis. Struct + defaults por tier |
| P2-06 | Contract — negotiation logic | contract-system.md | L | P2-05 | Preferencias da idol, chance de aceitacao, contra-proposta |
| P2-07 | Contract — auto-fill | contract-system.md | S | P2-05 | Pre-preencher contrato com preferencias da idol (casual-friendly) |
| P2-08 | Contract — renewal/rescission | contract-system.md | M | P2-06 | Renovacao, rescisao unilateral, multas |
| P2-09 | Wellness — 4 bars | happiness-wellness.md | M | P1-01 | Saude, Felicidade, Stress, Motivacao (0-100). Tick semanal |
| P2-10 | Wellness — triggers | happiness-wellness.md | M | P2-09 | O que sobe/desce cada barra (jobs, salario, escandalos, folga) |
| P2-11 | Wellness — state effects | happiness-wellness.md | M | P2-09 | Overwork, burnout, crise. Efeitos em crescimento e performance |
| P2-12 | Wellness — color coding | happiness-wellness.md | S | P2-09 | Verde/amarelo/vermelho/roxo baseado nos limiares |
| P2-13 | Fame — individual ranking | fame-rankings.md | M | P1-01 | Fama 0-10000, tier visivel (F-SSS) derivado da posicao relativa |
| P2-14 | Fame — group ranking | fame-rankings.md | M | P2-13 | Media dos membros × (1 + sinergia) |
| P2-15 | Fame — agency ranking | fame-rankings.md | S | P2-13 | Soma de fama de todas idols × 0.01 |
| P2-16 | Fame — weekly update | fame-rankings.md | M | P2-13 | Ganhos (jobs, musica) - perdas (inatividade, fracasso) |
| P2-17 | Market — idol pool | market-transfer.md | M | P1-14 | Pool de idols disponiveis filtrado por tier da agencia |
| P2-18 | Market — proposals | market-transfer.md | M | P2-17, P2-05 | Fazer/receber propostas de contratacao |
| P2-19 | Market — buyout system | market-transfer.md | M | P2-18 | Buyout entre agencias. Multa de rescisao. Evento urgente |

---

## Phase 3 — Gameplay (MVP Feature Layer)

GDD: job-assignment.md, schedule-agenda.md, week-simulation.md, rival-agency-ai.md,
agency-staff-operations.md, agency-strategy.md, agency-intelligence-reports.md

| ID | Tarefa | GDD Source | Complexidade | Deps | Descricao |
|---|---|---|---|---|---|
| P3-01 | Jobs — catalog (11 types) | job-assignment.md | M | P1-01 | Struct Job com 11 categorias (show, TV, radio, gravacao, etc.) |
| P3-02 | Jobs — board generation | job-assignment.md | M | P3-01, P1-08 | Gerar 10-20 jobs/semana filtrados por tier da agencia |
| P3-03 | Jobs — performance formula | job-assignment.md | L | P3-01, P2-09 | stat_score × consistencia × wellness × difficulty × random |
| P3-04 | Jobs — result outcomes | job-assignment.md | M | P3-03 | Sucesso (>=0.70), Parcial (0.40-0.69), Fracasso (<0.40). Receita, fama, XP |
| P3-05 | Jobs — group performance | job-assignment.md | M | P3-03 | Media individual + sinergia bonus |
| P3-06 | Jobs — post-mortem generator | job-assignment.md | L | P3-04 | 2-4 fatores positivos/negativos, reacao midia/fas, nota S-F |
| P3-07 | Jobs — collab cross-agency | job-assignment.md | M | P3-01 | Collabs com outras agencias. Revenue split |
| P3-08 | Jobs — competitive/premium | job-assignment.md | M | P3-02 | Jobs disputados: apenas 1-3 agencias do tier, bonus +20-50% |
| P3-09 | Schedule — weekly grid | schedule-agenda.md | M | P1-08 | 7 dias × 2 slots por idol. Drag-and-drop UI |
| P3-10 | Schedule — color coding | schedule-agenda.md | S | P3-09, P2-12 | Verde/amarelo/vermelho/roxo baseado em carga + wellness |
| P3-11 | Schedule — contract enforcement | schedule-agenda.md | M | P3-09, P2-05 | Carga maxima, exclusividade, descanso obrigatorio |
| P3-12 | Week Sim — pipeline Phase 1 | week-simulation.md | M | P1-08, P2-17 | Inicio semana: novos jobs, novas idols, mercado atualiza |
| P3-13 | Week Sim — pipeline Phase 2 | week-simulation.md | L | P3-03, P3-09 | Processamento diario: jobs, treino, descanso, eventos |
| P3-14 | Week Sim — pipeline Phase 3 | week-simulation.md | L | P3-13, P2-13 | Fim semana: stats grow/decay, wellness update, fame, economy, AI |
| P3-15 | Week Sim — pipeline Phase 4 | week-simulation.md | M | P3-14 | Relatorio: gerar resumo, headlines, alertas |
| P3-16 | Week Sim — Web Worker | week-simulation.md | M | P3-12 | Mover simulacao pra Web Worker thread separada |
| P3-17 | Week Sim — Moment Engine | week-simulation.md | L | P3-15 | Selecionar momentos por dramaticidade. Headlines, agency mood |
| P3-18 | Rival AI — agency profiles | rival-agency-ai.md | M | P1-12 | 50 agencias com personalidade, buyout_pattern, cultura interna |
| P3-19 | Rival AI — weekly decisions | rival-agency-ai.md | L | P3-18, P2-17 | Contratar, escalar, rescindir, investir. Heurísticas <2ms/agencia |
| P3-20 | Rival AI — buyout attempts | rival-agency-ai.md | M | P3-19, P2-19 | 1 buyout/mes por agencia. IA→IA e IA→Jogador |
| P3-21 | Rival AI — memory/rivalry | rival-agency-ai.md | M | P3-19 | Lembrar interacoes, criar rivalidades, afetar collabs |
| P3-22 | Staff — data model | agency-staff-operations.md | M | P1-02 | 11 cargos, 4 atributos (skill, dedication, adaptability, people_skills) |
| P3-23 | Staff — hiring market | agency-staff-operations.md | M | P3-22 | Pool de staff, custo proporcional, slots por tier |
| P3-24 | Staff — delegation system | agency-staff-operations.md | L | P3-22 | Parametros → staff executa → resultado. Auto-approve opcional |
| P3-25 | Staff — coach growth bonus | agency-staff-operations.md | M | P3-22, P1-03 | Coach acelera crescimento: eficacia × COACH_GROWTH_FACTOR |
| P3-26 | Staff — PR scandal mitigation | agency-staff-operations.md | M | P3-22 | Reducao de impacto: eficacia × SCANDAL_MITIGATION_FACTOR |
| P3-27 | Staff — systemic friction | agency-staff-operations.md | M | P3-24 | Staff toxico, conflitos entre staff, manager protetor, scout viés |
| P3-28 | Strategy — 4 levers | agency-strategy.md | M | P2-01 | Foco, Postura Agenda, Postura Imagem, Postura Crescimento |
| P3-29 | Strategy — modifier system | agency-strategy.md | M | P3-28 | Aplicar bonus/penalidade nos subsistemas (jobs, fame, stress) |
| P3-30 | Strategy — structural effects | agency-strategy.md | L | P3-28 | Efeitos ecossistemicos (tipo de fas, percepcao midia, volatilidade) |
| P3-31 | Strategy — profile display | agency-strategy.md | S | P3-28 | Combinacao → perfil visivel ("Studio Boutique", "Fabrica Comercial") |
| P3-32 | Intelligence — alert system | agency-intelligence-reports.md | M | P2-09, P2-01 | 10 tipos de alerta (burnout, churn, financeiro, etc.) Max 3 no dashboard |
| P3-33 | Intelligence — post-mortem | agency-intelligence-reports.md | M | P3-06 | Relatorios explicativos por job (fatores, reacoes, sugestoes) |
| P3-34 | Intelligence — comparisons | agency-intelligence-reports.md | M | P1-01 | Idol vs idol, grupo vs grupo, agencia vs rival |
| P3-35 | Intelligence — predictions | agency-intelligence-reports.md | M | P3-32 | Risco burnout, projecao financeira, janela renovacao. Precisao 65-85% |

---

## Phase 4 — MVP UI

GDD: ui-information-architecture.md, ui-dashboard.md, ui-idol-profile.md,
ui-job-board.md, ui-week-results.md

| ID | Tarefa | GDD Source | Complexidade | Deps | Descricao |
|---|---|---|---|---|---|
| P4-01 | Portal — layout 2 colunas | ui-dashboard.md | M | P0-13, P0-15 | Coluna esquerda 60% (mood, headlines, msgs) + direita 40% (tiles, calendario) |
| P4-02 | Portal — alert bar | ui-dashboard.md | M | P3-32 | Max 3 alertas priorizados por cor. Acoes rapidas inline |
| P4-03 | Portal — metric tiles | ui-dashboard.md | S | P2-01, P2-13 | 4 tiles clicaveis: receita, sucesso, wellness, ranking |
| P4-04 | Portal — headlines | ui-dashboard.md | M | P3-17 | Max 5 headlines do Moment Engine. Link pra drill-down |
| P4-05 | Portal — calendar compact | ui-dashboard.md | M | P1-08 | Proximas 2 semanas com jobs, eventos, contratos |
| P4-06 | Portal — pending actions | ui-dashboard.md | S | P3-02, P2-08 | Lista de decisoes pendentes clicavel |
| P4-07 | Portal — staff advice | ui-dashboard.md | S | P3-24 | 1-2 conselhos do staff (se contratado) |
| P4-08 | Idol Profile — header fixo | ui-idol-profile.md | M | P1-01, P2-09 | Avatar, nome, arquetipo, tier, wellness, contrato, acoes rapidas |
| P4-09 | Idol Profile — overview tiles | ui-idol-profile.md | S | P4-08 | 4 tiles: performance, receita, fama, dev plan |
| P4-10 | Idol Profile — Tab Stats | ui-idol-profile.md | M | P1-01 | 12 atributos com barras, valores, hover tooltips |
| P4-11 | Idol Profile — Tab Jobs | ui-idol-profile.md | M | P3-04 | Tabela densa de historico com nota, receita, fama. Link pra post-mortem |
| P4-12 | Idol Profile — Tab Contract | ui-idol-profile.md | M | P2-05 | 9 clausulas, tempo restante, botoes renovar/rescindir |
| P4-13 | Idol Profile — Tab Overview | ui-idol-profile.md | M | P4-08 | Background, agenda, ultimos jobs, grafico evolucao |
| P4-14 | Idol Profile — comparison | ui-idol-profile.md | M | P4-10 | Split view lado a lado com highlight do melhor valor |
| P4-15 | Idol Profile — market view | ui-idol-profile.md | M | P4-08, P2-17 | Stats com margem de erro, botoes proposta/scout/shortlist |
| P4-16 | Job Board — dense table | ui-job-board.md | L | P3-02, P0-15 | Tabela com 20+ jobs, colunas configuraveis, filtros sempre visiveis |
| P4-17 | Job Board — side panel | ui-job-board.md | M | P4-16 | Detalhes ao selecionar sem navegar. Top matches, checklist |
| P4-18 | Job Board — best fit/available | ui-job-board.md | M | P4-16, P3-09 | Duas colunas de match: absoluto vs disponivel agora |
| P4-19 | Job Board — inline escalation | ui-job-board.md | M | P4-17 | Confirmar com checklist (agenda, contrato, wellness). Aviso sem bloqueio |
| P4-20 | Job Board — batch actions | ui-job-board.md | M | P4-16 | Multi-select: auto-escalar, pin, rejeitar, aguardar |
| P4-21 | Week Results — mood + headlines | ui-week-results.md | M | P3-17 | Agency mood no topo. Max 5 headlines expandiveis inline |
| P4-22 | Week Results — expanded post-mortem | ui-week-results.md | M | P3-06 | Max 3 pos + 3 neg + reacoes. Content budget enforced |
| P4-23 | Week Results — right column | ui-week-results.md | M | P2-01, P2-13 | Financas, ranking, wellness changes, proxima semana |
| P4-24 | Week Results — monthly report | ui-week-results.md | M | P2-01 | Secao extra a cada 4 semanas: 4 tiles + metas do dono |
| P4-25 | Week Results — dense table view | ui-week-results.md | M | P4-21 | "Ver todos": tabela completa filtravel, link pra post-mortem |
| P4-26 | Context menus (right-click) | ui-information-architecture.md | M | P0-15 | Right-click em idols, jobs, agencias. Acoes contextuais |
| P4-27 | Power user — configurable columns | ui-information-architecture.md | M | P0-15 | Toda tabela: add/remove/reorder colunas. Presets salvos |
| P4-28 | Power user — persistent filters | ui-information-architecture.md | S | P0-15 | Filtros persistem entre sessoes. Badge de filtros ativos |
| P4-29 | Power user — keyboard traversal | ui-information-architecture.md | M | P0-16 | Arrows em tabelas, Enter abre, Space seleciona, Tab entre secoes |
| P4-30 | IdolPedia / Glossario | ui-information-architecture.md | M | P0-19 | F1 abre glossario. 10+ categorias. Links pra telas relevantes |

---

## Phase 5 — Persistence & Backend

GDD: save-load.md

| ID | Tarefa | GDD Source | Complexidade | Deps | Descricao |
|---|---|---|---|---|---|
| P5-01 | Game state serialization | save-load.md | L | P1-01, P2-01 | Serializar estado completo (roster, economy, contracts, fame, history) em JSON |
| P5-02 | Save to Supabase | save-load.md | M | P5-01, P0-06 | Edge Function save_game(): compress → upsert no Postgres JSONB |
| P5-03 | Load from Supabase | save-load.md | M | P5-02 | Edge Function load_game(): fetch → decompress → entregar ao client |
| P5-04 | Save slots (free vs premium) | save-load.md | M | P5-02 | Free: 1 slot. Premium: 5 slots. Validacao server-side |
| P5-05 | Auto-save (fim de semana) | save-load.md | S | P5-02, P3-14 | Auto-save apos cada Week Simulation completa |
| P5-06 | IndexedDB offline cache | save-load.md | M | P5-01 | Cache local pra jogo offline. Sync quando reconectar |
| P5-07 | Conflict resolution | save-load.md | M | P5-06 | Timestamps. Se conflito: mostrar ambas versoes, jogador escolhe |
| P5-08 | Row Level Security | save-load.md | S | P0-06 | RLS policy: user_id = auth.uid() em save_games |
| P5-09 | Subscription validation | save-load.md | M | P0-05 | Edge Function validate_premium(): checar status de subscription |
| P5-10 | New game flow | save-load.md | M | P5-03, P1-14 | Criar novo save: escolher World Pack, nome agencia, regiao inicial |

---

## Phase 6 — Vertical Slice

GDD: scouting-recruitment.md, event-scandal-generator.md, group-management.md,
news-feed.md, financial-reporting.md, music-charts.md, media-entities.md,
talent-development-plans.md, idol-archetypes-roles.md,
ui-scouting.md, ui-contract-negotiation.md, ui-news-feed.md

| ID | Tarefa | GDD Source | Complexidade | Deps | Descricao |
|---|---|---|---|---|---|
| P6-01 | Scouting — 5 pipelines | scouting-recruitment.md | L | P2-17, P2-01 | Rua, audição, festival, online, transfer. Custo/tempo/precisão distintos |
| P6-02 | Scouting — scout NPCs | scouting-recruitment.md | M | P6-01, P3-22 | 500 scouts fixos na seed. Skill, specialty, região, XP/levelup |
| P6-03 | Scouting — precision system | scouting-recruitment.md | M | P6-02 | Stats estimados com margem de erro (±15 rua, exato casting) |
| P6-04 | Scouting — region bonuses | scouting-recruitment.md | S | P6-01 | Tokyo: polished. Osaka: carisma. Fukuoka: visual. Etc. |
| P6-05 | Events — deterministic triggers | event-scandal-generator.md | L | P2-09, P2-13 | 3 leves + 4 medios + 3 graves escandalos. Todos com trigger mecanico |
| P6-06 | Events — positive events | event-scandal-generator.md | M | P6-05 | Momentos virais, oportunidades VIP, campanhas de fas |
| P6-07 | Events — group conflicts | event-scandal-generator.md | M | P6-05, P6-14 | Conflito interno, disputa de lideranca, ciumes |
| P6-08 | Events — consequence chain | event-scandal-generator.md | M | P6-05 | Escandalo → impacto wellness + fama + fas + midia. PR mitiga |
| P6-09 | Groups — create/dissolve | group-management.md | M | P1-01, P2-05 | Formar grupos 2-12 membros. Lock period. Dissolucao |
| P6-10 | Groups — leader dynamics | group-management.md | M | P6-09 | Lider por carisma. Disputa de lideranca. Impacto em moral |
| P6-11 | Groups — synergy calculation | group-management.md | M | P6-09 | Complementaridade de stats → sinergia 0-0.3 |
| P6-12 | Groups — pre-formed bands | group-management.md | S | P6-09, P1-14 | Bandas pre-existentes no World Pack com lock period |
| P6-13 | News Feed — template system | news-feed.md | L | P3-04, P2-13 | ~375 templates base com placeholders. Tom por veiculo (TV/revista/blog) |
| P6-14 | News Feed — generation | news-feed.md | M | P6-13, P3-14 | Gerar noticias a cada tick: jobs, escandalos, mercado, ranking |
| P6-15 | News Feed — follow idol | news-feed.md | S | P6-14 | Seguir idol → clipping filtrado no feed |
| P6-16 | News Feed — weekly digest (skip) | news-feed.md | M | P6-14 | Top 5-10 noticias resumidas pra modo Skip |
| P6-17 | Financial Reporting — monthly | financial-reporting.md | M | P2-01 | Receita/despesa por fonte, lucro, top idols, metas do dono |
| P6-18 | Financial Reporting — ROI | financial-reporting.md | M | P6-17, P3-33 | ROI por idol: receita vs custo total |
| P6-19 | Financial Reporting — projections | financial-reporting.md | M | P6-17 | Projecao de receita/despesa pro proximo mes |
| P6-20 | Music Charts — song model | music-charts.md | M | P2-01 | Struct Song: compositor, streams, vendas, posicao no chart |
| P6-21 | Music Charts — composition jobs | music-charts.md | M | P6-20, P3-01 | Idol compoe musica (slot especial). Qualidade = Vocal + Aura |
| P6-22 | Music Charts — monthly ranking | music-charts.md | M | P6-20 | Ranking estilo Oricon. Decay. Covers. Collabs |
| P6-23 | Music Charts — royalties | music-charts.md | M | P6-20, P2-01 | Receita recorrente por streaming/vendas. Split com compositor |
| P6-24 | Media Entities — TV/Radio/Web | media-entities.md | M | P1-14 | Entidades de midia com audiencia, schedule, preferencias |
| P6-25 | Media Entities — job generation | media-entities.md | M | P6-24, P3-02 | Shows de TV/radio publicam vagas como jobs |
| P6-26 | Development — stages (8) | talent-development-plans.md | M | P1-01 | Trainee→Pre-Debut→Rookie→Rising→Established→Ace→Veteran→Legacy |
| P6-27 | Development — quarterly plans | talent-development-plans.md | M | P6-26 | Ate 3 metas por plano. Foco de treino. Progress tracking |
| P6-28 | Development — readiness checks | talent-development-plans.md | M | P6-26 | Criterios por transicao. Forcar = consequencias |
| P6-29 | Development — mentoring | talent-development-plans.md | M | P6-26, P3-22 | Veterana mentora novata. Bonus crescimento mental |
| P6-30 | Development — emotional arcs | talent-development-plans.md | M | P6-26 | 7 arcos emergentes + sistema de traits (Confiavel, Diva, Sombra, etc.) |
| P6-31 | Development — external dev | talent-development-plans.md | M | P6-26 | Collabs, circuito regional, aparicoes menores. Risco buyout |
| P6-32 | Archetypes — 12 types | idol-archetypes-roles.md | M | P1-01 | Center, Ace Vocal, Dance Ace, etc. Derivados automaticamente de stats |
| P6-33 | Archetypes — diegetic names | idol-archetypes-roles.md | S | P6-32 | Nomes JP: Sentaa, Utahime, Osawagase, etc. |
| P6-34 | Archetypes — group synergy | idol-archetypes-roles.md | M | P6-32, P6-11 | Composicao por arquetipo afeta sinergia do grupo |
| P6-35 | UI — Scouting screen | ui-scouting.md | M | P6-01, P0-15 | Mapa regional, scouts ativos, resultados, filtros |
| P6-36 | UI — Contract negotiation | ui-contract-negotiation.md | M | P2-06, P0-15 | 9 sliders, feedback de aceitacao, auto-fill, contra-proposta |
| P6-37 | UI — News Feed screen | ui-news-feed.md | M | P6-14, P0-15 | Feed scrollavel, filtros por tipo/veiculo/idol, follow button |

---

## Phase 7 — Alpha

GDD: agency-meta-game.md, player-created-events.md, player-reputation-affinity.md,
fan-club-system.md, idol-lifecycle.md, idol-personal-finance.md,
agency-planning-board.md, roster-balance.md,
ui-rankings.md, ui-calendar-planning.md

| ID | Tarefa | GDD Source | Complexidade | Deps | Descricao |
|---|---|---|---|---|---|
| P7-01 | Meta-game — owner goals | agency-meta-game.md | M | P2-01, P2-13 | Metas mensais escalaveis por tier. Cumprir = bonus. Falhar 6+ meses = demissao |
| P7-02 | Meta-game — agency switching | agency-meta-game.md | M | P7-01 | Propostas de outras agencias baseadas em reputacao. Nova agencia = novo roster |
| P7-03 | Meta-game — dismissal/restart | agency-meta-game.md | M | P7-01 | Demissao → propostas de agencias menores. Nunca game over permanente |
| P7-04 | Player Events — festivals | player-created-events.md | M | P2-01, P3-09 | Criar evento: budget, lineup, convidar externos (cache proporcional ao tier) |
| P7-05 | Player Events — tours | player-created-events.md | M | P7-04 | Turnes regionais/nacionais. Multi-semana. Stress + fama |
| P7-06 | Reputation — affinity per idol | player-reputation-affinity.md | M | P2-09, P2-05 | 0-100 por idol. Sobe com boa gestao, desce com overwork/rescisao |
| P7-07 | Reputation — legacy titles | player-reputation-affinity.md | M | P7-06 | 8 titulos automaticos: Formador, Espremedor, Salvador, Maestro, etc. |
| P7-08 | Reputation — historical memories | player-reputation-affinity.md | M | P7-06 | Ex-idols lembram do jogador. Citacoes no News Feed |
| P7-09 | Fan Club — base mechanics | fan-club-system.md | M | P2-13, P2-09 | Size, mood, loyalty, toxicity. Cresce com fama. Reage a eventos |
| P7-10 | Fan Club — segmentation | fan-club-system.md | M | P7-09 | 4 segmentos (casual/dedicado/hardcore/anti-fan). Conversao entre segmentos |
| P7-11 | Fan Club — harassment events | fan-club-system.md | M | P7-09, P6-05 | Toxicidade > 60 → chance de assedio. Afeta wellness |
| P7-12 | Fan Club — merch conversion | fan-club-system.md | M | P7-09, P2-01 | Receita = size × segmentacao × mood × preco base |
| P7-13 | Fan Club — dynamics | fan-club-system.md | M | P7-10 | Shipping, ciumes, fandom grupo vs individual, anti-fan mobilizado |
| P7-14 | Lifecycle — aging system | idol-lifecycle.md | M | P1-08, P1-01 | Envelhecimento semanal. Condicoes de debut (aposentadoria) |
| P7-15 | Lifecycle — debut ceremony | idol-lifecycle.md | M | P7-14 | Graduation opcional → fama boost final. Ex-idol sai do roster ativo |
| P7-16 | Lifecycle — pool balance | idol-lifecycle.md | M | P7-14, P1-14 | Manter ~3.000 idols ativas em equilibrio (entradas e saidas mensais) |
| P7-17 | Lifecycle — post-debut roles | idol-lifecycle.md | S | P7-15 | Ex-idols viram apresentadoras, mentoras, produtoras (geram jobs) |
| P7-18 | Personal Finance — model | idol-personal-finance.md | M | P2-05, P2-01 | Salario → gastos pessoais → poupanca → divida. Afeta comportamento |
| P7-19 | Personal Finance — investments | idol-personal-finance.md | M | P7-18 | Cirurgia estetica (Visual +5-15), educacao (+Adaptabilidade) |
| P7-20 | Planning Board — quarterly goals | agency-planning-board.md | M | P1-08, P7-01 | Ate 5 metas trimestrais. Bonus de reputacao por meta cumprida |
| P7-21 | Planning Board — annual roadmap | agency-planning-board.md | M | P7-20 | Roadmap editavel com marcos. Eventos sazonais automaticos |
| P7-22 | Planning Board — risk panel | agency-planning-board.md | M | P3-32, P7-20 | Riscos e gargalos automaticos. Oportunidades projetadas |
| P7-23 | Roster Balance — analysis | roster-balance.md | M | P6-32, P1-01 | Cobertura por arquetipo, curva etaria, concentracao receita, pipeline |
| P7-24 | Roster Balance — suggestions | roster-balance.md | M | P7-23, P3-22 | Sugestoes automaticas de gaps (se staff contratado) |
| P7-25 | Roster Balance — UI screen | roster-balance.md | M | P7-23, P0-15 | Tela visual: barras por arquetipo, grafico etario, dependencia |
| P7-26 | UI — Rankings screen | ui-rankings.md | M | P2-13, P0-15 | 3 views paralelos (individual/grupo/agencia). Filtros, historico |
| P7-27 | UI — Calendar/Planning | ui-calendar-planning.md | M | P1-08, P7-21, P0-15 | Visao temporal: semana/mes/trimestre/ano. Eventos marcados |

---

## Phase 8 — Full Vision

GDD: post-debut-career.md, tutorial-onboarding.md, settings-accessibility.md

| ID | Tarefa | GDD Source | Complexidade | Deps | Descricao |
|---|---|---|---|---|---|
| P8-01 | Post-debut — career system | post-debut-career.md | M | P7-15, P3-01 | Ex-idols geram jobs (TV, mentoria, entrevistas). Fama decai -1%/mes |
| P8-02 | Post-debut — mentor facility | post-debut-career.md | M | P8-01, P3-22 | Ex-idol como mentora na agencia. Bonus pra novatas |
| P8-03 | Post-debut — comeback | post-debut-career.md | M | P8-01, P2-17 | Ex-idol anuncia retorno (raro). Aparece no mercado com stats congelados |
| P8-04 | Tutorial — progressive reveal | tutorial-onboarding.md | L | Todas telas | Revelar complexidade gradualmente. Contratos auto-fill no inicio |
| P8-05 | Tutorial — contextual hints | tutorial-onboarding.md | M | P8-04 | Tooltips contextuais em cada tela. Dismissiveis. Nao repetem |
| P8-06 | Tutorial — first week guided | tutorial-onboarding.md | M | P8-04 | Primeira semana com passo-a-passo: contratar, escalar, simular |
| P8-07 | Settings — game options | settings-accessibility.md | M | P0-20, P0-19 | Lingua, tema, velocidade, volume, notificacoes |
| P8-08 | Settings — accessibility | settings-accessibility.md | M | P8-07 | Colorblind modes, font scaling, contraste, atalhos remapeaveis |
| P8-09 | Settings — cloud/local toggle | settings-accessibility.md | S | P5-06 | Escolher entre cloud save e local save |

---

## Parallel Workstream — Character Generation (ComfyUI + RunPod)

GDD: character-generation.md

Roda independentemente do codigo do jogo. Pode comecar em paralelo com Phase 1.

| ID | Tarefa | GDD Source | Complexidade | Deps | Descricao |
|---|---|---|---|---|---|
| CG-01 | RunPod setup | character-generation.md | M | — | Configurar endpoint serverless com ComfyUI + modelo anime-xl |
| CG-02 | ComfyUI — base workflow | character-generation.md | L | CG-01 | Workflow: checkpoint → prompt → sampler → VAE decode → save |
| CG-03 | ComfyUI — IP-Adapter integration | character-generation.md | L | CG-02 | Adicionar IP-Adapter pra face consistency entre idades |
| CG-04 | ComfyUI — age progression | character-generation.md | L | CG-03 | Prompts por idade (8-35). Testar consistencia facial |
| CG-05 | ComfyUI — expression control | character-generation.md | M | CG-04 | 3 expressoes (feliz, seria, triste) via prompt |
| CG-06 | ComfyUI — clothing by age | character-generation.md | M | CG-04 | Vestuario proporcional a maturidade por faixa |
| CG-07 | Prototype — 10 idols | character-generation.md | M | CG-06 | Gerar 240 imagens (10 × 24). Validar qualidade e consistencia |
| CG-08 | Python orchestrator — seed→prompt | character-generation.md | M | P1-10, CG-06 | Ler visual_seed → construir prompt deterministico |
| CG-09 | Python orchestrator — batch queue | character-generation.md | M | CG-08 | Fila de geracao. N workers paralelos. Retry. Checkpoint |
| CG-10 | Python orchestrator — validation | character-generation.md | M | CG-09 | CLIP score + face similarity entre idades. Auto-retry se falhar |
| CG-11 | Python orchestrator — resize/compress | character-generation.md | S | CG-09 | 768→512 + thumbnail 128. WebP quality 85 |
| CG-12 | Python orchestrator — upload | character-generation.md | M | CG-11, P0-07 | Upload batch pra Supabase Storage. Gerar manifest |
| CG-13 | Client — image loader | character-generation.md | M | CG-12, P4-08 | getIdolImageUrl(idol, context). Age bracket + expression por wellness |
| CG-14 | MVP batch — 100 idols | character-generation.md | L | CG-10 | Gerar 2.400 imagens. Revisao manual de qualidade |
| CG-15 | Full batch — 5.000 idols | character-generation.md | L | CG-14 | Gerar 120.000 imagens. ~10-14 dias em paralelo |

---

## Critical Path

```
P0 (Infra) ──► P1 (Foundation) ──► P2 (Core) ──► P3 (Gameplay) ──► P4 (UI) ──► P5 (Persistence)
                    │                                                               │
                    │                                                               ▼
                    │                                                          MVP PLAYABLE
                    │
                    └──► CG-01..CG-07 (Character Gen prototype — paralelo)
                              │
                              ▼
                         CG-08..CG-14 (MVP batch — paralelo com Phase 4-5)

MVP PLAYABLE ──► P6 (Vertical Slice) ──► P7 (Alpha) ──► P8 (Full Vision)
                                                              │
                                                         CG-15 (Full batch)
```

**MVP = Phases 0-5 completas = jogo jogavel com core loop.**
- ~130 tarefas
- Maior risco: Week Simulation performance (P3-16) e ComfyUI face consistency (CG-04)

---

## Task Count Summary

| Phase | Tarefas | Foco |
|---|---|---|
| Phase 0 — Infrastructure | 20 | Setup tecnico |
| Phase 1 — Foundation | 15 | Stats, Database, Calendar |
| Phase 2 — Core Systems | 19 | Economy, Contracts, Wellness, Fame, Market |
| Phase 3 — Gameplay | 35 | Jobs, Schedule, Week Sim, Rival AI, Staff, Strategy, Intelligence |
| Phase 4 — MVP UI | 30 | Portal, Profile, Job Board, Results, Power User |
| Phase 5 — Persistence | 10 | Save/Load, Supabase, Auth, Offline cache |
| Phase 6 — Vertical Slice | 37 | Scouting, Events, Groups, News, Music, Dev Plans, Archetypes |
| Phase 7 — Alpha | 27 | Meta-game, Fans, Lifecycle, Planning, Roster Balance |
| Phase 8 — Full Vision | 9 | Post-debut, Tutorial, Settings |
| Character Generation | 15 | ComfyUI, RunPod, Python orchestrator, Batches |
| **TOTAL** | **217** | |
