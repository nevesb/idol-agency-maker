# Job Assignment & Simulation

> **Status**: Designed (v2 — ontologia de atividades revisada)
> **Author**: user + game-designer
> **Last Updated**: 2026-04-04
> **Implements Pillar**: Pilar 1 — Simulação com Profundidade Real, Pilar 2 — Suas Decisões, Suas Consequências
> **Related**: show-system.md, music-entities.md, setlist-system.md, schedule-agenda.md

## Overview

O Job Assignment & Simulation é o coração do core loop. Gerencia o catálogo de
jobs disponíveis, o processo de escalação (match idol ↔ job), e a simulação
de resultados. O jogador avalia requisitos de cada job, compara com stats das
idols disponíveis, escala, e vê os resultados após a simulação da semana.
Resultados geram receita, fama, experiência -- ou fracasso, stress e perda
de reputação. A tensão vem de escalar com informação imperfeita: stats indicam
probabilidade, mas o resultado tem variância (ocultos, sorte, contexto).

## Player Fantasy

A fantasia é de **produtor que monta o elenco perfeito**. Olhar um job de
TV que pede Variedade > 60 e Carisma > 70, comparar suas 3 idols que se
encaixam, e escolher a melhor pra maximizar resultado. A satisfação de acertar
-- e o drama de quando a idol surpreende (pra melhor ou pior). Serve o **Pilar 2
(Consequências)**: cada escalação é uma aposta calculada. E o **Pilar 4
(Drama Emergente)**: resultados inesperados geram as melhores histórias.

## Detailed Design

### Core Rules

#### 0. Ontologia da Agenda — Três Tipos de Atividade (v2)

Nem tudo que ocupa a agenda é um "job". A agenda da idol contém três tipos
de atividade com regras distintas:

| Tipo | Definição | Exemplo | Processamento |
|---|---|---|---|
| **Job** | Trabalho pago externo com resultado e consequências | TV variety, endorsement, sessão de fotos, gravação | job-assignment fórmulas (abaixo) |
| **Performance Event** | Show ao vivo com setlist, audiência, produção | Solo concert, festival slot, TV live, award show | **show-system.md** (processa inteiro) |
| **Support Activity** | Atividade interna sem resultado externo | Treino, ensaio, descanso, psicólogo, composição | Slots da agenda com efeito direto |

**Por que separar?**
- **Jobs** são processados pela fórmula de performance simples (stats vs. requisitos)
- **Performance Events** são processados pelo show-system.md (setlist música por
  música, audiência dinâmica, produção técnica) — muito mais complexo
- **Support Activities** não geram resultado externo, só efeitos internos
  (crescimento de stat, mastery, redução de stress)

**Impacto**: A tabela de "Tipos de Job" abaixo lista apenas Jobs e Performance
Events. Support Activities são definidas em `schedule-agenda.md` e
`setlist-system.md` (para ensaios). Performance Events marcados com ★ são
processados pelo show-system.md em vez da fórmula de job padrão.

#### 1. Catálogo de Tipos de Job

| Categoria | Tipos | Stats Primários | Duração típica |
|---|---|---|---|
| **★ Shows/Concertos** | Solo, grupo, festival, turnê | *Processado por show-system.md* | 1 dia - 8 semanas |
| **TV** | Variedade, talk show, drama, reality | Variedade, Atuação, Comunicação | 1 dia - 1 temporada |
| **Rádio** | Programa regular, entrevista, spot | Comunicação, Variedade | 1 dia - recorrente |
| **Gravação** | Single, álbum, collab, cover | Vocal, Dança (MV) | 1-4 semanas |
| **Dublagem** | Anime, game, narração | Atuação, Vocal | 1-4 semanas |
| **Sessão de fotos** | Revista, marca, photo book | Visual, Aura | 1 dia |
| **Meet & greet** | Fan meeting, handshake event | Comunicação, Carisma | 1 dia |
| **Eventos** | Anime expo, Comiket, premiações | Carisma, Aura | 1-3 dias |
| **Endorsement** | Campanha de marca, comercial | Visual, Carisma | 1 dia - 6 meses |
| **Streaming** | Live, NicoNico, SHOWROOM | Comunicação, Variedade | 1-3 horas |
| **Composição** | Idol escreve música (slot especial) | Vocal, Aura | 1-4 semanas |

#### 2. Ficha de um Job

```
Job {
  id:              uint32
  type:            enum (ver tabela acima)
  name:            string  // "Music Monday Ep. 45", "Sakura Cola CM"
  source:          "media_entity" | "event_calendar" | "brand" |
                   "agency_created" | "collab_request"
  media_entity_id: uint32? // se vem de rádio/TV/plataforma

  // Requisitos
  requirements: {
    min_tier_fame:    F-SSS   // tier de fama mínimo
    min_stats:        {stat: value}[]  // stats mínimos recomendados
    gender:           "any" | "female" | "male"
    solo_or_group:    "solo" | "group" | "either"
    exclusivity:      bool   // precisa de contrato exclusivo?
  }

  // Timing
  deadline:          date    // prazo de inscrição
  execution_date:    date    // quando acontece
  duration_days:     uint8   // slots de agenda que ocupa
  advance_notice:    uint8   // semanas de antecedência que aparece no board

  // Rewards
  payment:           ¥amount
  fame_gain:         uint16
  stat_experience:   {stat: value}[]  // stats que melhoram com o job

  // Risk
  difficulty:        1-10    // quão difícil é performar bem
  visibility:        1-10    // quão público é (afeta escândalo/fama)
}
```

**MVP (implementado):** para jobs com stats primários definidos, a média aritmética desses stats na idol (escala 0–100) deve ser **≥ `10 + difficulty × 5`**, além de `min_tier_fame`, `min_stats` por atributo e exclusividade quando aplicável. Ver `JobAssignmentRules` no projeto.

#### 3. Processo de Escalação

```
1. JOB APARECE no board (semanal, ou por convite direto)
   → Jogador vê requisitos, pagamento, prazo

2. JOGADOR AVALIA idols disponíveis
   → Compara stats vs. requisitos
   → Checa agenda (idol tem slot livre?)
   → Checa barras de wellness (verde/amarelo/vermelho?)
   → Checa contrato (carga máxima, exclusividade)

3. JOGADOR ESCALA idol(s)
   → Confirma escalação, slot bloqueado na agenda
   → Se job de grupo: escala múltiplas idols

4. SIMULAÇÃO RODA (no tick semanal)
   → Resultado calculado por fórmulas
   → Ocultos (Consistência, Temperamento) afetam variância
   → Resultado: Sucesso / Sucesso parcial / Fracasso

5. CONSEQUÊNCIAS
   → Receita (ou não), fama (sobe ou desce), stats crescem
   → Wellness impactado (stress, motivação, felicidade)
   → News feed atualizado com resultado
```

#### 4. Resultado da Simulação

Cada job escalado tem 3 possíveis resultados:

| Resultado | Quando | Efeito |
|---|---|---|
| **Sucesso** | Performance ≥ 70% do máximo | Pagamento total, fama +, stats crescem, motivação + |
| **Sucesso parcial** | Performance 40-69% | Pagamento parcial (~60%), fama neutra, stats crescem menos |
| **Fracasso** | Performance < 40% | Pagamento mínimo (~20%), fama -, stress +, motivação - |

A performance é calculada pela fórmula (ver Formulas abaixo) e inclui
variância baseada em Consistência (oculto). Idol com Consistência alta
raramente fracassa ou surpreende -- entrega previsível. Idol com
Consistência baixa pode brilhar ou floppar dramaticamente.

#### 5. Jobs de Grupo

Quando o job aceita grupo:
- Performance do grupo = média das performances individuais + bônus de sinergia
- Sinergia = complementaridade de stats (mesmo conceito do Fame Rankings GDD)
- Se 1 membro performa mal, puxa a média pra baixo mas não destrói
- Se grupo tem chemistry alto (membros que trabalham bem juntos), bônus extra

#### 6. Jobs de Colaboração Cross-Agency

Vindo do Market/Transfer System:
- Outra agência convida sua idol pra projeto (single, show, drama)
- Requisitos e pagamento definidos pela agência anfitriã
- Receita dividida conforme COLLAB_REVENUE_SPLIT (50/50 padrão)
- Boa pra exposição de novatas (collab com famosa de rival)

#### 7. Acesso a Jobs por Tier de Agência

Agências só veem e podem se candidatar a jobs compatíveis com seu tier:

| Tier Agência | Jobs acessíveis | Competição |
|---|---|---|
| Garagem | Locais, streaming, rádio regional | Quase nula (jobs abundantes) |
| Pequena | + Regionais, TV regional, eventos pequenos | Baixa |
| Média | + Nacionais, gravação, endorsements médios | Moderada em jobs premium |
| Grande | + TV nacional, festivais, endorsements grandes | Alta em jobs premium |
| Elite | Tudo + jobs VIP exclusivos (Kouhaku, etc.) | Muito alta no topo |

**Jobs normais** (maioria): Abundantes, sem competição. O board tem mais
jobs do que qualquer agência consegue preencher. O jogador escolhe livremente.

**Jobs especiais/premium**: Marcados com ícone de competição. Apenas 1-3
agências do mesmo tier podem competir. Melhor match idol/requisitos ganha.
Jobs disputados pagam **bônus de +20-50%** e dão **fama extra** por serem
competitivos.

#### 8. Jobs Recorrentes

Alguns jobs são recorrentes (programa semanal de TV, residência em show):
- Idol é escalada uma vez, aparece automaticamente toda semana
- Cancela a qualquer momento com aviso de 1-2 semanas
- Receita fixa semanal enquanto durar
- Ocupa slot fixo na agenda -- menos flexibilidade, mais estabilidade

### States and Transitions

| Estado do Job | Descrição | Transição |
|---|---|---|
| **Disponível** | No board, aceitando candidaturas | → Escalado (idol escalada), → Expirado (prazo passou) |
| **Escalado** | Idol confirmada, aguardando execução | → Em execução (dia chegou), → Cancelado (jogador ou idol cancela) |
| **Em execução** | Job acontecendo (em modo Live) | → Concluído (simulação completa) |
| **Concluído** | Resultado calculado | Terminal (receita + consequências aplicadas) |
| **Cancelado** | Jogador ou idol cancelou | Terminal (possível multa ou perda de reputação) |
| **Expirado** | Prazo passou sem escalação | Terminal (rival pode ter pegado) |

### Interactions with Other Systems

| Sistema | Direção | O que flui |
|---|---|---|
| **Stats System** | ← lê | Stats da idol determinam performance no job |
| **Fame & Rankings** | ↔ bidirecional | Fama determina quais jobs aparecem. Jobs geram fama |
| **Happiness & Wellness** | ↔ bidirecional | Barras afetam performance. Resultado afeta barras |
| **Agency Economy** | → receita/custo | Pagamento de jobs como receita. Custo de eventos criados |
| **Contract System** | ← restringe | Carga máxima, exclusividade, descanso obrigatório |
| **Schedule/Agenda** | ↔ bidirecional | Escalação bloqueia slots. Agenda mostra disponibilidade |
| **Week Simulation** | → alimenta | Jobs escalados são processados no tick semanal |
| **Rival Agency AI** | ← compete (só jobs especiais) | IA compete APENAS em jobs premium/especiais (eventos grandes, TV nacional, endorsements top). Jobs normais são abundantes e não disputados. Só agências do mesmo tier competem entre si |
| **show-system.md** | ← processa | Performance Events (★) são processados pelo show-system em vez da fórmula de job |
| **music-entities.md** | ← requisitos | Requisitos de músicas usados em gravação e shows |
| **setlist-system.md** | ← setlist | Shows usam setlist como estrutura de processamento |
| **Music Charts** | ← fornece jobs | Gravação de single/álbum/cover como tipo de job. Composição como slot especial |
| **Media Entities** | ← fornece jobs | Shows de TV/rádio publicam vagas como jobs. Audience afeta recompensa |
| **Market/Transfer** | ← fornece collabs | Colaborações cross-agency como jobs com revenue split |
| **News Feed** | → alimenta | Resultados de jobs aparecem no feed proporcional ao tier |
| **Idol Personal Finance** | → alimenta | % de receita do job flui pra finanças pessoais da idol |
| **Event/Scandal Generator** | ← lê | Eventos podem criar jobs de emergência ou cancelar jobs |

## Formulas

#### Performance de Job (core)

```
performance = stat_score × mult_consistencia × mult_wellness × mult_difficulty × random_factor

onde:
  stat_score = media dos stats requisitados pela job / 100
    Ex: job pede Vocal + Aura → stat_score = (Vocal + Aura) / 200

  mult_consistencia = 1.0 + ((Consistencia - 10) / 10 × CONSISTENCY_WEIGHT)
    CONSISTENCY_WEIGHT = 0.3
    Consistencia 20: mult = 1.3 (sempre bom)
    Consistencia 1: mult = 0.73 (muito variável)

  mult_wellness = health_factor × stress_factor
    health_factor = 1.0 (saúde OK), 0.8 (preocupante), 0.5 (crítico)
    stress_factor = 1.0 (stress OK), 0.9 (preocupante), 0.7 (overwork)

  mult_difficulty = 1.0 - (difficulty / 20)
    difficulty 1: mult = 0.95 (fácil, quase não reduz)
    difficulty 10: mult = 0.5 (muito difícil)

  random_factor = 0.8 + random(0, 0.4) pra Consistencia média
    Ajustado por Consistencia:
      Alta (15+): random(0.9, 0.2) — range menor
      Baixa (<5): random(0.6, 0.8) — range enorme
```

#### Resultado

```
Se performance ≥ 0.70: SUCESSO
  receita = payment × 1.0
  fama = fame_gain × 1.0
  stat_xp = stat_experience × 1.0

Se performance 0.40-0.69: SUCESSO PARCIAL
  receita = payment × 0.6
  fama = fame_gain × 0.3
  stat_xp = stat_experience × 0.5

Se performance < 0.40: FRACASSO
  receita = payment × 0.2
  fama = fame_gain × -0.5 (perde fama)
  stat_xp = stat_experience × 0.3
```

#### Performance de Grupo

```
performance_grupo = media(performances_individuais) × (1 + sinergia_bonus)

sinergia_bonus = 0.0 a 0.3 (da Fame Rankings — complementaridade de stats)
```

#### Carisma como Modificador Universal

```
// Carisma modifica TODOS os jobs como bônus
performance_final = performance × (1 + (Carisma - 50) / 200)

Carisma 100: +25% bônus
Carisma 50: neutro
Carisma 10: -20% penalidade
```

## Edge Cases

- **Idol escalada mas entra em burnout antes do job**: Job é cancelado
  automaticamente. Perda de reputação com a emissora/marca. Pode afetar
  jobs futuros daquela fonte
- **Job pede tier A mas só tem idols tier C**: Jogador pode escalar mas
  chance de sucesso é muito baixa. Pode surpreender se Consistência rolar alto
- **Dois jobs no mesmo dia**: Idol só pode fazer 1 por dia (slot de agenda).
  Jogador escolhe qual priorizar
- **Job cancelado pelo jogador**: Multa proporcional ao advance_notice.
  Cancelar no dia = multa total. Cancelar com 2+ semanas = sem multa
- **Rival AI e jogador escalaram pro mesmo job especial**: Só acontece em
  jobs premium/disputados. Vai pra quem tem idol mais adequada. Só agências
  do mesmo tier competem (Elite não rouba job de Garagem). Jobs disputados
  dão bônus extra de fama e pagamento por serem competitivos
- **Idol sem exclusividade bloqueia dia do job**: Job é prejudicado (se era
  multi-dia, performance parcial). Se era 1 dia, perdido completamente
- **Job de composição (idol escreve música)**: Não tem "performance" normal.
  Resultado é a qualidade da música gerada (Music Charts formula)
- **Idol com Consistência 1 no job mais importante do ano**: Range de
  random é enorme (0.6-1.4). Pode ser o maior sucesso ou o maior fracasso.
  Drama puro

## Dependencies

**Hard:**
- Stats System — stats determinam performance
- Fame & Rankings — tier de fama filtra quais jobs aparecem
- Happiness & Wellness — barras modificam performance

**Soft:**
- Music Charts — gravação/composição como tipos de job
- Media Entities — shows como fonte de jobs
- Contract System — carga máxima e exclusividade restringem escalação
- Market/Transfer — collabs como jobs
- **Producer Profile** (#50): Estilo e traços afetam nota e receita de jobs. Ver `producer-profile.md` seção 4c-4d.

**Depended on by:**
Schedule/Agenda, Week Simulation, News Feed, Agency Economy (receita),
Idol Personal Finance (% de receita), Rival Agency AI

## Tuning Knobs

| Knob | Default | Range | Efeito |
|---|---|---|---|
| `CONSISTENCY_WEIGHT` | 0.3 | 0.1-0.5 | Quanto Consistência afeta resultado |
| `SUCCESS_THRESHOLD` | 0.70 | 0.60-0.80 | Limiar pra sucesso |
| `PARTIAL_THRESHOLD` | 0.40 | 0.30-0.50 | Limiar pra sucesso parcial |
| `FAILURE_PAYMENT_RATE` | 0.20 | 0.0-0.3 | % do pagamento recebido em fracasso |
| `CANCEL_PENALTY_WEEKS` | 2 | 1-4 | Semanas de antecedência pra cancelar sem multa |
| `CHARISMA_MODIFIER_WEIGHT` | 0.005 | 0.001-0.01 | Peso do Carisma como bônus universal |
| `GROUP_SYNERGY_MAX` | 0.3 | 0.1-0.5 | Bônus máximo de sinergia de grupo |
| `RANDOM_FACTOR_BASE` | 0.4 | 0.2-0.6 | Range de aleatoriedade base |
| `JOBS_PER_WEEK_BASE` | 10-20 | 5-50 | Jobs novos no board por semana |

## Acceptance Criteria

1. Jobs aparecem no board com requisitos, prazo e pagamento visíveis
2. Escalação checa disponibilidade na agenda e restrições de contrato
3. Performance calculada conforme fórmula com variância de Consistência
4. Sucesso/Parcial/Fracasso distribuídos conforme limiares configuráveis
5. Receita proporcional ao resultado flui pra Agency Economy
6. Fama ganha/perdida conforme resultado flui pra Fame & Rankings
7. Stats da idol crescem com experiência de jobs (proporcional ao resultado)
8. Carisma funciona como modificador universal em todos os tipos de job
9. Jobs de grupo calculam performance média + sinergia
10. Rival AI compete APENAS por jobs premium/especiais, não por jobs normais
11. Só agências do mesmo tier competem entre si (Elite não rouba de Garagem)
12. Jobs disputados pagam bônus de +20-50% e dão fama extra
11. Jobs de mídia (TV/rádio) vêm do Media Entities System com audience e cachê
12. Jobs de gravação/composição interagem com Music Charts System

## Post-Job Breakdown (Dramatização de Resultado)

Cada job concluído gera um **breakdown dramatizado** -- o equivalente emocional
do pós-jogo do FM. Não é só "Sucesso/Fracasso" -- é uma narrativa curta que
explica o que aconteceu e por quê.

### Estrutura do Breakdown

```
╔══════════════════════════════════════════════╗
║  RESULTADO: Music Monday Ep. 45             ║
║  Idol: Suzuki Mei                           ║
║  Nota geral: B+ (performance 0.74)          ║
╠══════════════════════════════════════════════╣
║                                             ║
║  FATORES POSITIVOS:                         ║
║  ✓ Vocal forte (82) — delivery limpo        ║
║  ✓ Carisma acima da média (+16% bônus)      ║
║                                             ║
║  FATORES NEGATIVOS:                         ║
║  ✗ Nervosismo (primeira vez em TV nacional) ║
║  ✗ Agenda pesada nas últimas 2 semanas      ║
║                                             ║
║  REAÇÃO DE MÍDIA:                           ║
║  📺 "Performance sólida mas contida"        ║
║  Tier de cobertura: TV Nacional             ║
║                                             ║
║  REAÇÃO DE FÃS:                             ║
║  Fan mood: +5 (satisfeitos)                 ║
║  Toxicidade: sem mudança                    ║
║                                             ║
║  IMPACTO INTERNO:                           ║
║  Motivação: +3                              ║
║  Stress: +8 (TV nacional = pressão alta)    ║
║  Experiência: Variedade +2, Comunicação +1  ║
║                                             ║
║  APRENDIZADO SUGERIDO:                      ║
║  💡 "Treinar presença de palco pra grandes  ║
║     audiências. Coach sugere foco em Aura." ║
╚══════════════════════════════════════════════╝
```

### Fatores que Aparecem no Breakdown

| Categoria | Fatores Positivos | Fatores Negativos |
|---|---|---|
| **Stats** | Stat alto acima do requisito | Stat abaixo do requisito |
| **Wellness** | Saúde/motivação no verde | Stress alto, saúde precária |
| **Contexto** | Experiência prévia no tipo de job | Primeira vez, arena desconhecida |
| **Agenda** | Agenda leve na semana anterior | Overwork recente |
| **Chemistry** | Boa sinergia de grupo | Conflito interno no grupo |
| **Fãs** | Fã-clube engajado apoiando | Fãs em humor negativo |
| **Ocultos** | Consistência alta (estável) | Consistência baixa (errático) |
| **Encaixe** | Boa match com tipo de programa | Fora da zona de conforto |

**Regras:**
- Sempre 2-4 fatores positivos e 2-4 negativos (mesmo em sucesso total)
- Fatores ocultos aparecem como descrições vagas ("instabilidade emocional")
- Reação de mídia e fãs reflete o resultado
- Aprendizado sugerido só aparece se Coach ou Wellness Advisor contratado
- Breakdown acessível via Week Results UI e via histórico do perfil da idol

### Notas de Performance

| Nota | Performance | Descrição |
|---|---|---|
| **S** | ≥ 0.95 | Excepcional — momento memorável |
| **A** | 0.85-0.94 | Excelente — acima das expectativas |
| **B** | 0.70-0.84 | Bom — resultado sólido |
| **C** | 0.55-0.69 | Regular — sucesso parcial |
| **D** | 0.40-0.54 | Fraco — abaixo do esperado |
| **F** | < 0.40 | Fracasso — dano à reputação |

- Nota visível no breakdown e no histórico
- Notas S geram notícia especial no News Feed
- 3 notas F consecutivas geram alerta no Agency Intelligence

## Jobs Não Preenchidos (Mercado Indie)

Jobs que nenhuma agência (jogador ou IA) preenche são completados por
**idols não agenciadas (indie)**:
- Idols indie do mercado são alocadas automaticamente pela simulação
- Resultado calculado normalmente (stats da idol indie vs. requisitos)
- Indie que performa bem ganha fama e sobe no ranking
- Cria mercado orgânico: idols indie crescendo fazem scouting mais interessante
- Jogador vê no News Feed: "Idol indie X brilhou no show Y"
- Incentiva o jogador a prestar atenção no que está ignorando

## Open Questions

- **RESOLVIDO**: Reputação com fontes de job: Emissoras têm favorabilidade
  com a agência (inicia 50%). Jobs bem-sucedidos aumentam, fracassos e
  cancelamentos diminuem. Abaixo de 50% perde pontos em jobs concorridos.
  Acima de 80% ganha pontos. Não deixa de publicar jobs, mas perde
  competitividade
- **RESOLVIDO**: Jobs secretos pra tier SS+: Sim. Oportunidades VIP que
  não aparecem no board público
- **RESOLVIDO**: Dificuldade adaptativa: Não precisa de mecânica artificial.
  Os próprios concorrentes e exigências crescentes das idols dão dificuldade
  natural ao longo dos anos
