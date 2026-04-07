# Pre-Show Briefing System

> **Status**: Designed
> **Author**: user + game-designer
> **Last Updated**: 2026-04-06
> **Implements Pillar**: Pilar 2 — Suas Decisoes, Suas Consequencias, Pilar 4 — O Drama Nasce das Mecanicas
> **Related**: show-system.md (fluxo de show, performance formulas), happiness-wellness.md (stress, motivacao), idol-attribute-stats.md (ocultos: Temperamento, Profissionalismo, Ambicao), staff-functional.md (Stage Manager, Wellness Advisor)
> **Equivalent FM26**: Pre-Match Team Talk / Dressing Room
> **Wireframe**: [54-pre-show-briefing.md](../design/wireframes/54-pre-show-briefing.md)

## Overview

O Pre-Show Briefing e o equivalente direto do **Team Talk** do Football Manager 26.
Acontece **15 minutos antes do show**, depois que setlist, producao e escalacao
estao travadas — a unica coisa que o jogador ainda pode influenciar e o **estado
mental** das idols antes de subirem ao palco.

O produtor escolhe um **tom de discurso**, seleciona uma **frase especifica**, e
pode ter **conversas individuais** com ate 2 idols. Cada idol reage de forma
diferente baseada em seus atributos ocultos (Temperamento, Profissionalismo,
Ambicao). O resultado final e um **modificador de performance por idol** (0.85-1.15)
que alimenta diretamente o `show-system.md`.

**Principio**: O briefing e a ultima decisao antes do palco. Nao muda a setlist,
nao muda a producao — muda o **mental**. Uma fala errada pode destruir uma idol
nervosa. Uma fala certa pode transformar um grupo mediocre num grupo que performa
acima do esperado.

## Player Fantasy

A fantasia e de **lider de vestiario**. Voce olha pra cada idol, le a linguagem
corporal, sente a pressao do evento, e decide: "vou acalmar elas" ou "vou
cobrar resultado". A idol center esta confiante — otimo. Mas a main vocal esta
tremendo — voce puxa ela pro canto e diz "esquece a camera, foca na minha voz".

E quando da errado: voce escolheu tom agressivo achando que ia motivar, mas a
idol com Temperamento 4 explodiu, ficou revoltada, e entrou no palco com -15%
de performance. A culpa e sua. Voce viu os sinais (ou deveria ter visto) e
escolheu ignorar.

Serve o **Pilar 2 (Consequencias)**: o jogo mostra reacoes em tempo real. Se
voce insiste numa fala ruim, ve a idol reagir mal na sua frente. E o **Pilar 4
(Drama)**: a tensao entre o que voce quer dizer e o que cada idol precisa ouvir
gera momentos dramaticos emergentes.

## Detailed Design

### 1. Timing e Contexto

O briefing acontece **apos** todas as decisoes de producao estarem travadas:

```
PRE-SHOW (decisoes do jogador)
  1. Escalar idols            ← travado
  2. Montar setlist            ← travado
  3. Definir producao          ← travado
  4. Atribuir papeis           ← travado
  5. Confirmar show            ← travado

  >>> BRIEFING (15 min antes do palco) <<<
  6. Escolher tom de discurso
  7. Selecionar frase
  8. Side talks (0-2 idols)
  9. Confirmar ("Mandar pro Palco")

SIMULACAO DO SHOW
  10. Aplicar performance_modifier por idol
  11. Processar setlist musica por musica (show-system.md)
```

O briefing so e acessivel **uma vez** por show. Nao ha como voltar e refazer.
Decisao tomada, consequencia aplicada.

### 2. Nivel de Pressao (Pressure Level)

Antes do jogador falar, o sistema calcula o **nivel de pressao base** do evento.
Isso afeta o estado inicial das idols e define o contexto do briefing.

```
pressure_base = venue_pressure + stakes_pressure + context_pressure

venue_pressure:
  Cafe/bar (< 200):       5
  Casa de show (200-999):  10
  Hall (1000-4999):        20
  Arena (5000-14999):      35
  Stadium (15000+):        50
  TV Live:                 40
  Award Show:              45

stakes_pressure:
  Show normal:             0
  Rival agency watching:   +10
  Award ceremony:          +15
  Debut show:              +10
  Comeback show:           +10
  Season finale:           +15
  Nacional TV broadcast:   +20

context_pressure:
  Sequencia de fracassos (3+ shows ruins): +15
  Sequencia de sucessos (3+ shows bons):   -5
  Idol em crise (wellness):                +10 (por idol)
  Sold out:                                +5
  Venue vazio (<30% ocupacao):             +10
```

**Pressure Level** (exibido na UI como estrelas):

| Pressure | Range | Estrelas | Efeito base |
|---|---|---|---|
| **Baixa** | 0-20 | 1-2 | Idols relaxadas. Facil acertar o tom |
| **Media** | 21-40 | 3 | Normal. Decisoes importam |
| **Alta** | 41-60 | 4 | Idols nervosas. Tom errado penaliza mais |
| **Muito Alta** | 61-80 | 5 | Critico. Side talks quase obrigatorios |
| **Extrema** | 81+ | 5 (vermelho) | Qualquer erro e amplificado. Mestre ou desastre |

### 3. Tom de Discurso (Tone Selection)

O jogador escolhe **1 tom** que define a abordagem geral do discurso. O tom
filtra as frases disponiveis e aplica um efeito base ao grupo inteiro.

| Tom | Descricao | Efeito Base (grupo) | Melhor quando |
|---|---|---|---|
| **Encorajador** | "Voces sao incriveis, vamos arrasar" | Motivacao +3, Stress -5 | Pressure alta, grupo nervoso |
| **Neutro** | "Facam o que sabem fazer" | Motivacao +1, Stress -1 | Grupo equilibrado, sem extremos |
| **Competitivo** | "Mostrem que somos os melhores" | Motivacao +5, Stress +3 | Grupo confiante, rival assistindo |
| **Agressivo** | "Nao aceito menos que perfeicao" | Motivacao +7, Stress +8 | Grupo desmotivado com Profissionalismo alto |
| **Calmo** | "Respirem. Aproveitem o momento" | Motivacao -1, Stress -8 | Pressure extrema, idols em panico |

**Nota**: O efeito base e aplicado a **todas** as idols. Reacoes individuais
(secao 5) modificam esse efeito por idol.

### 4. Frases de Team Talk

Cada tom tem **4 frases** disponiveis. O jogador escolhe **1 frase** que
refina o efeito do tom. Frases marcadas com [Staff] so aparecem se o
Stage Manager ou Wellness Advisor estiver presente.

#### Tom: Encorajador

| Frase | Efeito adicional | Nota |
|---|---|---|
| "Hoje e o dia de voces. Brilhem!" | Motivacao +5, Stress -3 | Generico, seguro |
| "O publico veio pra ver VOCES. Nao os desapontem." | Motivacao +4, Stress +2 | Leve pressao embutida |
| "Lembrem do quanto treinaram. Confio em cada uma." | Motivacao +3, Stress -5 | Melhor para idols inseguras |
| [Staff] "A equipe tecnica esta pronta. Voces so precisam se divertir." | Motivacao +4, Stress -6 | Requer Stage Manager |

#### Tom: Neutro

| Frase | Efeito adicional | Nota |
|---|---|---|
| "Facam o trabalho de voces. Simples assim." | Motivacao +2, Stress -1 | Profissional |
| "Conhecemos a setlist. Executem como ensaiaram." | Motivacao +1, Stress -2 | Foco em processo |
| "Sem surpresas. Cada uma sabe seu papel." | Motivacao +1, Stress -3 | Reduz ansiedade |
| [Staff] "Os numeros mostram que estamos prontos. Confiem nos dados." | Motivacao +3, Stress -4 | Requer Wellness Advisor |

#### Tom: Competitivo

| Frase | Efeito adicional | Nota |
|---|---|---|
| "A Oricon ta de olho. Mostrem quem manda." | Motivacao +6, Stress +4 | Alta recompensa, alto risco |
| "A rival falhou ontem. Hoje e nossa chance." | Motivacao +7, Stress +3 | Melhor se rival realmente falhou |
| "Voces querem o topo? Entao provem agora." | Motivacao +5, Stress +5 | Polarizador: ambiciosas amam, timidas odeiam |
| [Staff] "O palco esta perfeito. Agora so falta voces serem melhores que todas." | Motivacao +6, Stress +2 | Requer Stage Manager. Melhor custo-beneficio |

#### Tom: Agressivo

| Frase | Efeito adicional | Nota |
|---|---|---|
| "Nao aceito erros hoje. Zero." | Motivacao +4, Stress +10 | Extremo. Profissionais respondem bem |
| "Se alguem nao ta pronta, sai agora." | Motivacao +3, Stress +12 | Pode causar reacao negativa violenta |
| "O ultimo show foi vergonhoso. Hoje voces compensam." | Motivacao +6, Stress +8 | Melhor apos fracasso real |
| [Staff] "A producao e impecavel. Se o show falhar, a culpa e de voces." | Motivacao +5, Stress +7 | Requer Stage Manager. Pressao direcionada |

#### Tom: Calmo

| Frase | Efeito adicional | Nota |
|---|---|---|
| "Respirem fundo. O palco e de voces." | Motivacao +0, Stress -10 | Maximo alivio de stress |
| "Nao importa o resultado. Divirtam-se la em cima." | Motivacao -2, Stress -12 | Sacrifica motivacao por calma |
| "Voces ja venceram por estarem aqui." | Motivacao +1, Stress -8 | Equilibrado |
| [Staff] "A equipe de wellness diz que voces estao prontas. Confiem no corpo de voces." | Motivacao +2, Stress -10 | Requer Wellness Advisor. Melhor calmo |

### 5. Reacoes Individuais (Individual Reactions)

Cada idol reage ao tom + frase baseada em seus **atributos ocultos**.
A reacao modifica o efeito base para aquela idol especifica.

#### Calculo de reaction_score

```
reaction_score(idol, tom, frase) =
  base_effect(tom, frase)        // motivacao e stress do tom + frase
  × reaction_modifier(idol, tom) // personalidade da idol modifica o efeito
  + noise                         // variancia pequena (-1 a +1)

reaction_modifier(idol, tom):
  // Cada combinacao oculto × tom produz um multiplicador

  SE Profissionalismo > 14:
    modifier = 1.1 para QUALQUER tom
    // Profissionais respondem bem a tudo. Multiplicador universal

  SE Temperamento > 14 E tom in [Agressivo, Competitivo]:
    modifier × 0.6
    // Alto temperamento RESISTE a pressao externa. Reage mal a cobranca
    // "Nao preciso que gritem comigo"

  SE Temperamento < 6 E tom in [Agressivo, Competitivo]:
    modifier × random(0.5, 1.5)
    // Volatil. Pode explodir positivamente OU negativamente
    // Imprevisivel — o jogador esta apostando

  SE Temperamento < 6 E tom in [Encorajador, Calmo]:
    modifier × 1.2
    // Temperamento baixo responde melhor a tons suaves

  SE Ambicao > 14 E tom == Competitivo:
    modifier × 1.4
    // Ambiciosas AMAM competicao. "Sim, vamos destruir"

  SE Ambicao > 14 E tom == Calmo:
    modifier × 0.7
    // Ambiciosas acham calmaria = falta de ambicao
    // "Por que nao estamos cobrando mais?"

  SE Ambicao < 6 E tom == Competitivo:
    modifier × 0.6
    // Sem ambicao, competicao e estressante, nao motivante

  SE Ambicao < 6 E tom == Calmo:
    modifier × 1.3
    // Idols de baixa ambicao preferem tranquilidade

  // Combinar multiplicadores (multiplicativo, nao aditivo)
  // Modifier final: clamp(0.3, 2.0)
```

#### Tabela Resumo de Reacoes

| Oculto | Valor | Encorajador | Neutro | Competitivo | Agressivo | Calmo |
|---|---|---|---|---|---|---|
| **Temperamento** | >14 | Normal | Normal | Resiste (x0.6) | Resiste (x0.6) | Normal |
| **Temperamento** | <6 | Bom (x1.2) | Normal | Volatil (x0.5-1.5) | Volatil (x0.5-1.5) | Bom (x1.2) |
| **Profissionalismo** | >14 | Bom (x1.1) | Bom (x1.1) | Bom (x1.1) | Bom (x1.1) | Bom (x1.1) |
| **Ambicao** | >14 | Normal | Normal | Ama (x1.4) | Normal | Resiste (x0.7) |
| **Ambicao** | <6 | Normal | Normal | Resiste (x0.6) | Normal | Bom (x1.3) |

**Nota**: Modificadores empilham multiplicativamente. Uma idol com Temperamento 4
+ Ambicao 18 + tom Competitivo: `random(0.5, 1.5) × 1.4` = range de 0.7 a 2.1
(clampado em 2.0). Alta variancia, alta recompensa potencial.

#### Feedback Visual (Body Language)

A UI mostra a reacao de cada idol em tempo real ao selecionar tom/frase:

| Cor | Reacao | reaction_modifier range |
|---|---|---|
| **Verde** | Positiva ("Parece revigorada", "Sorriu confiante") | >= 1.0 |
| **Amarelo** | Neutra/Mista ("Expressao nao mudou", "Achou a cobranca pesada") | 0.7 - 0.99 |
| **Vermelho** | Negativa ("Ficou irritada", "Maos tremendo mais") | < 0.7 |

**Se Stage Manager ou Wellness Advisor presente**: UI mostra o reaction_modifier
numerico estimado (com margem de erro de +-0.1). Sem staff, so cores.

### 6. Side Talks (Conversas Individuais)

Apos o discurso geral, o jogador pode ter **conversas 1-a-1** com ate
**2 idols**. Side talks sao intervencoes direcionadas para idols que
reagiram mal ou estao em estado mental critico.

#### Opcoes de Side Talk

| Opcao | Efeito | Melhor para |
|---|---|---|
| **Motivar** | Motivacao +8, Stress +3 | Idol desmotivada (Motivacao < 50) |
| **Acalmar** | Stress -10, Motivacao -2 | Idol nervosa (Stress > 60) |
| **Focar** | Consistencia temporaria +0.1 no show | Idol com Consistencia baixa ou distraida |
| **Alertar** | Profissionalismo temporario +3 no show, Stress +5 | Idol com Profissionalismo baixo que pode desleixar |

#### Reacoes de Side Talk

Side talks tambem sofrem influencia dos ocultos:

```
side_talk_effect(idol, opcao) =
  efeito_base(opcao)
  × side_modifier(idol, opcao)

side_modifier:
  Motivar + Ambicao > 14: × 1.3 ("Sim, eu vou arrasar!")
  Motivar + Ambicao < 6:  × 0.8 ("Tudo bem, tanto faz...")
  Acalmar + Temperamento < 6: × 1.4 (precisa muito, responde bem)
  Acalmar + Temperamento > 14: × 0.9 ("Eu estou bem, para de se preocupar")
  Focar + Profissionalismo > 14: × 1.2 (ja e focada, reforco funciona)
  Focar + Profissionalismo < 6: × 0.7 (dificil fazer focar quem nao liga)
  Alertar + Profissionalismo > 14: × 1.3 (responde a cobranca profissional)
  Alertar + Temperamento < 6: × random(0.5, 1.3) (pode explodir)
```

**Limite de 2 side talks**: Tempo e escasso (15 minutos). Escolher QUEM recebe
atencao individual e parte da decisao tatica.

### 7. Performance Modifier (Saida Final)

O resultado de todo o briefing e um **modificador de performance por idol**
aplicado ao `show-system.md`.

```
performance_modifier(idol) =
  clamp(0.85, 1.15,
    1.0
    + motivation_delta(idol) × MOTIVATION_TO_PERF_FACTOR
    + stress_delta(idol) × STRESS_TO_PERF_FACTOR
    + side_talk_bonus(idol)
    + pressure_reduction_bonus
  )

MOTIVATION_TO_PERF_FACTOR = 0.005
  // Cada ponto de motivacao ganho = +0.5% performance
  // Ex: motivacao +10 = +5% performance

STRESS_TO_PERF_FACTOR = -0.004
  // Cada ponto de stress ganho = -0.4% performance
  // Ex: stress +10 = -4% performance

side_talk_bonus:
  Se idol recebeu side talk positivo (verde): +0.02
  Se idol recebeu side talk negativo (vermelho): -0.02
  Se nao recebeu side talk: 0

pressure_reduction_bonus:
  Se pressure_base > 60 E tom in [Calmo, Encorajador]:
    +0.01 × (stress_reduzido / 10)  // Maximo ~+0.03
  Se pressure_base > 60 E tom in [Agressivo, Competitivo]:
    -0.01 × (stress_ganho / 10)     // Penalidade adicional sob pressao
  Se pressure_base <= 60:
    0  // Pressao normal, sem bonus/penalidade extra
```

**Range final**: 0.85 a 1.15 (hard clamp).

- 0.85 = briefing desastroso. Idol entra no palco irritada/nervosa/desmotivada
- 1.00 = neutro (nenhum efeito, como se nao houvesse briefing)
- 1.15 = briefing perfeito. Idol entra no palco no melhor estado possivel

Este modificador alimenta diretamente a formula `performance_modificada` do
`show-system.md` como um multiplicador adicional na Camada 2.

### 8. Influencia de Staff (Staff Influence)

A presenca de NPCs especificos melhora a experiencia do briefing:

#### Stage Manager

| Condicao | Beneficio |
|---|---|
| SM presente | Desbloqueia frases [Staff] nos tons Encorajador, Competitivo e Agressivo |
| SM skill > 10 | Predicao de reacao individual com precisao +-0.1 (UI mostra numero) |
| SM skill > 15 | Predicao com precisao +-0.05. Sugere tom ideal para o grupo |
| SM ausente | Frases [Staff] indisponiveis. Sem predicao numerica (so cores) |

#### Wellness Advisor

| Condicao | Beneficio |
|---|---|
| WA presente | Desbloqueia frases [Staff] nos tons Neutro e Calmo |
| WA skill > 10 | Side talks de "Acalmar" tem efeito ×1.3 |
| WA skill > 15 | 1 side talk extra (3 no total em vez de 2) |
| WA ausente | Frases [Staff] de Neutro/Calmo indisponiveis. Side talks limitados a 2 |

#### Combinacao SM + WA

Se ambos presentes:
- Todas frases [Staff] disponiveis
- Predicao numerica + side talk extra
- **Sugestao automatica**: O sistema sugere o tom ideal e quais idols precisam
  de side talk (jogador pode ignorar)

### States and Transitions

| Estado | Descricao | Transicao |
|---|---|---|
| **Aguardando** | Show confirmado, briefing disponivel | → Briefing Ativo (jogador abre a tela) |
| **Briefing Ativo** | Jogador escolhendo tom, frase, side talks | → Confirmado ("Mandar pro Palco") |
| **Confirmado** | Modificadores calculados, aplicados | → Show Em Execucao (show-system.md) |
| **Pulado** | Jogador nao fez briefing (confirmou show direto) | → Show Em Execucao (modifier = 1.0 para todas) |

**Nota**: Se o jogador pula o briefing, todas as idols recebem modifier 1.0
(neutro). Nao ha penalidade por pular — mas tambem nao ha bonus. O briefing e
**oportunidade**, nao obrigacao.

### Interactions with Other Systems

| Sistema | Direcao | O que flui |
|---|---|---|
| **show-system.md** | → modifier | performance_modifier por idol alimenta Camada 2 |
| **happiness-wellness.md** | ← estado | Stress e Motivacao atuais definem estado inicial. Briefing modifica temporariamente |
| **idol-attribute-stats.md** | ← ocultos | Temperamento, Profissionalismo, Ambicao determinam reacoes |
| **staff-functional.md** | ← staff | Stage Manager e Wellness Advisor desbloqueiam frases e predicao |
| **audience-system.md** | ← contexto | Venue size + tipo de evento definem pressure_base |
| **fame-rankings.md** | ← contexto | Sequencia de resultados recentes afeta context_pressure |
| **news-feed.md** | → moments | Briefing dramatico (muito bom ou muito ruim) gera headline |

## Formulas

### Pressure Base

```
pressure_base = venue_pressure + stakes_pressure + context_pressure
// Clamp: 0-100
// Ver tabelas na secao 2 para valores
```

### Reaction Score

```
reaction_score(idol, tom, frase) =
  base_motivation_delta = tom_motivation + frase_motivation
  base_stress_delta = tom_stress + frase_stress

  modifier = reaction_modifier(idol, tom)  // Ver secao 5

  final_motivation_delta = base_motivation_delta × modifier
  final_stress_delta = base_stress_delta × modifier
  // Nota: stress positivo (ganho) tambem e multiplicado pelo modifier
  // Modifier alto em tom agressivo = MAIS stress, nao menos
```

### Performance Modifier

```
performance_modifier(idol) =
  clamp(0.85, 1.15,
    1.0
    + final_motivation_delta × 0.005
    + final_stress_delta × (-0.004)
    + side_talk_bonus
    + pressure_reduction_bonus
  )
```

### Pressure Reduction

```
pressure_reduction =
  SE tom in [Calmo, Encorajador]:
    abs(final_stress_delta) × 0.3  // % de reducao da pressao percebida
  SE tom in [Competitivo, Agressivo]:
    0  // Nao reduz pressao
  SE tom == Neutro:
    abs(final_stress_delta) × 0.1  // Reducao minima
```

## Edge Cases

- **Show solo (1 idol)**: Briefing vira conversa 1-a-1. Tom + frase aplicados
  diretamente. Side talk automaticamente disponivel (nao conta no limite de 2)
- **Todas idols com Profissionalismo > 14**: Qualquer tom funciona bem. Briefing
  e "facil" — mas raro ter grupo inteiro profissional
- **Idol em Burnout escalada (grupo)**: Nao deveria acontecer (happiness-wellness.md
  bloqueia), mas se acontecer: modifier fixo em 0.85, ignora briefing
- **Idol com Temperamento 1 + Ambicao 1 + tom Agressivo**: Pior cenario.
  Modifier pode chegar a 0.3 (clampado). Idol entra destruida no palco
- **Briefing perfeito + producao pessima**: Modifier 1.15 mas producao 0.4.
  O efeito e multiplicativo no show-system — briefing bom nao salva producao ruim
- **Jogador muda tom repetidamente na UI**: Reacoes atualizam em tempo real
  (preview). So a selecao final ao clicar "Mandar pro Palco" conta
- **TV Live com 1 musica + briefing perfeito**: Modifier 1.15 aplicado a unica
  musica. Impacto maximo — mostra que briefing importa mais em shows curtos
- **Side talk em idol que ja reagiu verde**: Permitido mas desperdicado. Efeito
  marginal (ja esta no topo). Melhor usar em quem reagiu vermelho/amarelo

## Dependencies

**Hard:**
- show-system.md — consome o performance_modifier na Camada 2
- idol-attribute-stats.md — ocultos (Temperamento, Profissionalismo, Ambicao) determinam reacoes
- happiness-wellness.md — Stress e Motivacao atuais sao input

**Soft:**
- staff-functional.md — Stage Manager e Wellness Advisor desbloqueiam opcoes
- audience-system.md — venue/tipo definem pressure_base
- fame-rankings.md — contexto de resultados recentes

**Depended on by:**
- show-system.md (modifier alimenta performance de cada idol)
- news-feed.md (briefings dramaticos geram headlines)

## Tuning Knobs

| Knob | Default | Range | Se muito alto | Se muito baixo |
|---|---|---|---|---|
| `PERF_MODIFIER_MIN` | 0.85 | 0.70-0.95 | Briefing ruim quase nao penaliza | Briefing ruim destroi performance |
| `PERF_MODIFIER_MAX` | 1.15 | 1.05-1.30 | Briefing bom da boost enorme | Briefing bom quase nao ajuda |
| `MOTIVATION_TO_PERF_FACTOR` | 0.005 | 0.002-0.01 | Motivacao domina o modifier | Motivacao irrelevante |
| `STRESS_TO_PERF_FACTOR` | -0.004 | -0.008 a -0.001 | Stress arruina performance | Stress sem consequencia |
| `SIDE_TALK_LIMIT` | 2 | 1-3 | Jogador controla todas idols | Sem intervencao individual |
| `VOLATILITY_RANGE_LOW_TEMP` | [0.5, 1.5] | [0.3, 1.8] a [0.8, 1.2] | Temperamento baixo e bomba nuclear | Temperamento baixo pouco volatil |
| `PROFESSIONALISM_UNIVERSAL_MULT` | 1.1 | 1.0-1.3 | Profissionais reagem muito melhor | Profissionalismo irrelevante no briefing |
| `AMBITION_COMPETITIVE_MULT` | 1.4 | 1.1-1.8 | Ambiciosas adoram competicao demais | Ambicao nao importa no briefing |
| `STAFF_PREDICTION_ERROR` | +-0.1 | +-0.05 a +-0.2 | Predicao quase perfeita | Predicao inutil |
| `PRESSURE_BASE_WEIGHTS` | Ver tabela | +-30% | Pressao sempre alta | Pressao irrelevante |

## Acceptance Criteria

1. Briefing acontece apos setlist/producao travados e antes da simulacao do show
2. 5 tons de discurso (Encorajador, Neutro, Competitivo, Agressivo, Calmo) com efeitos base distintos
3. 4 frases por tom (3 base + 1 [Staff]) com efeitos especificos
4. Frases [Staff] so aparecem com Stage Manager ou Wellness Advisor presente
5. Cada idol reage individualmente baseada em Temperamento, Profissionalismo e Ambicao (ocultos)
6. Temperamento alto (>14) resiste a tons agressivos/competitivos (modifier x0.6)
7. Temperamento baixo (<6) tem reacoes volateis a tons pressao (random range)
8. Profissionalismo alto (>14) responde bem a qualquer tom (modifier x1.1)
9. Ambicao alta (>14) responde melhor a competitivo (modifier x1.4)
10. Side talks permitem conversa 1-a-1 com ate 2 idols (4 opcoes: motivar, acalmar, focar, alertar)
11. Pressure level calculado por venue + stakes + contexto, exibido como estrelas
12. Performance modifier por idol (0.85-1.15) aplicado como multiplicador na Camada 2 do show-system
13. Stage Manager desbloqueia frases e predicao numerica de reacoes
14. Wellness Advisor desbloqueia frases calmas e side talk extra (skill > 15)
15. Feedback visual em tempo real (cores verde/amarelo/vermelho) para cada idol ao selecionar tom/frase
16. Pular briefing resulta em modifier 1.0 (neutro) para todas idols — sem penalidade, sem bonus

## Open Questions

- Nenhuma pendente
