# Wireframe 06 — Roster (Visão Geral + Tabela)

> **Status**: Draft
> **Referência**: FM26 Plantel (screenshots: Visão Geral com cards + Equipe Principal com tabela densa)
> **Resolução alvo**: 1920×1080 (PC-first)
> **Rota**: `/roster` (src/routes/(game)/roster/+page.svelte)
> **Domínio**: Roster (tecla 2)
> **GDDs**: idol-attribute-stats, idol-archetypes-roles, roster-balance, happiness-wellness, contract-system, idol-lifecycle, ui-idol-profile

---

## Conceito

O Roster é o **coração da gestão** — equivalente ao "Plantel" do FM26.
Duas sub-telas principais:

1. **Visão Geral** — cards com resumos agregados (como FM26 Plantel > Visão Geral)
2. **Equipe Principal** — tabela densa com colunas configuráveis (como FM26 Plantel > Equipe Principal)

Mesma filosofia: **cards para overview, tabelas para operação** (Design Principle #1).

---

## Submenu do Roster

```
  Visão Geral   Equipe Principal   Grupos   Desenvolvimento   Balanço   Contratos   Mais ▾
  ───────────
```

| Submenu | Conteúdo | Wireframe |
|---|---|---|
| **Visão Geral** | Dashboard com cards agregados (esta tela) | 06a |
| **Equipe Principal** | Tabela densa configurável de todas idols | 06b |
| **Grupos** | Grupos formados, composição, sinergia | futuro |
| **Desenvolvimento** | Planos trimestrais, estágios, foco de treino | futuro |
| **Balanço** | Cobertura por arquétipo, curva etária, concentração | futuro |
| **Contratos** | Todos contratos, vencimentos, renovações | futuro |
| **Mais ▾** | Sub-20 (trainees), Empréstimos (se aplicável) | futuro |

---

## 06a — VISÃO GERAL (Cards Agregados)

> **Referência**: FM26 Plantel > Visão Geral — lista compacta à esquerda,
> cards de resumo à direita (Tácticas, Treino, Dinâmica, Camadas Jovens,
> Depto Médico, Disciplina, etc.)

### Layout

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│ [★ LOGO] Portal | Roster▾ | Mercado | Operações | Agência | Produtor            │
│   Visão Geral  Equipe Principal  Grupos  Desenvolvimento  Balanço  Contratos     │
│   ───────────                                                                     │
├───────────────────────────────────────────────────────────────────────────────────┤
│  Roster > Visão Geral                                                             │
│                                                                                   │
│  ┌── HEADER ─────────────────────────────────────────────────────────────────────┐│
│  │ [LOGO 48] Nova Star Agency                                        ● ● ○      ││
│  │ Idols (12)                    [▾ Informações Gerais]                           ││
│  └───────────────────────────────────────────────────────────────────────────────┘│
│                                                                                   │
│ ┌─ LISTA IDOLS (55%) ──────────────┐ ┌─ CARDS RESUMO (45%) ──────────────────┐  │
│ │                                   │ │                                        │  │
│ │ Idol        Arquétipo  Idade Tier │ │ ┌─ GRUPOS ──────┐ ┌─ DESENVOLVIMENTO─┐│  │
│ │ ─────────────────────────────────│ │ │ (formação)     │ │ (planos ativos)  ││  │
│ │ [AVT] Tanaka  センター   19   S  │ │ └────────────────┘ └──────────────────┘│  │
│ │ [AVT] Suzuki  歌姫       21   A  │ │                                        │  │
│ │ [AVT] Kimura  踊り手     17   B  │ │ ┌─ WELLNESS ─────┐ ┌─ PIPELINE ──────┐│  │
│ │ [AVT] Yamada  万能型     24   A  │ │ │ (dinâmica)      │ │ (jovens/trainee)││  │
│ │ ...                              │ │ └────────────────┘ └──────────────────┘│  │
│ │                                   │ │                                        │  │
│ │ (scroll)                          │ │ ┌─ MÉDICO ──────┐ ┌─ DISCIPLINA ────┐│  │
│ │                                   │ │ │ (burnout risk) │ │ (escândalos)    ││  │
│ │                                   │ │ └────────────────┘ └──────────────────┘│  │
│ │                                   │ │                                        │  │
│ │                                   │ │ ┌─ REAÇÕES ─────┐ ┌─ METAS ─────────┐│  │
│ │                                   │ │ │ (dono + fãs)   │ │ (objectivos)    ││  │
│ │                                   │ │ └────────────────┘ └──────────────────┘│  │
│ └───────────────────────────────────┘ └────────────────────────────────────────┘  │
│                                                                                   │
│ ┌── STATUS BAR ──────────────────────────────────────────────────────────────────┐│
│ │ [LOGO 20] Nova Star Agency  │  Saldo: ¥12.8M  │  [▶ Continuar]  [⚠ 3]       ││
│ └────────────────────────────────────────────────────────────────────────────────┘│
└───────────────────────────────────────────────────────────────────────────────────┘
```

---

### CARD: Header do Roster

```
┌──────────────────────────────────────────────────────────────────┐
│ [LOGO agência 48] Nova Star Agency                  ● ● ○       │
│ Idols (12)                                                       │
│ [▾ Informações Gerais]  ← dropdown de preset de vista            │
│                                                                  │
│ [🏆 Tácticas/Grupos]  [Escolha Rápida ▾]  [Ações ▾]            │
└──────────────────────────────────────────────────────────────────┘
```

| Elemento | Descrição |
|---|---|
| **Logo agência** | 48×48, sua agência |
| **Contagem** | "Idols (12)" — total do roster |
| **● ● ○ (dots)** | Paginação se houver sub-páginas da lista (como FM26) |
| **Dropdown vista** | Presets: Informações Gerais, Contrato, Performance, Wellness |
| **Botões** | Tácticas/Grupos, Escolha Rápida (escalar), Ações em lote |

---

### CARD: Lista de Idols (Esquerda, 55%)

Lista compacta com as principais informações de cada idol:

```
┌──────────────────────────────────────────────────────────────────┐
│ Idol             Arquétipo         Idade  Nação  Jobs  Nota Avg │
│ ────────────────────────────────────────────────────────────────│
│ [AVT 24] Tanaka Yui   センター      19    🇯🇵    12    ████████ │
│          ★ S                                           A (82%)  │
│                                                                  │
│ [AVT 24] Suzuki Mei   歌姫          21    🇯🇵     8    ██████░░ │
│          ★ A                                           B (68%)  │
│                                                                  │
│ [AVT 24] Kimura Aoi   踊り手        17    🇯🇵     3    ████░░░░ │
│          ★ B (PT: S)                                   C (52%)  │
│                                                                  │
│ [AVT 24] Yamada K.    万能型        24    🇯🇵    15    ████████ │
│          ★ A                                           A (78%)  │
│                                                                  │
│ [AVT 24] Hayashi R.   ビジュアル    18    🇯🇵     5    ██████░░ │
│          ★ B                                           B (65%)  │
│                                                                  │
│ [AVT 24] Chen Wei     歌姫          20    🇨🇳     7    ██████░░ │
│          ★ B                                           B (70%)  │
│                                                                  │
│ ... (scroll)                                                     │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

| Coluna | Descrição |
|---|---|
| **Avatar** | 24×24 circular, borda colorida do tier |
| **Nome** | Bold. Nomes em link (clicáveis → perfil) |
| **Arquétipo** | Nome diegético japonês (ex: センター, 歌姫). Tooltip mostra tradução |
| **Tier** | ★ + letra (F-SSS). Cor do tier. Se PT > TA: mostra "(PT: X)" |
| **Idade** | Numérica |
| **Nação** | Flag emoji |
| **Jobs** | Total de jobs realizados |
| **Nota Avg** | Barra de performance + nota média (A-F + %) |

**Double-click** em uma idol → abre perfil completo.
**Right-click** → context menu (Ver perfil, Escalar, Desenvolver, Ver contrato).

---

---

### CARD: Grupos (Direita Superior Esquerda)

> **FM26 equivalente**: Tácticas (formação do time com campo visual)

```
┌─ GRUPOS ATIVOS ──────────────────┐
│                                   │
│  Stellar Seven (7 membros)        │
│  [AVT×5 16] [+2]                 │
│  Sinergia: 72%  │  Fama: 4,800   │
│                                   │
│  Duo Sakura (2 membros)           │
│  [AVT×2 16]                      │
│  Sinergia: 88%  │  Fama: 3,200   │
│                                   │
│  Sem grupo: 3 idols               │
│                                   │
│  [Gerir Grupos →]                 │
└───────────────────────────────────┘
```

| Elemento | Descrição |
|---|---|
| **Nome do grupo** | Bold |
| **Avatars** | Stack 16×16 dos membros (max 5 visíveis + "+N") |
| **Sinergia** | % baseada na complementaridade de stats |
| **Fama** | Valor de fama do grupo |
| **Sem grupo** | Contagem de idols não alocadas |
| **Link** | [Gerir Grupos →] navega para Roster > Grupos |

---

### CARD: Desenvolvimento (Direita Superior Direita)

> **FM26 equivalente**: Treino (calendário da semana com sessões)

```
┌─ DESENVOLVIMENTO ────────────────┐
│ Calendário desta semana           │
│                                   │
│ Seg Ter Qua Qui Sex Sáb Dom      │
│ 🎤  🎤  💃  💃  📚  📚  🛌       │
│ 🎤  💃  🎭  📚  🎤  🛌  🛌       │
│                                   │
│ Treino individual                 │
│ ↑ 3 Melhorias     ↓ 0 Retrocessos│
│                                   │
│ [AVT 16] Kimura: Vocal +2 ▲      │
│ [AVT 16] Tanaka: Dança +1 ▲      │
│ [AVT 16] Chen: Carisma +1 ▲      │
│                                   │
│ [Ver Planos →]                    │
└───────────────────────────────────┘
```

| Elemento | Descrição |
|---|---|
| **Grid semanal** | Ícones de foco por dia (🎤 Vocal, 💃 Dança, 🎭 Atuação, 📚 Estudo, 🛌 Descanso) |
| **Melhorias** | Contagem de stats que subiram esta semana |
| **Retrocessos** | Contagem de stats que caíram |
| **Lista top** | Top 3 melhorias com avatar 16×16 + stat + variação |
| **Link** | [Ver Planos →] navega para Roster > Desenvolvimento |

---

### CARD: Wellness / Dinâmica (Direita Meio Esquerda)

> **FM26 equivalente**: Dinâmica (humor do elenco com texto + cor)

```
┌─ WELLNESS DO ROSTER ─────────────┐
│                                   │
│ 🟢 Bom                           │
│ "Roster em bom estado geral.      │
│  Atenção com Suzuki (stress alto)"│
│                                   │
│ Saúde média:   78% ████████░░    │
│ Felicidade:    65% ██████░░░░    │
│ Stress médio:  42% ████░░░░░░    │
│ Motivação:     71% ███████░░░    │
│                                   │
│ ⚠ [AVT 16] Suzuki: Stress 82%   │
│ ⚠ [AVT 16] Hayashi: Motivação 35%│
│                                   │
│ [Ver Detalhes →]                  │
└───────────────────────────────────┘
```

| Elemento | Descrição |
|---|---|
| **Estado geral** | Emoji + label (🟢 Bom / 🟡 Atenção / 🔴 Crítico) |
| **Frase** | 1-2 linhas de contexto narrativo |
| **4 barras** | Médias do roster com cor (verde >60, amarelo 40-60, vermelho <40) |
| **Alertas** | Idols com indicadores críticos (avatar 16 + nome + métrica) |
| **Link** | [Ver Detalhes →] navega para visão detalhada |

---

### CARD: Pipeline / Jovens (Direita Meio Direita)

> **FM26 equivalente**: Camadas Jovens (avaliação + recomendações do coach)

```
┌─ PIPELINE ───────────────────────┐
│                                   │
│ Avaliação geral: Decente          │
│                                   │
│ Recomendações do Coach:           │
│                                   │
│ [AVT 40] Kimura Aoi              │
│ 踊り手   17 anos                  │
│ TA: ★★★☆☆  PT: ★★★★★            │
│ "Pronta para debut solo"          │
│                                   │
│ [AVT 40] Novo Trainee            │
│ 金の卵    15 anos                  │
│ TA: ★★☆☆☆  PT: ★★★★☆            │
│ "Precisa de mais 6 meses"         │
│                                   │
│ 📅 Entrada de jovens 2025:        │
│ 9/10/2025 (faltam 304 dias)      │
│                                   │
└───────────────────────────────────┘
```

| Elemento | Descrição |
|---|---|
| **Avaliação** | Texto qualitativo do coach (Excelente/Bom/Decente/Fraco) |
| **Recomendações** | Avatar 40×40 + dados + frase do coach por prospect |
| **TA/PT** | Estrelas (1-5) como FM26 |
| **Data** | Próxima janela de recrutamento de trainees |

---

### CARD: Médico / Burnout (Inferior Esquerda)

> **FM26 equivalente**: Depto. Médico (jogadores em risco de lesão)

```
┌─ RISCO DE BURNOUT ───────────────┐
│ 🏥 2 idols em risco               │
│                                   │
│ [AVT 20] Suzuki Mei  [AVT 20] +1 │
│                                   │
│ ⚠ 2 idols em risco de burnout    │
│                                   │
│ [Ver Wellness →]                  │
└───────────────────────────────────┘
```

---

### CARD: Disciplina (Inferior Centro-Esquerda)

> **FM26 equivalente**: Disciplina (suspensões)

```
┌─ DISCIPLINA ─────────────────────┐
│ 🟡 1 Escândalo ativo              │
│                                   │
│ [AVT 20] Hayashi: escândalo leve │
│ Impacto: fama -50, stress +20    │
│                                   │
│ [Gerir Escândalo →]              │
└───────────────────────────────────┘
```

---

### CARD: Reações (Inferior Centro-Direita)

> **FM26 equivalente**: Reações ao Plantel (membros da direção + adeptos)

```
┌─ REAÇÕES ────────────────────────┐
│ 👔 Dono:         🟢 Satisfeito   │
│ 👥 Fãs:         🟡 Indecisos    │
│                                   │
│ [Ver Detalhes →]                 │
└───────────────────────────────────┘
```

---

### CARD: Metas do Roster (Inferior Direita)

> **FM26 equivalente**: Objectivos

```
┌─ METAS ──────────────────────────┐
│ 📋 3 Metas ativas                │
│                                   │
│ ✅ Contratar 1 idol tier A       │
│ 🔄 Top 10 ranking agência (65%) │
│ ⏳ 2 idols com nota S este mês  │
│                                   │
└───────────────────────────────────┘
```

---

---

## 06b — EQUIPE PRINCIPAL (Tabela Densa Configurável)

> **Referência**: FM26 Plantel > Equipe Principal — tabela com avatar,
> colunas sortáveis, presets de vista, right-click para inserir/substituir/
> remover colunas. Extremamente flexível para power users.

### Layout

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│ [★ LOGO] Portal | Roster▾ | Mercado | Operações | Agência | Produtor            │
│   Visão Geral  Equipe Principal  Grupos  Desenvolvimento  Balanço  Contratos     │
│                ─────────────────                                                  │
├───────────────────────────────────────────────────────────────────────────────────┤
│  Roster > Equipe Principal                                                        │
│                                                                                   │
│  ┌── HEADER ─────────────────────────────────────────────────────────────────────┐│
│  │ [LOGO 32] Nova Star Agency              [▾ Informações Gerais]               ││
│  │ Idols (12)                   [Escolha Rápida ▾]  [Ações ▾]                   ││
│  └───────────────────────────────────────────────────────────────────────────────┘│
│                                                                                   │
│  ┌── TABELA ─────────────────────────────────────────────────────────────────────┐│
│  │ ☐  Inf  Idol            Arquétipo    Melhor Arq  Valor Est.   Idade   TA     ││
│  │────────────────────────────────────────────────────────────────────────────── ││
│  │ ☐  ▾  [AVT] Tanaka Yui  センター     センター    ¥80M-300M    19    ★★★★★  ││
│  │ ☐  ▾  [AVT] Suzuki Mei  歌姫         歌姫        ¥55M-220M    21    ★★★★☆  ││
│  │ ☐  ▾  [AVT] Kimura Aoi  踊り手       踊り手      ¥14M-150M    17    ★★★☆☆  ││
│  │ ☐  ▾  [AVT] Yamada K.   万能型       センター     ¥80M-300M    24    ★★★★☆  ││
│  │ ... (todas as idols)                                                          ││
│  │                                                                    [Expandir]││
│  └───────────────────────────────────────────────────────────────────────────────┘│
│                                                                                   │
│ ┌── STATUS BAR ──────────────────────────────────────────────────────────────────┐│
│ │ [LOGO 20] Nova Star Agency  │  Saldo: ¥12.8M  │  [▶ Continuar]  [⚠ 3]       ││
│ └────────────────────────────────────────────────────────────────────────────────┘│
└───────────────────────────────────────────────────────────────────────────────────┘
```

### Dropdown de Presets de Vista

```
[▾ Informações Gerais]
├── Informações Gerais     ← default
├── Contrato
├── Performance
├── Wellness
├── Desenvolvimento
├── Mercado
├── ───────────────
├── Criar Cópia da Vista Atual...
├── Renomear Vista Atual...
├── Apagar Vista Atual...
├── ───────────────
├── Importar Vista...
└── Exportar Vista Atual...
```

Cada preset mostra **colunas diferentes** pré-selecionadas:

| Preset | Colunas |
|---|---|
| **Informações Gerais** | Idol, Arquétipo, Melhor Arq, Valor Estimado, Idade, TA (★), PT (★), Papel no Grupo, Nação, Salário, Contrato Expira |
| **Contrato** | Idol, Salário, Revenue Share, Exclusividade, Workload Max, Rescisão, Dating, Descanso Obrig., Expira |
| **Performance** | Idol, Nota Avg, Jobs Total, Jobs Mês, Receita Gerada, Fama, Ranking, Melhor Nota, Pior Nota |
| **Wellness** | Idol, Saúde, Felicidade, Stress, Motivação, Estado, Dias Descanso, Risco Burnout |
| **Desenvolvimento** | Idol, Estágio, Plano Ativo, Progresso %, Crescimento Semanal, TA, PT, Tier |
| **Mercado** | Idol, Valor Estimado, Interesse Externo, Buyout Fee, Contrato Expira, Tier, Fama |

### Colunas Disponíveis (Catálogo Completo)

Right-click no header de qualquer coluna abre menu de personalização:

```
┌─────────────────────────┐
│ Inserir coluna         →│ → [categorias]
│ Substituir esta coluna →│ → [categorias]
│ Remover esta coluna     │
│ Dimensionar esta coluna │
│ Dimensionar todas       │
│ ─────────────────────── │
│ Criar Cópia da Vista... │
│ Renomear Vista Atual... │
│ Apagar Vista Atual...   │
│ Importar Vista...       │
│ Exportar Vista Atual... │
└─────────────────────────┘
```

#### Categorias de Colunas

**Atributos** (16 colunas em 4 categorias — ref: idol-attribute-stats v2):

*Performance (4):*
| Coluna | Tipo | Descrição |
|---|---|---|
| Vocal | Barra 0-100 | Qualidade de canto, extensão, afinação, potência |
| Dança | Barra 0-100 | Coreografia, ritmo, expressão corporal |
| Atuação | Barra 0-100 | Expressividade dramática, range emocional |
| Variedade | Barra 0-100 | Humor, improviso, presença em talk shows |

*Presença (4):*
| Coluna | Tipo | Descrição |
|---|---|---|
| Visual | Barra 0-100 | Aparência, fotogenia, estilo |
| Carisma | Barra 0-100 | Magnetismo, capacidade de cativar |
| Comunicação | Barra 0-100 | Articulação, entrevistas, MC |
| Aura | Barra 0-100 | Presença de palco, "it factor" |

*Resiliência (4):*
| Coluna | Tipo | Descrição |
|---|---|---|
| Resistência | Barra 0-100 | Suporta agenda pesada sem quebrar fisicamente |
| Disciplina | Barra 0-100 | Pontualidade, profissionalismo, segue regras |
| Mentalidade | Barra 0-100 | Lida com pressão, críticas, escândalos |
| Foco | Barra 0-100 | Concentração sob distração, consistência em shows longos |

*Inteligência (4):*
| Coluna | Tipo | Descrição |
|---|---|---|
| Leitura de Palco | Barra 0-100 | Percebe e reage à audiência em tempo real |
| Criatividade | Barra 0-100 | Capacidade de improvisar, adicionar personalidade |
| Aprendizado | Barra 0-100 | Velocidade de absorção de novas habilidades |
| Trabalho em Equipe | Barra 0-100 | Coordenação com outros, sinergia natural |

**Capacidade e Arquétipos** (6 colunas):
| Coluna | Tipo | Descrição |
|---|---|---|
| TA (Talento Atual) | ★ 1-5 | Média ponderada dos 16 atributos visíveis |
| PT (Potencial) | ★ 1-5 | Teto de desenvolvimento |
| Tier | Letra (F-SSS) | Classificação baseada no PT |
| Arquétipo Primário | Texto | Nome diegético (ex: センター) |
| Arquétipo Secundário | Texto | Se houver |
| Melhor Arquétipo | Texto | Arquétipo com melhor fit atual |

**Agência** (3 colunas):
| Coluna | Tipo | Descrição |
|---|---|---|
| Agência Atual | Logo + nome | Sempre a sua (nesta tela) |
| Data Contratação | Data | Quando entrou |
| Tempo na Agência | Duração | Meses/anos |

**Contrato** (9 colunas):
| Coluna | Tipo | Descrição |
|---|---|---|
| Salário | ¥/mês | Salário fixo mensal |
| Revenue Share | % | Percentual que a idol recebe |
| Exclusividade | Sim/Não | Cláusula de exclusividade |
| Workload Máximo | Número | Jobs por semana permitidos |
| Direitos de Imagem | Total/Parcial/Restrito | Uso de imagem |
| Fee de Rescisão | ¥ | Multa por quebra |
| Restrição de Namoro | Sim/Não | Cláusula dating |
| Descanso Obrigatório | Dias/sem | Dias de folga no contrato |
| Contrato Expira | Data | Data de expiração |

**Wellness e Dinâmica** (6 colunas):
| Coluna | Tipo | Descrição |
|---|---|---|
| Saúde | Barra 0-100 | Health bar |
| Felicidade | Barra 0-100 | Happiness bar |
| Stress | Barra 0-100 | Stress bar (alto = ruim) |
| Motivação | Barra 0-100 | Motivation bar |
| Estado | Badge | Normal/Tired/Stressed/Overwork/Burnout/Crisis |
| Risco Burnout | % | Predição de burnout nas próximas 2 semanas |

**Estado e Ciclo de Vida** (4 colunas):
| Coluna | Tipo | Descrição |
|---|---|---|
| Estágio | Badge | Em Treino/Ativa/Overwork/Burnout/Veterana/etc |
| Idade | Número | Idade atual |
| Data Nascimento | Data | Aniversário |
| Multiplicador Etário | Texto | Fase (Novidade/Prime/Manutenção/Declínio) |

**Geral** (4 colunas):
| Coluna | Tipo | Descrição |
|---|---|---|
| Nome | Texto + avatar | Nome + avatar 24×24 (sempre visível, não removível) |
| Nação | Flag | Bandeira do país |
| Grupo | Texto | Nome do grupo (se pertence a algum) |
| Papel no Grupo | Texto | Center/Ace/Support/etc. |

**Desenvolvimento** (5 colunas):
| Coluna | Tipo | Descrição |
|---|---|---|
| Plano Ativo | Texto | Nome do plano trimestral |
| Progresso | Barra % | Progresso do plano |
| Crescimento Semanal | +/- | Variação de TA por semana |
| Foco de Treino | Ícone | Stat sendo treinada atualmente |
| Mentor | Texto | Se tem mentor designado |

**Mercado e Transferência** (4 colunas):
| Coluna | Tipo | Descrição |
|---|---|---|
| Valor Estimado | Range ¥ | Estimativa de mercado (range) |
| Buyout Fee | ¥ | Fee contratual de transferência |
| Interesse Externo | Nível | Nenhum/Baixo/Médio/Alto |
| Propostas Recebidas | Número | Buyout proposals pendentes |

**Desempenho / Estatísticas** (8 colunas):
| Coluna | Tipo | Descrição |
|---|---|---|
| Jobs Total | Número | Total de jobs realizados |
| Jobs Mês | Número | Jobs neste mês |
| Nota Média | Letra + % | Nota média dos últimos 10 jobs |
| Melhor Nota | Letra | Melhor nota já obtida |
| Pior Nota | Letra | Pior nota obtida |
| Receita Gerada | ¥ | Total de receita gerada (lifetime) |
| Receita Mensal | ¥ | Receita gerada este mês |
| ROI | % | Receita / Custo (salário + investimento) |

**Fama e Rankings** (4 colunas):
| Coluna | Tipo | Descrição |
|---|---|---|
| Fama | Número | Valor de fama (0-10,000) |
| Ranking | # | Posição no ranking geral |
| Variação Ranking | ▲▼ | Variação desde último mês |
| Fan Club | Número | Tamanho do fã club |

**Total: ~70 colunas disponíveis em 11 categorias.**

### Comportamento da Tabela

| Feature | Descrição |
|---|---|
| **Sort** | Click no header = sort A-Z / Z-A. Shift+click = sort secundário |
| **Resize** | Arrastar borda entre headers para redimensionar |
| **Reorder** | Arrastar header para reordenar colunas |
| **Checkbox ☐** | Selecionar idols para bulk actions |
| **Inf ▾** | Dropdown com info rápida (tooltip expandido) |
| **Double-click** | Na linha = abre perfil completo da idol |
| **Right-click header** | Menu de colunas (inserir/substituir/remover) |
| **Right-click linha** | Context menu (Ver perfil, Escalar, Desenvolver, Contrato, Comparar) |
| **Ctrl+Click** | Selecionar múltiplas idols |
| **C** (com 2 selecionadas) | Abrir comparação side-by-side |
| **[Expandir]** | Botão no canto inferior — expande tabela para fullscreen |

### Bulk Actions (com múltiplas selecionadas)

```
[☐ 3 selecionadas]  [Dar Folga]  [Escalar]  [Renovar Contrato]  [Comparar]
```

---

## Estados Gerais

| Estado | O que muda |
|---|---|
| **Normal** | Roster completo, dados atualizados |
| **Pós-Simulação** | Stats podem ter mudado, wellness atualizado, badges de melhoria/retrocesso |
| **Idol em crise** | Linha da idol com highlight vermelho |
| **Contrato vencendo** | ⚠ ícone na coluna Expira (se <4 semanas) |
| **0 Idols** | Mensagem "Roster vazio. [Ir ao Mercado →]" |

---

## Transições

| De | Para | Animação |
|---|---|---|
| Portal | Roster > Visão Geral | Slide right |
| Visão Geral | Equipe Principal | Submenu switch (fade conteúdo, 200ms) |
| Double-click idol | Perfil completo | Slide right |
| Click [Expandir] | Tabela fullscreen | Expand animation |
| Click card (Grupos, etc.) | Sub-tela respectiva | Slide right |

---

## Assets Necessários

| Asset | Formato | Tamanhos | Uso |
|---|---|---|---|
| Avatars de idols | WebP | 16, 20, 24, 40 | Tabela, cards, lista |
| Logo agência | SVG | 20, 32, 48 | Header |
| Ícones de arquétipo | SVG | 16 | Badges de arquétipo |
| Ícones de estado | SVG | 12 | Normal, Tired, Stressed, Burnout, etc. |
| Ícones de treino | SVG | 16 | 🎤💃🎭📚🛌 |
| Flags de nação | SVG/emoji | 16 | Coluna nação |
| Stars TA/PT | SVG | 12 | ★★★★☆ rating |

---

## Acceptance Criteria

1. Visão Geral: lista de idols (55%) + 8 cards de resumo (45%) sem scroll em 1920×1080
2. Cards: Grupos, Desenvolvimento, Wellness, Pipeline, Médico, Disciplina, Reações, Metas
3. Equipe Principal: tabela densa com ~70 colunas disponíveis em 11 categorias
4. Presets de vista: 6 presets default + criar/renomear/apagar custom
5. Right-click no header: inserir/substituir/remover coluna com categorias cascata
6. Sort por qualquer coluna (click header) + sort secundário (shift+click)
7. Checkbox para seleção múltipla + bulk actions
8. Double-click em idol abre perfil completo
9. Right-click em linha abre context menu (perfil, escalar, desenvolver, contrato)
10. C com 2 selecionadas abre comparação side-by-side
11. Avatars 24×24 com borda tier em toda menção de idol
12. Logos de agência no header e cards
13. [Expandir] transforma tabela em fullscreen
14. Submenu navegável: Visão Geral, Equipe Principal, Grupos, Desenvolvimento, Balanço, Contratos
