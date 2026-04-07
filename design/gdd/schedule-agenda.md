# Schedule/Agenda Management

> **Status**: Designed (v2 — ontologia de 3 tipos de atividade)
> **Author**: user + game-designer
> **Last Updated**: 2026-04-04
> **Implements Pillar**: Pilar 2 — Suas Decisões, Suas Consequências
> **Related**: job-assignment.md (ontologia: Jobs / Performance Events / Support Activities), setlist-system.md (3 tipos de ensaio), show-system.md, staff-functional.md (produtor time budget)

## Overview

O Schedule/Agenda Management é a interface entre o jogador e o tempo das idols.
Gerencia a alocação de slots diários (jobs, treinos, facilities, descanso) por
semana, mostra visualmente a carga de cada idol com código de cores, e enforça
restrições de contrato (carga máxima, descanso obrigatório). É onde o jogador
"monta o quebra-cabeça" da semana -- encaixando jobs, treinos e descanso no
tempo limitado de cada idol.

## Player Fantasy

A fantasia é de **malabarista de agendas** -- como um produtor real que olha o
calendário e pensa "segunda e terça tem show, quarta treino de vocal, quinta
psicólogo, sexta gravação, sábado folga, domingo meet & greet". A satisfação de
preencher a semana otimamente, e a tensão de não ter slots suficientes pra tudo.
Serve o **Pilar 2**: lotou a agenda = consequências de stress. Deixou vazia =
perdeu receita.

## Detailed Design

### Core Rules

#### 1. Estrutura da Agenda

- 7 dias por semana (Segunda a Domingo)
- Cada dia tem **2 slots**: Manhã e Tarde/Noite
- Total: 14 slots/semana por idol
- Cada atividade ocupa 1 ou 2 slots (show grande = dia inteiro = 2 slots)

#### 2. Tipos de Atividade no Slot

| Atividade | Slots | Efeito |
|---|---|---|
| **Job** | 1-2 | Receita, fama, experiência |
| **Treino** | 1 | Crescimento de stat focado (requer facility) |
| **Psicólogo** | 1 | Reduz stress (requer facility) |
| **Composição** | 1-2 | Idol compondo música (requer Motivação >60) |
| **Descanso** | 1 (ou dia inteiro) | Recupera saúde e stress |
| **Folga obrigatória** | Dia inteiro | Cláusula de contrato -- não pode alocar nada |
| **Bloqueio (sem exclusividade)** | 1-2 (aleatório) | Idol sem exclusividade bloqueia slot |
| **Viagem** | 1-2 | Deslocamento pra job em outra região/turnê |

#### 3. Restrições

- **Carga máxima** (contrato): Máximo de X jobs/semana definido no contrato
- **Descanso obrigatório** (contrato): Mínimo de Y dias livres/semana
- **Burnout**: Idol em burnout = todos slots bloqueados (roxo)
- **Incapacitada**: Saúde <20 = bloqueada. Forçar = dano permanente
- **Idade mínima**: Idols <16 anos têm carga máxima forçada de 3 jobs/semana
  independente do contrato (proteção de menores)

#### 4. Código de Cores

| Cor | Significado | Regra |
|---|---|---|
| **Verde** | Saudável, carga ok | Todas barras wellness >50, carga <70% do máximo |
| **Amarelo** | Atenção | 1+ barra 20-49 OU carga 70-90% do máximo |
| **Vermelho** | Crítico | 1+ barra <20 OU carga >90% do máximo |
| **Roxo** | Bloqueada | Burnout, incapacitada, ou folga obrigatória |

O jogador PODE escalar jobs em amarelo e até vermelho. O jogo não impede --
só mostra claramente. Consequências vêm depois. Roxo é bloqueio total -- não
há como alocar nada.

#### 5. Visão de Horizonte Temporal

- **Semana atual**: Grid detalhado 7×2 slots por idol
- **Próximas 4 semanas**: Resumo com jobs confirmados e prazos
- **Próximos 3 meses**: Eventos do calendário, turnês, contratos vencendo
- **Próximo ano**: Eventos sazonais fixos do World Pack

### States and Transitions

| Estado do Slot | Descrição | Transição |
|---|---|---|
| **Vazio** | Disponível pra alocação | → Alocado (jogador escalou algo) |
| **Alocado** | Atividade confirmada | → Em execução (dia chegou) |
| **Em execução** | Job/treino acontecendo | → Concluído (fim do slot) |
| **Concluído** | Resultado processado | Terminal |
| **Bloqueado (roxo)** | Folga obrigatória, burnout, ou incapacidade | Não pode ser alocado |
| **Bloqueado (exclusividade)** | Idol sem exclusividade bloqueou | Terminal (slot perdido) |

### Interactions with Other Systems

| Sistema | Direção | O que flui |
|---|---|---|
| **Job Assignment** | ← recebe | Jobs escalados ocupam slots |
| **Happiness & Wellness** | ↔ bidirecional | Barras determinam cor. Carga afeta stress |
| **Time/Calendar** | ← tick | Agenda avança com o tempo, slots passados são processados |
| **Contract System** | ← restringe | Carga máxima, descanso obrigatório, exclusividade |
| **Agency Economy** | ← facilities | Facilities (treino, psicólogo) requerem slots |
| **Stats System** | ← lê | Resistência afeta quando amarelo/vermelho aparece |
| **Week Simulation** | → alimenta | Agenda completa da semana é input pra simulação |
| **Music Charts** | ← slots | Composição e gravação ocupam slots |
| **Media Entities** | ← slots | Jobs recorrentes de TV/rádio ocupam slots fixos |
| **Idol Personal Finance** | ← slots | Viagens pessoais (férias) bloqueiam slots |

## Formulas

#### Carga Percentual

```
carga_percentual = slots_ocupados_jobs / (14 - slots_folga_obrigatoria) × 100
```

#### Cor da Agenda

```
se burnout OU incapacitada: ROXO
se carga > 90% OU qualquer_barra < 20: VERMELHO
se carga > 70% OU qualquer_barra < 50: AMARELO
senão: VERDE
```

#### Stress Semanal da Agenda

```
stress_semanal = (slots_com_job × STRESS_PER_SLOT) - (slots_descanso × REST_PER_SLOT)

STRESS_PER_SLOT = 3 (base), ajustado por tipo de job:
  Show/concerto: 5, Gravação: 4, TV: 3, Meet & greet: 2, Streaming: 2

REST_PER_SLOT = 4
```

## Edge Cases

- **Idol sem exclusividade bloqueia slot com job importante**: Job perdido
  ou penalizado. Jogador devia ter backup ou exclusividade
- **Job de turnê ocupa 2+ semanas**: Slots bloqueados por todo período.
  Outros jobs cancelados ou reagendados
- **Todas idols em vermelho**: Jogador sobre-escalou. Precisa cancelar
  jobs (com multa) ou aceitar consequências
- **Idol <16 com agenda acima do limite**: Sistema bloqueia. Não permite
  escalar acima de 3 jobs/semana pra menores
- **Psicólogo agendado mas idol cancelou**: Slot liberado mas idol perde
  benefício. Pode reagendar se slot livre
- **Treino + job no mesmo dia**: Possível (manhã treino, tarde job).
  Idol ganha experiência de ambos mas stress maior
- **Idol com 0 slots de descanso por 4 semanas**: Stress acumula
  rapidamente. Burnout quase garantido

## Dependencies

**Hard:**
- Job Assignment — jobs são a principal atividade nos slots
- Happiness & Wellness — barras determinam código de cores
- Time/Calendar — agenda existe dentro do ciclo semanal

**Soft:**
- Contract System — restrições de carga e descanso
- Agency Economy — facilities como atividades de slot
- Music Charts — composição/gravação como tipo de slot

**Depended on by:**
Week Simulation (precisa da agenda completa), Calendar/Planning UI, todos
sistemas que checam disponibilidade de idol

## Tuning Knobs

| Knob | Default | Range | Efeito |
|---|---|---|---|
| `SLOTS_PER_DAY` | 2 | 2-3 | Slots por dia (2 = manhã/tarde) |
| `MINOR_MAX_JOBS_WEEK` | 3 | 2-5 | Carga máxima forçada pra <16 anos |
| `GREEN_LOAD_THRESHOLD` | 70% | 50-80% | Limiar pra verde→amarelo |
| `YELLOW_LOAD_THRESHOLD` | 90% | 80-95% | Limiar pra amarelo→vermelho |
| `STRESS_PER_SLOT_BASE` | 3 | 1-6 | Stress base por slot de job |
| `REST_PER_SLOT` | 4 | 2-8 | Recuperação por slot de descanso |

## Acceptance Criteria

1. Grid 7×2 mostra slots com atividades alocadas por idol
2. Código de cores reflete corretamente barras de wellness + carga
3. Roxo = bloqueio total (burnout, incapacitada, folga obrigatória)
4. Contrato enforça carga máxima e descanso obrigatório
5. Menores de 16 limitados a 3 jobs/semana automaticamente
6. Facilities (treino, psicólogo) competem com jobs por slots
7. Bloqueios de idol sem exclusividade aparecem corretamente
8. Visão de horizonte mostra 4 semanas, 3 meses e 1 ano
9. Jogador pode escalar em amarelo/vermelho (jogo não impede, só mostra)
10. Agenda alimenta Week Simulation com todos slots da semana

## Open Questions

- **RESOLVIDO**: Drag-and-drop de slots (mouse + teclado no PC)
- **RESOLVIDO**: Auto-fill de agenda: recurso integrado para todos. Sugere melhores
  oportunidades automaticamente
- Notificação quando agenda muda: definir na implementação de UI
