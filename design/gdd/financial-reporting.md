# Financial Reporting

> **Status**: Designed
> **Author**: user + game-designer
> **Last Updated**: 2026-03-30
> **Implements Pillar**: Pilar 1 — Simulação com Profundidade Real

## Overview

O Financial Reporting gera relatórios financeiros mensais detalhados: receita
por fonte (jobs, royalties, merch, endorsements), despesas por categoria
(salários, facilities, scouting, produção), lucro/prejuízo, projeções, e
comparativo com meses anteriores, incluindo analytics avançados
(projeções, comparativos com rivais, tendências).

## Player Fantasy

A fantasia é de **CFO que lê o balanço**. Entender de onde vem cada yen e
pra onde vai. Descobrir que 40% da receita vem de uma única idol e perceber
o risco. Serve o **Pilar 1**: números reais com consequências reais.

## Detailed Design

### Core Rules

#### 1. Relatório Mensal (free)

| Seção | Conteúdo |
|---|---|
| **Receita total** | Soma de todas fontes, comparativo mês anterior |
| **Receita por fonte** | Jobs, royalties, merch, endorsements, transferências |
| **Despesa total** | Soma de todas despesas |
| **Despesa por categoria** | Salários, facilities, scouting, produção, marketing |
| **Lucro/Prejuízo** | Receita - despesas |
| **Top 3 idols (receita)** | 3 idols que mais geraram receita + botão "Ver mais" pra lista completa |
| **Metas do dono** | Status de cada meta (cumprida/falhada) |
| **Saldo** | Caixa atual da agência |

#### 2. Analytics Avançados

| Feature | Conteúdo |
|---|---|
| **Projeções** | Receita/despesa estimada pro próximo mês |
| **Tendências** | Gráfico de lucro dos últimos 6 meses |
| **ROI por idol** | Receita gerada vs. custo total (salário + treino + marketing) |
| **Comparativo rival** | Ranking de faturamento entre agências (estimado) |
| **Alertas financeiros** | "Se manter esse ritmo, caixa negativo em 3 meses" |

### Interactions with Other Systems

| Sistema | O que fornece |
|---|---|
| **Agency Economy** | Todos dados de receita e despesa |
| **Time/Calendar** | Trigger mensal |
| **Contract System** | Custos de salários e multas |
| **Music Charts** | Receita de royalties e vendas |
| **Scouting** | Custos de olheiros |

## Formulas

#### Lucro Mensal

```
lucro_mensal = receita_total - despesa_total

receita_total = jobs + royalties + merch + endorsements + transferencias_in
despesa_total = salarios + facilities + scouting + producao + marketing + transferencias_out
```

#### ROI por Idol

```
roi_idol = (receita_gerada - custo_total) / custo_total × 100

custo_total = salario_acumulado + custo_treino + custo_marketing_dedicado
receita_gerada = jobs_receita + royalties_idol + merch_idol + endorsements_idol
```

#### Projeção de Receita (próximo mês)

```
projecao_receita = media_movel_3m × trend_factor

media_movel_3m = (receita_m1 + receita_m2 + receita_m3) / 3
trend_factor = receita_m1 / receita_m2  // >1 crescendo, <1 caindo
```

#### Alerta de Caixa Negativo

```
meses_ate_zero = saldo_atual / (despesa_media_mensal - receita_media_mensal)
// Alerta se meses_ate_zero <= CASH_ALERT_MONTHS e despesa > receita
```

## Edge Cases

- **Primeiro mês (sem histórico)**: Projeções e tendências não exibidas.
  Mostrar "Dados insuficientes — disponível após 3 meses"
- **Receita zero**: Relatório exibe normalmente, projeção aponta ¥0. Alerta
  financeiro ativo se despesas > 0
- **Idol transferida no meio do mês**: Receita parcial atribuída ao período
  ativo; custo de salário proporcional aos dias no roster
- **Todas idols do roster gerando prejuízo**: ROI negativo para todas.
  Alerta: "Nenhuma idol rentável este mês"
- **Rival com dados incompletos**: Comparativo rival mostra estimativa
  baseada em ranking de fama e resultados públicos, não dados reais
- **Mês com transferência de entrada grande**: Pico isolado não distorce
  tendência — projeção usa média móvel, não último mês

## Tuning Knobs

| Knob | Default | Range | Efeito |
|---|---|---|---|
| `CASH_ALERT_MONTHS` | 3 | 1-6 | Meses até caixa zero antes de disparar alerta |
| `PROJECTION_WINDOW` | 3 | 2-6 | Meses usados na média móvel de projeção |
| `ROI_DISPLAY_THRESHOLD` | -50% | -100% a 0% | ROI mínimo antes de highlight vermelho |
| `TREND_MIN_MONTHS` | 3 | 2-6 | Meses mínimos antes de mostrar tendência |
| `RIVAL_ESTIMATE_ACCURACY` | 0.7 | 0.5-0.95 | Precisão da estimativa de faturamento rival |

## Dependencies

**Hard**: Agency Economy, Time/Calendar
**Depended on by**: Agency Meta-Game, Week Results UI (seção mensal)

## Acceptance Criteria

1. Relatório mensal gerado automaticamente a cada 4 semanas
2. Receita e despesa detalhadas por categoria
3. Top 3 idols por receita mostradas corretamente
4. Analytics avançados visíveis para todos os jogadores
5. Projeções com precisão razoável (±20%)
