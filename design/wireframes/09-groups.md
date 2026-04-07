# Wireframe 09 — Groups (Gerenciamento de Grupo)

> **Status**: Draft
> **Referência visual**: FM26 Club Overview + Tactics (composição, formação, chemistry)
> **Resolução alvo**: 1920×1080 (PC-first)
> **Rota**: `/groups/[id]`
> **GDDs**: group-management, idol-archetypes-roles, idol-attribute-stats, show-system, setlist-system, music-entities, fame-rankings

---

## Conceito

Tela de gerenciamento de um grupo específico. Equivalente ao Club Overview +
Tactics do FM26. O jogador monta, ajusta e monitora o grupo aqui. A tela
responde às perguntas: "Meu grupo está equilibrado?", "Quem contribui pra
quê?", "Como estão as relações internas?", "Que músicas o grupo domina?"

**Solo como grupo de 1**: Um grupo pode ter de 1 a 12 idols. Solo (1 membro)
é tratado como grupo de 1 — tem nome, logo, repertório, fama própria. A
partir de 2 membros aplicam-se as regras de sinergia, chemistry e pivô.

> **Nota GDD**: `group-management.md` define mín=2. A expansão para solo (1)
> será refletida no GDD atualizado.

**Acesso**: Portal > Roster > Grupos > [Nome do Grupo], ou via card de grupo
em qualquer tela.

---

## Layout Geral

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [Nav Bar — Logo agência | Portal  Roster  Market  Operations  Agency  ⚙]  │
├─────────────────────────────────────────────────────────────────────────────┤
│ Portal > Roster > Grupos > Aurora                               [◀ ▶]     │
│                                                                             │
│ ┌── GROUP HEADER (fixo) ─────────────────────────────────────────────────┐ │
│ │                                                                         │ │
│ │  [LOGO 80×80]  Aurora  ·  5 membros  ·  Ativo                          │ │
│ │                Sinergia: 0.28 (Excelente)  ·  Chemistry: 0.15          │ │
│ │                Fama: 4,200 (#12)  ·  Criado: Sem 4, Ano 1              │ │
│ │                Líder: Tanaka Yui (Center)                               │ │
│ │                                                                    [▼ Actions] │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ┌── OVERVIEW TILES ──────────────────────────────────────────────────────┐ │
│ │ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │ │
│ │ │ Sinergia     │ │ Performance  │ │ Fama         │ │ Repertório   │   │ │
│ │ │ 0.28 Exce.   │ │ Último: S    │ │ ▲+350 /sem   │ │ 8 músicas    │   │ │
│ │ │ Chem: 0.15   │ │ Média: A     │ │ #12 Rising   │ │ 3 sets ready │   │ │
│ │ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘   │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ┌── TABS ────────────────────────────────────────────────────────────────┐ │
│ │ [Composição]  [Dinâmicas & Afinidade]  [Repertório]  [Histórico]      │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ┌── CONTENT AREA (scroll interno) ───────────────────────────────────────┐ │
│ │                                                                         │ │
│ │  (conteúdo da tab selecionada)                                         │ │
│ │                                                                         │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Group Header (Fixo — Sempre Visível)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  ┌──────────┐                                                               │
│  │          │  Aurora  ·  5 membros  ·  Ativo                               │
│  │  [LOGO   │  Sinergia: 0.28 (████████████░░ Excelente)                   │
│  │  80×80]  │  Chemistry: 0.15 (████████████░░░ 75%)                       │
│  │          │  Fama: 4,200 (#12 no ranking de grupos)  ·  Trend: ▲         │
│  │          │  Líder: ★ Tanaka Yui (センター — Center)                     │
│  └──────────┘  Criado: Semana 4, Ano 1  ·  8 meses ativos                 │
│                                                                             │
│  🟢 Saúde    🟢 Felicid.    🟡 Stress    🟢 Motivação   (média do grupo)  │
│                                                                             │
│  [▼ Actions]                                                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

| Elemento | Descrição |
|---|---|
| **Logo** | 80×80px. Escolhido na criação entre ~200 logos pré-gerados. Editável depois |
| **Nome** | Nome do grupo (jogador define) |
| **Membros** | Contagem atual |
| **Estado** | Ativo / Em Lock / Em Conflito / Dissolvido (badge colorido) |
| **Sinergia** | Valor numérico + barra + label qualitativo. 0-0.10 Fraca, 0.10-0.20 Boa, 0.20-0.30 Excelente |
| **Chemistry** | 0.0-0.2 como barra de %. Base 0.10 = 50%. Max 0.20 = 100% |
| **Fama** | Fama absoluta + posição no ranking de grupos + tendência |
| **Líder** | Nome + arquétipo + ícone ★. Click abre modal da idol |
| **Criação** | Data + tempo ativo |
| **Wellness médio** | 4 dots coloridos (média das wellness de todos membros) |
| **[▼ Actions]** | Dropdown com ações do grupo |

### Actions Dropdown

```
▼ Actions
├── Membros
│   ├── Adicionar Membro
│   ├── Remover Membro
│   └── Trocar Líder
├── Agenda
│   ├── Escalar Grupo em Job
│   └── Agendar Treino de Grupo
├── Repertório
│   ├── Atribuir Música ao Grupo
│   └── Criar Setlist
├── Mais
│   ├── Editar Nome
│   ├── Trocar Logo
│   └── Dissolver Grupo
```

---

## Overview Tiles (4 tiles)

| Tile | Conteúdo | Click |
|---|---|---|
| **Sinergia** | Valor de sinergia + chemistry + label qualitativo | Scrolla para tab Composição |
| **Performance** | Nota do último job de grupo + média dos últimos 10 | Scrolla para tab Histórico |
| **Fama** | Variação semanal + posição no ranking + trend | Scrolla para tab Histórico |
| **Repertório** | Nº de músicas do grupo + nº de setlists prontas | Scrolla para tab Repertório |

---

## Tab: Composição (default)

Layout de 3 zonas: **Membros** (esquerda 40%) | **Radar + Pivô** (centro 30%) | **Stats do Grupo** (direita 30%)

### Zona Esquerda — Membros (40%)

```
┌─ MEMBROS ──────────────────────────────────────────────────────┐
│                                                                 │
│  #  Avatar  Nome              Arquétipo        TA    Pivô em   │
│  ─────────────────────────────────────────────────────────────  │
│  ★ [AVT]   Tanaka Yui        センター          S    4/4 cat   │
│  2 [AVT]   Sato Hana         歌姫              A    Perf,Int  │
│  3 [AVT]   Kimura Riko       踊り手            A    Perf,Res  │
│  4 [AVT]   Yamada Moe        バラエティ番長     B+   Pres,Int  │
│  5 [AVT]   Suzuki Rin        ビジュアル担当     B    Pres      │
│                                                                 │
│  Composição: Center ✓  Vocal ✓  Dance ✓  Visual ✓  Variety ✓  │
│  Sinergia de composição: +0.15 (todos papéis cobertos)         │
│                                                                 │
│  ⚠ Nenhum patinho feio detectado                               │
│                                                                 │
│  [+ Adicionar Membro]                                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

| Coluna | Descrição |
|---|---|
| **#** | Posição. ★ = líder |
| **Avatar** | 32×32 circular, borda tier |
| **Nome** | Click abre modal da idol (wireframe 07) |
| **Arquétipo** | Nome diegético japonês |
| **TA** | Tier letra (S, A, B+, etc.) |
| **Pivô em** | Categorias onde a idol está no top 50%. "4/4" = pivô em todas |
| **Composição** | Barra de arquetipos presentes vs faltantes (✓/✗) |
| **Bônus** | Explicação textual do bônus/penalidade de composição |
| **Alerta patinho feio** | ⚠ "Idol X não é pivô em nenhuma categoria" (amarelo) |

### Zona Central — Radar do Grupo (30%)

```
┌─ RADAR DO GRUPO ──────────────────────┐
│                                        │
│           Vocal                        │
│            ╱╲                          │
│      Trab.E.╱  ╲Dança                 │
│          ╱ ████ ╲                      │
│   Aprend╱████████╲Atuação             │
│        ╱██████████╲                    │
│  Criat.║████████████║Varied.           │
│        ╲██████████╱                    │
│   L.Pal ╲████████╱ Visual             │
│          ╲ ████ ╱                      │
│      Foco ╲  ╱ Carisma                │
│            ╲╱                          │
│       Ment.  Comunic.                  │
│         Disc.  Aura                    │
│           Resist.                      │
│                                        │
│  ── Grupo Aurora                       │
│  ·· Média do Ranking (ref.)           │
│                                        │
└────────────────────────────────────────┘
```

- Radar de **16 eixos** (1 por atributo) — mesmo formato do perfil individual
- Polígono preenchido = stats do grupo (calculados por top 50%)
- Polígono pontilhado = média dos grupos no mesmo tier de ranking (referência)
- Hover em eixo: tooltip com valor exato + quem são os pivôs daquele atributo

### Zona Direita — Stats do Grupo (30%)

```
┌─ STATS DO GRUPO (top 50%) ────────────┐
│                                        │
│ ─ PERFORMANCE ─                        │
│ Vocal          82 █████████░  Yui,Hana │
│ Dança          78 ████████░░  Riko,Yui │
│ Atuação        68 ███████░░░  Hana,Moe │
│ Variedade      72 ████████░░  Moe,Yui  │
│                                        │
│ ─ PRESENÇA ─                           │
│ Visual         86 █████████░  Rin,Yui  │
│ Carisma        88 █████████░  Yui,Moe  │
│ Comunicação    70 ███████░░░  Moe,Hana │
│ Aura           84 █████████░  Yui,Rin  │
│                                        │
│ ─ RESILIÊNCIA ─                        │
│ Resistência    74 ████████░░  Riko,Yui │
│ Disciplina     72 ████████░░  Hana,Rin │
│ Mentalidade    78 ████████░░  Yui,Riko │
│ Foco           70 ███████░░░  Riko,Yui │
│                                        │
│ ─ INTELIGÊNCIA ─                       │
│ L. de Palco    75 ████████░░  Yui,Hana │
│ Criatividade   68 ███████░░░  Moe,Hana │
│ Aprendizado    72 ████████░░  Hana,Riko│
│ Trab. Equipe   74 ████████░░  Moe,Yui  │
│                                        │
└────────────────────────────────────────┘
```

| Elemento | Descrição |
|---|---|
| **Valor** | Média dos top 50% membros naquele atributo |
| **Barra** | Proporcional. Verde >70, Amarelo 40-70, Vermelho <40 |
| **Nomes** | Quem são os pivôs daquele atributo (top 50%). Hover mostra valores individuais |

---

## Tab: Dinâmicas & Afinidade

Layout de 2 zonas: **Matriz de Afinidade** (esquerda 55%) | **Mapa de Influência + Wellness** (direita 45%)

### Zona Esquerda — Matriz de Afinidade (55%)

Tabela NxN mostrando afinidade entre cada par de membros. Inspirada em heat
maps de chemistry do FM26, mas com valores visíveis.

```
┌─ MATRIZ DE AFINIDADE ───────────────────────────────────────────────────┐
│                                                                          │
│              Yui     Hana    Riko    Moe     Rin                        │
│  Yui         ─      0.82    0.71    0.65    0.58                       │
│  Hana       0.82     ─      0.45    0.73    0.40                       │
│  Riko       0.71    0.45     ─      0.52    0.68                       │
│  Moe        0.65    0.73    0.52     ─      0.55                       │
│  Rin        0.58    0.40    0.68    0.55     ─                         │
│                                                                          │
│  Legenda:  ██ >0.70 (forte)  ▓▓ 0.40-0.70 (média)  ░░ <0.40 (fraca)  │
│                                                                          │
│  Afinidade média do grupo: 0.61 (Boa)                                   │
│  Par mais forte: Yui ↔ Hana (0.82)                                     │
│  Par mais fraco: Hana ↔ Rin (0.40)                                     │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

| Elemento | Descrição |
|---|---|
| **Célula** | Valor 0.0-1.0 com cor de fundo (heat map). Verde >0.70, Amarelo 0.40-0.70, Vermelho <0.40 |
| **Hover na célula** | Tooltip: "Yui ↔ Hana: 0.82 — 14 jobs juntas, 8 treinos, 3 shows. Crescimento: +0.02/mês" |
| **Afinidade média** | Média de todos os pares. Label qualitativo: Fraca/Média/Boa/Excelente |
| **Par mais forte/fraco** | Destaques automáticos |

**Como afinidade cresce** (tooltip de ajuda):
- +0.01 por job juntas (mesmo grupo ou convidadas no mesmo evento)
- +0.02 por treino de grupo
- +0.03 por show com sucesso ≥ A
- -0.05 por conflito entre as duas idols
- Cresce mesmo entre idols de rosters diferentes (ex: show multi-agência)
- Max: 1.0 (impossível na prática — ~0.90 após anos juntas)

**Click numa célula** abre painel de detalhe do par:

```
┌─ DETALHE: Yui ↔ Hana ─────────────────────────┐
│                                                  │
│  Afinidade: 0.82 (Forte)                        │
│  Desde: Semana 4, Ano 1 (mesmo grupo)           │
│                                                  │
│  Histórico:                                      │
│  ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇ 0.82                    │
│  ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇ 0.65   (6 meses atrás)      │
│  ▇▇▇▇▇▇▇▇▇ 0.40          (início)              │
│                                                  │
│  Atividades juntas: 14 jobs, 8 treinos, 3 shows │
│  Conflitos: 0                                    │
│                                                  │
│  Influência mútua:                               │
│  Yui → Hana: Carisma +3, Aura +2                │
│  Hana → Yui: Vocal +4, Disciplina +1            │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Zona Direita — Mapa de Influência + Estado (45%)

#### Mapa de Influência

Mostra o que cada idol **ensina e aprende** dos outros membros do grupo.
A influência acontece quando idols treinam ou fazem atividades juntas —
uma idol forte em Vocal pode influenciar positivamente o Vocal de outra.

```
┌─ MAPA DE INFLUÊNCIA ────────────────────────────────────────┐
│                                                              │
│  Selecionar idol: [Tanaka Yui ▼]                            │
│                                                              │
│  ── O QUE YUI ENSINA ──                                     │
│                                                              │
│  → Hana:   Carisma +3 ▲  ·  Aura +2 ▲                      │
│  → Riko:   Mentalidade +2 ▲  ·  Carisma +1 ▲               │
│  → Moe:    Visual +1 ▲  ·  Aura +2 ▲                       │
│  → Rin:    Carisma +3 ▲  ·  Comunicação +1 ▲               │
│                                                              │
│  ── O QUE YUI APRENDE ──                                    │
│                                                              │
│  ← Hana:   Vocal +4 ▲  ·  Disciplina +1 ▲                  │
│  ← Riko:   Dança +3 ▲  ·  Resistência +2 ▲                 │
│  ← Moe:    Variedade +2 ▲  ·  Comunicação +1 ▲             │
│  ← Rin:    Visual +1 ▲  ·  Foco +1 ▲                       │
│                                                              │
│  Total ensinado: 15 pts  ·  Total aprendido: 15 pts         │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

| Elemento | Descrição |
|---|---|
| **Dropdown** | Selecionar qual idol ver. Muda a perspectiva do mapa |
| **Ensina (→)** | Stats que essa idol influencia positivamente em cada membro. Baseado na diferença de stats: idol forte em X influencia idol fraca em X |
| **Aprende (←)** | Stats que essa idol absorve dos outros. Idols com stats maiores naquele atributo transmitem conhecimento |
| **Valores** | Ganho acumulado em pontos de stat desde que estão no grupo. ▲ = cresceu este mês |

**Regra de influência** (tooltip):
- Idol A influencia Idol B no stat X se: `stat_A[X] > stat_B[X] + 15`
- Ganho = `(stat_A[X] - stat_B[X]) × 0.02 × afinidade_AB × trabalho_em_equipe_B/100` por mês
- Afinidade alta = influência mais forte (motivação para manter pares com boa afinidade)
- Trabalho em Equipe da idol aprendiz amplifica a absorção
- Funciona entre idols de rosters diferentes se fazem atividades juntas

#### Dinâmicas do Grupo

```
┌─ DINÂMICAS ─────────────────────────────────────────────────┐
│                                                              │
│  LÍDER                                                       │
│  ★ Tanaka Yui · 🟢 Saudável · Chemistry +0.02/mês          │
│  Status: Estável (sem disputas)                              │
│                                                              │
│  ALERTAS                                                     │
│  ✅ Sem patinho feio                                         │
│  ✅ Sem disputas de liderança                                │
│  ⚠ Hana ↔ Rin: afinidade baixa (0.40) — risco de tensão    │
│                                                              │
│  WELLNESS INDIVIDUAL                                         │
│  ┌─────────┬────────┬─────────┬────────┬──────────┐         │
│  │ Membro  │ Saúde  │ Felic.  │ Stress │ Motivação│         │
│  ├─────────┼────────┼─────────┼────────┼──────────┤         │
│  │ Yui     │ 🟢 85  │ 🟢 78   │ 🟢 35  │ 🟢 82   │         │
│  │ Hana    │ 🟢 80  │ 🟡 55   │ 🟡 50  │ 🟢 70   │         │
│  │ Riko    │ 🟢 90  │ 🟢 75   │ 🟢 30  │ 🟢 85   │         │
│  │ Moe     │ 🟡 60  │ 🟢 72   │ 🟡 45  │ 🟢 78   │         │
│  │ Rin     │ 🟢 82  │ 🟡 58   │ 🟢 38  │ 🟡 65   │         │
│  └─────────┴────────┴─────────┴────────┴──────────┘         │
│                                                              │
│  FAMA INDIVIDUAL vs GRUPO                                    │
│  Yui: 6,500 (1.5× média) · Hana: 3,800 · Riko: 3,200      │
│  Moe: 2,900 · Rin: 2,100                                    │
│  Média individual: 3,700 · Fama do grupo: 4,200             │
│  ⚠ Se idol > 3× média e Ambição alta → risco de pedir solo │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

| Elemento | Descrição |
|---|---|
| **Líder** | Status, wellness, bônus de chemistry. 🟢 saudável / 🔴 em crise |
| **Alertas** | Sistema de warnings: patinho feio, disputa de liderança, afinidade baixa, membro descontente |
| **Wellness individual** | Tabela compacta com 4 stats de wellness de cada membro. Cores: 🟢 >60, 🟡 40-60, 🔴 <40 |
| **Fama individual vs grupo** | Compara fama de cada membro com a média. Alerta se alguém > 3× média (risco solo) |

---

## Tab: Repertório

Layout de 2 zonas: **Músicas do Grupo** (esquerda 60%) | **Setlists** (direita 40%)

### Zona Esquerda — Músicas do Grupo (60%)

Tabela densa com todas as músicas atribuídas ao grupo e a mastria/afinidade
do grupo com cada uma. A mastria do grupo = média da mastria real dos membros.

```
┌─ MÚSICAS DO GRUPO ─────────────────────────────────────────────────────────┐
│                                                                             │
│  [Filtro: Todas ▼]  [Ordenar: Mastria ▼]  [+ Atribuir Música]             │
│                                                                             │
│  Música              Gênero    Mastria   Afinidade  Readiness  Detalhes    │
│  ──────────────────────────────────────────────────────────────────────     │
│  Starlight Dream     J-Pop     82% ████  0.78 ██▓   🟢 Pronta    [→]      │
│  Kaze no Melody      Ballad    75% ███▓  0.85 ███   🟢 Pronta    [→]      │
│  Electric Thunder    EDM       58% ██▓░  0.52 ██░   🟡 Parcial   [→]      │
│  Sakura Promise      Enka-Pop  45% ██░░  0.68 ██▓   🟡 Parcial   [→]      │
│  Neon Nights         City Pop  30% █▓░░  0.41 █▓░   🔴 Não pronta [→]     │
│  Rising Sun Anthem   Rock      22% █░░░  0.35 █░░   🔴 Não pronta [→]     │
│  Moonlit Serenade    R&B       68% ███░  0.72 ██▓   🟢 Pronta    [→]      │
│  Hoshi no Kiseki     Pop-Rock  55% ██▓░  0.60 ██░   🟡 Parcial   [→]      │
│                                                                             │
│  8 músicas · 3 prontas · 3 parciais · 2 não prontas                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

| Coluna | Descrição |
|---|---|
| **Música** | Nome da música. Click abre detalhe da música |
| **Gênero** | Gênero musical |
| **Mastria** | Média da mastria de todos membros. 0-100%. Barra colorida |
| **Afinidade** | Média da afinidade individual de todos membros com a música. 0-1.0 |
| **Readiness** | 🟢 Pronta (mastria ≥70% e afinidade ≥0.60), 🟡 Parcial (mastria ≥50% OU afinidade ≥0.40), 🔴 Não pronta |
| **[→]** | Abre breakdown por membro |

**Click em [→]** expande breakdown individual:

```
┌─ BREAKDOWN: Starlight Dream ──────────────────────────────────────────┐
│                                                                        │
│  Membro       Mastria   Letra   Coreo   Vocal Fit   Afinidade         │
│  ──────────────────────────────────────────────────────────────        │
│  Yui          90% ████  95%     85%     1.00 ████   0.88              │
│  Hana         88% ████  92%     80%     0.85 ███▓   0.82              │
│  Riko         78% ███▓  70%     95%     0.65 ██▓░   0.71              │
│  Moe          72% ███░  80%     65%     0.85 ███▓   0.68              │
│  Rin          82% ████  88%     78%     0.85 ███▓   0.80              │
│                                                                        │
│  Grupo:       82%       85%     81%     —          0.78               │
│                                                                        │
│  ⚠ Riko: Vocal Fit baixo (0.65) — tessitura incompatível             │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

| Coluna do breakdown | Descrição |
|---|---|
| **Mastria** | Mastria individual daquela idol com a música (0-100%, logarítmica) |
| **Letra** | % de domínio da letra |
| **Coreo** | % de domínio da coreografia |
| **Vocal Fit** | 1.0 (perfeita), 0.85 (adjacente), 0.65 (incompatível). Baseado em tessitura/textura |
| **Afinidade** | vocal_fit×0.4 + genre_pref×0.3 + mood_match×0.2 + experience×0.1 |
| **Alertas** | ⚠ para Vocal Fit baixo, mastria abaixo de 50%, etc. |

### Zona Direita — Setlists (40%)

```
┌─ SETLISTS ───────────────────────────────────────────────────┐
│                                                               │
│  [+ Criar Setlist]                                            │
│                                                               │
│  ┌─ "Aurora Live Tour" ──────────────────────────────────┐   │
│  │  6 músicas · Readiness: 🟢 83%                         │   │
│  │                                                        │   │
│  │  1. Starlight Dream      🟢 82%                        │   │
│  │  2. Kaze no Melody        🟢 75%                        │   │
│  │  3. Moonlit Serenade     🟢 68%                        │   │
│  │  4. Hoshi no Kiseki       🟡 55%                        │   │
│  │  5. Electric Thunder     🟡 58%                        │   │
│  │  6. Starlight Dream (encore) 🟢 82%                    │   │
│  │                                                        │   │
│  │  [Editar]  [Usar em Job]                               │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─ "TV Appearance Set" ─────────────────────────────────┐   │
│  │  3 músicas · Readiness: 🟢 78%                         │   │
│  │                                                        │   │
│  │  1. Starlight Dream      🟢 82%                        │   │
│  │  2. Kaze no Melody        🟢 75%                        │   │
│  │  3. Moonlit Serenade     🟢 68%                        │   │
│  │                                                        │   │
│  │  [Editar]  [Usar em Job]                               │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

| Elemento | Descrição |
|---|---|
| **Setlist** | Lista ordenada de músicas para um contexto (show, TV, etc.) |
| **Readiness** | Média da readiness das músicas na setlist. 🟢 ≥70%, 🟡 ≥50%, 🔴 <50% |
| **Cada música** | Nome + readiness individual (mastria do grupo) |
| **[Editar]** | Reordenar, adicionar/remover músicas da setlist |
| **[Usar em Job]** | Abre Job Board com a setlist pré-selecionada |
| **[+ Criar Setlist]** | Nova setlist a partir das músicas do grupo |

---

## Tab: Histórico

Layout de 2 zonas: **Timeline** (esquerda 55%) | **Estatísticas** (direita 45%)

### Zona Esquerda — Timeline (55%)

```
┌─ TIMELINE DO GRUPO ────────────────────────────────────────────────────┐
│                                                                         │
│  [Filtro: Todos ▼]  [Período: Desde criação ▼]                         │
│                                                                         │
│  ● Sem 24  Show "Aurora Live" no Budokan — Nota: S — Fama +350        │
│  │         Receita: ¥8M · Público: 12,000 · Setlist: Aurora Live Tour  │
│  │                                                                      │
│  ● Sem 22  Single "Moonlit Serenade" lançado — #4 no chart semanal    │
│  │         Downloads: 45K · Streaming: 320K                            │
│  │                                                                      │
│  ● Sem 20  Rin adicionada ao grupo — Composição completa (5 papéis)   │
│  │         Sinergia: 0.22 → 0.28                                       │
│  │                                                                      │
│  ● Sem 18  TV "Music Station" — Nota: A — Fama +180                   │
│  │                                                                      │
│  ● Sem 15  Chemistry atingiu 0.15 (75%) — "Entrosadas"               │
│  │                                                                      │
│  ● Sem 12  Treino de grupo intensivo — Mastria geral +8%              │
│  │                                                                      │
│  ● Sem 8   Show regional — Nota: B+ — Fama +90                        │
│  │                                                                      │
│  ● Sem 4   Grupo "Aurora" criado com 4 membros                        │
│  │         Yui (Center), Hana (Vocal), Riko (Dance), Moe (Variety)    │
│                                                                         │
│  ... (scroll)                                                           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Zona Direita — Estatísticas (45%)

```
┌─ ESTATÍSTICAS ──────────────────────────────────────────────┐
│                                                              │
│  GERAL                                                       │
│  Jobs realizados:    18                                      │
│  Taxa de sucesso:    78% (14/18 nota ≥ B)                   │
│  Nota média:         A-                                      │
│  Receita total:      ¥32M                                    │
│  Fama acumulada:     +2,100                                  │
│                                                              │
│  POR TIPO DE JOB                                             │
│  ┌──────────┬──────┬────────┬──────────┐                    │
│  │ Tipo     │ Qtd  │ Média  │ Receita  │                    │
│  ├──────────┼──────┼────────┼──────────┤                    │
│  │ Show     │ 6    │ A      │ ¥18M     │                    │
│  │ TV       │ 5    │ A-     │ ¥6M      │                    │
│  │ Gravação │ 4    │ B+     │ ¥5M      │                    │
│  │ Evento   │ 3    │ B      │ ¥3M      │                    │
│  └──────────┴──────┴────────┴──────────┘                    │
│                                                              │
│  EVOLUÇÃO DE FAMA                                            │
│  ▁▂▃▃▄▅▅▆▆▇▇█  4,200 (atual)                              │
│  Trend: ▲ +350/sem (últimas 4 semanas)                      │
│                                                              │
│  EVOLUÇÃO DE SINERGIA                                        │
│  ▁▃▄▅▆▆▇▇  0.28 (atual)                                    │
│  Pico: 0.28 (agora)                                         │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Variações

### Grupo Solo (1 membro)

- Header mostra "Solo" em vez de "X membros"
- Tab Composição: sem radar de grupo (usa radar individual do perfil)
- Tab Dinâmicas: não existe (sem pares, sem matriz)
- Tab Repertório: igual ao repertório individual do perfil da idol
- Tab Histórico: timeline de jobs como solo act
- Sem sinergia, chemistry, pivô (conceitos de 2+ membros)

### Grupo em Lock (Pré-formada)

- Badge "Em Lock" no header (amarelo)
- Botão "Adicionar Membro" desabilitado com tooltip: "Lock até [data]"
- "Remover Membro" desabilitado (exceto rescisão individual de contrato)
- Demais funcionalidades normais

### Grupo em Conflito

- Badge "Em Conflito" (vermelho) no header
- Alerta vermelho na seção Dinâmicas: descrição do conflito ativo
- Barra de sinergia com cor vermelha
- Sugestões de resolução: "Trocar líder", "Remover membro X", "Dar folga ao grupo"

### Grupo Rival (Scouting)

- Logo e nome visíveis
- Membros listados mas stats com margem de erro (como idol rival scoutada)
- Sem wellness, sem afinidade entre membros (dados internos)
- Sinergia estimada como range ("0.15-0.25")
- Repertório público: músicas lançadas visíveis, mastria estimada
- Botão "Enviar Scout" para mais precisão

---

## Tela: Lista de Grupos

Antes de entrar no detalhe de um grupo, o jogador vê a lista de todos
os seus grupos em `/groups`:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Portal > Roster > Grupos                                                    │
│                                                                             │
│  [+ Criar Novo Grupo]                                                       │
│                                                                             │
│  ┌─ GRUPO ─────────────────────────────────────────────────────────────┐   │
│  │ [LOGO]  Aurora  ·  5 membros  ·  Sinergia 0.28 (Exc.)  ·  #12     │   │
│  │         Líder: Tanaka Yui  ·  Fama: 4,200  ·  Ativo               │   │
│  │         Último job: Show Budokan (S)  ·  8 músicas                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─ GRUPO ─────────────────────────────────────────────────────────────┐   │
│  │ [LOGO]  Stellar Seven  ·  7 membros  ·  Sinergia 0.18 (Boa) · #28 │   │
│  │         Líder: Nakamura Aoi  ·  Fama: 2,100  ·  Ativo             │   │
│  │         Último job: TV Music Monday (A-)  ·  5 músicas             │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─ GRUPO ─────────────────────────────────────────────────────────────┐   │
│  │ [LOGO]  Sakura (Solo)  ·  1 membro  ·  #55                        │   │
│  │         Watanabe Sakura  ·  Fama: 800  ·  Ativo                    │   │
│  │         Último job: Gravação Single (B+)  ·  3 músicas             │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Criar Novo Grupo (Wizard)

```
┌─ CRIAR GRUPO ─────────────────────────────────────────────────────────┐
│                                                                        │
│  Passo 1/3: Nome e Logo                                               │
│                                                                        │
│  Nome: [________________]                                              │
│                                                                        │
│  Escolha um logo:                                                      │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐           │
│  │ L1 │ │ L2 │ │ L3 │ │ L4 │ │ L5 │ │ L6 │ │ L7 │ │ L8 │           │
│  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘ └────┘ └────┘           │
│  (... scroll horizontal, ~200 logos pré-gerados)                       │
│  [Filtrar por estilo: Todos ▼]                                        │
│                                                                        │
│                                              [Próximo →]              │
└────────────────────────────────────────────────────────────────────────┘

┌─ CRIAR GRUPO ─────────────────────────────────────────────────────────┐
│                                                                        │
│  Passo 2/3: Membros                                                    │
│                                                                        │
│  Selecione 1-12 idols do seu roster:                                   │
│                                                                        │
│  ☑ Tanaka Yui      センター   S    ──── já em grupo: nenhum          │
│  ☑ Sato Hana       歌姫       A    ──── já em grupo: nenhum          │
│  ☑ Kimura Riko     踊り手     A    ──── já em grupo: nenhum          │
│  ☑ Yamada Moe      バラエティ  B+   ──── já em grupo: nenhum          │
│  ☐ Suzuki Rin      ビジュアル  B    ──── já em grupo: nenhum          │
│  ☐ Nakamura Aoi    万能型      B    ──── já em grupo: Stellar Seven  │
│  ...                                                                   │
│                                                                        │
│  Selecionadas: 4/12                                                    │
│  Composição: Center ✓  Vocal ✓  Dance ✓  Variety ✓  Visual ✗         │
│  ⚠ Falta papel: Visual                                                │
│                                                                        │
│                                    [← Voltar]  [Próximo →]            │
└────────────────────────────────────────────────────────────────────────┘

┌─ CRIAR GRUPO ─────────────────────────────────────────────────────────┐
│                                                                        │
│  Passo 3/3: Líder e Confirmação                                       │
│                                                                        │
│  Escolha o líder:                                                      │
│  ○ Tanaka Yui      センター   S  (recomendado: maior Carisma)        │
│  ○ Sato Hana       歌姫       A                                       │
│  ○ Kimura Riko     踊り手     A                                       │
│  ○ Yamada Moe      バラエティ  B+                                      │
│                                                                        │
│  Preview:                                                              │
│  [LOGO]  "Aurora"  ·  4 membros  ·  Sinergia estimada: 0.22 (Boa)   │
│  Composição: Center ✓  Vocal ✓  Dance ✓  Variety ✓  Visual ✗         │
│  ⚠ Nenhum membro é patinho feio                                       │
│  ⚠ Nakamura Aoi (Stellar Seven) pode ser adicionada depois            │
│                                                                        │
│                                    [← Voltar]  [Criar Grupo]          │
└────────────────────────────────────────────────────────────────────────┘
```

**Regra**: Uma idol pode pertencer a **múltiplos grupos** simultaneamente
(como na vida real). Mas chemistry e afinidade são por par de idols, não
por grupo — o grupo herda as afinidades existentes dos pares.

---

## Comportamento

| Ação | Resultado |
|---|---|
| **Click no nome/logo de grupo** (qualquer tela) | Navega para `/groups/[id]` |
| **Click no nome de membro** | Abre modal da idol (wireframe 07) |
| **Double-click no nome de membro** | Navega para perfil completo (wireframe 08) |
| **Click em célula da matriz de afinidade** | Abre painel de detalhe do par |
| **Hover em stat do grupo** | Tooltip com pivôs + valores individuais |
| **Hover em célula da matriz** | Tooltip com histórico de atividades juntas |
| **[▼ Actions]** | Dropdown hierárquico de ações |
| **Esc** (em painéis expandidos) | Fecha painel, volta ao estado anterior |

---

## Transições

| De | Para | Animação |
|---|---|---|
| Lista de Grupos → Grupo | Navega | Slide left (200ms) |
| Grupo → Perfil da Idol | Click nome | Abre modal (wireframe 07) |
| Grupo → Perfil Completo | Double-click nome | Navega slide left |
| Criar Grupo wizard | Passo a passo | Slide horizontal entre passos |

---

## Assets Necessários

| Asset | Formato | Tamanho | Uso |
|---|---|---|---|
| Logos de grupo | WebP | 80×80, 48×48, 32×32 | Header, lista, referências |
| ~200 logos pré-gerados | WebP | 200×200 (banco) | Wizard de criação |
| Avatars dos membros | WebP | 32×32 circular | Lista de membros |
| Ícones de arquétipo | SVG | 16×16 | Badges na lista de membros |
| Heat map colors | CSS | — | Matriz de afinidade (gradiente verde-amarelo-vermelho) |
| Gráfico radar | Canvas/SVG | ~280×280 | Radar de 16 eixos do grupo |

---

## Acceptance Criteria

1. Header fixo com logo, nome, sinergia, chemistry, fama, líder, wellness médio
2. 4 tiles de overview: Sinergia, Performance, Fama, Repertório
3. Tab Composição: lista de membros com arquétipo, TA, pivô + radar 16 eixos + stats top 50%
4. Radar do grupo com 16 eixos e polígono de referência (média do ranking)
5. Stats do grupo calculados por top 50% — cada atributo mostra quem são os pivôs
6. Alerta de patinho feio para idol que não é pivô em nenhum atributo
7. Composição por arquétipo com bônus/penalidade de sinergia visíveis
8. Tab Dinâmicas: matriz NxN de afinidade com heat map + hover detalhado
9. Click em célula da matriz abre painel de detalhe do par (histórico, influência mútua)
10. Mapa de Influência: o que cada idol ensina/aprende de cada membro
11. Dinâmicas: líder status, alertas, wellness individual, fama individual vs grupo
12. Tab Repertório: tabela de músicas com mastria, afinidade, readiness do grupo
13. Breakdown por membro com mastria individual, letra, coreo, vocal fit, afinidade
14. Setlists com readiness e ação "Usar em Job"
15. Tab Histórico: timeline de eventos + estatísticas agregadas + evolução de fama/sinergia
16. Wizard de criação: 3 passos (nome/logo → membros → líder/confirmação)
17. ~200 logos pré-gerados disponíveis no wizard
18. Variação para grupo solo (1 membro): sem sinergia/dinâmicas
19. Variação para grupo em lock: ações de membro desabilitadas
20. Variação para grupo rival: stats estimados, sem dados internos
21. Idol pode pertencer a múltiplos grupos simultaneamente
