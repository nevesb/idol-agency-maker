# Contract System

> **Status**: Designed
> **Author**: user + game-designer
> **Last Updated**: 2026-03-29
> **Implements Pillar**: Pilar 1 — Simulação com Profundidade Real, Pilar 2 — Suas Decisões, Suas Consequências

## Overview

O Contract System governa a relação legal entre agência e idol. Define as 9
cláusulas negociáveis, o processo de proposta/negociação/assinatura, renovações,
rescisões, e divisão de receita (incluindo royalties musicais). Contratos vêm
**pré-preenchidos com preferências da idol** pra acessibilidade -- o casual
aceita e joga; o hardcore negocia cada cláusula buscando vantagem. Cada
cláusula cria trade-offs em cadeia com outros sistemas (felicidade, agenda,
escândalos, economia).

## Player Fantasy

A fantasia é de **negociador astuto**. Ler as preferências da idol, entender
os riscos de cada cláusula, e montar um contrato que maximize seu retorno
enquanto mantém a idol satisfeita o suficiente pra não sair. A tensão: uma
idol SSS exige termos caros, mas recusar pode significar perdê-la pra um
rival. Serve o **Pilar 2**: cada cláusula é uma decisão com consequências
reais em cadeia.

## Detailed Design

### Core Rules

#### 1. As 9 Cláusulas

| # | Cláusula | Range | Preferência da idol (auto-fill) |
|---|---|---|---|
| 1 | **Duração** | 6 meses / 1 ano / 2 anos | Curta se tier alto, longa se novata |
| 2 | **Salário fixo** | ¥50K-¥10M/mês | Proporcional ao tier e fama |
| 3 | **% de receita** | 10-60% dos jobs | Alta se famosa, baixa se novata |
| 4 | **Exclusividade** | Sim / Não | Tier alto prefere Não |
| 5 | **Carga máxima** | 3-7 jobs/semana | Tier alto exige menos |
| 6 | **Direito de imagem** | Total / Parcial / Restrito | Varia por personalidade |
| 7 | **Cláusula de rescisão** | ¥0 a ¥500M | Agência quer alta, idol quer baixa |
| 8 | **Restrição de namoro** | Sim / Não | Depende de Vida Pessoal (oculto) |
| 9 | **Descanso obrigatório** | 0-3 dias/semana | Proporcional à idade e stress |

#### 2. Exclusividade e Risco Operacional

Idols **sem exclusividade** são mais baratas mas trazem risco concreto na agenda:

- **Bloqueia dia aleatoriamente**: "Tenho outro compromisso" -- slot perdido,
  job pode ser afetado ou cancelado
- **Atrasa pra compromisso**: Job acontece mas com penalidade de performance
  (-10 a -30% no resultado)
- **Frequência de problemas**: Proporcional ao inverso de Disciplina e Lealdade
  (ocultos -- jogador descobre pelo padrão de comportamento)
- **Aceita jobs por fora**: Receita vai pra rival ou pra própria idol. Jogador
  perde a receita mas não pode impedir legalmente

Exclusividade ON: Custo maior (idol pede mais salário) mas zero risco operacional.
Exclusividade OFF: Custo menor mas agenda imprevisível. Trade-off claro.

#### 3. Processo de Contratação

```
1. PROPOSTA: Jogador faz proposta OU clica "auto-fill" (preferências da idol)
2. NEGOCIAÇÃO: Idol avalia cada cláusula vs. suas preferências
   - Cláusula dentro da preferência: aceita
   - Cláusula fora: contra-propõe (1-3 rodadas)
   - Cláusula muito fora: recusa direto
3. DECISÃO: Idol aceita, recusa, ou rival faz proposta melhor
4. ASSINATURA: Contrato ativo, cláusulas em vigor
```

O casual pula tudo: clica "propor auto-fill" → idol aceita → pronto.

#### 4. Renovação

- Contratos vencem na data de duração
- Aviso 4 semanas antes do vencimento
- Idol famosa exige melhores termos na renovação (salário +20-50%)
- Idol infeliz pode recusar renovação
- Idol que quer sair: Lealdade baixa + Ambição alta + proposta rival

#### 5. Rescisão

- Jogador pode rescindir pagando a multa de rescisão
- Idol pode exigir rescisão se Felicidade < 20 por 4+ semanas
- Rescisão libera idol pro mercado (rivais podem pegar)
- Rescisão mútua (ambos querem): multa reduzida em 50%

#### 6. Divisão de Royalties Musicais

- % base de receita do contrato aplica a royalties de músicas
- Idol que **compôs** a música: recebe parte de compositor extra (+20%)
- Cover: artista original recebe %, idol que performa recebe % do contrato
- Royalties são receita mensal enquanto música estiver no ranking
- Idol rescindida continua recebendo royalties de compositor das suas músicas

#### 7. Contratos de Grupo (bandas pré-formadas)

Quando o jogador contrata uma banda pré-formada:
- Contrato é **individual por membro** -- cada idol assina separadamente
- Porém, todas vêm juntas (aceitar = aceitar o grupo todo)
- Jogador se torna **dono do grupo**: controla nome, formação, agenda do grupo
- **Lock de membros**: Por tempo negociado no contrato, formação é travada.
  Jogador não pode remover membros nem adicionar novos durante o lock
- Após o lock expirar: jogador pode adicionar/remover membros livremente
- Se um membro individual rescinde, sai do grupo mas o grupo continua
- Se todos membros rescendem, grupo se dissolve

#### 8. Compositores (sem contrato fixo)

Compositores NPC **não têm contrato** com a agência. Relacionamento é
transacional -- pagamento por faixa produzida:

- **Custo de produção**: One-time, proporcional ao tier do compositor
- **Royalties**: Compositor recebe % das vendas/streams da música
- Agência pode encomendar música a qualquer momento se tiver orçamento
- Compositores populares podem recusar se estiverem ocupados com outras
  agências
- Não há exclusividade de compositor -- rivais usam os mesmos

### States and Transitions

| Estado | Descrição | Transição |
|---|---|---|
| **Sem contrato** | Idol livre no mercado | → Em negociação (proposta feita) |
| **Em negociação** | Proposta enviada, contra-propostas | → Ativo (aceito), → Sem contrato (recusado) |
| **Ativo** | Contrato em vigor | → Em renovação (4 semanas antes do fim) |
| **Em renovação** | Negociando novos termos | → Ativo (renovado), → Sem contrato (expirado/recusado) |
| **Rescindido** | Multa paga, idol liberada | → Sem contrato |

Idol pode estar Em negociação com múltiplas agências simultaneamente.
Agência rival pode fazer contra-proposta durante sua negociação.

### Interactions with Other Systems

| Sistema | Direção | O que flui |
|---|---|---|
| **Stats System** | ← lê | Tier e stats determinam preferências e valor da idol |
| **Agency Economy** | ↔ bidirecional | Salários/% como despesa; multas de rescisão; royalties |
| **Happiness & Wellness** | ← lê, → afeta | Cláusulas afetam felicidade; infelicidade causa rescisão |
| **Schedule/Agenda** | → restringe | Carga máxima e descanso obrigatório limitam escalação. Exclusividade OFF causa bloqueios aleatórios |
| **Market/Transfer** | ← lê | Valor de mercado informa multas e propostas |
| **Scouting** | ← lê | Scouting informa tier/stats pra avaliar antes de propor |
| **Rival Agency AI** | ↔ bidirecional | IA faz propostas concorrentes; jogador pode contra-propor |
| **Event/Scandal Generator** | ← lê | Restrição de namoro afeta probabilidade de escândalo |
| **Music Charts** | → royalties | Divisão de royalties conforme contrato. Bônus de compositor (+20%) pra idol que compôs. Cover paga % ao original |
| **Media Entities** | ← lê | Contratos de exclusividade de slot (idol contratada pra programa regular) |
| **Idol Personal Finance** | → afeta negociação | Idol endividada aceita termos piores (desesperada). Idol com assessor pessoal bloqueia ofertas <90% mercado. Dívida modifica salário desejado |
| **Assessoria Jurídica** | ← facility | +20% de gordura na aceitação de condições piores que a idol queria. Sem custo extra (já pago na facility mensal) |

## Formulas

#### Preferência de Salário da Idol

```
salario_desejado = base_tier × mult_fama × mult_idade × mult_renovacao

onde:
  base_tier = F ¥50K, E ¥100K, D ¥300K, C ¥800K, B ¥2M, A ¥4M, S+ ¥8M
  mult_fama = ranking_factor (top 10 = ×3, top 100 = ×1.5, rest = ×1)
  mult_idade = 1.0 (prime), 0.8 (jovem), 0.9 (veterana)
  mult_renovacao = 1.2 a 1.5 (cada renovação pede mais)
```

#### Chance de Aceitação por Cláusula

```
chance = 1.0 se cláusula dentro da preferência
chance = 0.7 se 1 nível fora
chance = 0.3 se 2 níveis fora
chance = 0.0 se 3+ níveis fora (recusa direta)

Modificadores: Lealdade alta +0.1, Ambição alta -0.1, proposta rival ativa -0.2
             Assessoria Jurídica (facility) +0.2 em contratações e renovações
```

#### Multa de Rescisão

```
multa = salario_mensal × meses_restantes × RESCISSION_FACTOR
  RESCISSION_FACTOR = 0.5 (padrão, negociável de 0.0 a 2.0)
```

#### Royalties de Compositor (idol que compôs)

```
royalty_compositor = receita_musica × COMPOSER_BONUS_RATE
  COMPOSER_BONUS_RATE = 0.20 (20% extra além da % normal do contrato)
```

#### Risco Operacional (sem exclusividade)

```
chance_bloqueio_semanal = (20 - Disciplina) / 20 × (20 - Lealdade) / 20 × BASE_BLOCK_RATE
  BASE_BLOCK_RATE = 0.15 (15% chance base por semana)

chance_atraso = chance_bloqueio × 0.5 (metade dos problemas são atrasos, não bloqueios)
penalidade_atraso = -10% a -30% no resultado do job (proporcional ao atraso)
```

Exemplo: Disciplina 5, Lealdade 5 → chance ~5.6%/semana de bloqueio.
Disciplina 15, Lealdade 15 → chance ~0.9%/semana. Quase nulo.

## Edge Cases

- **Idol sem contrato recebe 2 propostas simultâneas**: Escolhe pela
  melhor combinação de cláusulas vs. preferências + Lealdade com agência
  anterior (se houver)
- **Contrato vence durante turnê**: Jogador é avisado antes da turnê
  começar que o contrato expira no meio dela. Renegociação prematura é
  oferecida pra estender o prazo. Se ignorar, turnê pode ser cancelada
- **Idol com exclusividade OFF aceita job de rival**: Legal. Receita vai
  pro rival. Jogador não pode impedir
- **Jogador propõe salário ¥0**: Possível pra novatas rank F desesperadas.
  Idol aceita mas felicidade cai drasticamente
- **Idol compõe música e depois é rescindida**: Royalties de compositor
  continuam sendo pagos à idol enquanto música estiver no ranking
- **Rival oferece proposta durante renovação**: Idol compara as duas.
  Lealdade e afinidade pesam, mas proposta muito melhor pode vencer
- **Idol sem exclusividade bloqueia dia de evento importante**: Job é
  perdido. Consequências de fama e economia. Jogador devia ter negociado
  exclusividade ou ter backup escalado
- **Todas cláusulas no máximo pró-idol**: Contrato caríssimo mas idol
  muito feliz e leal. Viável pra agência Elite com margem, inviável pra
  Garagem

## Dependencies

**Hard:**
- Stats System — tier/stats determinam preferências e valor
- Agency Economy — salários custam dinheiro, multas impactam saldo

**Soft:**
- Assessoria Jurídica (facility) — +20% chance de aceitação em contratações e renovações
- Happiness — sem ele, cláusulas não afetam felicidade
- **Producer Profile** (#50): Traços e background afetam acceptanceProbability (±10-15%). Ver `producer-profile.md` seção 4d.

**Depended on by:**
Schedule/Agenda, Market/Transfer, Scouting, Rival AI, Event/Scandal,
Music Charts, Happiness & Wellness

## Tuning Knobs

| Knob | Default | Range | Efeito |
|---|---|---|---|
| `BASE_SALARY_BY_TIER` | Ver tabela | ¥10K-¥20M | Custo base das idols |
| `RENEWAL_SALARY_INCREASE` | 1.3× | 1.0-2.0× | Quanto mais pede na renovação |
| `NEGOTIATION_ROUNDS_MAX` | 3 | 1-5 | Rodadas antes de aceitar/recusar |
| `RESCISSION_FACTOR` | 0.5 | 0.0-2.0 | Peso da multa de rescisão |
| `COMPOSER_BONUS_RATE` | 0.20 | 0.10-0.40 | Extra pra idol que compõe |
| `LOYALTY_NEGOTIATION_BONUS` | +0.1 | 0-0.3 | Quanto lealdade ajuda na aceitação |
| `RIVAL_PROPOSAL_PENALTY` | -0.2 | -0.1 a -0.5 | Quanto proposta rival prejudica |
| `UNHAPPINESS_RESCISSION_THRESHOLD` | Felicidade < 20 | Felicidade < 10-30 | Quando idol exige rescisão |
| `BASE_BLOCK_RATE` | 0.15 | 0.05-0.30 | Chance base de bloqueio sem exclusividade |

## Acceptance Criteria

1. Auto-fill gera contrato aceito pela idol em 90%+ dos casos (casual-friendly)
2. Negociação permite ajustar cada cláusula independentemente
3. Idol de tier alto exige termos melhores que novata (verificável por tabela)
4. Renovação pede salário 20-50% maior que contrato anterior
5. Rescisão cobra multa correta pela fórmula e libera idol pro mercado
6. Rival AI pode fazer contra-proposta durante negociação do jogador
7. Royalties de compositor pagam extra mesmo após rescisão do contrato
8. Cláusula de namoro OFF + tempo livre = risco de escândalo emergente
9. Carga máxima do contrato limita escalação no Schedule System
10. Contrato vencido sem renovação libera idol automaticamente
11. Idol sem exclusividade bloqueia agenda aleatoriamente conforme fórmula
12. Atrasos de idol sem exclusividade penalizam performance do job

## Open Questions

- **RESOLVIDO**: Contratos de grupo são individuais por membro. Jogador vira
  dono do grupo com lock de membros por tempo negociado
- **RESOLVIDO**: Compositores não têm contrato fixo. Pagamento por faixa
  (custo de produção + royalties)
- **RESOLVIDO**: Empréstimos formais não existem na indústria real. Em vez
  disso, **colaboração por projeto**: outra agência convida sua idol pra
  participar de um projeto específico (single, show, drama). Sua idol
  continua contratada, receita dividida entre agências. Bom pra exposição
  de novatas em collabs com famosas de rival. Detalhar no Job Assignment GDD
- **RESOLVIDO**: Idol sem exclusividade que fica famosa: risco de bloqueio
  se mantém normal. Exceção: se tiver collabs ativas com outra agência,
  bloqueio pode aumentar (mais compromissos externos)
