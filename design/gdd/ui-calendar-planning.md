# Calendar/Planning UI

> **Status**: Designed
> **Author**: user + game-designer
> **Last Updated**: 2026-03-30
> **Implements Pillar**: Pilar 1 — Simulação com Profundidade Real

## Overview

Tela de visão de horizonte temporal: mostra eventos futuros, prazos, turnês,
contratos vencendo, e eventos sazonais num timeline scrollable. Permite
planejar a médio/longo prazo (semanas, meses, temporadas). Complementa a
agenda semanal com visão macro.

## Detailed Design

### Layout

```
┌─────────────────────────┐
│ ← CALENDÁRIO            │
│ [Semana] [Mês] [Trimestre] [Ano]│
├─────────────────────────┤
│ SEMANA 45-48 (Nov, Ano 3)│
│ ──────────────────────── │
│ Sem 45: Show Osaka ✅    │
│ Sem 46: Prazo Anime Expo │
│ Sem 47: (livre)          │
│ Sem 48: Contrato Yamada ⚠│
│         vence             │
├─────────────────────────┤
│ PRÓXIMOS 3 MESES         │
│ Dez: Kouhaku (Ano Novo)  │
│      Premiações musicais │
│ Jan: Temporada castings   │
│ Fev: Fim contrato Suzuki │
├─────────────────────────┤
│ PRÓXIMO ANO              │
│ Primavera: TIF, novos tal.│
│ Verão: Festivais, Comiket │
│ Outono: Premiações, dramas│
│ Inverno: Kouhaku, especiais│
└─────────────────────────┘
```

### Elementos

- **Zoom levels**: Semana (detalhado), Mês (resumo), Trimestre (eventos), Ano (sazonal)
- **Ícones**: ⚠ prazos vencendo, 🏆 eventos especiais, 📅 eventos fixos
- **Cores**: Verde (confirmado), Amarelo (prazo próximo), Vermelho (urgente)
- **Click**: Clica num evento → detalhes + botão de ação (inscrever, agendar)

## Dependencies

**Hard**: Time/Calendar, Schedule
**Soft**: Contract (vencimentos), Events (sazonais)
**Depended on by**: Nenhum (output visual)

## Acceptance Criteria

1. 4 níveis de zoom funcionam (semana/mês/trimestre/ano)
2. Eventos do World Pack aparecem nas datas corretas
3. Prazos de contrato e inscrição visíveis com alertas
4. Click em evento abre detalhes com ação possível
5. Eventos sazonais fixos visíveis no zoom anual
