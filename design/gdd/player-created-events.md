# Player-Created Events

> **Status**: Designed
> **Author**: user + game-designer
> **Last Updated**: 2026-03-30
> **Implements Pillar**: Pilar 3 — Múltiplos Caminhos ao Topo

## Overview

O Player-Created Events permite ao jogador criar seus próprios eventos:
festivais, shows, meet & greets, release parties. O jogador define o tipo,
escala, convidados (de sua agência e externas), e investe na produção.
Convidar artistas maiores custa mais cachê e podem recusar se o evento
for de nível baixo demais. Eventos bem-sucedidos geram receita (bilheteria),
fama, e exposição. Eventos ruins dão prejuízo.

## Player Fantasy

A fantasia é de **empresário de eventos**. Organizar um festival com 3 grupos,
convidar uma idol SSS de rival como atração principal (pagando cachê altíssimo),
e ver o resultado. Serve o **Pilar 3**: criar eventos é um caminho ativo pra
gerar fama e receita, diferente de só aceitar jobs do board.

## Detailed Design

### Core Rules

#### 1. Tipos de Evento Criável

| Tipo | Custo base | Escala | Receita potencial |
|---|---|---|---|
| **Mini live** | ¥500K | 50-200 pessoas | Baixa, boa pra novatas |
| **Show** | ¥2M-¥10M | 200-2000 pessoas | Média |
| **Festival** | ¥20M-¥100M | 2000-50000 pessoas | Alta |
| **Meet & greet** | ¥300K | 20-100 pessoas | Baixa, boa pra fan base |
| **Release party** | ¥1M-¥5M | 100-500 pessoas | Média, promove música/disco |

#### 2. Convidar Artistas Externos

- Artistas de outras agências podem ser convidados (cachê proporcional ao tier)
- Artista pode recusar se: evento muito abaixo do tier dele, agenda cheia, agência rival bloqueia
- Artista famoso atrai público → mais bilheteria e fama pra todos
- Artista novato no mesmo evento que famoso → boost de exposição

#### 3. Resultado do Evento

```
sucesso = qualidade_lineup × marketing × capacidade_venue × aleatorio
receita = bilheteria - custo_producao - caches_convidados
fama_gain = sucesso × visibilidade × participantes
```

### Interactions with Other Systems

| Sistema | O que flui |
|---|---|
| **Agency Economy** | Custo de produção (despesa), bilheteria (receita) |
| **Fame & Rankings** | Fama gerada pelo evento |
| **Schedule/Agenda** | Idols escaladas ocupam slots |
| **Market/Transfer** | Convite a artistas de rivais (collab) |
| **Music Charts** | Release party promove música/disco |

## Dependencies

**Hard**: Economy, Fame, Schedule
**Soft**: Market/Transfer, Music Charts
- Producer Profile (#50): Estilo (Event Producer) reduz custo de eventos em -10%. Ver producer-profile.md seção 4c.
**Depended on by**: News Feed

## Acceptance Criteria

1. 5 tipos de evento criáveis com custos e escalas diferentes
2. Artistas externos podem aceitar/recusar baseado no tier
3. Receita = bilheteria - custos. Pode dar prejuízo
4. Fama gerada proporcional ao sucesso e escala
5. Slots de agenda bloqueados pra idols escaladas
