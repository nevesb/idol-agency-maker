# Agency Strategy — Direcao Estrategica

> **Status**: Designed
> **Author**: user + game-designer
> **Last Updated**: 2026-04-02
> **Implements Pillar**: Pilar 3 — Multiplos Caminhos ao Topo

## Overview

O Agency Strategy e o equivalente do "modulo tatico" do Football Manager.
Define as **alavancas-mestras** que dao identidade jogavel a agencia: foco
de mercado, postura de agenda, postura de imagem e postura de crescimento.
Essas configuracoes nao sao cosmeticas -- afetam modificadores em jobs,
scouting, fama, economia e contratacao. O jogador configura a direcao
estrategica e o jogo ajusta todos os subsistemas para refletir essa escolha.

Sem este sistema, a agencia tem muitos botoes mas nenhuma "alavanca-mestra"
que defina *quem voce e como produtor*. Com ele, a primeira decisao do jogo
ja e estrategica: "que tipo de agencia eu quero construir?"

## Player Fantasy

A fantasia e de **arquiteto de identidade**. Voce nao so gerencia idols --
voce define o que sua agencia *significa* no mercado. E a agencia boutique
vocal? E a fabrica variety? E o estudio experimental que aposta em nichos?
Mudar a estrategia e possivel mas tem custo (reposicionar marca leva tempo).

Serve o **Pilar 3**: cada combinacao de foco + postura e um caminho viavel ao
topo. Nao existe configuracao "correta" -- existe a que combina com seu roster,
seu mercado e seu estilo de jogo.

## Detailed Design

### Core Rules

#### 1. Foco de Mercado (Agency Focus)

Define o posicionamento de mercado da agencia. Afeta que tipos de job recebem
bonus, que tipos de idol o scouting prioriza, e como a midia percebe a agencia.

| Foco | Descricao | Bonus | Penalidade |
|---|---|---|---|
| **Mainstream Comercial** | Grande publico, pop, acessivel | +15% receita de endorsements e merch | -10% credibilidade em jobs de nicho |
| **Nicho Otaku** | Cultura anime, seiyuu, eventos otaku | +20% em jobs de dublagem, eventos anime, fan meets | -15% em TV mainstream |
| **Variety-Heavy** | TV, talk shows, humor, personalidade | +15% em jobs de TV/radio/variety | -10% em gravacoes musicais |
| **Vocal Prestige** | Excelencia musical, concertos, coros | +20% qualidade musical, +15% em shows | -10% em variety e endorsements |
| **Acting Crossover** | Dramas, filmes, dublagem dramatica | +15% em jobs de atuacao e dublagem | -10% em shows musicais |
| **Digital-First** | Streaming, redes sociais, conteudo online | +20% crescimento de fama online, +15% streaming | -15% em TV/radio tradicional |
| **Generalista** | Sem foco definido | Nenhum bonus | Nenhuma penalidade |

**Regras:**
- Jogador escolhe 1 foco ao iniciar a agencia (ou muda depois)
- Mudar foco custa **3 meses de transicao** onde nenhum bonus/penalidade aplica
- Foco afeta que jobs o **board prioriza** na apresentacao (nao bloqueia nenhum)
- Agencias rivais tambem tem foco (definido na seed)

#### 2. Postura de Agenda (Scheduling Stance)

Define como a agencia trata a carga de trabalho das idols.

| Postura | Descricao | Efeito |
|---|---|---|
| **Agressiva** | Maximiza jobs, aceita overwork | Carga maxima +20%. Stress acumula 30% mais rapido. Receita potencial maior |
| **Equilibrada** | Balanco padrao trabalho/descanso | Sem modificadores. Baseline |
| **Protetiva** | Prioriza saude e bem-estar | Carga maxima -15%. Stress acumula 20% mais devagar. Afinidade com idols +2/mes |

**Regras:**
- Afeta diretamente o Schedule/Agenda system
- Pode ser mudada a qualquer momento (efeito imediato)
- Talent Managers delegados seguem a postura da agencia
- Idols com contrato de "carga maxima" ainda respeitam o contrato (postura nao ignora clausula)

#### 3. Postura de Imagem (Image Direction)

Define a estetica e posicionamento publico que a agencia cultiva.

| Postura | Descricao | Efeito |
|---|---|---|
| **Pure / Idol Classica** | Imagem limpa, tradicional, kawaii | Escandalos de namoro tem 50% mais impacto. Fas mais leais. Merch +15% |
| **Edgy** | Provocativa, controversa, ousada | Escandalos leves *aumentam* fama (+5% por escandalo leve). Fas mais volateis |
| **Cute Mainstream** | Acessivel, simpática, inofensiva | Endorsements +20%. Escandalos tem impacto normal. Baseline de fama mais estavel |
| **Mature / Artistic** | Sofisticada, autoral, adulta | Publico mais velho e fiel. Menos fas jovens. Longevidade de carreira +20% |
| **Sem Direcao** | Sem postura definida | Nenhum bonus/penalidade. Pode parecer "sem identidade" pra midia |

**Regras:**
- Afeta como escandalos impactam (Event/Scandal Generator)
- Afeta tipo de fas que a agencia atrai (Fan Club System)
- Afeta quais endorsements sao oferecidos (marcas buscam agencias compativeis)
- Pode ser mudada, mas transicao leva **2 meses** e causa confusao na base de fas (mood -10 temporario)

#### 4. Postura de Crescimento (Growth Strategy)

Define a prioridade estrategica de alocacao de recursos.

| Postura | Descricao | Efeito |
|---|---|---|
| **Push Novatas** | Investir em formar talentos crus | Bônus de crescimento +20% pra idols com < 1 ano de contrato. Marketing de novatas custa 30% menos |
| **Proteger Premium** | Blindar e valorizar talentos top | Idols top 3 do roster ganham +10% fama/semana. Renovacao de contrato mais facil |
| **Maximizar Caixa** | Foco em receita de curto prazo | Receita de jobs +10%. Custos de treino -20%. Crescimento de atributos -10% |
| **Construir Legado** | Investir em longo prazo e reputacao | Reputacao do jogador +3/mes. Crescimento de atributos +10%. Receita de jobs -5% |

**Regras:**
- Pode ser mudada a qualquer momento (efeito na semana seguinte)
- Afeta Agency Economy, Stats growth, Fame
- Combinacao com Foco e Imagem cria perfil unico da agencia

#### 5. Perfil Estrategico Consolidado

A combinacao das 4 alavancas cria um **perfil visivel** da agencia:

```
Exemplo:
  Foco:        Vocal Prestige
  Agenda:      Protetiva
  Imagem:      Mature / Artistic
  Crescimento: Construir Legado

  Perfil resultante: "Studio Boutique de Excelencia"
  -> Agencia que forma poucas idols com foco em qualidade musical
  -> Carreiras longas, fas fieis, reputacao alta
  -> Menos receita de curto prazo, mais prestigio

Outro exemplo:
  Foco:        Mainstream Comercial
  Agenda:      Agressiva
  Imagem:      Cute Mainstream
  Crescimento: Maximizar Caixa

  Perfil resultante: "Fabrica Idol Comercial"
  -> Volume alto, muitos endorsements, muita receita
  -> Risco de burnout, turnover alto, fas superficiais
```

- O perfil e mostrado na UI do dashboard como identidade da agencia
- Agencias rivais tambem tem perfil visivel (jogador pode comparar)
- Midia comenta no News Feed quando a agencia muda de perfil

### 6. Efeitos Estruturais (Nao Apenas Modificadores)

A estrategia nao e so "+15% em X". Cada alavanca **muda o ecossistema**
ao redor da agencia de formas qualitativas, nao so quantitativas.

#### Efeitos Estruturais por Foco de Mercado

| Foco | Efeito Estrutural (alem dos modificadores) |
|---|---|
| **Mainstream Comercial** | Midia te trata como commodity — mais cobertura, menos respeito. Fas sao maiores em numero mas com loyalty media mais baixa. Staff de marketing e mais facil de recrutar. Compositores premium recusam trabalhar (preferem artistas "serios") |
| **Nicho Otaku** | Mercado menor mas intenso. Fas hardcore gastam 3× mais em merch. Mas TV mainstream ignora — voce simplesmente nao existe pra eles. Endorsements ficam limitados a marcas de anime/games. Staff especializado raro e caro |
| **Variety-Heavy** | Idols viram "personalidades" — quando mudam pra musica, publico estranha. Recontratar idol variety pra agencia vocal e mais dificil (idol se identifica com TV). Emissoras te amam mas gravadoras te ignoram |
| **Vocal Prestige** | Curva de receita lenta — custa caro manter roster sem volume. Mas idols ficam mais tempo no auge (publico de musica e mais fiel). Rivais respeitam mais, buyouts sao menos frequentes. Staff musical e atraido naturalmente |
| **Digital-First** | Fas overseas crescem rapido mas sao voláteis (abandonam por next trend). Receita altamente variavel mês a mês. Staff jovem e barato mas inexperiente. Idols desenvolvem dependencia de metricas (stress sobe se views caem) |

#### Efeitos Estruturais por Postura de Imagem

| Postura | Efeito Estrutural |
|---|---|
| **Pure** | Fas com loyalty extrema MAS com gatilhos extremos. Um unico escandalo pode destruir anos de construcao. Idol sente PRESSAO da imagem — felicidade cai -1/mes so por manter a fachada. Quanto mais sucesso, mais fragil a bolha |
| **Edgy** | Fas atraidos por controversia. Agencia vive de hype cycles — fama sobe e desce em ondas. Meses explosivos seguidos de meses mortos. Staff de PR precisa ser excelente pra surfar o caos sem afundar. Idols com Mentalidade < 50 nao aguentam |
| **Mature/Artistic** | Publico 25+ compra menos merch mas paga mais por show. Pipeline de novatas e mais dificil (jovens querem mainstream). Idol que cresce aqui tem dificuldade de migrar pra outra agencia (nicho demais). Carreira longa mas crescimento lento |

#### Efeitos Estruturais por Postura de Crescimento

| Postura | Efeito Estrutural |
|---|---|
| **Push Novatas** | Roster instavel — novatas cometem erros, floppam em jobs dificeis. Receita imprevisivel no curto prazo. Mas pipeline e forte e agencia nao depende de estrelas. Aces existentes podem se sentir negligenciadas (afinidade -2/mes) |
| **Proteger Premium** | Agencia se torna refem da estrela. Se ace sai, agencia perde identidade e receita. Renovacao fica cada vez mais cara (ace sabe seu poder). Novatas nao se desenvolvem direito (sombra da estrela) |
| **Maximizar Caixa** | Caixa cresce mas reputacao nao. Idols percebem: afinidade cai -1/mes pra todas. Staff percebe: moral cai -1/mes pra todos. Jogador precisa equilibrar cinismo com gestao humana. Sustentavel por 1-2 anos, depois o roster sangra |

#### Conflito entre Estrategia e Realidade

A estrategia PODE conflitar com o roster atual, e isso e intencional:

```
Exemplos de conflito:
  - Foco "Vocal Prestige" mas roster so tem Variety Engines
    → Jobs de musica vem com bonus, mas ninguem performa bem neles
    → Idols sentem que estao sendo forcadas fora da zona de conforto
    → Resultado: fracassos ate o roster se adaptar (ou o jogador mudar o foco)

  - Postura "Push Novatas" mas so tem veteranas
    → Bonus pra novatas desperdicado, nenhuma trainee no roster
    → Veteranas percebem a direcao e se sentem descartaveis (afinidade -3/mes)

  - Imagem "Pure" mas ace tem Temperamento 3
    → Bomba-relogio. Questao de QUANDO, nao SE, o escandalo acontece
    → Escandalo em agencia Pure = impacto 50% maior = catastrofe
    → O jogador SABE do risco (ou deveria — ocultos dao pistas)
```

A estrategia nao e so "escolher build". E manter coerencia entre
visao e execucao sob pressao. E ai que o jogo fica interessante.

### Interactions with Other Systems

| Sistema | Direcao | O que flui |
|---|---|---|
| **Job Assignment** | -> modifica | Bonus/penalidade de receita e fama por tipo de job |
| **Schedule/Agenda** | -> modifica | Postura de agenda altera carga maxima e acumulo de stress |
| **Fame & Rankings** | -> modifica | Postura de imagem e crescimento afetam velocidade de fama |
| **Event/Scandal Generator** | -> modifica | Postura de imagem altera impacto de escandalos |
| **Fan Club System** | -> modifica | Tipo de fas atraidos depende da postura de imagem |
| **Scouting & Recruitment** | -> modifica | Foco de mercado prioriza perfis de scouting |
| **Agency Economy** | -> modifica | Postura de crescimento afeta receita e custos |
| **Idol Attribute/Stats** | -> modifica | Postura de crescimento afeta velocidade de crescimento |
| **Contract System** | -> modifica | Postura de crescimento "Proteger Premium" facilita renovacao |
| **Rival Agency AI** | <- lê | Rivais tem perfil estrategico proprio |
| **News Feed** | -> alimenta | Mudancas de estrategia viram noticias |
| **Agency Intelligence** | <- informa | Reports sugerem ajustes de estrategia |

## Formulas

#### Bonus de Job por Foco

```
receita_final = receita_base × (1 + bonus_foco)

bonus_foco = +0.15 a +0.20 se job combina com foco
           = -0.10 a -0.15 se job conflita com foco
           = 0.0 se generalista ou job neutro
```

#### Modificador de Stress por Postura de Agenda

```
stress_acumulado = stress_base × mult_postura

mult_postura:
  Agressiva:   1.3
  Equilibrada: 1.0
  Protetiva:   0.8
```

#### Impacto de Escandalo por Postura de Imagem

```
impacto_escandalo = impacto_base × mult_imagem

mult_imagem (escandalo de namoro):
  Pure:          1.5
  Edgy:          0.7
  Cute:          1.0
  Mature:        0.8

// Edgy + escandalo leve:
impacto_fama = impacto_base × -0.05  // fama SOBE com escandalo leve
```

## Edge Cases

- **Mudar foco e imagem ao mesmo tempo**: Ambas transicoes correm em paralelo.
  3 meses sem bonus de foco + 2 meses de confusao de fas = periodo turbulento
- **Postura Agressiva + idol com contrato de carga maxima baixa**: Contrato
  prevalece. Postura nao pode violar clausula contratual
- **Postura Pure + idol sem restricao de namoro**: Idol pode namorar mas o
  impacto do escandalo e 50% maior. Trade-off real
- **Agencia garagem com foco "Vocal Prestige"**: Funciona mas poucos jobs
  musicais premium aparecem pra garagem. Foco ajuda quando os jobs aparecem
  mas nao cria jobs novos
- **Todas agencias rivais com mesmo foco**: Improvavel pela seed, mas se
  acontecer, nicho fica saturado e bonus diminui (supply/demand)

## Dependencies

**Hard:**
- Agency Economy -- modificadores de receita/custo
- Week Simulation -- aplica modificadores no tick

**Soft:**
- Todos sistemas que recebem modificadores (Jobs, Fame, Scouting, etc.)

**Depended on by:**
- Agency Intelligence (reports sugerem mudancas)
- Agency Planning Board (estrategia informa planejamento)
- Rival Agency AI (rivais tem perfil proprio)

## Tuning Knobs

| Knob | Default | Range | Efeito |
|---|---|---|---|
| `FOCUS_BONUS_RANGE` | 0.15-0.20 | 0.05-0.30 | Bonus de receita/fama por foco |
| `FOCUS_PENALTY_RANGE` | 0.10-0.15 | 0.05-0.25 | Penalidade fora do foco |
| `FOCUS_TRANSITION_WEEKS` | 12 | 4-24 | Semanas pra mudar foco |
| `IMAGE_TRANSITION_WEEKS` | 8 | 4-16 | Semanas pra mudar imagem |
| `IMAGE_FAN_MOOD_PENALTY` | -10 | -5 a -20 | Impacto temporario nos fas ao mudar imagem |
| `AGGRESSIVE_STRESS_MULT` | 1.3 | 1.1-1.5 | Multiplicador de stress em postura agressiva |
| `PROTECTIVE_AFFINITY_BONUS` | 2 | 1-5 | Afinidade extra/mes em postura protetiva |

## Acceptance Criteria

1. 4 alavancas estrategicas configuraveis pelo jogador
2. Foco de mercado afeta bonus/penalidade em tipos de job
3. Postura de agenda afeta carga maxima e acumulo de stress
4. Postura de imagem afeta impacto de escandalos e tipo de fas
5. Postura de crescimento afeta receita, custos e velocidade de crescimento
6. Perfil consolidado visivel no dashboard
7. Mudar foco tem periodo de transicao (sem bonus)
8. Mudar imagem causa turbulencia temporaria nos fas
9. Agencias rivais tem perfil estrategico visivel
10. Combinacoes de alavancas criam perfis unicos e viaveis

## Open Questions

- Nenhuma pendente
