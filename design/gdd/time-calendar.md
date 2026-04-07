# Time/Calendar System

> **Status**: Designed
> **Author**: user + game-designer
> **Last Updated**: 2026-03-29
> **Implements Pillar**: Infraestrutura — serve todos os pilares

## Overview

O Time/Calendar System controla a passagem de tempo no jogo. Define a unidade
fundamental (semana), os ciclos (mês, temporada, ano), o calendário de eventos
fixos/sazonais, e os 3 modos de velocidade (Live/Pause/Skip). É o relógio que
aciona todos os outros sistemas -- crescimento de stats, vencimento de contratos,
envelhecimento de idols, pagamento de salários, e geração de resultados.

O jogador interage ativamente escolhendo quando avançar o tempo (Skip) ou pausar
pra tomar decisões. Em modo Live, o tempo flui e o jogador reage. O sistema é
invisível quando funciona bem, mas define o ritmo de toda a experiência.

## Player Fantasy

A fantasia é de **controle do tempo** -- o poder de parar o mundo pra pensar,
ou acelerar quando não há nada urgente. O jogador se sente como um produtor
real: semanas passam rápido quando tudo vai bem, mas quando uma crise aparece,
ele para tudo e resolve. Serve o **Pilar 3 (Múltiplos Caminhos)**: o jogador
casual skipa semanas rapidamente; o hardcore pausa e analisa cada detalhe.

## Detailed Design

### Core Rules

#### 1. Unidades de Tempo

| Unidade | Duração real (modo normal) | Uso no jogo |
|---|---|---|
| **Dia** | ~1 min (em modo Live) | Menor unidade visual. Jobs duram X dias |
| **Semana** | ~5-6 min | Ciclo fundamental. Simulação roda por semana |
| **Mês** | ~20-25 min (4 semanas) | Relatório financeiro, metas do dono, rankings update |
| **Temporada** | ~3 meses | Eventos sazonais (primavera, verão, outono, inverno) |
| **Ano** | ~4-5 horas | Premiações anuais, aniversários, renovações |

Uma semana tem 7 dias: Segunda a Domingo.
Um mês tem 4 semanas (simplificado -- sem meses de 28/30/31 dias).
Um ano tem 12 meses = 48 semanas.
20 anos = 960 semanas ≈ 80-100 horas no modo normal.

#### 2. Modos de Velocidade

| Modo | Comportamento | Quando usar |
|---|---|---|
| **Live** | Dias passam automaticamente (~1 min/dia). Eventos aparecem em tempo real. Jogador pode intervir a qualquer momento | Observar a semana fluir, reagir a emergências |
| **Pause** | Tempo para completamente. Jogador gerencia livremente | Tomar decisões complexas, reorganizar agenda, analisar stats |
| **Skip** | Pula até segunda-feira da próxima semana. Simulação roda instantaneamente | Semana sem decisões pendentes, avançar rápido |

**Regras de transição:**
- Jogador pode alternar entre modos a qualquer momento
- Skip pode ser interrompido por **eventos urgentes** (escândalo, proposta
  de rival, burnout de idol) que forçam Pause automático
- Live pode ser acelerado (×2, ×4) ou desacelerado (×0.5)
- Pause é o modo padrão ao iniciar o jogo / carregar save

#### 3. Ciclo Semanal (o tick fundamental)

Cada semana segue esta sequência ao ser processada:

```
1. INÍCIO DA SEMANA (segunda-feira)
   → Novos jobs aparecem no board
   → Convites e propostas chegam
   → Resultados de castings agendados
   → Mercado de transferências atualiza

2. DURANTE A SEMANA (se em modo Live)
   → Jobs escalados são executados dia a dia
   → Eventos aleatórios podem disparar
   → Notícias aparecem no feed

3. FIM DA SEMANA (domingo)
   → Stats crescem/decaem (tick semanal do Stats System)
   → Stress/felicidade atualiza (Happiness System)
   → Fama atualiza (Fame System)
   → Receita/despesas processadas (Economy)
   → Contratos avançam 1 semana (vencimentos checados)
   → Idols envelhecem (birthday check)
   → Rival AI processa suas decisões
```

Em modo Skip, as etapas 1-3 rodam instantaneamente e o jogador vê o relatório.

#### 4. Ciclo Mensal

No fim de cada mês (a cada 4 semanas):
- Relatório financeiro: receita, despesas, lucro/prejuízo
- Avaliação de metas do dono da agência
- Rankings oficiais atualizados (individual, grupo, agência)
- Salários pagos
- Ranking de músicas atualizado

#### 5. Ciclo Sazonal/Anual

O calendário contém eventos fixos carregados do World Pack:

| Temporada | Meses | Eventos típicos |
|---|---|---|
| Primavera (春) | Mar-Mai | Formatura de academias, novos talentos, início de temporada de TV |
| Verão (夏) | Jun-Ago | Festivais (TIF, Summer Sonic), Anime Expo, Comiket |
| Outono (秋) | Set-Nov | Premiações musicais, temporada de dramas de TV |
| Inverno (冬) | Dez-Fev | Kouhaku (programa de ano novo NHK), shows de natal, castings de final de ano |

Eventos fixos têm:
- Data fixa no calendário (mesmo mês/semana todo ano)
- Requisitos de participação (tier mínimo, gênero, tipo)
- Prazo de inscrição (semanas/meses antes)
- Recompensas (fama, dinheiro, exposição)

### States and Transitions

| Estado | Descrição | Transição |
|---|---|---|
| **Pause** | Tempo parado. Jogador gerencia livremente | → Live (play), → Skip (avançar) |
| **Live** | Dias passando em tempo real (×1, ×2, ×4, ×0.5) | → Pause (pause), → Skip, → Pause automático (evento urgente) |
| **Skip** | Processando semana instantaneamente | → Pause (resultado pronto), → Pause automático (interrupção) |
| **Fim de Semana** | Processando tick de fim de semana | → Pause (relatório semanal) |
| **Fim de Mês** | Processando relatórios mensais | → Pause (relatório mensal) |

**Pause automático (interrupções):**
Eventos que forçam pausa durante Live ou Skip:
- Escândalo de idol (tier A+ ou da sua agência)
- Proposta de agência rival pra sua idol
- Burnout de idol contratada
- Oferta de troca de agência pro jogador
- Evento fixo com prazo de inscrição chegando (aviso)

### Interactions with Other Systems

| Sistema | Direção | O que flui |
|---|---|---|
| **Stats System** | → tick semanal | Dispara crescimento/decaimento de atributos toda semana |
| **Happiness & Wellness** | → tick semanal | Dispara atualização de stress/felicidade/motivação |
| **Fame & Rankings** | → tick mensal | Dispara recálculo de rankings mensais |
| **Agency Economy** | → tick semanal/mensal | Receita semanal, salários mensais, relatório financeiro |
| **Contract System** | → tick semanal | Avança contratos, checa vencimentos, dispara renovações |
| **Schedule/Agenda** | ↔ bidirecional | Agenda define o que acontece na semana; calendário define quando |
| **Week Simulation** | → tick semanal | Dispara processamento de todos jobs da semana |
| **Event/Scandal Generator** | → tick diário/semanal | Dispara chance de eventos aleatórios |
| **Idol Lifecycle** | → tick semanal | Checa aniversários, idade, condições de debut |
| **Rival Agency AI** | → tick semanal | Dispara decisões das agências IA |
| **World Pack** | ← carrega eventos | Eventos fixos/sazonais são lidos do World Pack |
| **Music Charts** | → tick mensal | Atualiza ranking de músicas, calcula royalties, processa decay de chart |
| **Media Entities** | → tick semanal/mensal | Shows publicam vagas semanalmente. Audiência atualiza mensalmente. Shows podem ser cancelados/criados |
| **Idol Personal Finance** | → tick mensal | Processa balanço mensal de cada idol (renda - gastos), juros de dívida, progresso de objetivos |

## Formulas

#### Conversão de Tempo

```
1 dia (Live) = LIVE_SPEED_BASE × speed_multiplier
  onde LIVE_SPEED_BASE = 60 segundos (1 minuto real)
  speed_multiplier = 0.5 (lento), 1.0 (normal), 2.0 (rápido), 4.0 (turbo)

1 semana = 7 dias
1 mês = 4 semanas = 28 dias
1 ano = 12 meses = 48 semanas = 336 dias
20 anos = 960 semanas

Duração real de 20 anos (modo normal, sem pause):
  960 semanas × 5.8 min/semana ≈ 93 horas
```

#### Calendário Simplificado

```
Mês do jogo = floor(semana_atual / 4) + 1
Ano do jogo = floor((mês_atual - 1) / 12) + 1
Temporada = spring (meses 3-5), summer (6-8), autumn (9-11), winter (12,1,2)
Dia da semana = (dia_na_semana % 7): 0=Mon, 1=Tue, ..., 6=Sun
```

## Edge Cases

- **Skip durante evento urgente**: Skip é interrompido, jogo força Pause,
  evento é apresentado. Jogador resolve antes de poder skipar novamente
- **Múltiplos eventos urgentes na mesma semana**: Processados em fila.
  Jogador resolve um, próximo aparece. Ordem: escândalos > burnout >
  propostas > avisos
- **Jogador pausa por muito tempo (AFK)**: Sem consequência. Tempo só
  avança com input do jogador (não é real-time)
- **Semana 960 (fim dos 20 anos)**: Jogo pode continuar infinitamente.
  20 anos é o horizonte do World Pack padrão, mas o calendário não para.
  Novas idols param de entrar se o pack acabou
- **Evento sazonal + skip**: Se jogador skipou a semana do prazo de
  inscrição, perde o evento. Decisão consciente -- avisos aparecem semanas
  antes
- **Dois eventos fixos no mesmo dia**: Ambos acontecem. Idol só pode
  participar de um (Schedule System resolve conflito)

## Dependencies

**Hard (não funciona sem):** Nenhuma -- é fundação.

**Soft:** World Pack (eventos fixos). Sem ele, calendário funciona mas
sem eventos sazonais pré-definidos.

**Depended on by:**
Agency Economy, Schedule/Agenda, Week Simulation, Event/Scandal Generator,
Idol Lifecycle, Financial Reporting, Calendar/Planning UI, Stats System
(tick semanal), Happiness, Fame, Contract, Rival AI, Music Charts.

## Tuning Knobs

| Knob | Default | Range | Se muito alto | Se muito baixo |
|---|---|---|---|---|
| `LIVE_SPEED_BASE` | 60s/dia | 15-120s | Muito lento, tedioso | Muito rápido, sem tempo de reagir |
| `WEEKS_PER_MONTH` | 4 | 4 (fixo) | N/A | N/A |
| `MONTHS_PER_YEAR` | 12 | 12 (fixo) | N/A | N/A |
| `URGENT_EVENT_TYPES` | 5 tipos | Configurável | Muitas interrupções, irritante | Jogador perde eventos importantes |
| `EVENT_WARNING_WEEKS` | 4 semanas | 1-12 | Avisos cedo demais, ignorados | Sem tempo de se preparar |
| `MAX_SPEED_MULTIPLIER` | ×4 | ×2-×8 | Perde eventos em Live | Modo Live lento demais |

## Acceptance Criteria

1. 20 anos completos rodam sem overflow ou erro de calendário
2. Modo Skip processa 1 semana em <200ms no PC target
3. Modo Live roda a 60fps sem drops durante processamento diário
4. Eventos urgentes interrompem Skip corretamente em 100% dos casos
5. Calendário sazonal mapeia corretamente pra primavera/verão/outono/inverno
6. Eventos fixos do World Pack aparecem no mês/semana corretos todo ano
7. Pause não consome CPU (zero processing enquanto pausado)
8. Transição entre modos (Pause↔Live↔Skip) é instantânea (<100ms)
9. Relatórios mensais disparam exatamente na semana 4 de cada mês
10. Jogador pode continuar jogando além de 20 anos sem crash

## Open Questions

- **RESOLVIDO**: Calendário genérico (Ano 1, Ano 2...)
- **DEFERIDO**: Push notifications sim, mas não é prioridade agora
- **RESOLVIDO**: Velocidade Live: varia com número de jobs por período do
  dia, eles vão se revelando. Velocidade 2x e 4x disponíveis para todos
- **RESOLVIDO**: Skip disponível para todos. Loading bar aparece em hardware
  low-end até completar processamento
