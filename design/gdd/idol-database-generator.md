# Idol Database & Generator

> **Status**: Designed
> **Author**: user + game-designer
> **Last Updated**: 2026-03-29
> **Implements Pillar**: Pilar 1 — Simulação com Profundidade Real, Pilar 3 — Múltiplos Caminhos ao Topo

## Overview

O Idol Database & Generator é o sistema que produz e armazena os ~5.000+ idols
que compõem o mercado ao longo de 20 anos de jogo. Usando uma seed fixa, gera
deterministicamente cada idol com nome (japonês + romanizado), região, gênero,
idade de entrada, data de aparição no jogo, 16 atributos visíveis, 6 atributos
ocultos, PT (potencial), background narrativo, e rótulo de personalidade.

O jogador interage indiretamente com este sistema -- nunca o vê, mas tudo que
ele avalia (stats, backgrounds, tiers) foi gerado por ele. É o "mundo" do jogo:
o pool de talentos, as agências rivais, o ecossistema. Sem este sistema, não
haveria idols pra contratar, competição pra enfrentar, nem meta-game pra
comunidade discutir.

A propriedade mais importante é a **reprodutibilidade**: a mesma seed gera o
mesmo universo em todo playthrough, permitindo tier lists, guias de draft, e
estratégias compartilhadas entre jogadores -- como no Football Manager com
jogadores reais.

O sistema é preparado para **multilinguagem** desde a fundação: nomes são
gerados em japonês (kanji) com romanização automática, e todos os textos
gerados (backgrounds, labels de personalidade) suportam i18n.

## Player Fantasy

Este é um sistema de **infraestrutura invisível** -- o jogador não interage
diretamente com ele no gameplay. A fantasia que ele alimenta é a de um **mundo
vivo e justo**: o jogador sabe que todos os outros jogadores enfrentam exatamente
o mesmo mercado. A idol "Yamada Rei" que aparece no mês 14 é a mesma pra todo
mundo. Isso transforma o jogo de uma experiência solo em uma **experiência
comunitária**: "como você lidou com a Yamada Rei?" é uma conversa possível
entre qualquer dois jogadores.

A profundidade do gerador alimenta a fantasia de **descoberta**: com ~3.000
idols ativas a qualquer momento, sempre há alguém que o jogador não viu.
Uma idol rank C escondida numa cidade regional que na verdade é S+ mas
ninguém sabe ainda. A sensação de que o mundo é grande demais pra dominar
completamente -- mas tentando é divertido.

O gerador é arquitetado como um **módulo independente** do jogo (web app),
permitindo que a comunidade crie pacotes customizados: idols, agências,
bandas pré-formadas, eventos sazonais, rádios/TVs. Como o Database Editor
do FM. Isso estende a rejogabilidade indefinidamente e cria uma economia
de conteúdo gerado pelo jogador.

O banco de dados não contém apenas idols -- é um **universo completo**:
agências rivais, bandas pré-formadas que só aceitam contrato conjunto,
eventos fixos no calendário (premiações anuais, festivais sazonais),
estações de rádio e canais de TV com seus perfis de audiência, e o
ranking de músicas mais tocadas.

O mundo já estava funcionando antes do jogador chegar. Agências rivais já
têm rosters, grupos famosos dominam rankings, hits já estão tocando nas
rádios. O jogador entra num **mundo maduro com história** e precisa se
inserir nele -- como assumir um time no FM num campeonato em andamento.

## Detailed Design

### Core Rules

#### 1. Arquitetura: Ferramenta Offline, Não Runtime

O gerador é uma **ferramenta de desenvolvimento** (web app), não um sistema
runtime. O jogo nunca gera idols -- só lê dados pré-computados.

**Fluxo:**
1. Ferramenta (web app) roda o gerador com a master seed
2. Gera ~5.000 idols, ~50 agências, bandas, eventos, mídia, músicas
3. **Simula ~5 anos** do mundo pra criar estado inicial maduro (rankings
   populados, contratos existentes, histórico, hits nas rádios)
4. Exporta o **World Pack** -- banco de dados estático (JSON/binário)
5. World Pack vem empacotado no download do jogo
6. O jogo só **lê** o World Pack -- zero geração em runtime

**Consequências:**
- Performance zero em runtime -- só carrega dados, não gera nada
- Reprodutibilidade perfeita -- todos jogadores recebem o mesmo banco
- Packs da comunidade seguem o mesmo processo (gera, simula, exporta, distribui)
- A simulação dos 5 anos iniciais usa os mesmos sistemas que o jogo
  (contrato, fama, jobs, economia) pra garantir coerência
- Updates do jogo podem incluir novos World Packs oficiais

#### 2. O Universo é um World Pack

Um World Pack é um pacote completo e auto-contido que define todo o universo:

| Entidade | Qtd (pack padrão) | Descrição |
|---|---|---|
| **Idols** | ~5.000+ | Fichas completas com stats, PT, background, data de entrada |
| **Agências** | ~50 | Nome, região, tier, orçamento, perfil de contratação |
| **Bandas pré-formadas** | ~100-200 | Grupos sem agência, só contratam em conjunto |
| **Eventos fixos** | ~30-50/ano | Premiações, festivais sazonais, com datas e requisitos |
| **Estações de rádio** | ~20-30 | Nome, região, perfil (pop/rock/idol), audiência |
| **Canais de TV** | ~15-20 | Slots de programação, audiência, perfil editorial |
| **Músicas seed** | ~500+ | Hits pré-existentes no ranking inicial |
| **Scouts** | ~500 | NPCs fixos com nome, nível, XP. Não envelhecem, não surgem novos |
| **Estado inicial** | 1 | Snapshot pós-simulação de 5 anos: contratos, rankings, histórico, scouts alocados |

#### 3. Ficha de uma Idol (estrutura de dados)

```
Idol {
  // Identidade
  id:               uint32        // Único, derivado da seed
  name_jp:          string        // 山田 玲 (kanji)
  name_reading:     string        // やまだ れい (hiragana)
  name_romaji:      string        // Yamada Rei
  stage_name:       string?       // Nome artístico (opcional)
  gender:           enum          // Female, Male
  birth_date:       date          // Determina idade no jogo
  region:           enum          // Tokyo, Kansai, Fukuoka, Nagoya, Hokkaido, etc.

  // Aparição no jogo
  entry_month:      uint16        // Mês do jogo em que aparece no mercado (0 = início)
  entry_method:     enum          // Street, Audition, Festival, Online, Transfer, PreExisting

  // Stats (definidos pelo Stats System GDD — 16 atributos em 4 categorias)
  attributes: {
    // Performance (4)
    vocal:          1-100
    dance:          1-100
    acting:         1-100
    variety:        1-100
    // Presença (4)
    visual:         1-100
    charisma:       1-100
    communication:  1-100
    aura:           1-100
    // Resiliência (4)
    stamina:        1-100
    discipline:     1-100
    mentality:      1-100
    focus:          1-100
    // Inteligência (4)
    stage_reading:  1-100
    creativity:     1-100
    learning:       1-100
    teamwork:       1-100
  }
  potential:        1-100         // PT -- teto, determina tier

  // Ocultos (nunca visíveis ao jogador — 6 atributos)
  hidden: {
    consistency:    1-20
    ambition:       1-20
    loyalty:        1-20
    temperament:    1-20
    personal_life:  1-20
    professionalism: 1-20
  }

  // Gerados
  personality_label: string       // "Estrela Disciplinada", "Bomba-Relógio", etc.
  background_text:  i18n_string   // 2-4 frases, multilíngue
  visual_seed:      uint64        // Seed pro gerador visual (módulo separado)
}
```

#### 4. Geração Determinística por Seed

O sistema usa uma **master seed** (número inteiro) que gera todo o universo:

```
master_seed → PRNG →
  ├── idol_seeds[0..N]      → cada idol gerada independentemente
  ├── agency_seeds[0..M]    → cada agência gerada
  ├── band_seeds[0..K]      → cada banda pré-formada
  ├── event_seeds           → calendário de eventos
  ├── media_seeds           → rádios e TVs
  └── music_seeds           → hits pré-existentes
```

**Regras de determinismo:**
- Mesma master_seed = mesmo universo, sempre, em qualquer plataforma
- Adicionar idol ao pack não altera as existentes (seeds são independentes)
- O PRNG deve ser platform-independent (não usar rand() nativo)
- Recomendação: PCG ou xoshiro256** como PRNG determinístico

#### 5. Simulação do Estado Inicial (~5 anos pré-jogo)

Após gerar todas as entidades, o gerador roda a simulação do jogo por
~5 anos (260 semanas) pra produzir um mundo maduro:

**O que é simulado:**
- Agências IA contratam idols do mercado usando a mesma lógica do jogo
- Idols são escaladas em jobs, ganham/perdem fama, evoluem stats
- Rankings são populados organicamente (quem performou melhor sobe)
- Contratos são assinados, renovados, quebrados
- Bandas se formam, grupos são montados pelas agências IA
- Músicas são "lançadas" e entram no ranking de charts
- Eventos sazonais acontecem e geram resultados
- Idols mais velhas debutam (aposentam), novas entram
- Escândalos e eventos aleatórios acontecem

**O que o jogador recebe no início:**
- Rankings já populados com idols famosas no topo
- Agências rivais já com rosters de 10-50 idols cada
- ~200-500 idols livres no mercado (sem contrato)
- Bandas pré-formadas disponíveis pra contratar
- Histórico de 5 anos de notícias e eventos
- Ranking de músicas com top 100 de hits existentes
- O jogador começa com uma agência nova (pequena, sem idols, orçamento inicial)

### States and Transitions

O World Pack passa por um pipeline linear de estados:

| Estado | Descrição | Transição |
|---|---|---|
| **Vazio** | Master seed definida, nenhuma entidade gerada | → Gerado (após rodar gerador) |
| **Gerado** | Todas entidades criadas, sem estado simulado | → Simulado (após rodar 5 anos) |
| **Simulado** | Estado inicial completo, rankings populados | → Exportado (após exportar) |
| **Exportado** | World Pack empacotado (JSON/binário) | → Carregado (no jogo) |
| **Carregado** | Jogo leu o pack, pronto pra jogar | Estado final |

Para idols individuais dentro do pack, os estados seguem o mesmo ciclo
definido no Stats System GDD (Aspirante → Ativa → Veterana → Debutada),
mas aplicados durante a simulação dos 5 anos iniciais.

### Interactions with Other Systems

| Sistema | Direção | O que flui |
|---|---|---|
| **Stats System** | ← lê definições | Regras de atributos, tiers, faixas de PT, fórmulas de crescimento |
| **Market/Transfer** | → fornece pool | Lista de idols disponíveis (sem contrato) a cada momento |
| **Fame & Rankings** | → fornece estado inicial | Rankings pré-populados dos 5 anos simulados |
| **Scouting** | → fornece candidatos | Idols filtradas por região, método, tier estimado |
| **Rival Agency AI** | → fornece agências + rosters | 50 agências com seus perfis e rosters iniciais |
| **Contract System** | → fornece contratos iniciais | Contratos existentes entre agências e idols no estado inicial |
| **Job Assignment** | → fornece jobs disponíveis | Eventos fixos, slots de rádio/TV, jobs recorrentes |
| **Visual Generator** | → fornece visual_seed | Seed por idol pra gerar aparência determinística |
| **News Feed** | → fornece histórico | 5 anos de notícias geradas durante simulação inicial |
| **Music Charts** | → fornece ranking musical + compositores | Top de músicas pré-existentes + pool de ~100-200 compositores NPC com tier/especialidade/custo |
| **Media Entities** | → fornece entidades de mídia | ~40-60 rádios/TVs/plataformas com audiência, perfil editorial, shows e programação |
| **Idol Personal Finance** | → fornece estado financeiro inicial | Idols do estado inicial (5 anos) têm poupança/dívida/conquistas acumuladas |
| **Web App Editor** | ↔ bidirecional | Comunidade cria/edita packs (idols, agências, compositores, mídia); editor valida contra regras |

## Formulas

#### Distribuição de Tiers no Pack

```
Para N idols totais, distribuição target:
  F   = N × 0.30    (~1500 de 5000)
  E   = N × 0.25    (~1250)
  D   = N × 0.20    (~1000)
  C   = N × 0.12    (~600)
  B   = N × 0.07    (~350)
  A   = N × 0.035   (~175)
  S   = N × 0.015   (~75)
  SS  = N × 0.007   (~35)
  SSS = N × 0.003   (~15)
```

#### Volume de Idols pra Simulação Inicial

```
Pré-existentes (entry_month ≤ 0):      ~3000-3500
  Distribuídas entre agências:          ~760 contratadas
    Grandes (7 agências × 30-50):       ~280
    Médias (17 agências × 10-25):       ~300
    Pequenas (26 agências × 3-10):      ~180
  Livres no mercado:                    ~200-500
  Em bandas pré-formadas:              ~300
  Já debutadas (aposentadas):          ~1200+

Entram durante os 5 anos de sim:        ~1000
Entram durante os 15 anos de jogo:      ~2000-2500
Total no banco:                         ~6000-7000
```

#### Distribuição de Gênero

```
Feminino: ~70% do total
Masculino: ~30% do total
```

#### Distribuição Regional

```
Tokyo: 45%    Kansai (Osaka): 20%    Fukuoka: 8%
Nagoya: 7%    Hokkaido: 5%           Outras regionais: 15%
```

#### Geração de Atributos Iniciais (por idol)

```
Para cada idol com PT definido:
  1. Definir teto por atributo: teto[i] = PT × (0.5 + seed_variation[i])
     onde seed_variation[i] ∈ [0.0, 1.0], soma normalizada
  2. Valor inicial: attr[i] = teto[i] × initial_factor
     onde initial_factor = 0.2 a 0.6 (proporcional à idade de entrada)
     Mais velha = mais desenvolvida no início
  3. Ocultos: hidden[j] = seed_roll(1, 20) independente do PT
```

## Edge Cases

- **Duas idols com mesmo nome**: Possível em ~6000. Resolver com sufixo
  regional automático ("Yamada Rei (Osaka)" vs "Yamada Rei (Tokyo)")
- **Pack customizado com idol PT > 100**: Validador rejeita. Range 1-100
  enforced pelo editor
- **Pack sem agências**: O jogo precisa de pelo menos 1 agência rival.
  Validador exige mínimo de 3 agências
- **Agência dominadora no estado inicial**: Natural e esperado. A simulação
  de 5 anos pode produzir 1-2 agências dominantes nos rankings -- isso é
  realista e dá ao jogador rivais claros pra superar. Balancear com análise
  de dados se ficar muito destoante
- **Banda pré-formada com membro contratado na simulação**: Banda se desfaz
  durante simulação. Marcada como "dissolvida" no estado inicial
- **Idol com entry_month > 240**: Válido -- aparece após 20 anos. Permite
  packs com horizonte maior
- **Nenhuma idol SSS no pack**: Possível em packs pequenos. Pack padrão
  oficial garante ≥10 SSS
- **Compositor sem músicas encomendadas nos 5 anos**: Possível pra
  compositores de tier baixo. Continuam disponíveis pro jogador

## Dependencies

**Hard (não funciona sem):**
- Stats System — define regras de atributos, tiers, fórmulas de crescimento

**Soft (funciona sem, mas degradado):**
- Visual Generator — sem ele, idols existem sem aparência visual
- Music Charts — sem ele, ranking musical fica vazio no estado inicial

**Depended on by (sistemas que precisam deste):**
Market/Transfer, Fame & Rankings, Scouting, Rival Agency AI, Contract System,
Job Assignment, Visual Generator, News Feed, Music Charts, Group Management

**Formato de armazenamento:**
- **JSON/binário** empacotado no download do jogo (World Pack estático — ADR-001/003)
- Distribuição via Supabase Storage para packs da comunidade (download sob demanda)
- Relações complexas (contratos, agências, grupos) representadas como JSON com IDs
- O jogo carrega o pack em memória no boot — queries por filtro (região, tier,
  disponibilidade) são feitas sobre arrays em memória, não sobre banco SQL
- Web app editor exporta JSON/binário; validador verifica integridade antes de publicar

## Tuning Knobs

| Knob | Default | Range | Se muito alto | Se muito baixo |
|---|---|---|---|---|
| `TOTAL_IDOLS` | 6000 | 100-20000 | Memory no load | Mercado vazio |
| `TOTAL_AGENCIES` | 50 | 3-200 | Competição diluída | Sem competição |
| `PRE_EXISTING_IDOLS` | 3500 | 500-5000 | Muitas idols livres | Mercado vazio no início |
| `SIMULATION_YEARS` | 5 | 1-10 | Mundo maduro demais | Rankings vazios |
| `NEW_IDOLS_PER_MONTH` | 12-15 | 5-30 | Mercado saturado | Poucas opções |
| `GENDER_RATIO_FEMALE` | 0.70 | 0.5-1.0 | Poucos masculinos | Desbalanceia mercado |
| `BANDS_PRE_FORMED` | 150 | 0-500 | Muitos grupos sem agência | Sem mecânica |
| `COMPOSERS_TOTAL` | 100-200 | 20-500 | Muitas opções, difícil escolher | Pouca variedade musical |
| `MASTER_SEED` (oficial) | TBD | uint64 | N/A | N/A |

## Acceptance Criteria

1. Mesma master_seed gera idols idênticas em qualquer plataforma (PC, web)
2. Distribuição de tiers no pack padrão dentro de ±3% dos targets
3. Distribuição regional dentro de ±5% dos targets
4. Todos nomes têm versão japonesa (kanji) e romanizada válida
5. Estado inicial pós-simulação tem rankings populados com ≥100 idols rankeadas
6. Todas agências rivais no estado inicial têm ≥5 idols contratadas
7. Agências grandes têm 30-50 idols no estado inicial
8. World Pack (JSON/binário) carrega em <1.5 segundos no PC target
9. Validador rejeita packs com dados fora dos ranges do Stats System
10. Web app editor produz packs válidos que o jogo carrega sem erros
11. Background narrativo de cada idol é coerente com seus stats e região
12. Ranking musical tem ≥100 músicas no estado inicial

## Open Questions

- **RESOLVIDO**: Quantidade de músicas seed definida pelo playtest com IAs
  simulando. Compositores ~100-200 como base
- Três vias de criação musical (compositor encomendado, idol compõe, cover)
  precisam de GDD próprio — Music Charts System. Adicionar ao systems index
- Media Entities (rádios/TVs como entidades persistentes) precisa de GDD próprio.
  Adicionar ao systems index
- Covers: idol pode fazer cover de artista da mesma agência (fácil), artista
  debutada (semi-público), ou artista de outra agência (negociar). Detalhar
  no Music Charts GDD
- Divisão de royalties vai no Contract System: idol que compõe ganha parte
  de compositor + parte de artista
- Player pode nomear músicas de suas idols -- detalhar no UI/UX
- Como distribuir compositores regionalmente? Tokyo-heavy como idols?
- Schema da entidade Compositor: precisa de ficha no World Pack (nome, tier,
  especialidade, custo, região)
