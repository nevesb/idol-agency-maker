# Idol Profile UI

> **Status**: Designed
> **Author**: user + game-designer
> **Last Updated**: 2026-04-02
> **Implements Pillar**: Pilar 1 — Simulacao com Profundidade Real
> **Parent**: ui-information-architecture.md

## Overview

Tela de perfil individual de cada idol. A tela mais visitada do jogo.
Segue o modelo **header fixo + tiles de overview + tabs de detalhe**.
Overview limpo pra decisao rapida, densidade total nas tabs internas.

**PC-First.** Projetado pra 1920×1080 com hover, tooltips e right-click.

## Layout — PC (1920×1080)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [Nav Bar]                                                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│ Portal > Roster > Suzuki Mei                                                │
│                                                                             │
│ ┌── HEADER (fixo, nao scrolla) ──────────────────────────────────────────┐ │
│ │                                                                         │ │
│ │  [AVATAR]   山田 玲 (Yamada Rei)                    [Escalar em Job]   │ │
│ │  160×200    "歌姫 (Utahime) — A Voz"                [Renovar Contrato] │ │
│ │             ★ Tier A | #45 | Rising                 [Plano de Desenv.] │ │
│ │             Saude 🟢 Felicid 🟡 Stress 🟢 Motiv 🟢                    │ │
│ │             Contrato: 8 meses restantes                                │ │
│ │                                                                         │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ┌── OVERVIEW TILES (4 tiles, scanavel) ──────────────────────────────────┐ │
│ │ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │ │
│ │ │ Performance  │ │ Receita      │ │ Fama         │ │ Dev. Plan    │   │ │
│ │ │ Ultima: A    │ │ ¥1.2M/mes   │ │ ▲+120 /sem   │ │ "Vocal→65"   │   │ │
│ │ │ Media: B+    │ │ ROI: +35%    │ │ Trend: ▲     │ │ 67% completo │   │ │
│ │ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘   │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ┌── TABS ─────────────────────────────────────────────────────────────────┐ │
│ │ [Overview] [Stats] [Desenvolvimento] [Jobs] [Contrato] [Midia/Fas]     │ │
│ │ [Historico]                                                             │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ┌── CONTENT AREA (scroll) ────────────────────────────────────────────────┐ │
│ │                                                                         │ │
│ │  (conteudo da tab selecionada — ver detalhes abaixo)                   │ │
│ │                                                                         │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Header (Fixo)

Sempre visivel no topo, nao scrolla:

| Elemento | Conteudo |
|---|---|
| **Avatar** | Visual gerado (otome/VTuber), 160×200px |
| **Nome** | Kanji + romaji |
| **Arquetipo** | Nome diegetico japones + traducao (ex: "歌姫 — A Voz") |
| **Tier + Rank** | Tier de fama com icone colorido + posicao no ranking |
| **Estagio** | Trainee / Rookie / Rising / Established / Ace / Veteran / Legacy |
| **Wellness** | 4 barras compactas com cor (sem numero — hover mostra %) |
| **Contrato** | Tempo restante em 1 linha |
| **Acoes rapidas** | Botoes: Escalar, Renovar, Plano de Desenvolvimento |
| **Traits** | Badges de traits emergentes (se houver): "Confiavel", "Diva", etc. |

## Overview Tiles (4 tiles)

| Tile | Conteudo |
|---|---|
| **Performance** | Nota do ultimo job + nota media dos ultimos 10 |
| **Receita** | Receita gerada no mes + ROI (receita vs custo) |
| **Fama** | Variacao semanal + tendencia (seta) |
| **Dev. Plan** | Meta atual + % progresso (se plano ativo). "Sem plano" se inativo |

Clique no tile scrolla pra tab relevante.

## Tabs de Conteudo

### Tab: Overview (default)

Layout de 2 colunas:

**Coluna esquerda:**
- Background narrativo (2-4 frases)
- Rotulo de personalidade (com tooltip explicando o que cada trait implica)
- Agenda desta semana (7 dias × slots)
- Ultimos 5 jobs com nota e resultado

**Coluna direita:**
- Grafico de evolucao (TA ao longo do tempo com marcos historicos)
- Premiacoes e conquistas (badges)
- Relacao com produtor (afinidade + memorias)

### Tab: Stats

Tabela densa dos **16 atributos visíveis** em **4 categorias** (ref: idol-attribute-stats v2):

```
PERFORMANCE                    PRESENÇA                      RESILIÊNCIA
Vocal      ██████████░░ 78    Visual    ████████████░ 88    Resistência █████░░░░░░░ 45
Dança      ██████░░░░░░ 55    Carisma   █████████░░░ 75    Disciplina  ██████████░░ 80
Atuação    ████████░░░░ 67    Comunic.  ██████░░░░░░ 58    Mentalidade ██████░░░░░░ 60
Variedade  ██████░░░░░░ 52    Aura      ████████░░░░ 70    Foco        ████████░░░░ 63

INTELIGÊNCIA
L. de Palco ███████░░░░ 71    TA: 66 / PT: 85 (Tier A)
Criatividade ██████░░░░ 65    Crescimento: +2.3/sem (foco: Vocal)
Aprendizado ████████░░░ 74
Trab. Equipe ███████░░░ 68
```

- Cada barra e hover = tooltip com: valor exato, teto, velocidade de crescimento
- Comparação lado-a-lado com outra idol (botão "Comparar" no topo)
- Opção de ver radar/polígono (toggle — 4 eixos: Performance/Presença/Resiliência/Inteligência)
- Atributos que estão no teto ficam destacados (cor diferente)

### Tab: Desenvolvimento

- Estagio atual com barra de progresso pros criterios do proximo
- Plano trimestral ativo (metas, progresso, foco de treino)
- Readiness check pra proxima transicao
- Historico de planos anteriores (cumpridos/falhados)
- Mentoria ativa (se houver)
- Sugestoes do coach (se contratado)

### Tab: Jobs

Tabela densa de historico de jobs:

| Data | Job | Tipo | Nota | Receita | Fama | Detalhes |
|---|---|---|---|---|---|---|
| Sem 44 | Show Budokan | Concerto | S | ¥5M | +250 | [→] |
| Sem 43 | Music Monday | TV | D | ¥600K | -80 | [→] |
| Sem 42 | Gravacao Single | Gravacao | A | ¥2M | +120 | [→] |

- Clique em [→] abre post-mortem completo (Moment Engine breakdown)
- Filtros: por tipo, por nota, por periodo
- Estatisticas agregadas: taxa de sucesso, receita total, nota media

### Tab: Contrato

- Todas clausulas do contrato atual com valores
- Historico de contratos anteriores
- Botao "Renovar" (abre negociacao)
- Botao "Rescindir" (com aviso de multa)
- Valor de mercado estimado
- Propostas de buyout ativas (se houver)

### Tab: Midia / Fas

**Midia:**
- Cobertura recente (ultimas 10 noticias sobre a idol)
- Tier de cobertura (TV nacional, revista, blog)
- Autenticidade (se PR system ativo)

**Fas:**
- Tamanho do fa-clube + grafico de crescimento
- Segmentacao (casual / dedicado / hardcore / anti-fan)
- Mood + loyalty + toxicidade
- Campanhas ativas (se houver)
- Demografia (domestico vs overseas)

### Tab: Historico

- Timeline completa: contratacao, subidas de tier, premiacoes, escandalos,
  mudancas de grupo, graduacao (se aplicavel)
- Grafico de fama ao longo da carreira
- Estatisticas por temporada (receita, jobs, nota media)
- Marcos automaticos marcados na timeline

## Perfil de Idol no Mercado (Nao Contratada)

Quando vendo perfil de idol nao contratada:

| Elemento | Visibilidade |
|---|---|
| Avatar + nome + background | Completo |
| Rotulo de personalidade | Completo (info publica) |
| Stats | Com margem de erro (±15 scout rua, exato casting/transfer) |
| Tier | Estimado como range ("entre C e A") |
| Wellness | NAO visivel |
| Contrato | Se em rival: mostra agencia, nao clausulas |
| Arquetipo | Estimado (baseado em stats estimados — pode estar errado) |
| Acoes | [Fazer Proposta] [Enviar Scout] [Adicionar a Shortlist] |

## Right-Click em Qualquer Idol (em qualquer tela)

```
Context menu:
├── Ver perfil
├── Escalar em job
├── Comparar com...
├── Adicionar a shortlist
├── Iniciar plano de desenvolvimento
├── Ver contrato
├── Ver grupo(s)  → submenu com grupos da idol (navega para /groups/[id])
└── Seguir (News Feed) → submenu com grupos de watchlist
```

## Comparacao Lado a Lado

Botao "Comparar" no header ou na tab Stats abre split view:

```
┌────────────────────────┐ ┌────────────────────────┐
│ Yamada Rei             │ │ Tanaka Yui             │
│ 歌姫 — A Voz          │ │ センター — O Rosto     │
│ Tier A | #45           │ │ Tier B | #28           │
├────────────────────────┤ ├────────────────────────┤
│ Vocal:    78 ████████  │ │ Vocal:    62 ██████    │
│ Danca:    55 ██████    │ │ Danca:    70 ███████   │
│ Carisma:  75 ████████  │ │ Carisma:  82 █████████ │
│ ...                    │ │ ...                    │
├────────────────────────┤ ├────────────────────────┤
│ Receita: ¥1.2M/mes    │ │ Receita: ¥2.0M/mes    │
│ ROI: +35%              │ │ ROI: +55%              │
│ Sucesso: 72%           │ │ Sucesso: 81%           │
└────────────────────────┘ └────────────────────────┘
```

Highlight automatico: quem e melhor em cada stat (verde pro maior).

## Acceptance Criteria

1. Header fixo com identidade, wellness, acoes rapidas — nao scrolla
2. 4 tiles de overview scanavel em 3 segundos
3. 7 tabs de conteudo com navegacao por teclado (← →)
4. Tab Stats mostra 16 atributos em 4 categorias com barras + valores + hover tooltip
5. Tab Jobs mostra tabela densa filtravel com historico completo
6. Tab Desenvolvimento mostra plano ativo + readiness + sugestoes
7. Comparacao lado a lado funcional
8. Right-click em idol abre context menu em qualquer tela
9. Perfil de idol no mercado mostra info com margem de erro
10. Grafico de evolucao com marcos historicos interativos

## Open Questions

- Nenhuma pendente
