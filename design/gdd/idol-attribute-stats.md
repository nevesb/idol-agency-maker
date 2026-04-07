# Idol Attribute/Stats System

> **Status**: Designed (v2 — revisão consolidada)
> **Author**: user + game-designer
> **Last Updated**: 2026-04-04
> **Implements Pillar**: Pilar 1 — Simulação com Profundidade Real
> **Related**: show-system.md, music-entities.md, setlist-system.md, audience-system.md, staff-functional.md

## Overview

O Idol Attribute/Stats System define quem cada idol É numericamente. É o sistema
fundacional que todas as mecânicas de gameplay consultam para avaliar, comparar e
simular idols.

Cada idol possui **16 atributos visíveis** (escala 1-100) organizados em **4
categorias** (Performance, Presença, Resiliência, Inteligência), **6 atributos
ocultos** (escala 1-20) que governam personalidade e comportamento, um **perfil
vocal** (classificação qualitativa), **traits** (características comportamentais),
e dois meta-valores: Talento Atual (TA) e Potencial (PT).

O PT define o teto de crescimento e determina o tier da idol (F→SSS). O TA
reflete a habilidade corrente e evolui com treino, experiência e idade.

Atributos dizem o que a idol **PODE** fazer. Traits dizem o que ela **TENDE A
TENTAR**. Juntos, definem tanto o teto de performance quanto o comportamento
emergente.

**Mudanças v2**: Expansão de 12→16 atributos visíveis (adição de Inteligência como
4ª categoria), 5→6 ocultos (adição de Profissionalismo), sistema de traits,
perfil vocal híbrido, e cadeias de cálculo integradas com show-system.md,
music-entities.md e audience-system.md.

O jogador interage com este sistema passivamente (vendo stats no perfil da idol) e
ativamente (escolhendo treinos, escalando idols com base em stats, avaliando
candidatos em castings). Sem este sistema, não há base para nenhuma decisão de
gameplay — seria escolher idols no escuro.

## Player Fantasy

A fantasia é ser o **olheiro e mentor** que enxerga potencial onde outros não veem.
Você olha uma idol rank F, novata, crua -- mas percebe que a Adaptabilidade é alta
e o Potencial escondido é de rank A. Você investe, treina, escala em jobs certos,
e vê os números subirem. Três anos depois ela é uma estrela e você foi quem
construiu isso.

O sistema de stats alimenta a fantasia central do jogo: **tomar decisões com
informação imperfeita**. Você vê os 12 atributos visíveis, mas os 5 ocultos são
revelados gradualmente conforme trabalha com a idol. Aquela idol com stats
medianos pode ter Consistência 19 e ser uma máquina confiável, ou ter
Temperamento 3 e explodir num escândalo a qualquer momento. Descobrir quem a
idol realmente é -- além dos números -- é parte da experiência.

Serve o **Pilar 1 (Simulação com Profundidade Real)**: os números são reais,
consistentes e têm consequências. E o **Pilar 4 (Drama Nasce das Mecânicas)**:
a tensão entre stats visíveis e ocultos gera surpresas emergentes.

## Detailed Design

### Core Rules

#### 1. Atributos Visíveis (16 atributos, escala 1-100)

Organizados em **4 categorias de 4 atributos** cada. Nenhum atributo é
combinação de outros — cada um mede algo distinto e irredutível.

**Performance** (habilidades técnicas de palco):

| Atributo | Descrição | Impacta | Usado por |
|---|---|---|---|
| **Vocal** | Qualidade de canto, extensão, afinação, potência | Shows, gravações, dublagem musical | show-system, music-entities (match vocal) |
| **Dança** | Coreografia, ritmo, expressão corporal | Shows, MVs, performances ao vivo | show-system, music-entities (match dance) |
| **Atuação** | Expressividade dramática, range emocional | TV dramas, dublagem, comerciais | job-assignment (TV/dublagem) |
| **Variedade** | Humor, improviso, presença em talk shows | Programas de TV, rádio, eventos | job-assignment (variety/talk) |

**Presença** (impacto pessoal e público):

| Atributo | Descrição | Impacta | Usado por |
|---|---|---|---|
| **Visual** | Aparência, fotogenia, estilo | Sessões de fotos, endorsements, merch | job-assignment, fan-club (conversão visual) |
| **Carisma** | Magnetismo, capacidade de cativar | Todos os jobs (modificador universal) | job-assignment (universal), audience-system |
| **Comunicação** | Articulação, entrevistas, MC | Rádio, podcasts, MC de shows | show-system (MC bonus), job-assignment |
| **Aura** | Presença de palco, "it factor" intangível | Shows ao vivo, festivais, grandes eventos | show-system (presence match), audience-system |

**Resiliência** (capacidade de suportar a indústria):

| Atributo | Descrição | Impacta | Usado por |
|---|---|---|---|
| **Resistência** | Suporta agenda pesada sem quebrar fisicamente | Carga de trabalho máxima, turnês | show-system (fadiga), schedule-agenda |
| **Disciplina** | Pontualidade, profissionalismo, segue regras | Velocidade de treino, confiabilidade | setlist-system (mastery gain), all training |
| **Mentalidade** | Lida com pressão, críticas, escândalos | Recuperação de crises, stress | happiness-wellness, event-scandal |
| **Foco** | Concentração sob distração, mantém qualidade por períodos longos | Consistência de performance intra-show, shows longos | show-system (fadiga mental), setlist-system |

**Inteligência** (capacidade cognitiva e adaptativa):

| Atributo | Descrição | Impacta | Usado por |
|---|---|---|---|
| **Leitura de Palco** | Percebe e reage à audiência em tempo real | Adapta performance ao mood da audiência | show-system, audience-system |
| **Criatividade** | Capacidade de improvisar, adicionar personalidade | MCs, encores, momentos espontâneos | show-system (eventos de momento), composição |
| **Aprendizado** | Velocidade de absorção de novas habilidades | Mastery de músicas novas, novos tipos de job | setlist-system (mastery gain), job-assignment |
| **Trabalho em Equipe** | Coordenação com outros, sinergia natural | Sinergia de grupo, harmonias, coreografia sincronizada | show-system (grupo), group-management |

**Princípio de design dos 16 atributos**: Cada atributo mede uma capacidade
atômica e irredutível. "Adaptabilidade" do sistema anterior foi decomposto em
"Aprendizado" (velocidade) e "Leitura de Palco" (percepção situacional).
Nenhum atributo é a soma ou média de outros.

**Regras dos atributos visíveis:**
- Escala: 1 (incompetente) a 100 (perfeição humana)
- Valor inicial: Gerado pela seed, proporcional ao PT da categoria relevante
- Visibilidade: Sempre visível para idols contratadas. Para idols no mercado,
  visibilidade depende do método de scouting (olheiro de rua vê estimativa ±15;
  casting vê valores exatos em atributos testados; transfer vê tudo)

#### 2. Atributos Ocultos (6 atributos, escala 1-20)

**Nunca revelados ao jogador como valores numéricos.** O jogador deduz seus
efeitos através de pistas indiretas, exatamente como no Football Manager.

| Atributo | Descrição | Como o jogador percebe | Impacto mecânico |
|---|---|---|---|
| **Consistência** | Regularidade de performance | Jobs com resultados erráticos vs. previsíveis | Variância no show-system (random factor range) |
| **Ambição** | Desejo de crescer e estar no topo | Pede transferência, exige mais, ou se acomoda | Teto de crescimento relativo ao PT |
| **Lealdade** | Vínculo com a agência/produtor | Recusa rivais facilmente ou aceita propostas | Chance de aceitar proposta rival |
| **Temperamento** | Estabilidade emocional | Escândalos, brigas internas, ou estabilidade sob pressão | Chance de eventos negativos, conflitos |
| **Vida Pessoal** | Atividade fora do trabalho | Flagrada em público, namoros, ou vida reservada | Chance de escândalos de vida privada |
| **Profissionalismo** | Ética de trabalho, respeito a processos | Atrasos, falhas, qualidade em tarefas rotineiras | Multiplicador de qualidade em jobs "chatos", mastery mínimo garantido |

**Profissionalismo** (novo): Distinto de Disciplina (visível). Disciplina mede
capacidade de manter rotina e ritmo. Profissionalismo mede a atitude em relação
ao trabalho — uma idol com Disciplina 80 e Profissionalismo 5 treina todo dia
mas faz corpo mole em fan meetings pequenos.

**Mecanismos de pista:**
- **Rótulo de personalidade**: Derivado da combinação dos 6 ocultos (ex: "Estrela
  Disciplinada", "Bomba-Relógio", "Pilar Silencioso", "Ambiciosa Instável",
  "Profissional Modelo", "Workaholic Volátil").
  Revelado pelo scout na contratação. **Fixo pra sempre** (ocultos não mudam)
- **Comentários de scout**: Scouts com skill maior dão pistas mais específicas
  e precisas sobre atributos individuais
- **Comportamento emergente**: O jogador observa padrões ao longo de semanas/meses
  de trabalho e aprende a "ler" cada idol
- Valores exatos existem internamente para cálculos de simulação, mas o jogador
  nunca os vê — nem com tempo, nem com scouts perfeitos

#### 2b. Sistema de Traits

**Traits são características comportamentais** que definem tendências, não
capacidades. Atributos dizem o que a idol PODE fazer; traits dizem o que ela
TENDE A TENTAR.

Cada idol possui **2-4 traits** da lista abaixo, definidos na seed (fixos).

**Traits de Performance:**

| Trait | Efeito | Interação |
|---|---|---|
| **Clutch** | Performance +15% em momentos de alta pressão (finales, TV live) | show-system: mult em músicas finais |
| **Choke** | Performance -15% em momentos de alta pressão | show-system: penalidade em momentos-chave |
| **Show-stealer** | Chance aumentada de Momento Brilhante (+5%) | show-system: eventos mid-show |
| **Crowd Reader** | Bônus de Leitura de Palco efetivo +10 em shows | audience-system: ajuste dinâmico |
| **Perfectionist** | Mastery cresce 20% mais rápido, mas stress +10% em erro | setlist-system + wellness |
| **Natural Performer** | Menos penalidade por mastery baixo (×0.7 em vez de ×0.5) | setlist-system |

**Traits de Personalidade:**

| Trait | Efeito | Interação |
|---|---|---|
| **Leader** | Sinergia de grupo +10%. MC +15% | show-system, group-management |
| **Lone Wolf** | Solo performance +10%, sinergia -10% | show-system |
| **Diva** | Performance +5% como center, -10% como backing | show-system: papéis |
| **Team Player** | Sinergia +15%, aceita qualquer papel sem penalidade | show-system, group-management |
| **Emotional** | Emotional impact +20% em ballads, instável sob pressão | audience-system, wellness |
| **Ice Queen** | Imune a pressão (-30% efeito de stress), mas emotional impact -15% | show-system, wellness |

**Traits de Carreira:**

| Trait | Efeito | Interação |
|---|---|---|
| **Workaholic** | Pode fazer 1 slot extra por semana, mas burnout risk +20% | schedule-agenda, wellness |
| **Late Bloomer** | Crescimento lento até 20 anos, acelerado após (×1.5 base) | curva de idade |
| **Prodigy** | Crescimento explosivo até 18, desacelera mais cedo | curva de idade |
| **Loyal Heart** | -50% chance aceitar rival, +20% loyalty com agência | contract-system |
| **Wanderlust** | +30% chance de querer mudar, mas Aprendizado +10 efetivo | contract-system, stats |
| **Composed** | Recuperação de crise 2× mais rápida | wellness, event-scandal |

**Traits de Nicho:**

| Trait | Efeito | Interação |
|---|---|---|
| **Idol Otaku** | +15% performance em fan meetings e handshake events | job-assignment |
| **Social Media Natural** | Fama online +30%, chance de viral +5% | fan-club-system |
| **Stage Presence** | Aura efetiva +10 em shows com >5000 pessoas | show-system |
| **Intimate Performer** | Performance +10% em venues <500, -5% em arenas | show-system |
| **Multilingual** | Acessa jobs internacionais, audience boost no exterior | job-assignment |
| **Songwriter** | Composições têm qualidade +25% | music-entities |

**Regras de traits:**
- 2-4 traits por idol, definidos na seed (fixos, como ocultos)
- Traits podem ter condições de ativação (só em shows, só em grupo, etc.)
- Traits são **visíveis** para idols contratadas após 4 semanas de observação
- Para idols scoutadas: scout skill alto revela 1-2 traits antes da contratação
- Traits conflitantes são raros mas possíveis (Clutch + Emotional = dramática)

#### 2c. Perfil Vocal — Sistema Híbrido

Cada idol tem um **perfil vocal** que combina o atributo numérico (Vocal 0-100)
com classificação qualitativa:

```
VocalProfile {
  // Numérico (Vocal attribute, escala 1-100)
  vocal:        uint8

  // Classificação qualitativa (fixo na seed)
  tessitura:    enum (Soprano, Mezzo, Alto, Tenor, Baritone)
  texture:      enum (Clear, Breathy, Husky, Powerful, Sweet, Raw)
  vocal_role:   enum (Lead, Harmony, Rap, Spoken)
}
```

O atributo Vocal mede **qualidade técnica**: afinação, controle, projeção.
A classificação qualitativa mede **tipo**: qual range, qual timbre, qual função.

Ambos são usados no match com músicas (music-entities.md):
- Vocal 90 + tessitura errada = execução tecnicamente perfeita mas que não soa bem
- Vocal 50 + tessitura perfeita = limitações técnicas mas a voz encaixa
- Vocal 90 + tessitura perfeita = ideal

Ver `music-entities.md` para detalhes do Vocal Fit system.

#### 3. Talento Atual (TA) e Potencial (PT)

Inspirado no sistema CA/PA do Football Manager:

**Potencial (PT)**: Escala 1-100. Teto absoluto de crescimento. Fixo na seed,
**nunca muda**. Determina o tier da idol e a velocidade de aprendizado.

**Talento Atual (TA)**: Escala 1-100. Representa a habilidade corrente como
média ponderada dos 12 atributos visíveis. Evolui com treino, jobs e idade.
Nunca pode ultrapassar o PT.

**Relação TA ↔ Atributos**: O TA não é um número independente — é derivado
dos 16 atributos visíveis. Quando atributos sobem, TA sobe. O PT limita
quanto cada atributo individual pode crescer (atributos têm tetos individuais
derivados do PT).

#### 4. Sistema de Tiers

O tier é determinado pelo PT (potencial), não pelo TA (habilidade atual).
Uma idol rank S é rank S desde o nascimento, mesmo que comece com TA baixo.
O tier é uma medida de **teto**, não de **performance atual**.

| Tier | Range de PT | Velocidade Base de Aprendizado | % no mercado |
|---|---|---|---|
| F | 1-20 | ×0.4 (muito lento) | ~30% |
| E | 21-35 | ×0.6 (lento) | ~25% |
| D | 36-50 | ×0.8 (abaixo da média) | ~20% |
| C | 51-65 | ×1.0 (base) | ~12% |
| B | 66-75 | ×1.3 (acima da média) | ~7% |
| A | 76-85 | ×1.6 (rápido) | ~3.5% |
| S | 86-92 | ×2.0 (muito rápido) | ~1.5% |
| SS | 93-97 | ×2.5 (excepcional) | ~0.7% |
| SSS | 98-100 | ×3.0 (prodígio) | ~0.3% |

**Regras dos tiers:**
- Tier é **visível** para idols contratadas. Para idols no mercado, scouts
  estimam o tier com margem de erro (scout ruim pode errar ±2 tiers)
- Distribuição no mercado segue curva realista: a maioria é F/E/D,
  SSS é ~1 a cada 300 idols
- Ao longo de 20 anos (~5.000 idols), o jogo terá ~15 idols SSS total
- Tier nunca muda (PT é fixo)

#### 5. Background Narrativo

Cada idol possui um background textual gerado proceduralmente pela seed que
**justifica narrativamente seus stats**. O background não é cosmético -- é a
primeira ferramenta de avaliação do jogador.

**Composição do background (fragmentos combinados por seed):**
- **Origem regional**: Cidade, família, contexto social (derivado de região)
- **Formação**: Explica stats altos ("cantou em coral desde os 6 anos" → Vocal alto)
- **Lacunas**: Explica stats baixos ("nunca pisou num palco antes" → Aura baixo)
- **Personalidade**: Hints dos atributos ocultos ("conhecida pela dedicação
  extrema" → Disciplina alta; "temperamento imprevisível" → Temperamento baixo)
- **Arco de descoberta**: Como foi encontrada ("viralizou no TikTok", "venceu
  concurso regional", "descoberta por olheiro em Harajuku")

**Regras:**
- Background é visível desde o scouting (é informação pública da idol)
- Jogadores atentos extraem pistas de atributos ocultos do texto
- Backgrounds são únicos por idol (seed fixa garante o mesmo texto todo playthrough)
- Extensão: 2-4 frases (conciso, scanável)

#### 6. Cadeias de Cálculo (Como Atributos Viram Performance)

Inspirado nas cadeias do FM26 (Perception→Decision→Execution→Sustain→Modulation),
cada ação no show segue uma cadeia onde diferentes atributos participam em fases:

**Cadeia de Performance Musical (show por música):**

```
PERCEPÇÃO (ler a situação)
  → Leitura de Palco: percebe o mood da audiência
  → Foco: mantém concentração apesar de distrações

DECISÃO (escolher como agir)
  → Criatividade: ajusta performance ao momento (improvisar, intensificar)
  → Trabalho em Equipe: coordena com grupo (se aplicável)

EXECUÇÃO (realizar a ação)
  → Vocal/Dança/Atuação: atributos técnicos primários da música
  → Aura: presença no palco durante execução

SUSTENTAÇÃO (manter qualidade)
  → Resistência: aguenta fisicamente até o fim
  → Foco: não perde concentração ao longo do show
  → Disciplina: mantém qualidade mesmo quando cansada

MODULAÇÃO (fatores que modificam tudo)
  → Carisma: modificador universal
  → Mentalidade: lida com pressão do momento
  → Traits: modificadores condicionais
  → Ocultos: Consistência (variância), Profissionalismo (base mínima)
```

**Cadeia de Job (não-show):**

```
EXECUÇÃO = atributos primários do job (da tabela de tipos)
SUSTENTAÇÃO = Resistência + Disciplina
MODULAÇÃO = Carisma + Mentalidade + Profissionalismo(oculto) + Traits
```

**Implicação**: Uma idol com Vocal 90 mas Foco 30 e Mentalidade 40 vai
brilhar nas primeiras músicas e desmoronar nas finais. Uma idol com
Vocal 70 mas Leitura de Palco 85 e Foco 80 vai entregar performance
consistente e se adaptar à audiência. O sistema de 16 atributos cria
**perfis complexos** onde nenhum atributo isolado garante sucesso.

#### 7. Crescimento de Atributos

Atributos visíveis crescem quando a idol treina ou trabalha. A velocidade
depende de 5 fatores:

1. **Tier de PT** (fator principal): Multiplicador da tabela de tiers (×0.4 a ×3.0)
2. **Disciplina** (oculto): Multiplica eficiência do treino (Disciplina/10 como fator,
   ex: Disciplina 16 = ×1.6)
3. **Ambição** (oculto): Se Ambição < 8, crescimento desacelera quando idol atinge
   ~70% do PT ("se acomoda"). Se Ambição > 14, empurra até ~95% do PT
4. **Idade**: Multiplicador por faixa etária (ver curva abaixo)
5. **Experiência**: Trabalhar em jobs relacionados dá bônus ao atributo correspondente
   (fazer show ao vivo melhora Aura e Dança mais rápido que treino puro)

**Fontes de crescimento:**
- **Treino na agência**: Crescimento lento mas controlado (jogador escolhe foco)
- **Jobs realizados**: Crescimento médio nos atributos que o job exercita
- **Crescimento natural**: Atributos sobem lentamente só por estar ativa (simula
  experiência de vida)

#### 7. Curva de Idade

A idade afeta o multiplicador de crescimento e causa decaimento físico:

| Faixa Etária | Multiplicador Crescimento | Efeito Físico | Efeito Mental |
|---|---|---|---|
| 12-15 | ×1.5 (explosivo) | Resistência cresce rápido | Mentalidade baixa (imatura) |
| 16-19 | ×1.3 (acelerado) | Pico de desenvolvimento físico | Mentalidade crescendo |
| 20-23 | ×1.0 (base) | Estável | Estável |
| 24-27 | ×0.7 (desacelerando) | Resistência começa a cair ~1/mês | Mentalidade no pico |
| 28-31 | ×0.4 (lento) | Resistência e Visual caem ~2/mês | Comunicação e Variedade no pico |
| 32-35 | ×0.2 (quase parado) | Declínio acelerado físico | Experiência compensa parcialmente |
| 36+ | ×0.1 (veterana) | Declínio constante | Estável (sabedoria) |

**Decaimento por idade (atributos que caem após o pico):**
- **Resistência**: Começa a cair aos ~24. Principal limitador de carreira longa
- **Visual**: Cai lentamente após ~28 (padrão da indústria idol)
- **Dança**: Cai após ~30 (físico)
- **Aura**: Pode se manter ou até subir com experiência (veteranas carismáticas)
- **Mentalidade e Comunicação**: Não decaem — só melhoram com experiência
- **Leitura de Palco**: Cresce com experiência, não decai
- **Criatividade**: Estável, leve declínio após ~35
- **Aprendizado**: Cai lentamente após ~28 (mais difícil aprender coisas novas)
- **Trabalho em Equipe**: Estável / cresce com experiência
- **Foco**: Estável até ~32, depois leve declínio

Isso cria a tensão natural: idols jovens crescem rápido mas são frágeis
mentalmente e têm baixa Leitura de Palco. Veteranas são sólidas, inteligentes,
mas estão em declínio físico. O jogador precisa gerenciar o roster com mix
de gerações.

### States and Transitions

Uma idol passa por estados que afetam como seus atributos se comportam:

| Estado | Crescimento | Decaimento | Trigger de Entrada | Trigger de Saída |
|---|---|---|---|---|
| **Aspirante** | Nenhum (fora do jogo) | Nenhum | Existe no banco de dados | Contratada por qualquer agência |
| **Em Treino** | ×1.2 (bônus treino) | Normal por idade | Recém-contratada ou foco em treino | Alocada em job / completou treino |
| **Ativa** | Normal | Normal por idade | Tem jobs na agenda | Sem jobs por 4+ semanas |
| **Overwork** | ×0.5 (corpo não absorve) | ×2.0 acelerado | Stress > 80% | Stress < 50% |
| **Burnout** | Zero | ×1.5 | Stress = 100% | Após período de descanso forçado (ver duração abaixo) |
| **Em Crise** | Zero | ×1.5 em atributos mentais | Escândalo ativo ou trauma | Crise resolvida (tempo + gestão) |
| **Veterana** | ×0.3 (quase parado) | Acelerado físico | Idade > limiar por gênero | Debut (aposentadoria) |
| **Debutada** | Zero | Zero (stats congelam) | Aposentadoria por idade/decisão | Não volta (mas gera jobs como ex-idol) |

**Regras de transição:**
- Uma idol pode estar em múltiplos estados negativos (ex: Overwork + Em Crise)
- Estados negativos empilham efeitos (Overwork + Crise = crescimento zero, decaimento ×3.5)
- Forçar uma idol em burnout a trabalhar causa dano permanente aos atributos
  (perda que não se recupera)
- Debutada é estado terminal -- idol sai do roster ativo

**Duração do Burnout:**
- Calculada pela média dos 4 atributos de Resiliência (Resistência, Disciplina,
  Mentalidade, Adaptabilidade)
- Média 100 (máximo teórico) = 1 semana de recuperação
- Média 20 ou menos = 8 semanas de recuperação
- Escala linear entre os dois extremos:
  `semanas_burnout = 8 - (media_resiliencia / 100 × 7)` arredondado pra cima
- Exemplos: Resiliência média 60 = ~4 semanas. Média 80 = ~3 semanas. Média 40 = ~6 semanas.

### Interactions with Other Systems

Este sistema é a fundação — quase todos os outros o consultam.

| Sistema | Direção | O que flui |
|---|---|---|
| **Idol Database & Generator** | ← lê Stats | Gera valores iniciais dos 16+6 atributos, PT, traits, e perfil vocal usando seed |
| **show-system.md** | ← lê Stats + Traits | Cadeia de cálculo completa: Percepção→Decisão→Execução→Sustentação→Modulação |
| **music-entities.md** | ← match | Stats vs requisitos da música + vocal fit (perfil vocal) |
| **setlist-system.md** | ← mastery | Disciplina e Aprendizado afetam velocidade de mastery |
| **audience-system.md** | ← stats | Leitura de Palco e Carisma afetam interação com audiência |
| **Job Assignment** | ← lê Stats | Compara atributos da idol com requisitos do job |
| **Happiness & Wellness** | ↔ bidirecional | Resiliência afeta velocidade de stress. Felicidade baixa reduz crescimento. Burnout zera crescimento |
| **Fame & Rankings** | ← lê TA | TA é fator no cálculo do tier de ranking visível |
| **Contract System** | ← lê Stats + Tier | Idols de tier alto exigem melhores cláusulas. Stats afetam valor de mercado |
| **Schedule/Agenda** | ← lê Resistência | Resistência determina carga máxima antes de overwork |
| **Scouting** | ← lê Stats (parcial) | Scouts veem stats com margem de erro. Podem revelar 1-2 traits |
| **Week Simulation** | ← lê Stats | Usa atributos + ocultos + traits pra calcular resultado de cada job/show |
| **staff-functional.md** | ← coaches | Coaches afetam crescimento de atributos específicos |
| **Rival Agency AI** | ← lê Stats + Tier | IA avalia idols pelo tier e stats pra decidir contratar/competir |
| **Group Management** | ← lê Stats | Trabalho em Equipe + complementaridade calculam sinergia |
| **Event/Scandal Generator** | ← lê Ocultos + Traits | Temperamento, Vida Pessoal, Profissionalismo e traits alimentam probabilidade de eventos |
| **Visual Generator** | ← lê Seed | Usa a mesma seed pra gerar visual coerente com stats |
| **Music Charts** | ← lê Stats | Vocal + Criatividade determinam qualidade de composição |
| **Media Entities** | ← lê Stats | Stats relevantes determinam performance na mídia |
| **Idol Personal Finance** | → afeta Stats | Cirurgia estética pode dar Visual +5-15 permanente. Educação +Aprendizado. Dívida severa reduz Foco -5 temporário |

## Formulas

#### Talento Atual (TA)

```
TA = média ponderada dos 16 atributos visíveis
   = (soma de todos atributos) / 16
```

Nota: Pesos iguais por simplicidade. Se necessário, pesos por categoria
podem ser adicionados depois (ex: Performance vale mais que Resiliência
para cálculo de TA).

#### Teto Individual de Atributo

Cada atributo tem um teto máximo derivado do PT:

```
teto_atributo = PT + variação_seed
```

A seed gera uma "distribuição de talento" por atributo. Uma idol com PT 85 (rank A)
pode ter teto de Vocal = 95 mas teto de Dança = 60. O PT define o orçamento
total; a seed distribui desigualmente entre atributos.

#### Crescimento por Tick (semanal)

```
crescimento = base × mult_tier × mult_disciplina × mult_aprendizado × mult_idade × mult_estado × fonte

onde:
  base             = 0.5 pontos/semana (constante de calibração)
  mult_tier        = tabela de tiers (0.4 a 3.0)
  mult_disciplina  = Disciplina (visível) / 50  (range: 0.02 a 2.0)
  mult_aprendizado = Aprendizado / 80  (range: 0.01 a 1.25) — para novas habilidades
  mult_idade       = tabela de faixas etárias (0.1 a 1.5)
  mult_estado      = 1.0 (ativa), 1.2 (treino), 0.5 (overwork), 0.0 (burnout/crise)
  fonte            = 0.5 (natural), 1.0 (treino), 1.5 (job relacionado), 2.0 (show ao vivo)
```

**Nota**: Aprendizado afeta especialmente mastery de músicas novas (setlist-system.md)
e velocidade de adaptação a novos tipos de job. Disciplina afeta a consistência do
treino (frequência). Ambos contribuem mas medem coisas diferentes.

Se `atributo_atual >= teto_atributo`, crescimento = 0 (atingiu o limite).
Se `TA >= PT × (ambição_fator)`, crescimento desacelera:
- Ambição < 8: fator = 0.70 (para em 70% do PT)
- Ambição 8-14: fator = 0.85
- Ambição > 14: fator = 0.95

#### Decaimento por Idade (semanal)

```
decaimento = taxa_base × mult_atributo × mult_estado

onde:
  taxa_base = 0 (antes da idade de início de declínio)
  taxa_base = 0.25/semana (24-27), 0.5/semana (28-31), 1.0/semana (32-35), 1.5/semana (36+)
  mult_atributo = 1.0 (Resistência, Dança, Visual) ou 0.5 (Aprendizado, Foco, Criatividade) ou 0.0 (Mentalidade, Comunicação, Leitura de Palco, Trabalho em Equipe — não decaem)
  mult_estado = 1.0 (normal), 2.0 (overwork), 1.5 (burnout)
```

#### Burnout — Duração de Recuperação

```
media_resiliencia = (Resistência + Disciplina + Mentalidade + Adaptabilidade) / 4
semanas_burnout = ceil(8 - (media_resiliencia / 100 × 7))
```

Range: 1 semana (resiliência máxima) a 8 semanas (resiliência mínima).

## Edge Cases

- **Estimativa de tier pelo scout**: Scouts sempre dão um range (ex: "entre E e C")
  e o tier real está garantidamente dentro desse range. Scout melhor = range menor.
  Idols de tier S, SS e SSS são todas reportadas como **"S+"** -- o jogador sabe que
  é elite mas não sabe o quão elite. Descobrir que sua idol "S+" é na verdade SSS
  é um momento de revelação emergente
- **Atributo no teto + job que exige esse atributo**: Idol ainda performa bem
  (usa o valor atual), mas não ganha crescimento. Sem desperdício -- teto é bom
- **Todos atributos no teto (TA = PT)**: Idol totalmente desenvolvida. Crescimento
  para. Só decaimento por idade a partir daqui. Boa situação mas temporária
- **Idol rank F com Disciplina 20 (oculto)**: Cresce no máximo da velocidade F
  (×0.4) mas com bônus de disciplina (×2.0). Resultado: ×0.8 -- medíocre no
  melhor caso. Disciplina não salva talento baixo, mas faz o máximo possível
- **Idol rank SSS com Ambição 1**: Prodígio que se acomoda. Para de crescer em
  ~70% do PT. Mecanicamente frustrante pro jogador -- mas é o drama emergente.
  O jogador precisa descobrir isso pela observação (nunca é revelado diretamente)
- **Burnout + Crise simultâneos**: Efeitos empilham. Crescimento = 0 (burnout) +
  decaimento ×1.5 (crise) = idol perdendo stats sem poder trabalhar. Pior cenário
- **Idol com 12 anos e Resistência 90**: Mesmo com Resistência alta, o sistema de
  stress do Happiness & Wellness protege menores. Carga máxima é limitada por
  idade além de Resistência
- **Decaimento levaria atributo abaixo de 1**: Atributo nunca cai abaixo de 1.
  Piso mínimo absoluto
- **Dano permanente por trabalhar em burnout**: Redução fixa de -5 no atributo
  mais alto da idol por semana forçada. Irreversível. Penalidade severa pra
  desencorajar exploração
- **Idol com Visual 95 e idade 35**: Visual está decaindo ~2/mês. Em 1 ano cai
  pra ~71. A veterana pode compensar com Comunicação e Variedade (que não decaem)
  e migrar pra jobs de TV/rádio
- **Scout estima tier errado dentro do range**: Scout ruim vê idol rank B e reporta
  "entre D e A". O jogador investiga mais (outro scout, casting) ou arrisca.
  Scout bom reporta "entre A e B". Range menor = mais confiável

## Dependencies

**Hard dependencies (não funciona sem):** Nenhuma — este é o sistema fundacional.

**Soft:**
- **Producer Profile**: Estilo e traço afetam taxa de crescimento. Ver `producer-profile.md`.
- **staff-functional.md**: Coaches afetam velocidade de crescimento de atributos.

**Depended on by (sistemas que não funcionam sem este):**
Idol Database & Generator, show-system.md, music-entities.md, setlist-system.md,
audience-system.md, Job Assignment, Happiness & Wellness, Fame & Rankings,
Contract System, Schedule/Agenda, Week Simulation, Rival Agency AI, Scouting,
Group Management, Event/Scandal Generator, Visual Generator.

## Tuning Knobs

| Knob | Default | Range Seguro | Se muito alto | Se muito baixo |
|---|---|---|---|---|
| `BASE_GROWTH_PER_WEEK` | 0.5 | 0.2-1.5 | Idols chegam ao teto rápido demais | Progressão imperceptível |
| `TIER_MULTIPLIERS[F..SSS]` | 0.4-3.0 | 0.2-5.0 | SSS cresce absurdamente rápido | Diferença entre tiers irrelevante |
| `AGE_DECAY_START_FEMALE` | 24 | 20-28 | Carreiras muito curtas | Sem pressão de envelhecimento |
| `AGE_DECAY_START_MALE` | 30 | 26-36 | Idem | Idem |
| `BURNOUT_PERMANENT_DAMAGE` | -5/semana | -2 a -10 | Punição extrema, frustrante | Sem consequência real de forçar burnout |
| `SCOUT_RANGE_BY_SKILL` | ±2 tiers (ruim) a ±1 (bom) | ±1 a ±3 | Scouting inútil | Sem incerteza no scouting |
| `AMBITION_CEILING_FACTORS` | 0.70/0.85/0.95 | 0.5-1.0 | Todos idols atingem 100% do PT | Ambição baixa trava crescimento cedo demais |
| `ATTRIBUTE_MIN_FLOOR` | 1 | 1 | N/A | N/A |

## Acceptance Criteria

1. 16 atributos visíveis em 4 categorias (Performance, Presença, Resiliência, Inteligência)
2. 6 atributos ocultos incluindo Profissionalismo
3. Cada idol tem 2-4 traits definidos na seed, visíveis após 4 semanas
4. Perfil vocal híbrido (numérico + tessitura/textura/role) afeta match com músicas
5. Cadeias de cálculo (Percepção→Decisão→Execução→Sustentação→Modulação) implementadas
6. Uma idol rank SSS com condições ideais atinge 90% do PT em no máximo 2 anos
7. Atributos físicos decaem com idade; mentais/inteligência não decaem
8. Burnout dura 1-8 semanas. Trabalho em burnout causa perda permanente
9. Scouts reportam S/SS/SSS como "S+" sem distinção
10. Background narrativo coerente com stats e perfil vocal
11. Traits afetam comportamento em shows, jobs e carreira conforme documentado
12. TA nunca ultrapassa PT. Atributos nunca caem abaixo de 1
13. Nenhum atributo é combinação/média de outros atributos

## Open Questions

- **RESOLVIDO**: Pesos do TA são iguais pra todos 16 atributos
- **RESOLVIDO**: Rótulo de personalidade revelado pelo scout na contratação. Fixo pra sempre
- **RESOLVIDO (v2)**: Profissionalismo é agora atributo oculto separado de Disciplina.
  Disciplina = capacidade de manter rotina (visível). Profissionalismo = atitude em
  relação ao trabalho (oculto)
- **RESOLVIDO**: Background narrativo gerado por LLM individualmente. Multi-língua obrigatório
- **RESOLVIDO (v2)**: Expansão para 16 atributos (de 12) com adição de categoria
  Inteligência. Nenhum atributo é combinação de outros. "Adaptabilidade" decomposto em
  "Aprendizado" + "Leitura de Palco"
- **RESOLVIDO (v2)**: Traits adicionados como sistema (2-4 por idol, fixos na seed)
- **RESOLVIDO (v2)**: Perfil vocal híbrido (numérico + qualitativo) integrado com music-entities.md
