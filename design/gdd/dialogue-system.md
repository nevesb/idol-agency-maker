# Dialogue System (Conversas com Idols)

> **Status**: Designed
> **Author**: user + game-designer
> **Last Updated**: 2026-04-06
> **Implements Pillar**: Pilar 2 — Suas Decisões, Suas Consequências, Pilar 4 — Drama Nasce das Mecânicas
> **Related**: happiness-wellness.md (barras de wellness), player-reputation-affinity.md (afinidade, memórias), idol-attribute-stats.md (ocultos), contract-system.md (renovação/negociação), staff-functional.md (Wellness Advisor, PR Manager)
> **Wireframes**: 68-conversation-modal.md (modal de conversa), 72-interaction-history.md (histórico de interações)

## Overview

O Dialogue System permite ao jogador (produtor) conversar diretamente com idols
para influenciar seu estado emocional, resolver conflitos, negociar contratos e
construir relacionamento. Cada conversa tem um **tipo**, um **tom** escolhido
pelo jogador e produz **deltas** em afinidade, wellness e potencialmente dispara
**promessas** que entram no histórico de interação. O sistema recompensa
produtores que conhecem suas idols (atributos ocultos, estado atual) e pune
abordagens genéricas ou agressivas sem contexto.

## Player Fantasy

A fantasia é de **líder carismático e gestor de pessoas**. Você entra na sala
sabendo que Aiko está furiosa porque não foi escalada como Center. Você vê o
Temperamento dela (se já descobriu), sabe que a Motivação está baixa, e precisa
escolher: elogiar o esforço dela (Calmo) ou ser direto e explicar a decisão
(Assertivo)? Errar o tom pode custar a relação de meses. Serve o **Pilar 2**:
a conversa é uma decisão com consequência real e imediata. Serve o **Pilar 4**:
a combinação de tom errado + personalidade volátil gera drama emergente.

## Detailed Design

### Core Rules

#### 1. Tipos de Conversa

| Tipo | Propósito | Quando disponível | Efeito primário |
|---|---|---|---|
| **Motivacional** | Levantar moral de idol desanimada | Motivação < 40 ou Felicidade < 50 | wellness_delta (motivação, felicidade) |
| **Disciplinar** | Corrigir comportamento problemático | Após escândalo, atraso, quebra de regra | wellness_delta (stress), affinity_delta |
| **Elogio** | Reconhecer conquista ou esforço | Após job bem-sucedido, ranking subiu, treino exemplar | affinity_delta, wellness_delta (motivação) |
| **Negociação** | Conversa ligada a contrato | Contrato expirando em 8 semanas, pedido de renegociação | affinity_delta, pode disparar Promise |
| **Social** | Construir relacionamento pessoal | Sempre disponível (respeitando cooldown) | affinity_delta |
| **Confronto** | Resolver conflito entre idols ou com produtor | Conflito ativo entre idols, idol confrontou produtor | affinity_delta, wellness_delta, pode resolver ou escalar conflito |

#### 2. Seleção de Tom

O jogador escolhe um dos 5 tons antes de confirmar a resposta. O tom modifica
a probabilidade de sucesso e a magnitude dos outcomes.

| Tom | Descrição | Modificador de sucesso | Risco |
|---|---|---|---|
| **Encorajador** | Entusiasta, motivador, celebratório | Alto em contexto de conquista ou moral baixa | Baixo — raramente causa reação negativa |
| **Neutro** | Informativo, objetivo, sem carga emocional | Seguro em qualquer contexto | Nenhum — previsível, sem surpresas |
| **Competitivo** | Desafiador, ambicioso, orientado a resultado | +15% se idol tem Ambição alta | Médio — pode intimidar idols com Temperamento baixo |
| **Agressivo** | Duro, confrontacional, pressão | +25% se idol respeita autoridade | Alto — falha causa dano severo em afinidade e stress |
| **Calmo** | Mentor, empático, paciente | +0% base (seguro, suavizante) | Muito baixo — raramente causa reação negativa |

**Regra de ouro**: Neutro/Calmo nunca são desastrosos mas nunca são espetaculares.
Encorajador e Competitivo recompensam quem conhece a idol. Agressivo é aposta
alta — prêmio grande ou desastre.

#### 3. Topic Triggers (Quando Conversas Ficam Disponíveis)

Conversas não são arbitrárias. O jogo gera oportunidades de conversa baseadas
em eventos e estados:

| Trigger | Tipo de conversa gerado | Condição |
|---|---|---|
| **Idol infeliz 2+ semanas** | Motivacional | Felicidade < 50 por 2 semanas consecutivas |
| **Contrato expirando** | Negociação | Contrato vence em ≤ 8 semanas |
| **Escândalo recente** | Disciplinar | Idol envolvida em escândalo nos últimos 7 dias |
| **Performance pós-show** | Elogio ou Disciplinar | Após show: Elogio se performance ≥ 80%, Disciplinar se < 40% |
| **Conflito entre idols** | Confronto | Dois idols com conflito ativo (detectado pelo Group Management) |
| **Ranking subiu significativamente** | Elogio | Idol subiu 10+ posições no ranking em 1 mês |
| **Motivação crítica** | Motivacional | Motivação < 20 |
| **Idol confronta produtor** | Confronto | Idol com Felicidade < 30 e Temperamento > 12 inicia confronto (evento automático) |
| **Pedido de renegociação** | Negociação | Idol com Ambição > 14 e ranking subiu: exige melhores termos |

**Conversas ativas** aparecem como notificação no portal e no perfil da idol.
O jogador pode ignorar — mas ignorar uma conversa pendente por 2+ semanas
causa affinity -3 ("idol sente que produtor não se importa").

#### 4. Response Mechanics (Como a Idol Reage)

A resposta da idol é determinística, baseada em 4 fatores combinados:

```
reaction_score = base_score
               + temperamento_modifier
               + lealdade_modifier
               + wellness_modifier
               + affinity_modifier

base_score = TONE_BASE[tom] + TYPE_MATCH[tipo][contexto]
```

**Fatores de modificação:**

| Fator | Como afeta reaction_score |
|---|---|
| **Temperamento** (oculto, 1-20) | Alto (>14): tolera Competitivo/Agressivo (+10). Baixo (<8): penaliza tons duros (-15) |
| **Lealdade** (oculto, 1-20) | Alta (>12): benefício da dúvida (+5). Demais: neutro (0) |
| **Profissionalismo** (oculto, 1-20) | Alto (>14): aceita instrução e feedback com maturidade (+8). Demais: neutro (0) |
| **Wellness atual** | Felicidade < 30: irritável e fechada (-10). Demais: neutro (0) |
| **Afinidade com produtor** | Contínua: (afinidade_normalizada - 0.5) × 20. Range: -10 a +10 |
| **Relevância do tópico** | Conversa alinhada com o que a idol precisa: +10. Fora de contexto: -5 |

**Threshold de sucesso:**

```
reaction_score >= 60: Sucesso — outcome positivo (affinity sobe, wellness melhora)
reaction_score 40-59: Parcial — outcome neutro (pouco efeito, idol "ouviu mas não convenceu")
reaction_score < 40:  Falha — outcome negativo (affinity desce, wellness piora)
reaction_score < 20:  Desastre — outcome severo (affinity cai muito, pode gerar evento de crise)
```

#### 5. Outcome Deltas

Cada conversa produz 3 tipos de resultado:

**affinity_delta** (range: -15 a +10):

```
Sucesso:     +5 a +10 (proporcional a reaction_score - 60)
Parcial:     -2 a +2
Falha:       -5 a -10
Desastre:    -10 a -15
```

**wellness_delta** (aplicado às barras relevantes):

| Tipo de conversa | Sucesso | Parcial | Falha | Desastre |
|---|---|---|---|---|
| Motivacional | motivação +10, felicidade +5 | motivação +3 | motivação -3, stress +5 | stress +10, felicidade -5 |
| Disciplinar | stress -5, motivação +3 | stress +3 | stress +8, felicidade -5 | stress +15, felicidade -10 |
| Elogio | motivação +8, felicidade +5 | motivação +2 | felicidade -2 (idol sente falsidade) | felicidade -8, afinidade -5 extra |
| Negociação | felicidade +5 | nenhum | felicidade -5, stress +5 | felicidade -10, idol pode recusar renovação |
| Social | felicidade +5, stress -3 | felicidade +2 | nenhum | felicidade -3 |
| Confronto | stress -10, motivação +5 | stress -3 | stress +10, motivação -5 | stress +15, conflito escala |

**Promise trigger** (opcional):

Conversas de tipo Negociação e Motivacional podem gerar promessas:

```
Promise {
  id:           uint32
  idol_id:      uint32
  type:         "center_position" | "salary_raise" | "rest_days" | "solo_project" | "training_focus"
  deadline:     semana  // prazo pra cumprir (4-12 semanas)
  created_at:   semana
  fulfilled:    bool
  broken:       bool    // true se deadline passou sem cumprir
}
```

Promessa quebrada: affinity -10, gera memória negativa. Promessa cumprida:
affinity +8, gera memória positiva.

#### 6. Cooldown

```
MAX_CONVERSATIONS_PER_WEEK = 2  // por idol
DIMINISHING_RETURNS_FACTOR = 0.5  // 2ª conversa na mesma semana tem 50% do efeito

Se jogador tenta 3ª conversa: bloqueado ("Idol não quer mais conversar esta semana")
```

**Exceção**: Confronto iniciado pela idol ignora cooldown (ela veio até você,
não o contrário).

**Impacto de excesso**: Se o jogador conversa 2×/semana com a mesma idol por
3+ semanas consecutivas, a idol fica "saturada":

```
SATURATION_DECAY halving: cada semana consecutiva de saturação reduz o
multiplicador à metade do valor anterior.
  semana 1 de saturação: deltas positivos × 0.5
  semana 2 de saturação: deltas positivos × 0.25
  semana 3+: deltas positivos × 0.125 (e assim por diante)
Após 1 semana sem conversa, saturação reseta ao multiplicador 1.0.
```

#### 7. Risk System

Combinações perigosas de tom + contexto + personalidade:

| Combinação | Efeito |
|---|---|
| **Agressivo + Temperamento < 8** | affinity -15, stress +10. Idol pode chorar/sair da sala (evento visual) |
| **Agressivo + Felicidade < 30** | affinity -10, stress +15. Risco de idol exigir rescisão |
| **Competitivo + Temperamento < 8** | Idol se sente pressionada além do limite. affinity -8, stress +5 |
| **Elogio + Performance ruim recente** | Idol percebe falsidade. affinity -5, motivação -3 |
| **Motivacional + Motivação > 70** | Sem efeito — idol já está motivada. Desperdiça slot de conversa |
| **Confronto + Calmo + Temperamento > 14** | Idol com temperamento alto não respeita tom passivo. reaction_score -10 |
| **Negociação + Agressivo + Lealdade < 12** | Idol interpreta como ameaça. affinity -12, pode recusar renovação |

**Regra visual**: Quando o jogador seleciona um tom arriscado, o modal de conversa
(Wireframe 68) mostra um **indicador de risco** (ícone amarelo ou vermelho) ao
lado da opção, se o Wellness Advisor estiver presente (ver seção 8).

#### 8. Staff Mediation

Membros do staff presentes na agência modificam o sistema de diálogo:

**Wellness Advisor (Conselheiro de Bem-Estar):**

```
Se Wellness Advisor presente na agência:
  - ANTES de confirmar resposta: mostra barra de "Reação Prevista"
    (Positiva / Neutra / Negativa) baseada no reaction_score estimado
  - Precisão da previsão: 70% (nível 1), 85% (nível 2), 95% (nível 3)
  - Não mostra o número exato — apenas a faixa estimada
  - Idol com ocultos desconhecidos: previsão menos precisa (-20% de accuracy)
```

O Wellness Advisor funciona como "rede de segurança" pra jogadores que ainda
não conhecem suas idols. Jogadores experientes podem dispensar o conselho.

**PR Manager (Gerente de Relações Públicas):**

```
Se PR Manager presente na agência:
  - Reduz impacto negativo de affinity em 30%
  - affinity_delta negativo × 0.7 (arredondado)
  - Narrativa: "O PR Manager intervém e suaviza a situação"
  - Não afeta wellness_delta (apenas afinidade)
  - Não funciona em Desastres (reaction_score < 20) — dano muito grande pra mitigar
```

| Staff | Efeito | Limitação |
|---|---|---|
| **Wellness Advisor** | Previsão de reação antes da escolha | Precisão limitada por nível e conhecimento dos ocultos |
| **PR Manager** | affinity negativa × 0.7 | Não mitiga Desastres nem wellness_delta |
| **Ambos presentes** | Efeitos combinam | Independentes, não multiplicam entre si |

#### 9. Memory System

Conversas significativas geram **memórias** que entram no interaction_history
(Wireframe 72) e afetam o relacionamento a longo prazo.

**Critério para gerar memória:**

```
Conversa gera memória se:
  - reaction_score >= 70 (Sucesso forte) → memória positiva
  - reaction_score < 20 (Desastre) → memória negativa
  - Promise foi criada → memória neutra (atualizada quando cumprida/quebrada)
  - Confronto resolvido → memória positiva
  - Confronto escalou → memória negativa
```

**Estrutura da memória (extensão do modelo em player-reputation-affinity.md):**

```
ConversationMemory extends Memory {
  idol_id:          uint32
  type:             "positive" | "negative" | "neutral"
  event:            string    // texto narrativo gerado
  impact:           -20 a +20 // modificador permanente na afinidade
  conversation_type: ConversationType
  tone_used:        "encorajador" | "neutro" | "competitivo" | "agressivo" | "calmo"
  week:             uint32
  visible:          bool      // aparece no perfil como citação
  referenced_in_news: bool    // se virou notícia no news feed
}
```

**Exemplos de memórias geradas:**

| Situação | Texto da memória | impact | type |
|---|---|---|---|
| Motivacional Sucesso com Calmo | "Ele sentou comigo e me ouviu quando eu mais precisava" | +12 | positive |
| Disciplinar Desastre com Agressivo | "Ela gritou comigo na frente de todos. Nunca vou esquecer" | -20 | negative |
| Elogio Sucesso | "Ele reconheceu meu esforço depois do show. Significou muito" | +8 | positive |
| Confronto Resolvido | "Tivemos uma briga séria, mas ele resolveu com maturidade" | +15 | positive |
| Promessa Cumprida | "Ele prometeu que eu seria Center e cumpriu. Confio nele" | +15 | positive |
| Promessa Quebrada | "Mais uma promessa vazia. Não acredito mais nele" | -15 | negative |

**Efeitos a longo prazo:**
- Memórias positivas aparecem como citações no **News Feed** ("Ex-idol elogia
  produtor em entrevista")
- Memórias negativas podem aparecer em **tabloides** ("Idol denuncia tratamento
  agressivo do produtor")
- Ao reencontrar uma idol (troca de agência), memórias afetam negociação
  (conforme player-reputation-affinity.md seção 4)
- Acumular 3+ memórias negativas com mesma idol: idol recebe trait temporário
  "Ressentida" — affinity não sobe além de 40 até memória positiva compensar

### States and Transitions

| Estado | Descrição | Transição |
|---|---|---|
| **Sem conversa pendente** | Nenhum trigger ativo | → Conversa disponível (trigger ativado) |
| **Conversa disponível** | Trigger gerou oportunidade | → Em conversa (jogador abre modal), → Ignorada (2 semanas sem responder) |
| **Em conversa** | Modal aberto, jogador escolhendo | → Resultado processado (jogador confirma) |
| **Resultado processado** | Deltas aplicados, memória gerada se aplicável | → Cooldown ativo, → Sem conversa pendente |
| **Cooldown ativo** | Idol no limite semanal | → Sem conversa pendente (nova semana) |
| **Ignorada** | Jogador ignorou conversa pendente | affinity -3, → Sem conversa pendente |

### Interactions with Other Systems

| Sistema | Direção | O que flui |
|---|---|---|
| **Happiness & Wellness** | ← lê, → afeta | Lê barras pra calcular reaction_score. Aplica wellness_delta no resultado |
| **Player Reputation & Affinity** | ← lê, → afeta | Lê afinidade pra reaction_score. Aplica affinity_delta. Gera memórias |
| **Idol Attribute Stats** | ← lê | Lê ocultos (Temperamento, Lealdade, Profissionalismo, Ambição) pra calcular reação |
| **Contract System** | ← trigger, → afeta | Contrato expirando dispara Negociação. Resultado afeta chance de renovação |
| **Staff Functional** | ← lê | Wellness Advisor e PR Manager modificam experiência de conversa |
| **Group Management** | ← trigger | Conflitos entre idols disparam Confronto |
| **Event/Scandal Generator** | ← trigger | Escândalos disparam Disciplinar |
| **Schedule/Agenda** | ← lê | Performance pós-show dispara Elogio ou Disciplinar |
| **News Feed** | → gera | Memórias relevantes aparecem como notícias |
| **Wireframe 68** | → alimenta | Modal de conversa exibe dados deste sistema |
| **Wireframe 72** | → alimenta | Histórico de interações exibe memórias e log de conversas |

## Formulas

#### Reaction Score (cálculo principal)

```
reaction_score = TONE_BASE[tom]
               + TYPE_RELEVANCE[tipo][trigger_ativo]
               + temperamento_mod
               + lealdade_mod
               + profissionalismo_mod
               + wellness_mod
               + affinity_mod

TONE_BASE:
  encorajador = 60  // alto base, recompensa contextos de moral baixa
  neutro      = 50
  competitivo = 45
  calmo       = 45
  agressivo   = 40  // baixo base, alto risco/recompensa

TYPE_RELEVANCE (contexto correto = +15, neutro = 0, errado = -10):
  ex: Motivacional quando Motivação < 40 = +15
      Elogio quando performance recente ruim = -10

temperamento_mod:
  Temperamento > 14: +10 (tom assertivo/agressivo), +0 (calmo)
  Temperamento 8-14: +0
  Temperamento < 8:  -15 (agressivo), -5 (assertivo), +5 (calmo)

lealdade_mod:
  Lealdade > 12: +5
  Lealdade <= 12: +0

profissionalismo_mod:
  Profissionalismo > 14: +8 (aceita feedback e instrução com maturidade)
  Profissionalismo <= 14: +0

wellness_mod:
  Felicidade < 30: -10
  Senão: +0

affinity_mod:
  (getAffinity() - 0.5) × 20
  // Afinidade normalizada (0.0-1.0). Exemplos:
  // Afinidade 1.0 (máx): (1.0 - 0.5) × 20 = +10
  // Afinidade 0.5 (meia): (0.5 - 0.5) × 20 = 0
  // Afinidade 0.0 (mín): (0.0 - 0.5) × 20 = -10
```

#### Affinity Delta

```
Se reaction_score >= 60 (Sucesso):
  affinity_delta = +5 + floor((reaction_score - 60) / 8)
  Cap: +10

Se reaction_score 40-59 (Parcial):
  affinity_delta = floor((reaction_score - 50) / 5)
  Range: -2 a +2

Se reaction_score 20-39 (Falha):
  affinity_delta = -5 - floor((40 - reaction_score) / 4)
  Cap: -10

Se reaction_score < 20 (Desastre):
  affinity_delta = -10 - floor((20 - reaction_score) / 4)
  Cap: -15

Modificadores:
  2ª conversa na semana: affinity_delta × DIMINISHING_RETURNS_FACTOR (0.5)
  Saturação ativa: affinity_delta positivo × SATURATION_DECAY^semanas_consecutivas
    // ex: semana 1 → ×0.5; semana 2 → ×0.25; semana 3 → ×0.125
  PR Manager presente (se negativo): affinity_delta × 0.7
```

#### Wellness Delta

```
wellness_delta calculado por tipo de conversa (ver tabela na seção 5).

Modificadores:
  2ª conversa na semana: wellness_delta × DIMINISHING_RETURNS_FACTOR (0.5)
  Saturação ativa: wellness_delta positivo × SATURATION_DECAY^semanas_consecutivas
    // ex: semana 1 → ×0.5; semana 2 → ×0.25; semana 3 → ×0.125
```

#### Wellness Advisor Prediction Accuracy

```
accuracy = BASE_ACCURACY[advisor_level] - unknown_hidden_penalty

BASE_ACCURACY:
  nível 1: 0.70
  nível 2: 0.85
  nível 3: 0.95

unknown_hidden_penalty:
  Se ocultos da idol não foram revelados: -0.20
  Se parcialmente revelados (1-3 de 6): -0.10
  Se todos revelados: 0

Previsão exibida:
  Se reaction_score estimado >= 60: "Reação Positiva Provável" (verde)
  Se reaction_score estimado 40-59: "Reação Incerta" (amarelo)
  Se reaction_score estimado < 40: "Reação Negativa Provável" (vermelho)

Chance de previsão errada = 1 - accuracy
  Se errada: mostra a faixa adjacente (ex: mostra "Incerta" quando seria "Negativa")
```

## Edge Cases

- **Idol inicia Confronto durante cooldown**: Permitido. Confrontos iniciados
  pela idol ignoram o limite de 2/semana — ela veio até você
- **Elogio após fracasso (jogador não viu o resultado)**: Sistema bloqueia
  Elogio se performance recente < 40%. Evita inconsistência narrativa
- **Agressivo com idol já em Burnout**: Bloqueado. Idol em Burnout não pode
  receber conversa (exceto Social com tom Calmo, para manter afinidade mínima)
- **Promessa duplicada**: Se já existe promessa ativa do mesmo tipo, nova conversa
  de Negociação não gera outra. Mostra alerta: "Você já prometeu isso"
- **Idol com Temperamento 20 (máximo) recebe Agressivo**: Não se incomoda.
  reaction_score recebe +10. Mas combinado com Lealdade baixa, ainda pode
  interpretar como falta de respeito
- **3 memórias negativas + promessa cumprida**: Promessa cumprida gera memória
  positiva. Se impact >= 15, remove trait "Ressentida". Senão, precisa de mais
  memórias positivas
- **Conversa ignorada por 2 semanas + nova conversa disponível**: Ambas ficam
  no queue. Penalidade de ignorar (-3 affinity) aplicada na primeira. Segunda
  pode ser respondida normalmente
- **Staff demitido entre abrir modal e confirmar resposta**: Efeitos de staff
  calculados no momento da confirmação, não na abertura do modal
- **Idol com Ambição > 14 pede renegociação mas contrato é bom**: Trigger
  dispara mesmo assim. Idol ambiciosa sempre quer mais. Jogador pode recusar
  (tom Assertivo recomendado) — affinity -3 mas sem dano maior

## Dependencies

**Hard:**
- Happiness & Wellness — barras de wellness são input e output do sistema
- Player Reputation & Affinity — afinidade é input e output, memórias são geradas
- Idol Attribute Stats — ocultos (Temperamento, Lealdade, Profissionalismo, Ambição) determinam reação

**Soft:**
- Staff Functional — Wellness Advisor e PR Manager melhoram a experiência
- Contract System — Negociação conecta com renovação
- Group Management — conflitos entre idols disparam Confrontos
- Event/Scandal Generator — escândalos disparam Disciplinares
- News Feed — memórias podem virar notícias
- **Producer Profile** (#50): Traço (Empático) dá +5 em reaction_score de Motivacional/Social. Traço (Disciplinador) dá +5 em Disciplinar. Ver `producer-profile.md`

**Depended on by:**
Happiness & Wellness (wellness_delta), Player Reputation & Affinity (affinity_delta, memórias),
Contract System (modificador de renovação via Negociação), News Feed (memórias como notícias)

## Tuning Knobs

| Knob | Default | Range | Se muito alto | Se muito baixo |
|---|---|---|---|---|
| `TONE_BASE_ENCORAJADOR` | 60 | 45-70 | Encorajador sempre sucede, sem risco | Encorajador falha frequentemente, frustrante |
| `TONE_BASE_NEUTRO` | 50 | 40-60 | Neutro trivial demais | Neutro nunca vale a pena |
| `TONE_BASE_COMPETITIVO` | 45 | 35-55 | Competitivo trivial demais | Competitivo nunca vale a pena |
| `TONE_BASE_CALMO` | 45 | 35-55 | Calmo sempre sucede, sem risco | Calmo falha frequentemente, frustrante |
| `TONE_BASE_AGRESSIVO` | 40 | 25-50 | Agressivo sem risco real | Agressivo sempre falha, inútil |
| `TYPE_RELEVANCE_BONUS` | +15 | +5 a +25 | Contexto correto garante sucesso | Contexto quase irrelevante |
| `SUCCESS_THRESHOLD` | 60 | 50-75 | Fácil demais, sem tensão | Quase impossível sem Lealdade alta + afinidade alta |
| `DISASTER_THRESHOLD` | 20 | 10-30 | Desastres raros demais | Desastres frequentes, frustrante |
| `MAX_CONVERSATIONS_PER_WEEK` | 2 | 1-4 | Conversa spam, sem peso | Muito restritivo, sem interação |
| `DIMINISHING_RETURNS_FACTOR` | 0.5 | 0.3-0.8 | 2ª conversa quase inútil | 2ª conversa tão boa quanto 1ª |
| `SATURATION_DECAY` | 0.5 | 0.25-0.75 | Conversa constante perde eficácia rapidamente | Sem custo real de falar demais |
| `IGNORE_AFFINITY_PENALTY` | -3 | -1 a -8 | Ignorar conversa é devastador | Sem consequência de ignorar |
| `PR_MANAGER_MITIGATION` | 0.7 | 0.5-0.9 | PR Manager quase anula negativos | PR Manager irrelevante |
| `PROMISE_BROKEN_AFFINITY` | -10 | -5 a -20 | Quebrar promessa é catastrófico | Promessas sem peso |
| `PROMISE_FULFILLED_AFFINITY` | +8 | +3 a +15 | Cumprir promessa é muito recompensador | Cumprir promessa não compensa |
| `MEMORY_RESENTMENT_THRESHOLD` | 3 | 2-5 | Ressentimento rápido, difícil recuperar | Idol perdoa facilmente demais |

## Acceptance Criteria

1. 6 tipos de conversa (Motivacional, Disciplinar, Elogio, Negociação, Social, Confronto) funcionais
2. 5 tons (Encorajador, Neutro, Competitivo, Agressivo, Calmo) modificam reaction_score conforme fórmula
3. Topic triggers disparam conversas corretamente (idol infeliz 2+ semanas, contrato expirando, escândalo, pós-show, conflito)
4. reaction_score calculado com todos 6 fatores (tom, relevância, temperamento, lealdade, wellness, afinidade)
5. Outcomes produzem affinity_delta (-15 a +10) e wellness_delta corretos por tipo
6. Cooldown de 2 conversas/semana por idol, com diminishing returns na 2ª
7. Tom Agressivo em idol com Temperamento < 8 causa affinity -15, stress +10
8. Wellness Advisor mostra previsão de reação com precisão proporcional ao nível
9. PR Manager reduz affinity negativa em 30% (exceto Desastres)
10. Conversas significativas geram memórias no interaction_history
11. Promessas geradas em Negociação/Motivacional com deadline e tracking de cumprimento
12. Promessa quebrada causa affinity -10 e memória negativa
13. Conversa ignorada por 2+ semanas causa affinity -3
14. Saturação (2×/semana por 3+ semanas) reduz eficácia de conversas
15. Modal de conversa (Wireframe 68) exibe dados contextuais conforme wireframe
16. Histórico de interação (Wireframe 72) registra todas conversas e memórias

## Open Questions

- **PENDENTE**: Conversas de grupo (falar com o grupo inteiro vs. individual).
  Possibilidade: conversa de grupo afeta todos os membros com efeito reduzido
  (×0.5) mas sem custo de cooldown individual. Avaliar se adiciona complexidade
  demais
- **PENDENTE**: Diálogos com staff (não apenas idols). Possível extensão futura
  pra resolver conflitos com staff ou negociar permanência de coaches
