# Job Board UI

> **Status**: Designed
> **Author**: user + game-designer
> **Last Updated**: 2026-04-02
> **Implements Pillar**: Pilar 2 — Suas Decisoes, Suas Consequencias
> **Parent**: ui-information-architecture.md
> **Dominio**: Operacoes (tecla 4)

## Overview

Tela de listagem e gestao de jobs disponiveis. Vive dentro do dominio
**Agenda** (nav bar). E a tela operacional principal do core loop: o jogador
passa a maior parte do tempo aqui decidindo quem escalar pra qual job.

**PC-First.** Layout de tabela densa com filtros poderosos, nao cards.
O jogador precisa comparar 20+ jobs rapidamente — cards desperdicam espaco.

## Layout — PC (1920×1080)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [Nav Bar]                                                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│ Portal > Agenda > Job Board                                                 │
│                                                                             │
│ ┌── FILTROS (barra horizontal, sempre visivel) ──────────────────────────┐ │
│ │ Tipo: [Todos ▼]  Stats: [Todos ▼]  Prazo: [Todos ▼]  Pagamento: [▼]  │ │
│ │ [✓ Disputados] [✓ Recorrentes] [✓ Meus tier]    Ordenar: [Match % ▼] │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ┌── TABELA DE JOBS ──────────────────────────────────────────────────────┐ │
│ │                                                                         │ │
│ │ Tipo  │ Nome              │ Requisitos      │ Pagamento │ Prazo  │Match│ │
│ │ ──────┼───────────────────┼─────────────────┼───────────┼────────┼─────│ │
│ │ ⭐📺  │ Music Monday      │ Vocal 60+,      │ ¥5M (+30%)│ 2 sem  │     │ │
│ │       │ (TV Tokyo)        │ Tier B+         │           │        │     │ │
│ │       │                   │                 │           │        │     │ │
│ │       │ Melhor: Tanaka 85%🟢 Yamada 62%🟡  │           │        │ 85% │ │
│ │ ──────┼───────────────────┼─────────────────┼───────────┼────────┼─────│ │
│ │ 🎤    │ Show Osaka         │ Danca 50+,      │ ¥1.2M     │ Esta   │     │ │
│ │       │ (Zepp Osaka)      │ Aura 40+        │           │ semana │     │ │
│ │       │                   │                 │           │        │     │ │
│ │       │ Melhor: Suzuki 91%🟢                │           │        │ 91% │ │
│ │ ──────┼───────────────────┼─────────────────┼───────────┼────────┼─────│ │
│ │ 📸    │ Sakura Cola CM     │ Visual 70+,     │ ¥3M       │ 3 sem  │     │ │
│ │       │ (Sakura Brands)   │ Tier C+         │           │        │     │ │
│ │       │                   │                 │           │        │     │ │
│ │       │ Melhor: Tanaka 78%🟢                │           │        │ 78% │ │
│ │ ──────┼───────────────────┼─────────────────┼───────────┼────────┼─────│ │
│ │ ...   │ (20+ jobs)        │                 │           │        │     │ │
│ │                                                                         │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ┌── PAINEL LATERAL (aparece ao selecionar job) ──────────────────────────┐ │
│ │                                                                         │ │
│ │  MUSIC MONDAY Ep. 52                                                   │ │
│ │  Fonte: TV Tokyo | Audiencia: ~2M                                      │ │
│ │  Dificuldade: 7/10 | Visibilidade: 9/10                               │ │
│ │                                                                         │ │
│ │  REQUISITOS:                                                            │ │
│ │  Vocal:   60+ (Tanaka: 78 🟢, Yamada: 52 🔴)                          │ │
│ │  Tier:    B+  (Tanaka: A 🟢, Yamada: C 🔴)                            │ │
│ │                                                                         │ │
│ │  TOP MATCHES:                                                           │ │
│ │  1. Tanaka Yui     85% 🟢  Agenda: ✅ livre                           │ │
│ │  2. Yamada Rei     62% 🟡  Agenda: ✅ livre                           │ │
│ │  3. Suzuki Mei     33% 🔴  Agenda: ⚠ stress                          │ │
│ │                                                                         │ │
│ │  [Escalar Tanaka] [Escalar outra...] [Ignorar]                         │ │
│ │                                                                         │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Elementos

### Barra de Filtros
Sempre visivel. Nao esconde atras de botao.

| Filtro | Opcoes |
|---|---|
| **Tipo** | Todos, Show, TV, Radio, Gravacao, Dublagem, Foto, Meet, Evento, Endorsement, Streaming, Composicao |
| **Stats** | Vocal, Danca, Atuacao, Variedade, Visual, Carisma, Comunicacao, Aura |
| **Prazo** | Todos, Esta semana, 2 semanas, 3+ semanas |
| **Pagamento** | Todos, >¥1M, >¥3M, >¥5M |
| **Disputado** | Checkbox: so disputados |
| **Recorrente** | Checkbox: so recorrentes |
| **Ordenacao** | Match %, Pagamento, Prazo, Fama potencial, Dificuldade |

### Tabela de Jobs
Layout de tabela densa — colunas configuraveis:

**Colunas default:**
- Icone de tipo + badge (disputado/recorrente)
- Nome + fonte (emissora/marca/evento)
- Requisitos (stats minimos com cor)
- Pagamento (com bonus se disputado)
- Prazo
- Best Fit (idol + % — melhor match absoluto, pode estar indisponivel)
- Best Available (idol + % — melhor match LIVRE e saudavel agora)

**Colunas opcionais (jogador ativa):**
- Dificuldade
- Visibilidade
- Fama potencial
- Duracao (dias)
- Solo/grupo
- Competicao (quantas agencias)

### Painel Lateral (Detail on Select)
Selecionar uma linha da tabela abre painel lateral **sem sair da tela**:
- Detalhes do job
- Requisitos com match por idol (cor verde/vermelho)
- Top 3 matches do roster com % + status de agenda + wellness
- Botao de escalar direto
- Botao "Escalar outra" abre picker de idol

**Isso evita o erro do FM26 de "muitos cliques"** — o jogador ve detalhes
sem navegar pra outra tela.

### Escalacao Inline

Ao clicar "Escalar":

```
┌─────────────────────────────────────┐
│ CONFIRMAR ESCALACAO                 │
│                                     │
│ Job: Music Monday Ep. 52            │
│ Idol: Tanaka Yui                    │
│ Match: 85%                          │
│                                     │
│ Checklist:                          │
│ ✅ Agenda: slot livre (terca)       │
│ ✅ Contrato: dentro da carga        │
│ 🟡 Wellness: stress 58% (atencao)  │
│ ✅ Exclusividade: ok                │
│                                     │
│ ⚠ "Stress acima de 50%. Continuar?"│
│                                     │
│ [Confirmar] [Cancelar]              │
└─────────────────────────────────────┘
```

- Aviso visual em amarelo, **nunca bloqueia**
- Jogador confirma ou cancela
- Apos confirmar: job sai da lista, slot bloqueado na agenda

### Best Fit vs Best Available

A tabela mostra DUAS colunas de match (ambas default):

| Coluna | Significado | Quando diferem |
|---|---|---|
| **Best Fit** | Idol com maior % de match absoluto, independente de disponibilidade | Sempre mostra a melhor idol teorica |
| **Best Available** | Idol com maior % de match que ESTA LIVRE + wellness verde/amarelo | Mostra quem voce pode escalar AGORA |

**Por que importa:**
- Best Fit = Tanaka 92% — mas Tanaka esta em burnout
- Best Available = Yamada 68% — disponivel e saudavel
- O jogador precisa saber AMBOS pra tomar decisao informada
- Se Best Fit == Best Available: mostra so 1 (sem redundancia)

Best Available considera:
- Agenda: tem slot livre no dia do job?
- Wellness: stress < 80%? (nao em burnout/crise?)
- Contrato: dentro da carga maxima?
- Estrategia: nao viola restricoes da postura?

### Batch Actions (Acoes em Lote)

Selecionar multiplos jobs na tabela (`Ctrl+Click` ou `Shift+Click`)
habilita acoes em lote:

| Acao | O que faz |
|---|---|
| **Auto-Escalar** (`Shift+E`) | Escala Best Available pra cada job selecionado. Confirmacao antes |
| **Pin** (`P`) | Marca jobs como favoritos (ficam no topo) |
| **Rejeitar** (`X`) | Remove jobs da lista (voltam na proxima semana se ainda ativos) |
| **Aguardar** (`W`) | Marca como "esperando" — lembrete aparece quando prazo < 1 semana |

**Auto-Escalar em lote:**
- Mostra resumo: "5 jobs, 4 idols Best Available, 1 sem match aceitavel"
- Jogador confirma ou ajusta individualmente
- Nao escala se nenhuma idol tem match > 40%
- Ideal pra semanas com muitos jobs rotineiros

### Jobs Disputados

- Badge ⭐ na tabela
- Coluna de competicao: "3 agencias competindo"
- Pagamento mostra bonus (+20-50%)
- No painel lateral: aviso "Job disputado — melhor match ganha"
- Apos semana: News Feed mostra quem ganhou (se nao foi o jogador)

### Jobs Recorrentes

- Badge 🔄 na tabela
- Escalar uma vez = automatico toda semana
- Cancelar: botao no painel lateral com aviso de prazo

## Historico de Jobs

Tab separada acessivel via submenu de Agenda:

| Data | Job | Idol/Grupo | Nota | Receita | Fama | Post-Mortem |
|---|---|---|---|---|---|---|
| Sem 44 | Show Budokan | Tanaka | S | ¥5M | +250 | [→] |
| Sem 43 | Music Monday | Suzuki | D | ¥600K | -80 | [→] |

- [→] abre Moment Engine breakdown
- Filtros: por idol, por tipo, por nota, por periodo
- Inclui jobs perdidos pra rival e completados por indies

## Acceptance Criteria

1. Tabela de 20+ jobs carrega em <500ms
2. Filtros e ordenacao funcionam combinados sem lag
3. Colunas configuraveis pelo jogador (drag ou toggle)
4. Painel lateral abre ao selecionar job sem navegar
5. Escalacao com checklist inline (agenda, contrato, wellness)
6. Aviso amarelo em wellness sem bloquear
7. Jobs disputados mostram badge, competicao e bonus
8. Requisitos com cor verde/vermelho por idol
9. Match % calculado corretamente
10. Historico filtravel com link pra post-mortem

## Open Questions

- Nenhuma pendente
