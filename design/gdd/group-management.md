# Group Management

> **Status**: Designed (v2 — referências a show/setlist/audience systems)
> **Author**: user + game-designer
> **Last Updated**: 2026-04-04
> **Implements Pillar**: Pilar 3 — Múltiplos Caminhos ao Topo
> **Related**: show-system.md (papéis por música, sinergia), setlist-system.md, audience-system.md (lightstick distribution), idol-attribute-stats.md (Trabalho em Equipe)
> **Wireframe**: wireframes/09-groups.md

## Overview

O Group Management permite ao jogador criar, gerenciar e dissolver grupos de
idols. Grupos têm ranking próprio, sinergia baseada em complementaridade de
stats, e podem participar de jobs exclusivos de grupo. Bandas pré-formadas
do World Pack são contratadas como unidade. Após o período de lock de membros,
o jogador pode adicionar/remover integrantes. Grupos são um caminho estratégico
alternativo: investir num grupo coeso vs. focar em carreiras solo.

## Player Fantasy

A fantasia é de **arquiteto de dream team**. Montar um grupo onde cada membro
cobre uma fraqueza do outro. A cantora principal com Vocal 90, a dançarina com
Dança 95, a "face" com Visual 98, a entertainer com Variedade 85. A sinergia
faz o grupo valer mais que a soma das partes. Serve o **Pilar 3**: grupos são
um caminho ao topo tão válido quanto idols solo.

## Detailed Design

### Core Rules

#### 1. Criar Grupo

- Jogador seleciona 1-12 idols do roster
- 1 membro = **solo act** (grupo de 1 — tem nome, logo, repertório, fama própria; sem sinergia/chemistry/pivô)
- 2+ membros = grupo padrão com todas mecânicas (sinergia, chemistry, pivô, etc.)
- Define nome do grupo (jogador escolhe)
- Escolhe logo entre ~200 logos pré-gerados por LLM
- **Define líder** do grupo (jogador escolhe, pode trocar depois; solo não tem líder)
- Grupo formado instantaneamente, aparece nos rankings de grupo
- Requer: todas idols contratadas pela mesma agência
- Uma idol pode pertencer a **múltiplos grupos** simultaneamente (como na vida real). Chemistry e afinidade são por par de idols, não por grupo

#### 2. Líder do Grupo

Cada grupo tem 1 líder designado pelo jogador:
- **Líder saudável e performando bem**: Bônus de chemistry +0.02/mês
- **Líder em crise (wellness ruim)**: Todos membros sofrem Felicidade -5/semana
- **Disputa de liderança** (trigger determinístico, 2 caminhos):
  - Caminho A: Líder tem stats abaixo de outro membro em 3+ atributos E
    Consistência baixa → membro com Ambição > 14 desafia liderança
  - Caminho B: Líder performa mal em 3 shows consecutivos ENQUANTO resto
    do grupo vai bem (performance líder < média do grupo por 3 shows)
  - Se não resolvido (troca de líder ou treino) → conflito escala

#### 3. Bandas Pré-formadas (World Pack)

- Contratadas como unidade (aceitar = contratar todas)
- Contrato individual por membro mas proposta é pro grupo todo
- Lock de membros por tempo negociado (6 meses - 2 anos)
- Após lock: jogador pode adicionar/remover livremente
- Se membro rescinde durante lock: sai do grupo, grupo continua
- Líder da banda pré-formada já vem definido na seed

#### 4. Cálculo de Stats do Grupo (Top 50%)

Stats do grupo são calculados pela **média dos top 50% dos membros** em
cada atributo:

```
stat_grupo[attr] = media(top_50%(membros, attr))

Exemplos:
  Grupo de 12: média dos 6 maiores valores de cada atributo
  Grupo de 6: média dos 3 maiores
  Grupo de 4: média dos 2 maiores
  Duo (2): pega o MAIOR valor de cada atributo (máximo de complementaridade)
```

Isso significa:
- **Duo é extremamente complementar**: cada membro cobre o melhor do outro
- **Grupo grande precisa de mais talentos**: com 12, precisa de 6 bons em cada área
- **Membros fracos não puxam pra baixo** (não estão no top 50%)
  MAS podem causar problemas internos (ver "Pivô" abaixo)

#### 5. Pivô (Contribuição Mínima)

Uma idol é **pivô** do grupo se está no top 50% de pelo menos 1 atributo:

```
é_pivô = existe ao menos 1 atributo onde idol está no top ceil(N/2) do grupo
```

- Idol que é pivô em Vocal: ela contribui pro cálculo de Vocal do grupo
- Idol que NÃO é pivô em NENHUM atributo: **patinho feio** -- não contribui nada
- Patinho feio causa tensão interna e eventualmente crise

**Trigger de crise "patinho feio"** (determinístico):
1. Idol não é pivô em nenhum atributo ✅
2. Grupo fez show com resultado < Sucesso (Parcial ou Fracasso) ✅
3. 4+ semanas desde que idol entrou no grupo ✅
→ **Crise "membro fraco"**: Felicidade -10 pra todos, fãs criticam o membro,
   chemistry -0.05. Pode escalar pra pedido de remoção

**Assistente**: Avisa ao montar grupo: "Idol X não será pivô em nenhum
atributo neste grupo. Risco de crise interna após shows ruins."

#### 6. Sinergia

```
sinergia = complementaridade × chemistry

complementaridade = 0.0 a 0.3
  Calculada por: quantas categorias (Performance, Presença, Resiliência)
  têm pivôs diferentes (membros cobrindo áreas diversas)
  Grupo com todos fortes em Vocal = 0.05 (redundante)
  Grupo com pivôs bem distribuídos = 0.25 (complementar)

chemistry = 0.0 a 0.2
  Base 0.1. Cresce +0.01 por mês trabalhando juntas
  Líder saudável: +0.02/mês extra
  Conflito interno: -0.05 por conflito
  Max: 0.2 (2+ anos juntas sem conflitos)
```

#### 7. Fama do Grupo (separada das idols)

O grupo acumula **fama própria** independente da fama individual:

```
// Ao CRIAR grupo:
fama_grupo_inicial = media_ponderada(fama_de_cada_membro)

// A cada semana:
fama_grupo += ganhos_de_jobs_em_grupo + ganhos_de_musicas_do_grupo
fama_idols_individuais += ganhos_individuais_normais

// Se membro SAI:
fama_grupo = fama_grupo (NÃO MUDA -- fama do grupo é do grupo, não das idols)
media_ponderada_nova recalcula pra membros restantes

// Modelo K-pop:
// Grupo com fama 8000 perde 1 membro problemático → fama continua 8000
// Idol substituta entra → grupo absorve, fama intacta
// Fama do grupo >> fama individual é o estado natural de grupos maduros
```

#### 8. Performance de Grupo

```
performance_grupo_job = media(performance_individual_top50%) × (1 + sinergia)
  Nota: performance usa top 50% (pivôs), não média geral
```

#### 9. Influência entre Membros

Idols que fazem atividades juntas (treino, jobs, shows) influenciam os
stats umas das outras. A influência acontece quando uma idol é
significativamente melhor que outra num atributo:

```
// Condição: idol A influencia idol B no stat X se:
stat_A[X] > stat_B[X] + 15

// Ganho mensal:
ganho = (stat_A[X] - stat_B[X]) × 0.02 × afinidade_AB × trabalho_em_equipe_B / 100

// Exemplo: Hana (Vocal 90) influencia Yui (Vocal 72), afinidade 0.82, TrabEquipe Yui 74
// ganho = (90-72) × 0.02 × 0.82 × 74/100 = 0.22/mês
```

**Regras:**
- Afinidade alta entre as duas idols amplifica a influência
- Trabalho em Equipe da idol aprendiz amplifica a absorção
- Funciona entre idols de rosters diferentes se fazem atividades juntas (ex: show multi-agência)
- Influência é bidirecional: cada idol ensina nos stats onde é forte e aprende onde é fraca

#### 10. Afinidade Individual entre Idols

Afinidade é um valor 0.0-1.0 entre cada par de idols no jogo. Não
pertence ao grupo — pertence ao par. Se duas idols estão em grupos
diferentes mas fazem um show juntas, a afinidade entre elas cresce.

```
// Crescimento de afinidade:
+0.01 por job juntas (mesmo grupo ou convidadas no mesmo evento)
+0.02 por treino de grupo
+0.03 por show com sucesso ≥ A
-0.05 por conflito entre as duas idols

// Max teórico: 1.0 (na prática ~0.90 após anos juntas)
// Afinidade inicial entre estranhas: 0.10
```

Afinidade afeta: influência mútua de stats, chemistry do grupo,
sinergia, felicidade dos membros.

#### 11. Dinâmicas de Grupo

- **Líder em crise**: Todo grupo sofre. Disputa de liderança possível
- **Patinho feio**: Membro que não é pivô → crise após show ruim
- **Membro mais famoso**: Se fama individual > 3× média do grupo e Ambição alta,
  pode pedir carreira solo (conflito)
- **Grupo com chemistry alta**: Bônus em jobs de grupo
- **Grupo com conflito**: Penalidade em performance, risco de dissolução

### States and Transitions

| Estado | Descrição | Transição |
|---|---|---|
| **Ativo** | Grupo funcionando | → Em conflito, → Dissolvido |
| **Em lock** | Membros travados (pré-formada) | → Ativo (lock expirou) |
| **Em conflito** | 2+ membros com problemas | → Ativo (resolvido), → Dissolvido |
| **Dissolvido** | Grupo acabou | Terminal (membros voltam a solo) |

### Interactions with Other Systems

| Sistema | Direção | O que flui |
|---|---|---|
| **Stats System** | ← lê | Stats dos membros pra calcular sinergia |
| **Contract System** | ← lê | Contratos individuais, lock de grupo |
| **Fame & Rankings** | ↔ bidirecional | Ranking de grupo separado, fama compartilhada |
| **Job Assignment** | ← fornece | Jobs de grupo como tipo, performance de grupo |
| **Happiness & Wellness** | ← lê | Conflitos afetam felicidade de membros |
| **Event/Scandal Generator** | ← gera | Conflitos internos como eventos |
| **Music Charts** | ← lê | Grupo pode lançar músicas/álbuns coletivos |

## Formulas

Ver Core Rules seções 4-8 para todas fórmulas (top 50%, pivô, sinergia, fama, performance).

## Edge Cases

- **Grupo com 1 membro (solo act)**: Funciona como solo — tem nome, logo, repertório e fama própria. Sem sinergia, chemistry, pivô, líder. Se membro sai, grupo é dissolvido
- **Membro sai do grupo**: Fama do GRUPO permanece intacta. Média individual recalcula
- **Jogador move membro pra outro grupo**: Sai do A, entra no B. Chemistry reseta no B
- **Grupo de 12 com 6 patinhos feios**: Crise garantida após qualquer show ruim.
  Jogador precisa treinar ou substituir membros fracos
- **Duo onde ambos são melhores em tudo**: Top 50% = top 1 = cada um brilha no
  que é melhor. Duo é a formação mais complementar possível
- **Líder entra em burnout**: Grupo inteiro sofre Felicidade -5/semana.
  Jogador deve trocar líder ou dar folga
- **Fama do grupo = 8000, idol SSS sai**: Fama do grupo continua 8000.
  Nova idol entra, grupo absorve. Modelo K-pop realista
- **Grupo maduro (5+ anos) com fama >> membros**: Normal. Fama do grupo é
  independente. Substituições não afetam. Só dissolução zera

## Dependencies

**Hard**: Stats, Contract, Fame
**Soft**: Happiness, Events, Music Charts
- **Producer Profile** (#50): Estilo (Group Strategist) afeta sinergia +15% e revela combos. Ver `producer-profile.md` seção 4c.
**Depended on by**: Job Assignment, Fame Rankings, Music Charts

## Tuning Knobs

| Knob | Default | Range | Efeito |
|---|---|---|---|
| `MIN_GROUP_SIZE` | 1 | 1-3 | Mínimo de membros (1 = solo act) |
| `MAX_GROUP_SIZE` | 12 | 6-20 | Máximo de membros |
| `CHEMISTRY_GROWTH_PER_MONTH` | 0.01 | 0.005-0.02 | Crescimento de chemistry |
| `SYNERGY_MAX` | 0.3 | 0.1-0.5 | Bônus máximo de sinergia |
| `LOCK_PERIOD_DEFAULT` | 12 meses | 6-24 | Lock padrão de pré-formadas |

## Acceptance Criteria

1. Grupo criado com 1-12 idols (1 = solo act, 2+ = grupo com líder designado)
2. Stats calculados pela média dos top 50% membros por atributo
3. Duo pega o melhor valor de cada atributo (top 1 de 2)
4. Pivô identificado corretamente: idol no top 50% de pelo menos 1 atributo
5. Patinho feio (sem pivô) causa crise determinística após show ruim
6. Líder em crise afeta felicidade de todos (-5/semana)
7. Fama do grupo é independente: membro sair NÃO reduz fama do grupo
8. Fama inicial = média ponderada da fama dos membros
9. Sinergia calculada por complementaridade + chemistry
10. Bandas pré-formadas contratadas como unidade com lock
11. Assistente avisa sobre patinho feio ao montar grupo
12. Solo act dissolve se membro sai; grupo de 2+ dissolve se <1 membro
13. Idol pode pertencer a múltiplos grupos simultaneamente
14. ~200 logos pré-gerados disponíveis na criação

## Open Questions

- **RESOLVIDO**: Sem sub-grupos
- Graduação de membro: cerimônia pública que afeta fama do grupo e do membro?
- Votação interna de líder: fãs ou membros podem votar pra trocar líder?
