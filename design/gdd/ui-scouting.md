# Scouting UI

> **Status**: Designed
> **Author**: user + game-designer
> **Last Updated**: 2026-03-30
> **Implements Pillar**: Pilar 1 — Simulação com Profundidade Real

## Overview

Tela de gerenciamento de scouting: enviar olheiros, agendar castings, ver
resultados de buscas, e avaliar candidatos encontrados. Inclui mapa do Japão
com regiões clicáveis pra enviar scouts, e lista de candidatos com stats
(com margem de erro), tier estimado, e botão de fazer proposta.

## Detailed Design

### Layout (PC Desktop)

```
┌─────────────────────────┐
│ ← SCOUTING              │
│ [Olheiros] [Casting] [Online]│
├─────────────────────────┤
│ MAPA DO JAPÃO           │
│   ┌──┐                  │
│   │北│ Hokkaido          │
│   └──┘                  │
│  Tokyo ●  Nagoya ●      │
│  Osaka ●  Fukuoka ●     │
│                         │
│ Olheiros ativos: 2/3    │
│ Scout A → Tokyo (2/4 sem)│
│ Scout B → Osaka (1/2 sem)│
│ [Enviar novo scout ▼]   │
├─────────────────────────┤
│ CANDIDATOS ENCONTRADOS  │
│ ┌─────────────────────┐ │
│ │ [Avatar] Idol X     │ │
│ │ Região: Fukuoka     │ │
│ │ Tier est.: C-A      │ │
│ │ Vocal: ~65 Dança:~45│ │
│ │ "Estrela Discipl."  │ │
│ │ [Ver perfil] [Propor]│ │
│ └─────────────────────┘ │
│ ... (mais candidatos)   │
└─────────────────────────┘
```

### Elementos

- **Mapa**: Regiões clicáveis, mostra scouts ativos com timer
- **Tabs**: Olheiros (mapa), Casting (agendar audição), Online (busca digital)
- **Candidatos**: Cards com stats estimados (~ indica margem), tier range, rótulo
- **Propor**: Abre tela de contrato com auto-fill das preferências da idol

### Filtros

- Filtrar candidatos por stat específico
- Comparar candidatos side-by-side
- Histórico de scouts anteriores

## Dependencies

**Hard**: Scouting & Recruitment
**Depended on by**: Contract System (inicia proposta daqui)

## Acceptance Criteria

1. Mapa mostra regiões com scouts ativos e timer
2. Candidatos mostram stats com margem de erro proporcional ao scout skill
3. Tier range (ex: "C-A") e S+ masking funcionam
4. Botão "Propor" abre contrato com auto-fill
5. Tabs alternam entre métodos de scouting
