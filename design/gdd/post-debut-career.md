# Post-Debut Career System

> **Status**: Designed
> **Author**: user + game-designer
> **Last Updated**: 2026-03-30
> **Implements Pillar**: Pilar 4 — O Drama Nasce das Mecânicas

## Overview

O Post-Debut Career System gerencia as carreiras de ex-idols após a
aposentadoria. Ex-idols não desaparecem -- viram apresentadoras de TV/rádio,
produtoras, mentoras, comentaristas, ou empreendedoras. Cada carreira pós-debut
gera jobs e oportunidades no ecossistema (ex-idol convida idols ativas pro
seu programa). Idols lendárias podem anunciar retorno temporário.

## Player Fantasy

A fantasia é de **legado vivo**. A idol que você gerenciou por 10 anos
debutou e agora tem programa de rádio próprio -- e convida suas novatas
atuais. O mundo lembra das suas decisões passadas.

## Detailed Design

### Core Rules

#### 1. Carreiras Pós-debut

| Carreira | Requisito | Efeito no ecossistema |
|---|---|---|
| **Apresentadora TV/Rádio** | Fama alta (B+) ao debutar | Cria show regular com spots pra convidados |
| **Produtora** | Experiência (10+ anos ativa) | Pode oferecer mentoria como facility |
| **Compositora** | Compôs músicas durante carreira | Entra no pool de compositores NPC |
| **Mentora** | Afinidade alta com agência | Facility especial (bônus treino) |
| **Comentarista** | Variedade/Comunicação altos | Aparece no News Feed comentando eventos |
| **Empreendedora** | Personal Finance alta (rica) | Pode criar agência rival (NPC) |
| **Retorno temporário** | Fama lendária (SSS) | Raro, evento especial de alto impacto |

#### 2. Geração de Jobs

Ex-idols com programa próprio geram jobs automaticamente:
- Show de TV: 2-4 spots/mês pra convidados (idols ativas)
- Programa de rádio: 4-8 spots/mês
- Evento especial de retorno: 1-2/ano (mega evento)

#### 3. Decaimento

- Fama da ex-idol decai -1%/mês até sair do ranking público
- Programa/carreira pode ser cancelado se audiência cai demais
- Hall of Fame preserva legado das lendárias

### Interactions with Other Systems

| Sistema | O que flui |
|---|---|
| **Idol Lifecycle** | Trigger de debut inicia carreira pós |
| **Job Assignment** | Ex-idols geram jobs no board |
| **Media Entities** | Programas de ex-idols como shows no ecossistema |
| **Music Charts** | Ex-idol compositora entra no pool |
| **News Feed** | Anúncios de carreira, retornos, programas |

## Dependencies

**Hard**: Idol Lifecycle, Job Assignment
**Soft**: Media Entities, Music Charts, Fame
**Depended on by**: Job Assignment (jobs gerados), Media Entities (shows)

## Acceptance Criteria

1. Ex-idols escolhem carreira baseada em stats/fama ao debutar
2. Programas de ex-idols geram jobs no board
3. Retorno temporário de lendária é evento especial raro
4. Fama decai mensalmente pós-debut
5. Hall of Fame preserva legado
