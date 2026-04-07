# Market/Transfer System

> **Status**: Designed (v2 — Talent Board/Vitrine, intermediários, projeção financeira, prioridades de scouting)
> **Author**: user + game-designer
> **Last Updated**: 2026-04-06
> **Implements Pillar**: Pilar 1 — Simulação com Profundidade Real, Pilar 2 — Suas Decisões Suas Consequências
> **Related**: scouting-recruitment.md, contract-system.md, agency-economy.md, rival-agency-ai.md, idol-archetypes-roles.md
> **Wireframe**: wireframes/10-market.md

## Overview

O Market/Transfer System é o **hub centralizado de recrutamento** do jogo — o
pool central de idols disponíveis, o mecanismo de transferências entre agências,
o marketplace bidirecional (publicar necessidades E ver demandas de rivais), e o
painel onde o jogador gerencia scouts, shortlists, orçamentos e negociações.

Inspirado no Recruitment Hub + TransferRoom do FM26, adaptado para o mundo idol:
- **Talent Board** (TransferRoom In): publicar o que você precisa, receber respostas
- **Vitrine** (TransferRoom Out): ver o que rivais procuram, oferecer idols excedentes
- **Intermediários**: para idols "encalhadas" que não vendem naturalmente
- **Sem janelas de transferência**: mercado aberto o ano todo (casual-friendly)

A tensão vem da **competição com 50 agências IA**, não de deadlines artificiais.

## Player Fantasy

A fantasia é de **caçador de talentos num mercado competitivo de rede**. Não é
mais "buscar no banco de dados e oferecer" — é operar um mercado bidirecional
onde você publica necessidades e recebe propostas, vê o que rivais procuram e
oferece seus excedentes, mantém scouts em campo gerando inteligência, e
decide entre investir em scouting profundo ou reagir a oportunidades do feed.

Serve o **Pilar 1 (Simulação)**: o mercado é um ecossistema vivo onde 50
agências competem. O **Pilar 2 (Decisões)**: cada yen gasto em scouting,
buyout ou salário tem trade-off real. E o **Pilar 4 (Drama Emergente)**:
perder uma idol disputada pra um rival gera história.

## Detailed Design

### Core Rules

#### 1. Pool do Mercado

O mercado contém todas idols não-contratadas a qualquer momento:

**Fontes de entrada:**
- **World Pack schedule**: Novas idols aparecem no entry_month definido pela seed
- **Contratos expirados**: Idol cujo contrato venceu e não foi renovado
- **Rescisões**: Idol liberada por rescisão de contrato
- **Debut reverso**: Idol que estava inativa volta ao mercado (raro)

**Fontes de saída:**
- **Contratação**: Idol assina com uma agência (jogador ou IA)
- **Debut (aposentadoria)**: Idol decide debutar por idade/infelicidade
- **Inatividade prolongada**: Idol no mercado sem proposta por 12+ meses
  pode decidir abandonar a carreira

#### 2. Visibilidade do Mercado

O jogador NÃO vê todas as ~200-500 idols livres ao mesmo tempo.
Visibilidade depende do método de busca:

| Método | O que vê | Custo | Precisão |
|---|---|---|---|
| **Mercado aberto** | Idols que se candidataram publicamente (~20% do pool) | Grátis | Stats visíveis, tier estimado |
| **Scouting (olheiro)** | Idols na região do olheiro | Custo do scout | Stats com margem ±15, tier S+ masking |
| **Casting (audição)** | Idols que aparecem na audição | Custo do casting | Stats exatos nos atributos testados |
| **Festival/Evento** | Idols indie que performam no evento | Custo do ingresso | Consistência revelada (viu performar) |
| **Online** | Idols que viralizaram em redes | Custo baixo | Stats com margem ±20, incerto |
| **Transfer direto** | Idol contratada por rival | Custo de buyout | Stats completos (já é pública) |
| **News Feed** | Idols mencionadas em notícias | Grátis (ler feed) | Só o que a notícia diz (pistas, não stats) |
| **Talent Board** | Idols/agências que respondem ao seu anúncio | Grátis (publicar) | Depende: idol livre = ±estimado; agência = stats parciais |

#### 3. News Feed como Ferramenta de Scouting

O feed de notícias é uma **fonte passiva de inteligência de mercado**:

- **Idol fez sucesso em show** → Pista de tier e localização
- **Idol lançou single** → Pista de Vocal e região
- **Idol terminou contrato** → Disponível no mercado, jogador pode agir rápido
- **Idol envolvida em escândalo** → Pista de Temperamento, pode estar barata
- **Idol debutada dá entrevista dizendo que voltaria** → Oportunidade rara
  pra recontratar veterana que saiu do mercado. Só aparece no feed —
  jogador atento descobre antes dos rivais

**Meta-game**: Jogador que lê notícias com atenção descobre ONDE a idol
pode ser encontrada e manda olheiro pra lá antes da concorrência. Exemplo:
"Idol X fez show em Osaka" → mandar olheiro pra Osaka na semana seguinte.

**No Market Hub**: Notícias de mercado relevantes aparecem filtradas na
Overview do Market, com ações diretas ("Enviar Scout →", "Fazer Proposta →").

#### 4. Talent Board (Buscar — TransferRoom In)

O jogador **publica necessidades do roster** como anúncios no Talent Board.
Inspirado no TransferRoom Requirements do FM26.

**Criar anúncio:**
- Descrição livre (ex: "Dance Ace para grupo Aurora")
- Arquétipo desejado (12 opções ou "Qualquer")
- Tier mínimo
- Faixa etária
- Tempo de palco esperado (Estrela / Titular / Rotação / Desenvolvimento)
- Tipo de transferência (Permanente / Buyout / Colaboração)
- Budget máximo (opcional)

**Mecânica de respostas:**
- Agências IA com idols excedentes que encaixam nos critérios respondem
  ao longo das semanas (1-3 respostas por semana, depende de reputação)
- Idols livres se candidatam se os termos parecem atrativos
- Staff do jogador filtra e recomenda a melhor match
- Anúncios ficam ativos até serem fechados pelo jogador

**Reputação da agência afeta respostas:**
- Agência Garage: 1-2 respostas/semana, maioria tier C-D
- Agência Standard: 2-4 respostas/semana, mix de tiers
- Agência Elite: 5+ respostas/semana, incluindo tier A+

#### 5. Vitrine (Oferecer — TransferRoom Out)

O jogador vê o que **rivais estão procurando** e oferece idols do seu
roster. Inspirado no TransferRoom Pitch Opportunities do FM26.

**Mecânica:**
- Tabela de demandas publicadas por agências rivais (IA)
- Sistema cruza automaticamente necessidades com stats/arquétipo do roster
- Staff marca com ★ idols recomendadas para oferta
- Jogador escolhe tipo de oferta: transferência, liberação gratuita, colaboração
- Define valor pedido (sugerido pelo sistema baseado em valor de mercado)

**Pitch Activity**: tracking de ofertas enviadas com status (Pendente,
Aceita, Recusada, Contra-proposta).

#### 6. Intermediários

Para idols "encalhadas" (salário desproporcional ao tier, sem demanda
natural), o jogador pode contratar um intermediário:

```
custo_intermediario = INTERMEDIARY_BASE_FEE + (INTERMEDIARY_PCT × taxa_transferencia_final)

INTERMEDIARY_BASE_FEE = ¥50K
INTERMEDIARY_PCT = 5%
```

O intermediário usa rede de contatos para encontrar clubes interessados
que não estão monitorando a idol. Pode demorar 2-4 semanas para gerar
interesse. Funciona especialmente bem para:
- Idols com salário > valor de mercado
- Idols sem arquétipo demandado no momento
- Idols com escândalos recentes (reputação manchada)

#### 7. Prioridade de Propostas

Propostas são **fechadas** — idol recebe todas e escolhe a melhor.
Sem leilão público.

| Situação | Quem tem prioridade | Mecânica |
|---|---|---|
| **Idol desempregada no mercado aberto** | Jogador | Bônus de prioridade (+10% chance) |
| **Idol descoberta em casting/scout** | IA | IA pode ter descoberto primeiro. Jogador pode contra-propor |
| **Idol famosa (tier A+) livre** | Ninguém | Disputa aberta. Idol com assessor dificulta |
| **Idol via Talent Board** | Jogador | Resposta ao seu anúncio = vantagem tática |
| **Idol que anunciou volta** | Quem agiu primeiro | Corrida temporal |

#### 8. Transferências (Buyout de Rival)

Processo em fases (inspirado nas 3 fases do FM26):

```
Fase 1 — Clube-a-Clube (taxa e cláusulas)
  1. Jogador identifica idol alvo (contratada por rival)
  2. Pode fazer "Sondagem" (inquérito informal — revela valor pedido sem compromisso)
  3. Faz proposta de buyout: valor + estrutura de pagamento + cláusulas
  4. Rival avalia e responde (aceita, recusa, contra-proposta)
  5. Até 3 rounds de negociação

Fase 2 — Contrato com a Idol (se rival aceitou)
  6. Idol entra em negociação de contrato com jogador
  7. 9 cláusulas negociáveis (ver contract-system.md)
  8. Idol pode recusar (Lealdade com agência atual, termos insuficientes)

Fase 3 — Confirmação
  9. Se idol aceita: transferência completa
  10. Período de transição (0-4 semanas se idol está em projeto/turnê)
```

**Estruturas de pagamento** (inspiradas no FM26):

| Estrutura | Quando usar | Prós | Contras |
|---|---|---|---|
| **À vista** | Caixa forte, alvo disputado | Fecha rápido | Consome budget |
| **Parcelado** | Caixa curto, rival aceita | Viabiliza acima do caixa | Compromete meses futuros |
| **Com add-ons** | Jogador potencial, risco | Reduz entrada | Pode explodir custo |
| **% de venda futura** | Comprar jovem de formador | Vendedor aceita mais fácil | Reduz lucro futuro |
| **Troca de idol** | Rival precisa de alguém seu | Reduz fee | Complica contrato |

**Sondagem** (novo, inspirado no FM26 "Make Enquiry"):
- Antes de fazer proposta formal, jogador pode sondar o rival
- Revela: valor aproximado pedido, se idol está à venda, se há interesse
- Sem compromisso — mas rival fica atento (pode acelerar renovação)

**Regras:**
- Rival pode recusar buyout mesmo pagando rescisão (se idol é essencial — top 3 do roster)
- Rival pode fazer contra-oferta de renovação pra manter a idol
- Idol com Lealdade alta é mais difícil de tirar (~-20% chance aceitação)
- Jogador também pode sofrer buyout: IA rival pode tentar comprar suas idols
- Negociação rival aparece como alerta no Market Hub ("⚠ Zenith Ent. também negocia com X")

#### 9. Colaboração por Projeto (não é loan)

Em vez de empréstimo formal:
- Outra agência convida sua idol pra projeto específico (single, show, drama)
- Jogador aceita ou recusa
- Idol continua contratada, receita dividida entre agências
- Bom pra exposição de novatas (collab com famosa de rival)
- Rival também pode convidar; jogador pode convidar idols de rivais
- Visível na Vitrine quando rival publica demanda de colaboração

#### 10. Bandas Pré-formadas

Bandas sem agência no mercado:
- Aparecem como unidade: aceitar = contratar TODOS os membros
- Contrato individual por membro, mas proposta é pro grupo todo
- Se qualquer membro recusar termos, negociação falha pro grupo inteiro
- Após contratação, jogador vira dono do grupo com lock de membros

#### 11. Orçamento e Projeção Financeira

O Market Hub centraliza a gestão de 3 orçamentos:

```
Budget de Transfer: ¥ total disponível para buyouts e taxas
Budget de Salários: ¥/mês máximo comprometido com contratos
Budget de Scouting: ¥/ano para scouts, viagens, audições
```

**Slider de redistribuição** (como FM26): jogador pode converter budget
de transfer em margem salarial e vice-versa. Exemplo: reduzir transfer em
¥10M libera ~¥200K/mês de margem salarial.

**Projeção de impacto**: ao negociar uma contratação, o sistema mostra:
- Budget de transfer restante após a compra
- Novo salário total mensal
- Margem salarial remanescente
- Alerta se margem ficar apertada

#### 12. Prioridades de Scouting (Recruitment Focuses)

O jogador define **prioridades de busca** (como Recruitment Focuses do FM26):
- Perfil desejado (arquétipo + stats mínimos + tier + idade)
- Região preferida
- Scout atribuído
- Resultados acumulados ao longo do tempo

Scouts atribuídos a uma prioridade buscam ativamente idols que encaixam,
reportando candidatas conforme as encontram. Difere de "missão de scout"
(pontual) por ser contínua.

### States and Transitions

| Estado da Idol no Mercado | Descrição | Transição |
|---|---|---|
| **Disponível** | Livre, aceitando propostas | → Em negociação, → Debutou, → Abandonou |
| **Em negociação** | 1+ agências fazendo propostas | → Contratada, → Disponível (recusou todas) |
| **Disputada** | 2+ agências competindo pela mesma idol | → Contratada (melhor proposta), → Disponível |
| **Contratada** | Assinou contrato, sai do mercado | → Disponível (contrato expira/rescisão) |
| **Debutou** | Aposentou, sai do mercado ativo | Estado terminal (gera jobs como ex-idol) |
| **Abandonou** | Desistiu da carreira (12+ meses sem proposta) | Estado terminal |

### Interactions with Other Systems

| Sistema | Direção | O que flui |
|---|---|---|
| **Idol Database** | ← lê | Pool total de idols, entry_months, bandas pré-formadas |
| **Agency Economy** | ↔ bidirecional | Custo de buyout (despesa), venda de idol (receita), orçamentos |
| **Contract System** | → alimenta | Idol aceita do mercado → inicia negociação de contrato |
| **Scouting** | ← filtra | Scouting retorna subsets do mercado por região/método |
| **Rival Agency AI** | ↔ bidirecional | IA publica demandas (Vitrine), faz propostas, compete |
| **Fame & Rankings** | ← lê | Fama da idol afeta interesse de agências e valor de mercado |
| **Stats System** | ← lê | Stats determinam valor de mercado e interesse |
| **Time/Calendar** | ← tick | Novas idols entram no mercado conforme entry_month |
| **News Feed** | → visibilidade | Notícias sobre idols funcionam como scouting passivo |
| **Idol Personal Finance** | → afeta negociação | Idol endividada aceita propostas piores |
| **Media Entities** | → visibilidade | Idol aparecendo em TV/rádio fica mais visível |
| **Idol Archetypes** | ← lê | Talent Board e prioridades usam arquetipos como filtro |

## Formulas

#### Valor de Mercado (pra transferências)

```
valor_mercado = base_tier × mult_fama × mult_contrato × mult_idade

onde:
  base_tier     = F ¥1M, E ¥3M, D ¥8M, C ¥20M, B ¥50M, A ¥100M, S+ ¥300M+
  mult_fama     = ranking_factor (top 10 = ×3, top 100 = ×1.5, rest = ×1)
  mult_contrato = meses_restantes / duracao_total (mais tempo = mais caro)
  mult_idade    = 1.0 (prime), 0.7 (veterana), 0.4 (próxima de debut)
```

Nota: Fórmula duplicada intencionalmente aqui e no Agency Economy pra
referência cruzada. Agency Economy é a fonte de verdade.

#### Chance de Rival Aceitar Buyout

```
chance_aceitar = base × mult_importancia × mult_valor × mult_sondagem

onde:
  base = 0.5 (50% base)
  mult_importancia = 0.3 se idol é top 3 da agência, 0.7 se mid, 1.0 se baixa
  mult_valor = buyout_oferecido / valor_mercado (>1.5 = muito provável)
  mult_sondagem = 1.1 se fez sondagem antes (rival percebe seriedade)
```

A IA tem **10-20% de margem de manobra** sobre posição inicial (como FM26).
Ultrapassar esse limiar faz a negociação colapsar após 3 rounds.

#### Chance de Idol Aceitar Proposta (em disputa)

```
score_proposta = salario_normalizado × 0.35
              + fama_agencia × 0.20
              + tempo_palco_prometido × 0.15
              + lealdade_agencia_atual × (-0.15)
              + bonus_prioridade_jogador × 0.10
              + assessor_pessoal × (-0.05)

// Idol escolhe proposta com maior score
// Em caso de empate: Lealdade desempata
```

#### Tempo no Mercado até Abandonar

```
meses_abandono = BASE_ABANDON_MONTHS × mult_tier × mult_idade
  BASE_ABANDON_MONTHS = 12
  mult_tier = F 0.5 (abandona em 6 meses), SSS 3.0 (aguenta 36 meses)
  mult_idade = 1.0 (jovem), 0.5 (velha — desiste mais rápido)
```

#### Frequência de Respostas no Talent Board

```
respostas_por_semana = base × mult_reputacao × mult_atratividade

onde:
  base = 1
  mult_reputacao = 0.5 (Garage), 1.0 (Standard), 2.0 (Elite), 3.0 (Top 5)
  mult_atratividade = 0.5 se salário oferecido baixo, 1.0 normal, 1.5 generoso
```

## Edge Cases

- **Idol entry_month chega mas mercado está saturado**: Idol entra normalmente.
  Mercado não tem limite — saturação é problema das agências
- **Jogador e IA fazem proposta no mesmo tick**: Idol avalia ambas
  simultaneamente. Melhor score_proposta vence
- **Buyout de idol que está em turnê com rival**: Buyout é aceito mas idol
  só transfere após turnê acabar. Período de transição (0-4 semanas)
- **Banda pré-formada com 1 membro que outra agência já quer**: Se membro
  individual recebe proposta solo E proposta de grupo, escolhe pela melhor
- **Idol rank SSS no mercado por mais de 1 mês**: Improvável — IA rivais
  disputam agressivamente. Se acontecer, salário pedido é absurdo
- **Jogador tenta comprar 10 idols no mesmo mês**: Possível se tiver
  orçamento. Sem limite artificial. Economy System controla via saldo
- **Talent Board sem respostas**: Agência de reputação muito baixa ou
  anúncio muito restritivo. Staff sugere ampliar critérios
- **Intermediário não encontra comprador**: Após 4 semanas sem resultado,
  intermediário reporta "sem interesse encontrado" e cobra apenas base fee
- **Rival publica demanda no exato perfil da minha idol**: Vitrine
  mostra match automático com ★. Oportunidade de vender caro
- **Idol rival em pré-contrato (<6 meses)**: Jogador pode abordar
  diretamente sem pagar buyout. Rival é notificado (pode renovar)

## Dependencies

**Hard:**
- Idol Database — pool de idols e schedule de entrada
- Agency Economy — dinheiro pra buyouts, custo de scouting, orçamentos
- Contract System — negociação de contrato (Fase 2 do buyout)

**Soft:**
- Fame & Rankings — fama afeta valor de mercado e interesse
- Stats System — stats afetam avaliação e decisões de contratação
- Scouting & Recruitment — scouts como pipeline de descoberta
- Idol Archetypes — arquetipos como linguagem do Talent Board e prioridades
- Producer Profile (#50): Cidade de origem (Tokyo) aumenta pool inicial +20%

**Depended on by:**
Scouting, Rival Agency AI, Contract System, News Feed

## Tuning Knobs

| Knob | Default | Range | Efeito |
|---|---|---|---|
| `MARKET_VISIBILITY_OPEN` | 20% | 10-50% | % de idols visíveis no mercado aberto |
| `BUYOUT_ACCEPTANCE_BASE` | 0.5 | 0.2-0.8 | Chance base de rival aceitar buyout |
| `BUYOUT_AI_MARGIN` | 0.15 | 0.10-0.25 | Margem de negociação da IA (% sobre posição inicial) |
| `BASE_ABANDON_MONTHS` | 12 | 6-24 | Meses sem proposta até idol desistir |
| `COLLAB_REVENUE_SPLIT` | 50/50 | 30/70 a 70/30 | Divisão de receita em colaborações |
| `TRANSFER_TRANSITION_WEEKS` | 2 | 0-4 | Semanas entre aceitar buyout e idol chegar |
| `MARKET_REFRESH_FREQUENCY` | Semanal | Semanal/Mensal | Quando novas idols aparecem |
| `TALENT_BOARD_BASE_RESPONSES` | 1 | 0-3 | Respostas base por semana ao Talent Board |
| `INTERMEDIARY_BASE_FEE` | ¥50K | ¥20K-¥100K | Custo fixo do intermediário |
| `INTERMEDIARY_PCT` | 5% | 2-10% | % da taxa de transferência pro intermediário |
| `PRE_CONTRACT_MONTHS` | 6 | 3-12 | Meses restantes de contrato para pré-contrato |

## Acceptance Criteria

1. Novas idols aparecem no mercado no entry_month correto do World Pack
2. Transferência (buyout) em 3 fases: clube-a-clube, contrato com idol, confirmação
3. Sondagem ("Make Enquiry") revela valor pedido sem compromisso
4. Rival AI compete ativamente por idols no mercado (não deixa idols S+ livres)
5. Bandas pré-formadas só são contratáveis como unidade completa
6. Idol sem proposta por 12+ meses abandona carreira (ajustado por tier)
7. Colaboração por projeto divide receita conforme configuração
8. Jogador pode sofrer buyout de suas idols por rivais
9. Visibilidade do mercado varia por método de busca conforme tabela
10. Idol disputada por 2+ agências escolhe melhor proposta via score_proposta
11. Mercado funciona o ano todo (sem janelas de transferência)
12. Talent Board: publicar necessidades e receber respostas (freq. depende de reputação)
13. Vitrine: ver demandas de rivais e oferecer idols com match automático
14. Intermediário disponível para idols encalhadas (custo fixo + %)
15. Prioridades de scouting contínuas (Recruitment Focuses) com resultados acumulados
16. Slider de redistribuição Transfer ↔ Salários
17. Projeção de impacto financeiro antes de confirmar contratação
18. Pré-contrato: abordar idol com <6 meses de contrato sem pagar buyout
19. Estruturas de pagamento: à vista, parcelado, add-ons, % venda futura, troca de idol
20. Alerta quando rival negocia com o mesmo alvo ("⚠ competição")

## Open Questions

- **RESOLVIDO**: Sem leilão público. Propostas fechadas, idol escolhe a melhor
- **RESOLVIDO**: Idols famosas (A+) podem ter assessor pessoal que dificulta
  negociação (ligado ao Idol Personal Finance System)
- **RESOLVIDO**: Sem janelas de transferência fixas. Livre o ano todo (casual)
- **RESOLVIDO**: Talent Board e Vitrine como marketplace bidirecional (v2)
- **RESOLVIDO — CRIADO**: Idol Personal Finance System (system #40)
- Intermediário pode ser NPC com personalidade (alguns são mais caros mas mais eficazes)?
- Talent Board deveria ter custo de publicação para agências pequenas?
