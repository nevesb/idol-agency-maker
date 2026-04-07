# Staff Functional System

> **Status**: Designed
> **Author**: user + game-designer
> **Last Updated**: 2026-04-04
> **Implements Pillar**: Pilar 1 — Simulação com Profundidade Real, Pilar 3 — Múltiplos Caminhos ao Topo
> **Supersedes**: Seções operacionais de `agency-staff-operations.md` (que mantém a ficha de staff, contratação e mercado)
> **Related**: show-system.md, setlist-system.md, audience-system.md, music-entities.md, idol-attribute-stats.md

## Overview

O Staff Functional System transforma NPCs de staff de **cosmético** para
**funcional**. Cada cargo de staff corresponde a uma **função operacional**
real da agência. Se a função não tem NPC atribuído, o **produtor (jogador)
a executa pessoalmente** — com qualidade reduzida e custo de tempo.

A diferença fundamental em relação ao `agency-staff-operations.md` (que define
fichas, contratação e mercado de staff): este GDD define **o que cada função
FAZ mecanicamente**, como a ausência de staff degrada resultados, e como o
produtor cobre buracos.

**Princípio**: Staff não é bônus opcional. Staff é a **estrutura operacional**
da agência. Sem staff, a agência funciona — mas o produtor está fazendo tudo
sozinho, e a qualidade reflete isso.

## Player Fantasy

A fantasia é de **construir uma organização real**. No início, você É a agência:
treina as idols, monta a agenda, negocia contratos, gerencia crises. Conforme
cresce, contrata pessoas que fazem isso melhor que você — e você sobe para o
nível estratégico. Mas cada contratação é uma decisão: um bom vocal coach
custa caro, e enquanto não tem um, VOCÊ é o vocal coach (e não é tão bom
quanto um especialista).

A progressão natural é: **garagem (faz tudo)** → **pequena (delega treino)** →
**média (delega operações)** → **grande (delega estratégia)** → **elite
(só decide o rumo)**. Mas o jogador pode escolher manter controle manual de
áreas que considera críticas, mesmo com staff disponível.

## Detailed Design

### 1. Funções Operacionais da Agência

Cada função é uma **responsabilidade real** que precisa ser executada para a
agência operar. Sem executor (NPC ou produtor), a função simplesmente **não
acontece** — com consequências.

| Função | Responsabilidade | Executor NPC | Prioridade |
|---|---|---|---|
| **Treinamento Vocal** | Conduzir sessões de treino vocal, avaliar progresso | Vocal Coach | MVP |
| **Treinamento de Dança** | Conduzir sessões de coreografia e expressão corporal | Dance Coach | MVP |
| **Treinamento de Atuação** | Sessões de expressividade, improviso, presença | Acting Coach | VS |
| **Gestão de Agenda** | Montar agenda semanal, alocar idols em slots | Talent Manager | MVP |
| **Scouting** | Buscar e avaliar candidatas no mercado | Scout | MVP |
| **Relações Públicas** | Gerenciar imagem, responder a crises, spin mediático | PR Manager | MVP |
| **Negociação de Contratos** | Negociar termos, renovações, rescisões | Legal Counsel | VS |
| **Wellness & Saúde Mental** | Monitorar stress, prevenir burnout, sessões de apoio | Wellness Advisor | VS |
| **Produção Musical** | Avaliar qualidade de gravações, sugerir lançamentos | Music Producer / A&R | Alpha |
| **Direção de Show** | Coordenar produção de shows ao vivo (ver show-system.md) | Stage Manager | Alpha |
| **Redes Sociais** | Gerenciar presença online das idols | Social Media Manager | Alpha |
| **Planejamento de Eventos** | Organizar eventos criados pela agência | Event Planner | Alpha |

### 2. O Produtor como Executor Substituto

**Regra central**: Quando uma função não tem NPC atribuído, o produtor a
executa pessoalmente. Isso tem três consequências:

#### 2a. Qualidade Reduzida

O produtor não é especialista. A qualidade da execução depende do **perfil
do produtor** (ver `producer-profile.md`):

```
qualidade_produtor(função) = BASE_PRODUCER_QUALITY
  × mult_background    // Veterano da Indústria: ×1.3 em treino
  × mult_estilo        // Talent Developer: ×1.2 em treino, ×0.8 em PR
  × mult_trait         // Visionário: ×1.1 em todas, Carismático: ×1.3 em PR

BASE_PRODUCER_QUALITY = 0.5  // 50% da qualidade de um NPC skill 10
```

Comparação com NPC dedicado:

| Executor | Qualidade efetiva (escala 0-1) |
|---|---|
| NPC skill 20, condições ideais | ~1.0 |
| NPC skill 10, condições normais | ~0.5 |
| NPC skill 5, condições ruins | ~0.15 |
| Produtor (base, sem bônus) | 0.5 |
| Produtor (com bônus de perfil) | 0.5 - 0.85 |
| Ninguém (função vazia) | 0.0 |

**Nota**: O produtor é "razoável em tudo, excelente em nada" por padrão.
Com perfil otimizado (Background + Estilo + Trait alinhados), pode ser
competitivo com um NPC skill 10-12 numa função específica — mas só nessa.

#### 2b. Custo de Tempo do Produtor

O produtor tem um **orçamento de tempo semanal** limitado. Cada função
que executa pessoalmente consome parte desse orçamento.

```
PRODUCER_TIME_BUDGET = 100 pontos/semana

Custo por função executada pelo produtor:
  Treino (por idol)         = 15 pontos
  Gestão de agenda          = 10 pontos
  Scouting (por busca)      = 20 pontos
  Relações públicas         = 10 pontos (passivo) + 25 (crise ativa)
  Negociação de contrato    = 20 pontos (por negociação)
  Wellness (por idol)       = 10 pontos
  Produção musical          = 25 pontos (por projeto)
  Direção de show           = 30 pontos (por evento)
  Redes sociais             = 15 pontos
  Planejamento de evento    = 25 pontos
```

**Quando o orçamento estoura (>100 pontos):**
- Cada ponto acima de 100 reduz a qualidade de TODAS as funções em -1%
- A 150 pontos, qualidade de tudo cai para metade
- A 200+ pontos, produtor entra em **Overwork** (burnout do produtor):
  - Qualidade -70% em tudo
  - Chance de erro grave em decisões delegadas
  - Mensagem do dono: "Você precisa de ajuda. Contrate staff."

**Consequência de design**: Na garagem com 3-5 idols, o produtor consegue
cobrir 2-3 funções confortavelmente. Com 10+ idols, é impossível sem staff.
O crescimento da agência FORÇA a contratação — não por regra artificial,
mas por escassez real de tempo.

#### 2c. Funções Não Cobertas

Se uma função não tem NPC E o produtor não a executa (sem tempo ou por
escolha):

| Função não coberta | Consequência |
|---|---|
| Treino vocal/dança/atuação | Crescimento dos atributos = apenas natural (×0.3 do normal) |
| Gestão de agenda | Jogador precisa montar manualmente. Sem sugestões automáticas |
| Scouting | Sem busca proativa. Jogador só vê idols que aparecem no mercado público |
| Relações públicas | Escândalos recebem impacto total. Sem mitigação |
| Negociação de contratos | Jogador negocia direto (sem bônus, sem proteção jurídica) |
| Wellness | Sem alertas antecipados de burnout. Stress se acumula sem intervenção |
| Produção musical | Qualidade de gravação base. Sem sugestões de lançamento |
| Direção de show | Shows sem stage manager = produção básica (ver show-system.md) |
| Redes sociais | Fama online cresce apenas organicamente (lento) |
| Planejamento de eventos | Eventos custam mais e têm qualidade base |

### 3. NPC Multi-Role (Acúmulo de Função)

Em agências menores, um NPC pode cobrir **mais de uma função**. Isso é
explicitamente permitido mas tem custo:

```
Se NPC cobre N funções simultaneamente:
  qualidade_por_função = qualidade_base × MULTI_ROLE_PENALTY[N]

MULTI_ROLE_PENALTY:
  1 função:  ×1.0  (100% — dedicado)
  2 funções: ×0.7  (70% — dividido)
  3 funções: ×0.5  (50% — sobrecarregado)
  4+ funções: ×0.3 (30% — inviável na prática)
```

**Regras de acúmulo:**
- Nem toda combinação faz sentido. Combinações válidas:

| Combinação | Viável? | Justificativa |
|---|---|---|
| Vocal Coach + Dance Coach | ✓ | Mesmo domínio (treino) |
| Vocal Coach + Wellness | ✓ | Próximo (cuidado com idol) |
| PR Manager + Social Media | ✓ | Mesmo domínio (comunicação) |
| Scout + Talent Manager | ✓ | Mesmo domínio (gestão de talento) |
| Legal + PR | ✓ | Ambos lidam com risco |
| Vocal Coach + Legal | ✗ | Domínios incompatíveis |
| Stage Manager + Scout | ✗ | Domínios incompatíveis |

- O skill efetivo usado é o do cargo **primário** do NPC. Para a função
  secundária, usa skill × 0.8 (mesmo sem a penalidade de multi-role)
- NPCs com adaptability > 14 sofrem menos penalidade de multi-role (×0.8
  em vez de ×0.7 para 2 funções)

### 4. Progressão da Agência e Staff

O sistema de staff se entrelaça com a progressão de tier da agência
(ver `agency-economy.md`):

| Tier | Situação típica | Produtor cobre | Staff cobre |
|---|---|---|---|
| **Garagem** (3-5 idols) | 0-3 staff | Treino + agenda + scouting | 1-2 funções |
| **Pequena** (6-15 idols) | 3-6 staff | 1-2 funções específicas | Maioria das operações |
| **Média** (16-30 idols) | 6-10 staff | Supervisão estratégica | Todas operações |
| **Grande** (31-50 idols) | 10-15 staff | Só decisões-chave | Tudo delegado |
| **Elite** (50+ idols) | 15-22 staff | Visão e direção | Tudo mais staff dedicado por sub-área |

**Negociação de orçamento com a Diretoria**: O dono da agência define o
orçamento total. O produtor **negocia** quanto do orçamento vai para staff:

```
orcamento_staff = orcamento_total × STAFF_BUDGET_RATIO

STAFF_BUDGET_RATIO definido pela diretoria:
  - Agência em crise: 10-15% (corta staff primeiro)
  - Normal: 20-30%
  - Em crescimento: 30-40%
  - Elite: 25-35% (mais eficiente, menos staff per capita)

Produtor pode argumentar por mais orçamento:
  - Apresentar resultados (ROI do staff contratado)
  - Pedir aumento pontual (para contratação específica)
  - Diretoria avalia trimestralmente
```

### 5. Stage Staff — Sistema Híbrido (NPCs-chave + Pacotes de Produção)

Shows ao vivo (ver `show-system.md`) requerem **produção técnica** além das
idols. O sistema de stage staff é **híbrido**: combina NPCs-chave contratados
pela agência com pacotes de produção alocados por evento.

#### 5a. NPCs-chave de Produção (contratação permanente)

| Cargo | Responsabilidade | Impacto no Show |
|---|---|---|
| **Stage Manager** | Coordena toda a produção técnica. Único NPC obrigatório para shows profissionais | Qualidade de produção ×1.0 a ×2.0 baseado em skill. Sem SM: produção capped em "básica" |
| **Coreógrafo** | Cria e ensaia coreografias. Afeta setlist e rehearsal | Bônus de coreografia no show. Sem: idols usam coreografia genérica (penalidade visual) |

Estes NPCs usam a ficha padrão de `agency-staff-operations.md` (skill,
dedication, adaptability, people_skills). São **contratação permanente** —
ficam na folha de pagamento da agência.

#### 5b. Pacotes de Produção (alocação por evento)

Para cada show/evento, o produtor **aloca pacotes de produção** que determinam
a qualidade técnica. Pacotes são **custos por evento**, não contratação fixa.

| Pacote | Tiers | Custo/evento | Efeito |
|---|---|---|---|
| **Som** | Básico / Profissional / Premium | ¥500K / ¥2M / ¥8M | Qualidade de áudio. Afeta percepção vocal da audiência |
| **Iluminação** | Básica / Profissional / Premium | ¥300K / ¥1.5M / ¥6M | Impacto visual. Afeta Aura percebida e engagement |
| **Banda ao Vivo** | Backing track / Semi-live / Full band | ¥0 / ¥1M / ¥5M | Autenticidade sonora. Afeta reação de audiência |
| **Cenografia** | Nenhuma / Básica / Elaborada | ¥0 / ¥800K / ¥4M | Produção visual. Afeta primeira impressão e engagement inicial |
| **Efeitos Especiais** | Nenhum / Básico / Premium | ¥0 / ¥500K / ¥3M | Momentos wow. Chance de momento viral |

**Regras de pacotes:**
- Pacotes são selecionados pelo produtor (ou Stage Manager se delegado)
- Stage Manager com skill alto otimiza custos (-10% a -25%)
- Pacote de som Premium sem Stage Manager = desperdício (qualidade capped)
- Pacotes mínimos por tipo de venue:

| Venue | Som mínimo | Iluminação mín. | Banda mín. |
|---|---|---|---|
| Café / bar | Básico | Básica | Backing track |
| Casa de show (500) | Básico | Básica | Backing track |
| Hall (2000) | Profissional | Básica | Semi-live |
| Arena (10000) | Profissional | Profissional | Semi-live |
| Stadium (30000+) | Premium | Premium | Full band |

Usar pacote abaixo do mínimo: penalidade de -30% na qualidade de produção.
Não impede o show, mas audiência e mídia percebem.

#### 5c. Investimento Total de Produção

```
producao_total = qualidade_SM × media_pacotes × mult_venue

qualidade_SM:
  - Sem Stage Manager: 0.4 (produção amadora)
  - SM skill 1-5: 0.5-0.7
  - SM skill 6-10: 0.7-0.9
  - SM skill 11-15: 0.9-1.1
  - SM skill 16-20: 1.1-1.3

media_pacotes = média normalizada dos tiers de pacote (0.3 a 1.0)

mult_venue = compatibilidade venue/pacotes (0.7 se abaixo do mínimo, 1.0 normal, 1.1 acima)
```

O `producao_total` alimenta diretamente o `show-system.md` como modificador
da qualidade do show.

### 6. Interação Staff ↔ Sistemas

| Sistema | Função de Staff | Como interage |
|---|---|---|
| **show-system.md** | Stage Manager, Coreógrafo | SM define qualidade de produção. Coreógrafo afeta visual do setlist |
| **setlist-system.md** | Vocal Coach, Dance Coach, Stage Manager | Coaches treinam mastery. SM coordena transições |
| **audience-system.md** | Stage Manager | Produção afeta engagement base. SM pode ajustar setlist mid-show |
| **music-entities.md** | Music Producer / A&R | Avalia qualidade, sugere lançamentos, seleciona compositores |
| **idol-attribute-stats.md** | Todos os coaches | Crescimento de atributos acelerado por coach dedicado |
| **happiness-wellness.md** | Wellness Advisor | Previne burnout, reduz stress, sessões de apoio |
| **contract-system.md** | Legal Counsel | Negocia termos, protege contra cláusulas ruins |
| **scouting-recruitment.md** | Scout | Busca proativa, avaliação com menor margem de erro |
| **event-scandal-generator.md** | PR Manager | Mitigação de escândalos, spin mediático |
| **schedule-agenda.md** | Talent Manager | Monta agenda, otimiza alocação, previne overwork |
| **fan-club-system.md** | Social Media Manager | Crescimento de fama online, gestão de presença |
| **player-created-events.md** | Event Planner | Qualidade e custo de eventos criados |

### States and Transitions

Funções operacionais têm estados:

| Estado | Descrição | Trigger |
|---|---|---|
| **Coberta (NPC)** | NPC dedicado executa. Qualidade = skill do NPC | NPC contratado e atribuído |
| **Coberta (Produtor)** | Produtor executa. Qualidade reduzida | Sem NPC, produtor com tempo |
| **Coberta (Multi-role)** | NPC acumula. Qualidade penalizada | NPC atribuído a 2+ funções |
| **Descoberta** | Ninguém executa. Consequências aplicam | Sem NPC, produtor sem tempo/escolha |

### Interactions with Other Systems

| Sistema | Direção | O que flui |
|---|---|---|
| **agency-staff-operations.md** | ← fichas | Fichas de staff, contratação, mercado, atributos |
| **producer-profile.md** | ← qualidade | Background/Estilo/Trait do produtor afetam qualidade substituta |
| **agency-economy.md** | ← custos | Salários de staff + pacotes de produção por evento |
| **show-system.md** | → produção | Qualidade de produção (SM + pacotes) alimenta shows |
| **week-simulation.md** | → processado | Trabalho de staff processado no tick semanal |
| **All training systems** | → crescimento | Coaches afetam crescimento de atributos |

## Formulas

### Qualidade de Execução de Função

```
qualidade_funcao =
  SE tem NPC dedicado:
    eficacia_staff (de agency-staff-operations.md)
  SE produtor executa:
    qualidade_produtor(função) × mult_overwork_produtor
  SE NPC em multi-role:
    eficacia_staff × MULTI_ROLE_PENALTY[N_funcoes] × 0.8 (skill secundário)
  SE descoberta:
    0.0
```

### Overwork do Produtor

```
tempo_gasto = soma(custo_tempo de cada função executada pelo produtor)

mult_overwork_produtor =
  SE tempo_gasto <= 100: 1.0
  SE tempo_gasto 101-150: 1.0 - (tempo_gasto - 100) × 0.01
  SE tempo_gasto 151-200: 0.5 - (tempo_gasto - 150) × 0.004
  SE tempo_gasto > 200: 0.3 (mínimo, produtor em burnout)
```

### Custo Total de Produção de Show

```
custo_producao = soma(custo de cada pacote selecionado)
                + salario_SM_proporcional  // SM é custo fixo, mas se 100% dedicado ao show
                + custos_extras_venue       // aluguel, segurança, etc.
```

## Edge Cases

- **Garagem sem nenhum staff**: Produtor faz tudo. Com 3 idols e foco em
  treino + agenda, gasta ~55 pontos de tempo. Viável mas apertado. Não sobra
  tempo para scouting proativo
- **Produtor com Background "Veterano da Indústria" + Estilo "Talent Developer"
  como vocal coach**: Qualidade ~0.78 (competitivo com NPC skill 12). Viável
  manter como coach pessoal mesmo em agência média — mas consome tempo
- **NPC cobrindo 4 funções**: Qualidade ×0.3 em cada. Praticamente inútil.
  O jogo deve sinalizar: "X está sobrecarregado. Qualidade comprometida."
- **Show sem Stage Manager**: Produção capped em "amadora" (0.4). Pacotes
  premium são desperdiçados (qualidade capped não usa todo o investimento).
  Viável para shows em cafés/bares, inviável para arenas+
- **Staff demitido no meio da semana**: Função fica descoberta imediatamente.
  Produtor precisa cobrir ou aceitar consequências até próxima contratação
- **Produtor em overwork (>200 pontos) + escândalo grave**: Qualidade do
  produtor em PR = 0.3 × 0.5 (base) × modifiers = ~0.15. Escândalo recebe
  quase impacto total. Incentivo forte para contratar PR Manager ANTES da crise
- **Dois NPCs na mesma função (ex: 2 Vocal Coaches)**: Dividem idols entre
  si. Sem penalidade — cada um é dedicado ao seu grupo de idols. Bônus de
  qualidade não empilha na mesma idol

## Dependencies

**Hard:**
- agency-staff-operations.md — fichas, contratação, mercado de staff
- producer-profile.md — qualidade do produtor como substituto
- agency-economy.md — salários e orçamento

**Soft:**
- Todos sistemas que recebem funções de staff (show, training, wellness, etc.)

**Depended on by:**
- show-system.md (qualidade de produção)
- setlist-system.md (coaches para rehearsal)
- week-simulation.md (processamento de funções)

## Tuning Knobs

| Knob | Default | Range | Efeito |
|---|---|---|---|
| `BASE_PRODUCER_QUALITY` | 0.5 | 0.3-0.7 | Qualidade base do produtor como substituto |
| `PRODUCER_TIME_BUDGET` | 100 | 60-150 | Pontos de tempo semanal do produtor |
| `MULTI_ROLE_PENALTY_2` | 0.7 | 0.5-0.85 | Penalidade para NPC com 2 funções |
| `MULTI_ROLE_PENALTY_3` | 0.5 | 0.3-0.7 | Penalidade para NPC com 3 funções |
| `OVERWORK_THRESHOLD` | 100 | 80-120 | Quando produtor começa a perder qualidade |
| `STAGE_MANAGER_QUALITY_MIN` | 0.4 | 0.2-0.5 | Produção de show sem SM |
| `PRODUCTION_PACKAGE_COSTS` | Ver tabela | ±50% | Custos dos pacotes por tier |

## Acceptance Criteria

1. Cada função operacional é executável por NPC dedicado, produtor, ou NPC multi-role
2. Produtor substitui funções vazias com qualidade reduzida conforme perfil
3. Orçamento de tempo do produtor limita quantas funções pode cobrir
4. Overwork do produtor (>100 pontos) degrada qualidade progressivamente
5. NPC multi-role sofre penalidade de qualidade proporcional ao número de funções
6. Combinações inválidas de multi-role são bloqueadas
7. Shows sem Stage Manager são capped em produção "amadora"
8. Pacotes de produção afetam qualidade técnica do show proporcionalmente
9. Pacotes abaixo do mínimo do venue geram penalidade visível
10. Progressão natural: garagem (produtor faz tudo) → elite (tudo delegado)
11. Negociação de orçamento de staff com diretoria funciona trimestralmente
12. Função descoberta tem consequências claras e documentadas

## Open Questions

- Nenhuma pendente
