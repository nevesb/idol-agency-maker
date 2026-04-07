# Rankings UI

> **Status**: Designed
> **Author**: user + game-designer
> **Last Updated**: 2026-03-30
> **Implements Pillar**: Pilar 1 — Simulação com Profundidade Real

## Overview

Tela de visualização dos 3 rankings paralelos: Individual, Grupo e Agência.
Mostra posições, movimentações (setas ▲▼), e permite filtrar/buscar. Suas
idols são destacadas visualmente. Rankings atualizam mensalmente.

## Detailed Design

### Layout

```
┌─────────────────────────┐
│ ← RANKINGS              │
│ [Individual] [Grupo] [Agência]│
├─────────────────────────┤
│  #  Nome          Fama ▲▼│
│  1. Suzuki Mei   8420 ▲2│ ← dourado pra top 10
│  2. Nakamura Y.  8100 ▼1│
│  ...                     │
│ 45. ★Tanaka Rei  2300 ▲3│ ← ★ = sua idol
│  ...                     │
│ [Buscar] [Suas idols ▼] │
└─────────────────────────┘
```

### Elementos

- **Tabs**: Individual / Grupo / Agência
- **Posição**: # com cor (dourado top 10, prata top 100, normal resto)
- **Setas**: ▲ verde (subiu), ▼ vermelho (desceu), — cinza (manteve)
- **Destaque**: ★ pra suas idols, cor de fundo diferenciada
- **Filtros**: Buscar por nome, mostrar só suas idols, por tier, por região

## Dependencies

**Hard**: Fame & Rankings
**Depended on by**: Nenhum (output visual)

## Acceptance Criteria

1. 3 tabs funcionam (Individual, Grupo, Agência)
2. Setas mostram variação mensal correta
3. Suas idols destacadas com ★
4. Filtro/busca funciona
5. Top 10 com destaque visual (dourado)
