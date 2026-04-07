# Contract Negotiation UI

> **Status**: Designed
> **Author**: user + game-designer
> **Last Updated**: 2026-03-30
> **Implements Pillar**: Pilar 2 — Suas Decisões, Suas Consequências

## Overview

Tela de negociação de contrato cláusula por cláusula. Mostra as 9 cláusulas
com o valor pré-preenchido (preferência da idol), permite ajustar cada uma,
e mostra em tempo real a reação da idol (chance de aceitar). O casual clica
"Aceitar auto-fill" e segue. O hardcore ajusta cada slider buscando a melhor
combinação possível.

## Detailed Design

### Layout (PC Desktop)

```
┌─────────────────────────┐
│ ← CONTRATO: Yamada Rei  │
│ [Auto-fill ✓] [Negociar]│
├─────────────────────────┤
│ Chance de aceitar: 87% 🟢│
├─────────────────────────┤
│ 1. Duração              │
│ [6m] [1a ●] [2a]        │  ← Idol prefere 1 ano
│                          │
│ 2. Salário fixo          │
│ ├──────●──────┤ ¥2M/mês │  ← Slider
│ Pedido: ¥2M  Seu: ¥2M   │
│                          │
│ 3. % de receita          │
│ ├────●────────┤ 25%     │
│ Pedido: 30%  Seu: 25%   │  ← Ajustou pra baixo: chance -5%
│                          │
│ 4. Exclusividade         │
│ [Sim ●] [Não]            │
│                          │
│ 5. Carga máxima          │
│ [3] [4] [5 ●] [6] [7]   │
│                          │
│ 6. Direito de imagem     │
│ [Total ●] [Parcial] [Restr.]│
│                          │
│ 7. Rescisão              │
│ ├──────●──────┤ ¥20M    │
│                          │
│ 8. Restrição namoro      │
│ [Sim] [Não ●]            │  ← Idol prefere Não
│                          │
│ 9. Descanso obrigatório  │
│ [0] [1 ●] [2] [3] dias  │
├─────────────────────────┤
│ Custo mensal total: ¥2.5M│
│ 💼 Assessoria Jurídica +20%│  ← Se facility ativa
├─────────────────────────┤
│ [Propor contrato]        │
│ [Aceitar auto-fill]      │
└─────────────────────────┘
```

### Mecânicas da UI

- **Chance de aceitar**: Recalcula em tempo real a cada ajuste de cláusula
- **Cor**: Verde (>70%), Amarelo (40-70%), Vermelho (<40%)
- **Pedido vs. Seu**: Mostra o que a idol quer vs. o que o jogador oferece
- **Auto-fill**: Preenche com preferências da idol (90%+ chance de aceitar)
- **Assessoria Jurídica**: Badge mostra +20% se facility ativa
- **Custo mensal**: Soma de salário + facilities + estimativa de % receita

### Contra-proposta

Se a idol recusa:
- Tela mostra "Idol recusou. Contra-proposta:" com cláusulas ajustadas
- Jogador aceita contra-proposta ou ajusta novamente (máx 3 rodadas)
- Se rival fez proposta: "Agência X também propôs. Competindo."

## Dependencies

**Hard**: Contract System
**Depended on by**: Scouting UI (botão "Propor"), Market/Transfer

## Acceptance Criteria

1. 9 cláusulas editáveis com sliders/botões
2. Chance de aceitar recalcula em tempo real
3. Auto-fill preenche com preferências (>90% aceitar)
4. Contra-proposta funciona até 3 rodadas
5. Assessoria Jurídica mostra bônus de +20%
6. Custo mensal total calculado corretamente
