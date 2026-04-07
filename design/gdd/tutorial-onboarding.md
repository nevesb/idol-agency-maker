# Tutorial/Onboarding System

> **Status**: Designed
> **Author**: user + game-designer
> **Last Updated**: 2026-03-30
> **Implements Pillar**: Pilar 3 — Múltiplos Caminhos ao Topo (acessibilidade)

## Overview

O Tutorial/Onboarding guia jogadores novos pelos primeiros meses de jogo
sem sobrecarregar. Revela complexidade gradualmente: primeiro contratar 1 idol,
depois escalar 1 job, depois ver resultado. Sistemas avançados (facilities,
música, grupos) são introduzidos conforme o jogador progride. Nunca é
obrigatório -- jogador pode skipar tudo.

## Player Fantasy

Infraestrutura invisível quando funciona bem. O casual se sente **guiado sem
ser preso**. O hardcore skipa e descobre sozinho. Serve o **Pilar 3**: o
tutorial respeita múltiplos estilos de jogador.

## Detailed Design

### Core Rules

#### 1. Onboarding Progressivo (não um tutorial forçado)

| Semana | O que introduz | Como |
|---|---|---|
| 1 | Contratar primeira idol | Prompt + auto-fill de contrato |
| 2 | Escalar idol em job | Destaque no job board |
| 3 | Ver resultado + agenda | Relatório com tooltips |
| 4 | Wellness (barras de cor) | Tooltip quando barra muda |
| Mês 2 | Scouting (enviar olheiro) | Sugestão contextual |
| Mês 3 | Facilities (treino) | Quando tier sobe, mostra opções |
| Mês 4+ | Grupos, música, etc. | Tooltips contextuais por feature |

#### 2. Princípios

- **Contextual**: Dicas aparecem quando relevantes (não tudo de uma vez)
- **Skipável**: Botão "Já sei" em todas dicas. Toggle "Desativar tutorial"
- **Não intrusivo**: Tooltips e highlights, não popups que bloqueiam
- **Progressivo**: Complexidade revelada a cada tier da agência
- **Recoverable**: Pode reativar dicas a qualquer momento nos settings

#### 3. Assistente vs. Tutorial

O assistente é um recurso integrado disponível a todos os jogadores, complementando o tutorial:
- Tutorial: "Isso é a barra de stress" (explica o que é)
- Assistente: "Sua idol está com stress 72%, considere dar folga" (diz o que fazer)

### Interactions with Other Systems

Observa todos sistemas e gera dicas contextuais. Não afeta gameplay.

## Dependencies

**Hard**: Todos sistemas core + UI (precisa existir pra explicar)
**Depended on by**: Nenhum

## Acceptance Criteria

1. Primeiras 4 semanas guiam jogador novo sem bloquear
2. Todo tutorial é skipável
3. Tooltips aparecem contextualmente (não tudo de uma vez)
4. Toggle "Desativar tutorial" nos settings
5. Funciona sem tutorial (hardcore pode ignorar completamente)
