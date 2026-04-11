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

A carreira é derivada do atributo mais forte da idol no momento da formatura:

| Tipo | Atributo Principal | Efeito no ecossistema |
|---|---|---|
| **solo-artist** | Vocal alto | Lança música solo, gera jobs de performance |
| **actress** | Comunicação ou Visual altos | Aparece em dramas/filmes, cria spots de mídia |
| **model** | Visual alto | Aparece em campanhas, gera jobs de variedade |
| **trainer** | Mentalidade alta | Disponível como treinadora NPC para agências |
| **composer** | Compôs músicas durante carreira | Entra no pool de compositores NPC |
| **choreographer** | Coreografou durante carreira | Entra no pool de coreógrafos NPC |
| **producer** | Mentalidade alta + 10+ anos ativa | Pode oferecer mentoria como facility |
| **retired** | Sem atributo dominante | Decaimento de fama; possível retorno especial se fama lendária |

**Derivação de carreira**: No momento da formatura, o sistema avalia o atributo mais alto:
- Vocal → `solo-artist`
- Dança → `model` ou `choreographer` (se coreografou)
- Visual → `model` ou `actress`
- Comunicação → `actress`
- Mentalidade → `trainer` ou `producer`
- Sem dominância clara → `retired`

**Flags aditivas**: `composer` e `choreographer` são complementares ao `careerType` principal — uma idol pode ser `actress` E estar disponível como compositora NPC se compôs durante a carreira ativa.

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

1. Ex-idols recebem tipo de carreira derivado do atributo dominante ao debutar (solo-artist/actress/model/trainer/composer/choreographer/producer/retired)
2. Composer e choreographer são flags aditivas ao careerType principal
3. Ex-idols com careerType ativo geram jobs no board mensalmente
4. retired com fama lendária pode ter retorno temporário especial
5. Fama decai mensalmente pós-debut
6. Hall of Fame preserva legado
