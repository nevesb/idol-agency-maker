# Settings & Accessibility

> **Status**: Designed
> **Author**: user + game-designer
> **Last Updated**: 2026-03-30
> **Implements Pillar**: Pilar 3 — Múltiplos Caminhos ao Topo (acessibilidade)

## Overview

Settings & Accessibility centraliza configurações do jogo: velocidade de
simulação, idioma, notificações, acessibilidade visual, e opções de QoL.
Acessibilidade inclui: modo daltonismo (não depender só de cores pra
comunicar estado), tamanho de fonte ajustável, e simplificação de UI.

**Não há tier premium.** Todas features são built-in para todos jogadores.

## Player Fantasy

Infraestrutura invisível. O jogador sente que o jogo **se adapta a ele**.

## Detailed Design

### Core Rules

#### 1. Configurações Gerais

| Setting | Opções | Default |
|---|---|---|
| **Idioma** | Japonês, Inglês, Português, + i18n | Detecta dispositivo |
| **Velocidade Live** | ×0.5, ×1, ×2, ×4 | ×1 |
| **Notificações push** | On/Off, tipos selecionáveis | On (prazos + urgentes) |
| **Tutorial** | On/Off, reset | On |
| **Música/SFX** | Volume sliders | 80%/80% |
| **Auto-save** | Mostrar indicador | On |

#### 2. Acessibilidade

| Feature | Descrição | Default |
|---|---|---|
| **Modo daltonismo** | Ícones + texto além de cor (🟢✅ vs 🔴❌) | Off |
| **Tamanho de fonte** | Pequeno / Normal / Grande / Muito Grande | Normal |
| **Contraste alto** | Bordas e fundos mais distintos | Off |
| **Simplificar UI** | Esconde elementos secundários, foca no essencial | Off |
| **Velocidade de animação** | Normal / Rápido / Instantâneo | Normal |

#### 3. Funcionalidades Completas (built-in para todos)

| Setting | Opções | Default |
|---|---|---|
| **Skip mode** | On/Off | Off |
| **Save slots** | 1 autosave + 3 manuais | — |
| **Assistente** | On/Off, configurável (alertas, sugestões) | Off |
| **Analytics** | Básico / Avançado | Básico |
| **Cloud save** | On/Off (requer conta) | Off |

### Interactions with Other Systems

Aplica configurações globalmente a todos sistemas (velocidade, idioma, visual).

## Dependencies

**Hard**: Nenhum (sistema standalone)
**Depended on by**: Todos (configurações afetam apresentação)

## Acceptance Criteria

1. Todas settings salvam e persistem entre sessões
2. Modo daltonismo funciona (ícones + texto, não só cor)
3. Tamanho de fonte ajustável sem quebrar layout
4. Idioma troca sem restart do jogo
5. Todas features acessíveis sem restrição (sem tier premium)
6. Acessibilidade funciona em todas telas
