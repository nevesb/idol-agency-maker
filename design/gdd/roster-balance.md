# Roster Balance & Composition

> **Status**: Designed
> **Author**: user + game-designer
> **Last Updated**: 2026-04-02
> **Implements Pillar**: Pilar 1 — Simulacao com Profundidade Real

## Overview

O Roster Balance & Composition e o sistema de **analise de composicao global
do roster**. Enquanto arquetipos classificam cada idol individualmente, Roster
Balance avalia o conjunto: cobertura por arquetipo, risco de concentracao,
curva etaria, pipeline futuro e dependencia de estrelas. E o equivalente da
tela de "squad depth" do Football Manager -- onde voce ve que esta sem lateral
esquerdo ou com muitos meias.

## Player Fantasy

A fantasia e de **GM que constroi um elenco equilibrado**. "Tenho 3 variety
engines mas nenhuma ace vocal." "Meu roster e jovem demais -- sem veteranas
pra mentoria." "Dependo 60% da receita de uma idol -- se ela sair, quebro."
Essa leitura transforma contratacoes de decisoes isoladas em decisoes de
portfolio.

## Detailed Design

### Core Rules

#### 1. Dimensoes de Analise

| Dimensao | O que mede | Como mostra |
|---|---|---|
| **Cobertura por arquetipo** | Quantas idols de cada arquetipo no roster | Barra por arquetipo (0, 1, 2+) |
| **Distribuicao etaria** | Mix de idades no roster | Grafico: jovens / prime / veteranas |
| **Concentracao de receita** | % de receita gerada pelos top N idols | Pie chart ou barra |
| **Cobertura por tipo de job** | Roster capaz de cobrir cada categoria de job | Heatmap: forte / fraco / vazio |
| **Pipeline futuro** | Trainees e rising em desenvolvimento | Contagem + projecao |
| **Dependencia de estrela** | Quanto o roster depende de 1-2 idols | Indice 0-100 (quanto maior, pior) |
| **Profundidade de grupo** | Substituta disponivel pra cada membro de grupo | Por membro: tem backup? |
| **Custo vs tier** | Gasto total em salarios vs tier medio do roster | Eficiencia de custo |

#### 2. Tela de Roster Balance

```
ROSTER BALANCE — Agencia Stellaris (12 idols)

COBERTURA POR ARQUETIPO:
  Center:           ██ 2     [OK]
  Ace Vocal:        █  1     [BAIXO]
  Dance Ace:        █  1     [BAIXO]
  Visual Face:      ██ 2     [OK]
  Variety Engine:   ███ 3    [FORTE]
  All-Rounder:      █  1     [OK]
  Reliable Veteran: 0        [VAZIO] ⚠
  Rising Trainee:   ██ 2     [OK]
  Outros:           0

ALERTAS DE COMPOSICAO:
  ⚠ Sem veterana — falta mentoria e estabilidade
  ⚠ Ace Vocal unica — se sair/lesionar, capacidade musical cai drasticamente
  ⚠ 45% da receita vem de Tanaka Yui — dependencia alta

CURVA ETARIA:
  12-17: ██      2 idols (pipeline)
  18-22: ██████  6 idols (prime)
  23-27: ███     3 idols (established)
  28+:   █       1 idol  (veterana em falta)

PIPELINE:
  Trainees:  2 (Kimura, Akagi)
  Pre-debut: 0
  Rookies:   1 (Ogawa)
  → Projecao: 1 idol pronta pra Rising em ~3 meses

COBERTURA DE JOBS:
  Shows/Concertos:  ████████  FORTE
  TV/Variety:       ████████  FORTE
  Gravacao musical: ████      MEDIO
  Dublagem:         ██        FRACO
  Sessao de fotos:  ████████  FORTE
  Streaming:        ██████    BOM
  Endorsements:     ██████    BOM
```

#### 3. Indicadores de Saude do Roster

| Indicador | Saudavel | Atencao | Critico |
|---|---|---|---|
| **Cobertura de arquetipos** | 8+ arquetipos cobertos | 5-7 cobertos | < 5 cobertos |
| **Concentracao de receita** | Top 1 < 25% | Top 1 25-40% | Top 1 > 40% |
| **Curva etaria** | Mix equilibrado | Enviesado pra jovens OU veteranas | Sem pipeline OU sem experiencia |
| **Pipeline** | 2+ trainees/rookies | 1 trainee | 0 trainees |
| **Dependencia de estrela** | Indice < 30 | Indice 30-60 | Indice > 60 |
| **Profundidade de grupo** | Backup pra cada membro | Backup pra maioria | Sem backup |

#### 4. Sugestoes Automaticas

Baseado na analise, o sistema sugere acoes:

| Gap Identificado | Sugestao |
|---|---|
| Sem Ace Vocal | "Considere buscar idol com Vocal > 70 via scouting" |
| Sem veterana | "Idols 25+ no mercado: [lista]. Considere contratar pra mentoria" |
| Pipeline vazio | "Nenhuma trainee. Investir em scouting de novatas?" |
| Concentracao alta | "60% da receita de [idol]. Desenvolver alternativas" |
| Excesso de tipo | "4 Variety Engines. Roster desequilibrado pra TV" |
| Custo alto vs tier | "Folha salarial acima da media pra seu tier. Considere liberar [idol]" |

**Regras:**
- Sugestoes aparecem so se staff relevante esta contratado (Talent Manager ou coach)
- Sugestoes sao informativas -- nao forcam acao
- Podem ser dispensadas pelo jogador

### Interactions with Other Systems

| Sistema | Direcao | O que flui |
|---|---|---|
| **Idol Archetypes** | <- arquetipos | Classificacao por arquetipo |
| **Idol Attribute/Stats** | <- stats | Dados brutos pra analise |
| **Agency Economy** | <- financas | Receita por idol, custo total |
| **Contract System** | <- contratos | Salarios, prazos |
| **Talent Development** | <- estagios | Pipeline de desenvolvimento |
| **Idol Lifecycle** | <- idades | Curva etaria |
| **Group Management** | <- grupos | Profundidade por membro |
| **Job Assignment** | <- cobertura | Capacidade de cobrir tipos de job |
| **Agency Intelligence** | -> alimenta | Dados de roster entram nos reports |
| **Agency Planning Board** | -> alimenta | Gaps aparecem como gargalos no planning |
| **Scouting & Recruitment** | -> sugere | Gaps sugerem perfis de busca |
| **Agency Staff** | <- habilita sugestoes | Staff presente habilita sugestoes |

## Formulas

#### Indice de Dependencia de Estrela

```
receita_top1 = receita da idol que mais gera / receita_total
receita_top3 = receita das 3 idols que mais geram / receita_total

dependencia = receita_top1 × 60 + receita_top3 × 40
// Normalizado pra 0-100

// Exemplo: top 1 gera 50% (×60 = 30), top 3 geram 80% (×40 = 32)
// dependencia = 62 = CRITICO
```

#### Score de Equilibrio do Roster

```
cobertura = arquetipos_presentes / 12 × 100
pipeline = min(trainees + rookies, 4) / 4 × 100  // cap em 4
diversidade_etaria = 1 - desvio_padrao(idades) / 10 × 100

equilibrio = cobertura × 0.4 + pipeline × 0.3 + diversidade_etaria × 0.3
// Range: 0-100
```

## Edge Cases

- **Roster de 1 idol**: Analise mostra tudo critico. Normal pra garagem no
  inicio. Sem penalidade mecanica -- e informativo
- **Roster de 50 idols**: Analise funciona mas player precisa scroll. Resumo
  no topo com alertas mais urgentes
- **Todas idols do mesmo arquetipo**: Roster extremamente especializado.
  Board alerta mas nao impede (Pilar 3: multiplos caminhos)
- **Idol muda de arquetipo**: Cobertura recalcula automaticamente. Pode
  criar novo gap ou resolver um existente
- **Nenhum staff contratado**: Analise basica funciona. Sem sugestoes
  automaticas (ninguem pra sugerir)

## Dependencies

**Hard:**
- Idol Archetypes -- classificacao por papel
- Idol Attribute/Stats -- dados base

**Soft:**
- Agency Economy, Contracts, Lifecycle, Groups, Jobs
- Agency Staff (sugestoes)

**Depended on by:**
- Agency Intelligence (reports de roster)
- Agency Planning Board (gargalos)
- Scouting (perfis sugeridos)

## Tuning Knobs

| Knob | Default | Range | Efeito |
|---|---|---|---|
| `REVENUE_CONCENTRATION_WARN` | 0.25 | 0.15-0.40 | Limiar de atencao pra concentracao |
| `REVENUE_CONCENTRATION_CRIT` | 0.40 | 0.30-0.60 | Limiar critico |
| `MIN_PIPELINE_TRAINEES` | 2 | 1-4 | Trainees minimas pra "saudavel" |
| `ARCHETYPE_COVERAGE_GOOD` | 8 | 6-10 | Arquetipos minimos pra "saudavel" |

## Acceptance Criteria

1. Tela de roster balance mostra cobertura por arquetipo
2. Concentracao de receita visivel com alertas
3. Curva etaria em grafico legivel
4. Pipeline de desenvolvimento mostra trainees e projecao
5. Cobertura de jobs por tipo mostrada como heatmap
6. Indice de dependencia de estrela calculado corretamente
7. Sugestoes automaticas quando staff presente
8. Indicadores com 3 niveis (saudavel/atencao/critico)
9. Analise funciona pra rosters de 1 a 50 idols
10. Recalcula automaticamente quando roster muda

## Open Questions

- Nenhuma pendente
