# Agency Meta-Game

> **Status**: Designed
> **Author**: user + game-designer
> **Last Updated**: 2026-03-30
> **Implements Pillar**: Pilar 3 — Múltiplos Caminhos ao Topo

## Overview

O Agency Meta-Game gerencia a progressão de longo prazo do jogador: metas
escaláveis do dono da agência, promoção/rebaixamento de tier da agência,
e a possibilidade de trocar de agência (como trocar de time no FM). O jogador
é o produtor/gerente, não o dono -- o dono define metas e pode demitir.
Trocar pra agência maior = mais recursos mas metas mais ambiciosas.

## Player Fantasy

A fantasia é de **carreira de produtor** -- não só da agência. Começar numa
garagem, crescer, ser notado por agências maiores, aceitar propostas
ambiciosas. Ou ser demitido e recomeçar humildemente. Como no FM onde
você pode ser contratado pelo Barcelona ou cair pra League Two.

## Detailed Design

### Core Rules

#### 1. Metas do Dono (detalhadas no Agency Economy)

Metas mensais escalam com tier. Tipos: financeira, ranking, crescimento,
qualidade, prestígio. Cumprir = bônus. Falhar 6+ meses = demissão.

#### 2. Troca de Agência

- Após 1+ ano no cargo, jogador pode receber propostas de outras agências
- Propostas chegam baseadas na reputação do jogador (ranking + metas cumpridas)
- Ao trocar: leva reputação e afinidade com idols que gerenciou
- Nova agência = novo orçamento, novo roster, novas metas
- Idols que trabalharam com jogador antes são mais fáceis de recontratar

#### 3. Demissão e Recomeço

- Dono demite após 6+ meses falhando metas
- Jogador recebe propostas de agências menores (baseado na reputação residual)
- Se reputação muito baixa: só garagem aceita
- NUNCA é game over permanente -- sempre tem recomeço

#### 4. Tiers da Agência

A agência progride por 6 níveis baseados em métricas sustentadas de desempenho:

| Tier | Nome | Descrição |
|---|---|---|
| 1 | **garage** | Agência iniciante, recursos mínimos |
| 2 | **small** | Pequena agência estabelecida |
| 3 | **mid** | Agência de médio porte com presença no mercado |
| 4 | **large** | Grande agência com múltiplos grupos e recursos |
| 5 | **major** | Agência de primeiro escalão com alcance nacional |
| 6 | **elite** | Agência de topo, referência do setor |

Rebaixamento é possível se as métricas caírem abaixo do threshold por 2+ temporadas.

#### 5. Reputação do Jogador

```
reputacao = (metas_cumpridas / metas_totais × 0.4)
          + (ranking_agencia_max × 0.3)
          + (anos_experiencia × 0.2)
          + (idols_desenvolvidas × 0.1)
```

### Interactions with Other Systems

| Sistema | O que flui |
|---|---|
| **Agency Economy** | Metas, tier, orçamento |
| **Fame & Rankings** | Ranking da agência |
| **Financial Reporting** | Dados pra avaliação de metas |
| **Player Reputation & Affinity** | Afinidade com idols transferida |

## Dependencies

**Hard**: Economy, Fame, Financial Reporting
**Soft:**
- **Producer Profile** (#50): Background define nível inicial de metas do dono. Ver `producer-profile.md` seção 4a.
**Depended on by**: Nenhum (meta-sistema)

## Acceptance Criteria

1. Propostas de troca chegam após 1+ ano com boa reputação
2. Demissão após 6 meses falhando, com oferta de agência menor
3. Afinidade com idols persiste após troca
4. Metas escalam corretamente com tier da agência
5. 6 tiers de agência (garage → small → mid → large → major → elite) com progressão e rebaixamento
