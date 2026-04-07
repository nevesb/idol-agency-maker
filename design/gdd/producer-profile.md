# Producer Profile — Perfil do Produtor

> **Status**: Designed (v2 — referência a staff-functional.md para produtor como substituto)
> **Author**: user + game-designer
> **Last Updated**: 2026-04-04
> **Implements Pillar**: Pilar 2 — Suas Decisões, Suas Consequências
> **Related**: staff-functional.md (produtor como executor substituto de funções — qualidade baseada no perfil do produtor)

## Overview

O Producer Profile define a identidade do jogador como produtor. Ao iniciar
uma nova campanha, o jogador cria um personagem com nome, sexo, data de
aniversário e traços de personalidade/gestão. Esses traços não são cosméticos
— afetam como idols, staff e rivais reagem ao jogador durante toda a campanha.

Sem este sistema, o jogador é uma câmera flutuante sem identidade. Com ele,
cada jogador tem uma experiência social distinta: um produtor Agressivo
encontra idols ambiciosas dispostas a aceitar contratos duros, enquanto um
Cauteloso atrai idols sensíveis que valorizam estabilidade.

## Player Fantasy

A fantasia é de **identidade profissional**. Você não é só "o produtor" —
você é o tipo de produtor que inspira medo, confiança ou admiração. Idols
cochicham sobre seu estilo. Staff adapta relatórios ao que sabe que você
valoriza. Rivais ajustam negociações sabendo quem está do outro lado.

Serve o **Pilar 2**: a personalidade que você escolhe no início determina
como o mundo reage às suas decisões ao longo de toda a campanha.

## Detailed Design

### Core Rules

#### 1. Dados Básicos do Produtor

| Campo | Tipo | Regras |
|---|---|---|
| **Nome** | string (3-24 chars) | Livre |
| **Sobrenome** | string (3-24 chars) | Livre. Usado com pronome de chamamento |
| **Pronome de chamamento** | string (3-24 chars) | Default: "[Sobrenome]-san". Usado em diálogos, news, contratos, mensagens de idols e staff |
| **Sexo** | male / female / other | Afeta pronomes em textos gerados. Sem efeito mecânico |
| **Aniversário** | mês + dia | Evento anual in-game (bonus moral do staff). Sem seleção de ano (produtor não envelhece mecanicamente) |

#### 1.5. Background na Indústria

O jogador seleciona sua reputação prévia e cidade de origem. Define a
dificuldade inicial e como o mundo te recebe.

**Cidade de origem:**

| Cidade | Efeito |
|---|---|
| **Tokyo** | Rede maior, mercado competitivo |
| **Osaka** | Conexões humor/variedade |
| **Fukuoka** | Cena menor, custo menor |
| **Nagoya** | Equilíbrio custo/oportunidade |
| **Sapporo** | Cena digital forte, scouting online +10% |
| **Okinawa** | Remoto, underdog |

**Reputação prévia (selecionar 1):**

| Opção | ID | Reputação Inicial | Efeito |
|---|---|---|---|
| **Prodígio da Indústria** | `prodigy` | Lendário | Portas abertas, metas brutais |
| **Ícone de Geração** | `icon` | Muito Alto | Prestígio, metas altas |
| **Hitmaker Consagrado** | `hitmaker` | Alto | Equilíbrio, scouting +5% |
| **Especialista Reconhecido** | `specialist` | Médio-Alto | Bônus na área do estilo escolhido |
| **Promessa do Mercado** | `rising` | Médio | Neutro, balanceado |
| **Veterano de Bastidores** | `veteran` | Baixo-Médio | Staff loyalty +10%, metas modestas |
| **Começando do Zero** | `zero` | Nenhum | Modo hard, progressão satisfatória |

#### 1.6. Estilo de Produção

O jogador seleciona 1-2 estilos que definem sua filosofia de trabalho
e geram bônus em áreas específicas.

| Estilo | ID | Efeito |
|---|---|---|
| **Vocal Maestro** | `vocal` | Jobs música: +10% nota |
| **Image Architect** | `image` | Endorsements: +10% receita |
| **Hit Factory** | `hits` | Revenue singles/álbuns: +15%, stress +5% |
| **Talent Developer** | `developer` | Crescimento stats: +10% |
| **Variety King** | `variety` | Jobs TV: +10% nota |
| **Group Strategist** | `groups` | Sinergia grupo: +15% |
| **Digital Pioneer** | `digital` | Scouting online: +15% |
| **Event Producer** | `events` | Shows ao vivo: +10% nota e receita |
| **All-Rounder** | `allrounder` | Sem bônus, sem penalidade |

**Regras:** 1 estilo = bônus ×1.5. 2 estilos = bônus normal cada.
All-Rounder é exclusivo (desmarca outros).

#### 2. Traços de Personalidade (Management Traits)

O jogador seleciona **2 traços** de uma lista de 5 no início da campanha.
Cada traço define um modificador permanente que afeta subsistemas específicos.

| Traço | Descrição | Efeito Mecânico |
|---|---|---|
| **Agressivo** (攻撃的) | Foco em resultados rápidos, pressão constante | Idols ambiciosas: +15% chance aceitar contrato. Idols sensíveis: -10% chance. Jobs competitivos: +10% receita. Stress das idols: +5% por semana |
| **Cauteloso** (慎重) | Planejamento metódico, evita riscos | Idols sensíveis: +15% chance aceitar. Burnout rate: -20%. Velocidade de crescimento de fama: -10% |
| **Visionário** (先見) | Aposta em potencial de longo prazo, aceita prejuízo agora | Idols tier F-D: +20% taxa de crescimento de stats. Scouting: +10% precisão. Custos operacionais: +10% (investe mais) |
| **Pragmático** (実利的) | Decisões baseadas em números, eficiência máxima | Negociação de contrato: -10% no salário pedido. Revenue de merch: +10%. Afinidade cresce 20% mais devagar (idols sentem frieza) |
| **Carismático** (魅力的) | Relacionamentos pessoais, clima positivo | Happiness base de todas idols: +5. Staff loyalty: +15%. Rivais oferecem collabs +20% mais frequente. Detecção de problemas (intelligence): -10% (confia demais) |

**Regras:**
- Exatamente 2 traços são selecionados na criação (não pode repetir)
- Combinações criam sinergias emergentes (ex: Agressivo + Visionário = aposta em jovens com pressão de resultado rápido)
- Traços NÃO podem ser mudados durante a campanha (são parte da identidade)
- Traços são visíveis para idols e afetam negociações desde o primeiro contrato
- Títulos de legado (do sistema Player Reputation) são cumulativos com traços

#### 3. Reação de NPCs aos Traços

NPCs têm personalidades (definidas nos 5 atributos ocultos: ambição, disciplina,
resiliência, sociabilidade, adaptabilidade). A compatibilidade traço-personalidade
segue esta matriz:

| Personalidade Idol | Prefere Traço | Resiste Traço |
|---|---|---|
| Ambição alta (>70) | Agressivo, Visionário | Cauteloso |
| Disciplina alta (>70) | Pragmático, Cauteloso | Carismático |
| Resiliência baixa (<40) | Cauteloso, Carismático | Agressivo |
| Sociabilidade alta (>70) | Carismático | Pragmático |
| Adaptabilidade alta (>70) | Visionário | Pragmático |

**Fórmula de compatibilidade:**
```
traitBonus = sum(matchingPreferences) × 0.10 - sum(matchingResistances) × 0.08
acceptanceModifier = baseAcceptance × (1 + traitBonus)
```

Onde `matchingPreferences` conta quantas preferências da idol batem com os
2 traços do jogador (0-2), e `matchingResistances` conta resistências (0-2).

#### 4. Efeitos em Subsistemas

A tabela abaixo é a **referência canônica** de como cada escolha do produtor
afeta outros sistemas. Os GDDs listados DEVEM implementar esses modifiers.

##### 4a. Efeitos por Background (Reputação)

| Background | Sistema Afetado | GDD | Efeito |
|---|---|---|---|
| **Prodígio** | Agency Meta-Game | `agency-meta-game.md` | Metas do dono iniciam no nível máximo |
| **Prodígio** | Contract System | `contract-system.md` | Idols tier A+ aceitam reunião imediata |
| **Prodígio** | Rival Agency AI | `rival-agency-ai.md` | Rivais te respeitam/temem: menos buyouts agressivos |
| **Ícone** | Agency Meta-Game | `agency-meta-game.md` | Metas altas desde o início |
| **Ícone** | Contract System | `contract-system.md` | Idols veteranas (5+ anos) têm +10% chance aceitar |
| **Hitmaker** | Scouting & Recruitment | `scouting-recruitment.md` | Precisão de scouting: +5% |
| **Especialista** | Job Assignment | `job-assignment.md` | Bônus +5% extra no estilo escolhido (Step 3) |
| **Veterano** | Agency Staff | `agency-staff-operations.md` | Staff loyalty: +10% |
| **Zero** | Agency Meta-Game | `agency-meta-game.md` | Metas mínimas iniciais |
| Todos | News Feed | `news-feed.md` | Tom das notícias reflete reputação do produtor |

##### 4b. Efeitos por Cidade de Origem

| Cidade | Sistema Afetado | GDD | Efeito |
|---|---|---|---|
| **Tokyo** | Market/Transfer | `market-transfer.md` | Pool inicial de idols maior (+20%) |
| **Tokyo** | Rival Agency AI | `rival-agency-ai.md` | Mais agências rivais competindo na região |
| **Osaka** | Job Assignment | `job-assignment.md` | Jobs de TV/variedade: +5% frequência |
| **Osaka** | Idol Database | `idol-database-generator.md` | Idols da região com carisma/humor elevado |
| **Fukuoka** | Agency Economy | `agency-economy.md` | Custos operacionais: -10% |
| **Nagoya** | Agency Economy | `agency-economy.md` | Equilíbrio neutro |
| **Sapporo** | Scouting & Recruitment | `scouting-recruitment.md` | Scouting online: +10% precisão |
| **Okinawa** | Agency Economy | `agency-economy.md` | Custos: -20%, conexões: -30% |

##### 4c. Efeitos por Estilo de Produção

| Estilo | Sistema Afetado | GDD | Efeito |
|---|---|---|---|
| **Vocal Maestro** | Job Assignment | `job-assignment.md` | Jobs gravação/música: +10% nota |
| **Vocal Maestro** | Scouting | `scouting-recruitment.md` | Scouting prioriza stat vocal |
| **Image Architect** | Job Assignment | `job-assignment.md` | Endorsements/foto: +10% receita |
| **Image Architect** | Fame & Rankings | `fame-rankings.md` | Fama por visual: +15% |
| **Hit Factory** | Agency Economy | `agency-economy.md` | Revenue singles/álbuns: +15% |
| **Hit Factory** | Happiness & Wellness | `happiness-wellness.md` | Stress base: +5% (pressão por hits) |
| **Hit Factory** | Music Charts | `music-charts.md` | Posição em charts: +10% |
| **Talent Developer** | Idol Attribute/Stats | `idol-attribute-stats.md` | Taxa crescimento de stats: +10% |
| **Talent Developer** | Talent Development | `talent-development-plans.md` | Planos trimestrais: +10% eficiência |
| **Variety King** | Job Assignment | `job-assignment.md` | Jobs TV/variedade: +10% nota |
| **Variety King** | Idol Attribute/Stats | `idol-attribute-stats.md` | Carisma cresce +10% mais rápido |
| **Group Strategist** | Group Management | `group-management.md` | Sinergia de grupo: +15% |
| **Group Strategist** | Group Management | `group-management.md` | Formação revela combos de arquétipo |
| **Digital Pioneer** | Scouting | `scouting-recruitment.md` | Scouting online: +15% precisão |
| **Digital Pioneer** | Agency Economy | `agency-economy.md` | Revenue streaming: +10% |
| **Event Producer** | Job Assignment | `job-assignment.md` | Shows ao vivo: +10% nota e receita |
| **Event Producer** | Player-Created Events | `player-created-events.md` | Custo de evento: -10% |

##### 4d. Efeitos por Traço de Personalidade

| Traço | Sistema Afetado | GDD | Efeito |
|---|---|---|---|
| **Agressivo** | Contract System | `contract-system.md` | Idols ambiciosas: +15% aceitar. Sensíveis: -10% |
| **Agressivo** | Job Assignment | `job-assignment.md` | Jobs competitivos: +10% receita |
| **Agressivo** | Happiness & Wellness | `happiness-wellness.md` | Stress base: +5%/semana |
| **Cauteloso** | Contract System | `contract-system.md` | Idols sensíveis: +15% aceitar |
| **Cauteloso** | Happiness & Wellness | `happiness-wellness.md` | Burnout rate: -20% |
| **Cauteloso** | Fame & Rankings | `fame-rankings.md` | Velocidade crescimento fama: -10% |
| **Visionário** | Idol Attribute/Stats | `idol-attribute-stats.md` | Idols F-D: +20% crescimento stats |
| **Visionário** | Scouting | `scouting-recruitment.md` | Precisão: +10% |
| **Visionário** | Agency Economy | `agency-economy.md` | Custos operacionais: +10% |
| **Pragmático** | Contract System | `contract-system.md` | Salário pedido: -10% |
| **Pragmático** | Agency Economy | `agency-economy.md` | Revenue merch: +10% |
| **Pragmático** | Player Reputation | `player-reputation-affinity.md` | Afinidade cresce 20% mais lenta |
| **Carismático** | Happiness & Wellness | `happiness-wellness.md` | Happiness base: +5 todas idols |
| **Carismático** | Agency Staff | `agency-staff-operations.md` | Staff loyalty: +15% |
| **Carismático** | Rival Agency AI | `rival-agency-ai.md` | Collabs oferecidas: +20% |
| **Carismático** | Agency Intelligence | `agency-intelligence-reports.md` | Detecção de problemas: -10% |
| Todos | News Feed | `news-feed.md` | Tom das notícias reflete traços |
| Todos | Messages (inbox) | — | Staff ajusta linguagem ao estilo |

##### Regra de Stacking

Quando múltiplos modifiers afetam o mesmo sistema, eles são **aditivos**:
```
finalModifier = backgroundMod + cityMod + styleMod + traitMod1 + traitMod2
```
Nunca multiplicativos. Cap máximo: ±40% em qualquer modifier combinado.

### States and Transitions

O perfil do produtor é imutável após criação. Não há transições de estado.

Títulos de legado (sistema #29 Player Reputation) se acumulam sobre os traços,
criando uma identidade que evolui: traços são o "DNA" e títulos são as
"conquistas". Um produtor Agressivo que ganha título "Salvador de Carreiras"
cria uma narrativa emergente interessante.

## Formulas

```
# Modifier de aceitação de contrato
traitMatchCount = count(idol.personality matches producer.traits preferences)
traitResistCount = count(idol.personality matches producer.traits resistances)
traitModifier = (traitMatchCount × 0.10) - (traitResistCount × 0.08)

# Aplicado em contract-negotiation.ts
finalAcceptance = baseAcceptance × (1 + traitModifier)
```

## Dependencies

- **Depende de**: Stats System (personalidade das idols)
- **Alimenta** (ver tabelas 4a-4d para detalhes):
  - Contract System — acceptance modifiers
  - Happiness & Wellness — stress/happiness base modifiers
  - Scouting & Recruitment — precisão modifiers
  - Agency Economy — revenue/custo modifiers
  - Job Assignment — nota e receita modifiers
  - Fame & Rankings — velocidade de crescimento
  - Agency Staff & Operations — loyalty modifiers
  - Agency Intelligence — detecção modifiers
  - Rival Agency AI — comportamento de rivais
  - Group Management — sinergia modifiers
  - Idol Attribute/Stats — crescimento modifiers
  - Talent Development Plans — eficiência modifiers
  - Music Charts — posição modifiers
  - Player-Created Events — custo modifiers
  - Player Reputation & Affinity — velocidade afinidade
  - News Feed & Media — tom narrativo
  - Market/Transfer — pool inicial

## UI/UX Implications

- Tela de criação: wizard 6 steps (dados pessoais → background → estilo → personalidade → agência → confirmação). Ver wireframe: `docs/design/wireframes/02-new-game-wizard.md`
- Traços mostrados como cards com ícone, nome JP/romaji, descrição e efeito
- No jogo: perfil do produtor acessível via menu da agência
- Em negociações: ícone do traço relevante aparece ao lado do modifier
- Em mensagens: remetente pode mencionar traço ("Sei que você é pragmático, mas...")

## Edge Cases

- Jogador com 0 traços: impossível (UI não permite confirmar sem 2)
- Dois traços conflitantes (Agressivo + Cauteloso): permitido — modifiers se cancelam em parte, criando perfil "moderado com contradições"
- NPC sem personalidade forte (todos atributos 40-60): traço tem efeito reduzido

## Anti-Patterns

- Traços NÃO devem criar hard blocks ("você não pode contratar esta idol")
- Traços NÃO devem tornar uma combinação claramente superior
- Efeitos são modificadores suaves (5-15%), nunca binários
