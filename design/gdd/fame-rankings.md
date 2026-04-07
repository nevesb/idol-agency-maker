# Fame & Rankings System

> **Status**: Designed (v2 — referências a show/audience systems)
> **Author**: user + game-designer
> **Last Updated**: 2026-04-04
> **Implements Pillar**: Pilar 1 — Simulação com Profundidade Real, Pilar 3 — Múltiplos Caminhos ao Topo
> **Related**: show-system.md (shows geram fama), audience-system.md (conversão de fãs), music-entities.md (charts afetam fama)

## Overview

O Fame & Rankings System gerencia a reputação pública de cada idol, grupo e
agência através de um valor numérico de fama e 3 rankings paralelos atualizados
mensalmente. Fama sobe com jobs bem-sucedidos, músicas populares, mídia social,
e exposição. Desce com inatividade, fracassos e envelhecimento. Escândalos
leves/médios AUMENTAM fama (toda exposição é visibilidade) mas destroem
felicidade e stress. O tier visível (F→SSS) é derivado do ranking relativo,
não de um valor absoluto -- subir de tier significa ultrapassar outras idols.

## Player Fantasy

A fantasia é de **kingmaker** -- ver o nome da sua idol subir no ranking
semana a semana, ultrapassar rivais, e eventualmente chegar ao topo.
Serve o **Pilar 1 (Simulação)**: rankings refletem resultados reais de
jobs e investimentos. E o **Pilar 3 (Múltiplos Caminhos)**: uma idol pode
ser famosa por ser a melhor cantora, a mais carismática em TV, ou a que
mais vende merch -- caminhos diferentes pro topo.

## Detailed Design

### Core Rules

#### 1. Fama (valor numérico, 0-10000)

Cada idol e grupo tem um valor de **fama** que flutua semanalmente:

| Fonte de fama | Ganho |
|---|---|
| Job completado com sucesso | +5 a +200 (proporcional ao tier do job) |
| Música no top 100 | +10 a +100/mês (proporcional à posição) |
| Evento grande (festival, premiação) | +50 a +500 |
| Campanha de mídia social | +5 a +50 (proporcional ao investimento) |
| Endorsement/parceria de marca | +20 a +100 |
| Cover viral ou collab com famosa | +30 a +200 |

| Fonte de perda de fama | Perda |
|---|---|
| Inatividade (sem jobs por 2+ semanas) | -5/semana |
| Fracasso em job | -10 a -50 |
| Escândalo grave (crime, abuso) | -200 a -500 |
| Idade (curva de declínio) | -2 a -10/mês após pico |
| Idol debutou (aposentou) | Fama congela e decai lentamente |

#### 2. "Falem Bem, Falem Mal" — Exposição Midiática

Escândalos NÃO destroem fama automaticamente. Toda exposição é visibilidade.
Só escândalos graves reduzem fama:

| Tipo de exposição | Fama | Felicidade | Stress |
|---|---|---|---|
| Notícia positiva (sucesso, prêmio) | +Fama | +Felicidade | Neutro |
| Notícia neutra (aparição, menção) | +Fama (menor) | Neutro | Neutro |
| Escândalo leve (flagrada na rua) | +Fama (sobe!) | -Felicidade (leve) | +Stress (leve) |
| Escândalo médio (namoro exposto) | +Fama (sobe bastante) | -Felicidade (muito) | +Stress (muito) |
| Escândalo grave (crime, abuso) | -Fama (derruba) | -Felicidade (crítico) | +Stress (crítico) |

Trade-off perverso e realista: jogador cínico pode não proteger idol de
escândalos leves pra ganhar fama grátis -- mas paga com stress e infelicidade.
É o lado sombrio da indústria.

#### 3. Curva de Fama por Idade

Multiplicador aplicado ao ganho de fama:

| Faixa | Mult ganho | Mult perda | Nota |
|---|---|---|---|
| 12-15 | ×1.3 | ×0.5 | "Novidade" -- ganha rápido, perde devagar |
| 16-22 | ×1.0 | ×1.0 | Prime -- baseline |
| 23-28 | ×0.8 | ×1.2 | Precisa manter-se relevante |
| 29-35 | ×0.5 | ×1.5 | Declínio acelerado sem reinvenção |
| 36+ | ×0.3 | ×2.0 | Muito difícil manter, nicho de veterana |

#### 4. Os 3 Rankings (atualizados mensalmente)

**Ranking Individual**: Todas idols ativas rankeadas por fama.
- Top 10 recebem bônus de exposição (mais propostas de jobs premium)
- Top 100 são "conhecidas" -- aparecem no feed de notícias nacional
- Tier visível derivado da posição relativa no ranking

**Ranking de Grupo**: Grupos rankeados pela fama média dos membros + bônus
de sinergia (grupo com membros complementares ganha bônus).

**Ranking de Agência**: Agências rankeadas pela soma de fama de todas as
idols contratadas. Determina o tier da agência (parcialmente).

#### 5. Tier Visível (derivado do ranking)

O tier de fama é **relativo** -- baseado na posição no ranking, não em
valores absolutos. Com ~3.000 idols ativas:

| Tier | Posição no ranking | Significado |
|---|---|---|
| SSS | Top 10 (~0.3%) | Lendas nacionais |
| SS | Top 10-30 (~0.7%) | Superestrelas |
| S | Top 30-75 (~1.5%) | Estrelas de primeira linha |
| A | Top 75-180 (~3.5%) | Elite reconhecida |
| B | Top 180-390 (~7%) | Conhecidas nacionalmente |
| C | Top 390-750 (~12%) | Reconhecidas na indústria |
| D | Top 750-1350 (~20%) | Emergentes |
| E | Top 1350-2100 (~25%) | Pouco conhecidas |
| F | 2100+ (~30%) | Desconhecidas/underground |

**Nota**: Tier de fama é diferente do tier de potencial (PT).
Uma idol com PT rank S pode ter fama rank D se nunca foi investida.
Uma idol PT rank D pode ter fama rank B se foi muito promovida.

#### 6. Investimentos Ativos em Fama

| Ação | Custo | Efeito | Duração |
|---|---|---|---|
| Campanha de mídia social | ¥500K-¥5M | +5 a +50 fama/semana | 1-4 semanas |
| Aparição estratégica (TV, evento) | Custo do job | Bônus fama ×1.5 nesse job | Pontual |
| Turnê promocional | ¥10M-¥50M | +20 fama/show + exposição regional | 2-8 semanas |
| Parceria com marca | Negociação | +20-100 fama + receita | 1-6 meses |
| Lançar single/álbum | Custo produção | Fama proporcional ao ranking da música | Permanente |
| Equipe de Social Media (facility) | ¥500K-¥3M/mês | Bônus passivo pra todas idols | Contínuo |

### States and Transitions

| Estado de fama | Fama | Efeito |
|---|---|---|
| **Desconhecida** | 0-100 | Só jobs locais, scouting difícil |
| **Emergente** | 100-500 | Jobs regionais, começa a aparecer em feeds |
| **Conhecida** | 500-2000 | Jobs nacionais, mídia cobre, merch viável |
| **Famosa** | 2000-5000 | Jobs premium, endorsements, pressão de fama |
| **Superestrela** | 5000-8000 | Tudo disponível, alta demanda, alta pressão |
| **Lendária** | 8000+ | Ícone cultural, propostas globais, legado |

Transição é orgânica -- não tem "promoção". A fama sobe/desce e o estado
reflete automaticamente.

### Interactions with Other Systems

| Sistema | Direção | O que flui |
|---|---|---|
| **Stats System** | ← lê | TA influencia performance em jobs que geram fama |
| **Idol Database** | ← lê | Pool de ~3.000 idols pra ranking. Estado inicial pré-populado |
| **Job Assignment** | ↔ bidirecional | Jobs geram fama. Fama determina quais jobs aparecem |
| **Agency Economy** | → fornece | Fama afeta receita de merch e valor de endorsements |
| **Contract System** | → fornece | Idol famosa exige melhores termos. Valor de mercado sobe |
| **Happiness & Wellness** | ↔ bidirecional | Ranking sobe = Motivação sobe. Escândalos leves = +fama -felicidade |
| **Music Charts** | ← lê | Músicas populares geram fama contínua |
| **News Feed** | → fornece | Tier determina nível do veículo de notícias |
| **Scouting** | → fornece | Tier de fama visível no scouting de idols no mercado |
| **Rival Agency AI** | → fornece | IA usa ranking de agência pra tomar decisões |
| **Event/Scandal Generator** | ← lê | Escândalos leves/médios = +fama. Graves = -fama |
| **Media Entities** | ← lê | Aparição em mídia de alta audiência = boost de fama proporcional à audiência. Shows de TV nacional > rádio regional |

## Formulas

#### Fama Semanal

```
fama_nova = fama_atual + ganhos_semana - perdas_semana

ganhos_semana = sum(ganho_por_job × mult_idade × mult_facility)
             + exposicao_escandalos_leves
  mult_facility = 1.0 (sem Social Media), 1.1/1.2/1.3 (nível 1/2/3)
  exposicao_escandalos_leves = +20 (leve), +50 (médio)

perdas_semana = inatividade + fracassos + escandalos_graves + declinio_idade
  inatividade = 5/semana se sem jobs por 2+ semanas
  escandalos_graves = -200 a -500
  declinio_idade = fama_atual × DECAY_RATE × mult_idade_perda
    DECAY_RATE = 0.005 (0.5%/semana, só ativa após pico de idade)
```

#### Ranking de Grupo

```
fama_grupo = media_fama_membros × (1 + SINERGIA_BONUS)
  SINERGIA_BONUS = 0.0 a 0.3 (baseado na complementaridade de stats)
  Grupo onde todos têm Vocal alto: sinergia baixa (redundante)
  Grupo com Vocal + Dança + Visual + Variedade: sinergia alta (complementar)
```

#### Ranking de Agência

```
fama_agencia = sum(fama_de_todas_idols_contratadas) × AGENCY_FAME_FACTOR
  AGENCY_FAME_FACTOR = 0.01 (normaliza pra escala comparável)
```

## Edge Cases

- **Idol SSS de fama com PT rank D**: Possível com promoção massiva. Mas sem
  talento, jobs falham e fama cai rápido. Bolha que estoura
- **Idol debutada no ranking**: Fama congela e decai -1%/mês. Sai do ranking
  ativo após cair pra 0. Histórico preservado
- **Empate no ranking**: Desempata por TA. Se empata, por idade (mais nova
  primeiro -- viés real da indústria)
- **Escândalo leve da idol #1**: Fama SOBE (+20-50). Mas felicidade despenca
  e stress sobe. Drama emergente máximo
- **Escândalo grave da idol #1**: Fama CAIR -500. Pode descer vários tiers.
  Queda icônica
- **Grupo com 1 membro muito mais famoso**: Fama do grupo é média. Membro
  famoso "carrega" mas grupo nunca será tão alto quanto o solo. Tensão:
  manter no grupo ou carreira solo?
- **Agência com 1 idol SSS e 49 rank F**: Ranking alto pela soma mas frágil.
  Se SSS sair, ranking despenca
- **Campanha social pra idol sem Carisma**: Funciona com menor eficiência.
  Carisma modifica ganho de fama em campanhas (×Carisma/50)

## Dependencies

**Hard:**
- Stats System — TA e atributos influenciam performance que gera fama
- Idol Database — Pool de idols e estado inicial do ranking

**Soft:**
- Music Charts — Músicas populares geram fama contínua
- Agency Economy — Facilities (Social Media) dão bônus
- Event/Scandal Generator — Escândalos afetam fama (positiva ou negativamente)
- **Producer Profile** (#50): Estilo (Image Architect) e traço (Cauteloso) afetam velocidade de fama. Ver `producer-profile.md` seção 4c-4d.

**Depended on by:**
Job Assignment, Contract System, Agency Economy (merch), Happiness (motivação),
News Feed, Scouting, Rival AI, Agency Meta-Game, Market/Transfer

## Tuning Knobs

| Knob | Default | Range | Efeito |
|---|---|---|---|
| `FAME_PER_JOB_BASE` | 5-200 | 1-500 | Velocidade geral de ganho de fama |
| `FAME_DECAY_RATE` | 0.005/semana | 0.001-0.02 | Velocidade de perda por idade |
| `INACTIVITY_PENALTY` | -5/semana | -1 a -15 | Punição por não trabalhar |
| `SCANDAL_LIGHT_FAME_GAIN` | +20 | +5 a +50 | Fama ganha com escândalo leve |
| `SCANDAL_MEDIUM_FAME_GAIN` | +50 | +10 a +100 | Fama ganha com escândalo médio |
| `SCANDAL_GRAVE_FAME_LOSS` | -200 a -500 | -100 a -1000 | Fama perdida com escândalo grave |
| `GROUP_SYNERGY_MAX` | 0.3 (30%) | 0.1-0.5 | Bônus máximo de sinergia |
| `SOCIAL_MEDIA_FACILITY_MULT` | 1.1/1.2/1.3 | 1.0-1.5 | Bônus passivo da facility |
| `AGE_FAME_MULTIPLIERS` | Ver tabela | Ajustável | Curva de idade vs fama |
| `RANKING_UPDATE_FREQUENCY` | Mensal | Semanal/Mensal | Frequência de recálculo |

## Acceptance Criteria

1. Ranking individual ordena ~3.000 idols por fama corretamente
2. Tier visível mapeia pra posição no ranking conforme tabela de percentis
3. Idol sem jobs por 4+ semanas perde fama visível
4. Escândalo leve/médio AUMENTA fama mas reduz felicidade/sobe stress
5. Escândalo grave REDUZ fama significativamente
6. Ranking de grupo calcula sinergia baseada em complementaridade de stats
7. Ranking de agência reflete soma de fama de todas idols contratadas
8. Investimentos ativos resultam em ganho de fama mensurável
9. Curva de idade modifica ganho/perda conforme tabela
10. Estado inicial (pós-5 anos simulados) tem rankings populados
11. Tier de fama é independente de tier de potencial (PT)

## Open Questions

- **RESOLVIDO**: Rankings globais: Não. Apenas se tivesse modo online
- **RESOLVIDO**: Hall of Fame: Sim. Top 100 idols por fama, mesmo inativas/
  debutadas. Preserva legado permanentemente
- **EM ANÁLISE**: Fama regional vs. nacional: Sim, na distribuição de shares
  de música isso afeta. Precisa analisar complexidade de implementação antes
  de confirmar escopo completo
