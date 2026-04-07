# Wireframe 62 — World Rankings (Rankings Oricon/Fama)

> **Status**: Draft (FM26 UI Standard)  
> **Referência visual**: FM26 Competitions / Club Rankings / Coefficient  
> **Resolução alvo**: 1920×1080 (PC-first)  
> **Rota**: `/agency/rankings`  
> **GDDs**: agency-growth, finance-economy

---

## Conceito

No Football Manager, você é obcecado pela tabela da Premier League e pelo Coeficiente de Clubes da UEFA.
No **Star Idol Agency**, esta é a tela do **Ranking de Agências e Paradas da Oricon**. É a sua "Tabela do Campeonato". Aqui você vê se a sua agência subiu do Ranking D para C, o que atrai melhores talentos, e acompanha os seus álbuns brigando pelo Top 1 nas listas semanais de vendas.

---

## Estrutura da Tela (Layout FM26)

```text
+-------------------------------------------------------------------------------------------------+
| [Logo] < >   Portal | Plantel | Recrutamento | Dia de Show | Clube | Carreira  | RELATÓRIOS (V) |
|-------------------------------------------------------------------------------------------------|
| RANKINGS (Ativo) | Finanças Avançadas | Histórico Oricon | Auditoria Médica | Segurança         |
+-------------------------------------------------------------------------------------------------+
| [ CABEÇALHO - VISÃO DA INDÚSTRIA ]                                                              |
| Semana 15 de 2026 | Valor Total da Indústria: ¥ 850 Bilhões                                     |
|-------------------------------------------------------------------------------------------------|
| [ COLUNA ESQ - RANKING DE AGÊNCIAS (TIERS) ] | [ COLUNA CENTRO/DIR - ORICON MUSIC CHARTS ]      |
|                                              |                                                  |
| RANKING NACIONAL DE PRESTÍGIO                | ORICON WEEKLY TOP 10 (Singles)                   |
|                                              |                                                  |
| [TIER S - Lendárias]                         | #1  [-] "Summer Breeze" - Titan Girls (Titan Ag) |
| 1. Titan Agency        [ Reputation: 9800 ]  |     Vendas: 450.000 cópias | Semanas: 3          |
| 2. RedMoon Production  [ Reputation: 9100 ]  |                                                  |
|                                              | #2  [▲] "Starlight Melody" - Celestial Nine      |
| [TIER A - Gigantes]                          |     Vendas: 320.000 cópias | Semanas: 1 (NEW!)   |
| 3. NeoTokyo Stars      [ Reputation: 8200 ]  |     (Star Idol Agency)                           |
| 4. Sun&Sea Entertainm. [ Reputation: 7900 ]  |                                                  |
|                                              | #3  [▼] "Rainy Days" - Koji (Solo Indie)         |
| [TIER B - Nacionais]                         |     Vendas: 180.000 cópias | Semanas: 5          |
| 5. STAR IDOL AGENCY    [ Reputation: 6500 ]  |                                                  |
|    (Você subiu 2 posições este ano!)         | #4  [▲] "Neon Dreams" - CyberIdols               |
|                                              | ...                                              |
| [TIER C - Regionais]                         |                                                  |
| 12. Osaka Underground  [ Reputation: 4200 ]  | RANKING DE ÁLBUNS                                |
|                                              | [ Botão: Alternar para Ranking de Álbuns Mensal ]|
| [ Botão: Ver Critérios de Evolução de Tier ] |                                                  |
+-------------------------------------------------------------------------------------------------+
```

## Componentes FM26 Aplicados

### 1. The League Table (A Tabela)
A direita imita a clássica tabela de campeonatos do FM, com as setas Verdes e Vermelhas subindo e descendo de posição. A diferença é que a pontuação são "Cópias Vendidas" e "Semanas na Tabela".

### 2. Reputation Tiers (O Coeficiente da UEFA)
A esquerda atua como a hierarquia brutal do FM. Um jogador com reputação Mundial não assina com um time de 3ª divisão. Aqui, talentos Tier S não assinam com agências Tier B (sua agência). Você precisa escalar esse ranking acumulando hits na Oricon.

---

---

## Sub-View: Oricon Charts

> **FM26 equivalente**: League Tables detalhadas — quando você clica na liga
> e vê a tabela completa com posições, movimentação, pontos, gols. Aqui é a
> versão completa das paradas musicais.

Acessível via tab/botão **"Oricon Charts"** na barra de sub-navegação da tela de Rankings.
Substitui a visão split (Ranking + Top 10) por uma visão dedicada e expandida das paradas.

### Weekly Singles Chart (Top 100)

```
┌─ ORICON WEEKLY SINGLES CHART — Semana 15 de 2026 ──────────────────────────────┐
│                                                                                 │
│ [Singles (Ativo)]  [Álbuns]       [🔍 Buscar artista...]  [☐ Só minhas músicas] │
│                                   [Filtro: Semanas no chart ▼]                  │
│                                                                                 │
│ #    Mov.   Música                Artista/Grupo        Agência       Sem  Vendas Sem  Total     │
│ ──── ────── ───────────────────── ──────────────────── ──────────── ──── ────────── ─────────── │
│ ★ 1  —      Summer Breeze         Titan Girls          Titan Agency   3   450.000    1.200.000  │
│ ★ 2  ▲3 NEW Starlight Melody      Celestial Nine       STAR IDOL AG.  1   320.000      320.000  │
│   3  ▼1     Rainy Days            Koji                 Solo Indie     5   180.000      950.000  │
│   4  ▲2     Neon Dreams           CyberIdols           NeoTokyo St.   2   165.000      310.000  │
│   5  ▼1     Moonlit Serenade      Luna                 RedMoon Prod.  8   140.000    1.800.000  │
│   6  —      Cherry Blossom Wind   Hanami Five          Sun&Sea Ent.   4   125.000      520.000  │
│   7  ▲5 NEW Diamond Heart         Prism Queens         STAR IDOL AG.  1   110.000      110.000  │
│   8  ▼2     Electric Youth        Voltage              NeoTokyo St.  12    95.000    2.100.000  │
│   9  ▲1     Forever Young         Classic Rose         Titan Agency   6    88.000      680.000  │
│  10  ▼3     Tokyo Nights          Neon Seven           Osaka Undergr.  9    72.000      890.000  │
│  ...                                                                                             │
│  Mostrando 1-20 de 100                                        [1] [2] [3] [4] [5] [→]          │
│                                                                                                  │
│ ★ = Sua agência (linha com fundo dourado)                                                       │
│                                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

| Coluna | Descrição |
|---|---|
| **#** | Posição atual no chart (1-100) |
| **Mov.** | Movimentação: ▲N (subiu N posições, verde), ▼N (desceu N, vermelho), — (manteve, cinza), NEW (estreia, dourado) |
| **Música** | Título da música. Click abre detalhes (music-entities) ou Chart History |
| **Artista/Grupo** | Nome do artista ou grupo. Click abre perfil |
| **Agência** | Nome da agência. Suas músicas destacadas com ★ e fundo dourado na linha |
| **Sem** | Semanas no chart |
| **Vendas Sem** | Vendas/streams nesta semana |
| **Total** | Vendas/streams acumulados desde entrada no chart |

### Weekly Albums Chart (Top 50)

Mesmo formato do Singles Chart, acessível via toggle **[Álbuns]**:

```
┌─ ORICON WEEKLY ALBUMS CHART — Semana 15 de 2026 ──────────────────────────────┐
│                                                                                │
│ [Singles]  [Álbuns (Ativo)]      [🔍 Buscar artista...]  [☐ Só minhas músicas] │
│                                                                                │
│ #    Mov.   Álbum                 Artista/Grupo        Agência       Sem  Vendas Sem  Total     │
│ ──── ────── ───────────────────── ──────────────────── ──────────── ──── ────────── ─────────── │
│ ★ 1  ▲2     Celestial Dreams      Celestial Nine       STAR IDOL AG.  3   85.000      210.000  │
│   2  ▼1     Titan Anthology       Titan Girls          Titan Agency   8   72.000      890.000  │
│   3  —      Neon Genesis          CyberIdols           NeoTokyo St.   5   58.000      340.000  │
│   4  ▲1 NEW Moonrise              Luna                 RedMoon Prod.  1   55.000       55.000  │
│   5  ▼2     Summer Collection     Various              Compilation    12   42.000    1.200.000  │
│  ...                                                                                             │
│  Mostrando 1-20 de 50                                          [1] [2] [3] [→]                  │
│                                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Filtros

| Filtro | Descrição |
|---|---|
| **Só minhas músicas** | Toggle checkbox — filtra para mostrar apenas músicas da sua agência |
| **Buscar artista** | Campo de texto — busca por nome de artista ou grupo |
| **Semanas no chart** | Dropdown: Todas / 1-4 semanas / 5-12 semanas / 13+ semanas |

### Chart History (Histórico de Posição)

Click em qualquer música na tabela abre um painel expandido com gráfico de linha:

```
┌─ CHART HISTORY: "Starlight Melody" — Celestial Nine ──────────────────────────┐
│                                                                                │
│  Posição                                                                       │
│  #1  ─                                          ●                              │
│  #5  ─                               ●                                         │
│ #10  ─                    ●                                                    │
│ #20  ─         ●                                                               │
│ #50  ─  ●                                                                      │
│#100  ─                                                                         │
│       ──────────────────────────────────────────────── Semanas                 │
│        Sem 11   Sem 12   Sem 13   Sem 14   Sem 15                             │
│                                                                                │
│  Entrada: Sem 11 (#48)  |  Pico: #2 (Sem 15)  |  Semanas: 5  |  Total: 320k  │
│                                                                                │
│  [Fechar]                                                                      │
└────────────────────────────────────────────────────────────────────────────────┘
```

| Elemento | Descrição |
|---|---|
| **Gráfico de linha** | Eixo Y = posição (invertido, #1 no topo). Eixo X = semanas. Pontos clicáveis |
| **Resumo** | Semana de entrada + posição inicial, pico, total semanas, vendas acumuladas |
| **Hover em ponto** | Tooltip com posição, vendas daquela semana, movimentação |

---

## Acceptance Criteria

1. Tela dividida entre Ranking Corporativo de Reputação (Esquerda) e as Paradas de Sucesso Semanais (Oricon - Direita).
2. Agrupamento visual das agências por "Tiers" influenciando diretamente o limite teto de contratações do jogador.
3. Indicadores de tendência (▲, ▼, [-], NEW!) nas listas de músicas simulando paradas de sucesso reais.
4. Sub-view **Oricon Charts** com Weekly Singles Chart (Top 100) e Weekly Albums Chart (Top 50) em formato tabular completo
5. Músicas da agência do jogador destacadas com ★ e fundo dourado na linha
6. Filtros: toggle "Só minhas músicas", busca por artista, filtro por semanas no chart
7. Chart History: click em música abre gráfico de linha mostrando posição ao longo das semanas, com pico, entrada, e totais