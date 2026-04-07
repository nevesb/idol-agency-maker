# Agency Economy

> **Status**: Designed (v2 — referências a show/staff systems, pacotes de produção)
> **Author**: user + game-designer
> **Last Updated**: 2026-04-04
> **Implements Pillar**: Pilar 1 — Simulação com Profundidade Real
> **Related**: show-system.md (receita de shows), staff-functional.md (salários de staff + pacotes de produção), music-entities.md (custos de compositor + royalties)

## Overview

O Agency Economy gerencia todo o fluxo de dinheiro do jogo: receitas de jobs,
salários de idols, custos operacionais, investimentos, cachê de compositores,
custos de scouting, e orçamento da agência. É processado semanalmente (receitas
de jobs) e mensalmente (salários, relatório). O jogador interage ativamente
decidindo onde investir, quanto pagar, e quais custos cortar. Sem este sistema,
não há tensão financeira -- e sem tensão financeira, contratar uma idol SSS não
tem peso.

## Player Fantasy

A fantasia é de **construir um império do zero**. Começar com orçamento apertado,
escolher entre contratar mais uma idol ou investir em scouting, sentir a
satisfação do primeiro mês lucrativo, e eventualmente ter dinheiro suficiente
pra competir com as gigantes. Serve o **Pilar 2 (Suas Decisões, Suas
Consequências)**: cada yen gasto é uma escolha com trade-off real. E o **Pilar 3
(Múltiplos Caminhos)**: agência boutique com margem alta vs. fábrica de talentos
com volume alto são ambas viáveis financeiramente.

## Detailed Design

### Core Rules

#### 1. Fontes de Receita

| Fonte | Frequência | Valor depende de |
|---|---|---|
| **Jobs completados** | Semanal (por job) | Tier do job × performance da idol × fama |
| **Royalties de músicas** | Mensal | Posição no ranking × streams/vendas |
| **Merchandising** | Mensal | Fama da idol/grupo × fan club size |
| **Endorsements/Parcerias** | Por contrato | Tier da marca × tier da idol |
| **Eventos criados** | Por evento | Bilheteria × participantes × tier |
| **Transferências (venda)** | Pontual | Buyout de contrato de idol pra outra agência |

#### 2. Fontes de Despesa

| Despesa | Frequência | Valor depende de |
|---|---|---|
| **Salários fixos** | Mensal | Cláusula de contrato de cada idol |
| **% de receita pra idol** | Por job | Cláusula de contrato (% negociada) |
| **Custos operacionais** | Mensal | Tamanho da agência (sede, staff, facilities) |
| **Scouting** | Por ação | Tipo de scouting × região × duração |
| **Castings** | Por evento | Custo de organizar audição |
| **Cachê de compositores** | Por música | Tier do compositor |
| **Eventos criados** | Por evento | Custo de produção + cachê de convidados |
| **Treinamento** | Mensal | Qualidade das facilities de treino |
| **Marketing/Mídia social** | Por campanha | Alcance × duração |
| **Multas de rescisão** | Pontual | Cláusula de rescisão do contrato |
| **Transferências (compra)** | Pontual | Buyout pra tirar idol de rival |

#### 3. Orçamento e Fluxo de Caixa

```
Saldo = saldo_anterior + receitas_semana - despesas_semana

No fim do mês:
  saldo -= salarios_totais
  saldo -= custos_operacionais
  saldo += royalties_musicas
  saldo += merchandising
```

- Saldo pode ficar **negativo** (dívida). Não é game over imediato
- Dívida por 3+ meses consecutivos: dono da agência intervém (metas de corte,
  venda forçada de idol, ou demissão do jogador = game over suave)
- O jogador pode pedir **empréstimo** ao dono (com juros e prazo)

#### 4. Metas do Dono da Agência

O dono não é o jogador -- o jogador é o produtor/gerente. O dono define metas:

- Metas escalam com o nível atual da agência
- Geradas mensalmente, baseadas no desempenho recente
- **Cumprir**: Bônus de orçamento, melhor sede, acesso a recursos premium
- **Falhar**: Perde o bônus, mas sem punição. Mantém casualidade
- **Falhar 6+ meses**: Dono fica insatisfeito, pode demitir (game over suave)

Tipos de metas:

| Tipo | Exemplo |
|---|---|
| Financeira | "Faturar ¥50M este mês" |
| Ranking | "Ter uma idol no Top 20" |
| Crescimento | "Contratar 3 novas idols este trimestre" |
| Qualidade | "Manter felicidade média acima de 60%" |
| Prestígio | "Participar de 2 eventos de TV este mês" |

#### 5. Progressão da Agência

A agência tem um **tier** que sobe com sucesso e desbloqueia recursos:

| Tier Agência | Orçamento base | Max Idols | Facilities | Acesso |
|---|---|---|---|---|
| Garagem | ¥5M/mês | 5 | Básico | Jobs locais, scouting 1 cidade |
| Pequena | ¥15M/mês | 15 | Sala de treino | Jobs regionais, scouting 2 cidades |
| Média | ¥50M/mês | 30 | Studio próprio | Jobs nacionais, scouting 4 cidades |
| Grande | ¥150M/mês | 50 | Campus completo | Todos jobs, scouting todas cidades |
| Elite | ¥500M+/mês | 100+ | Flagship | Acesso a tudo, propostas de troca de agência |

Subir de tier requer: metas cumpridas + faturamento consistente + ranking mínimo

#### 6. Departamentos e Facilities (upgrades progressivos)

Dentro de cada tier, o jogador pode investir em **departamentos** que dão
bônus progressivos. Cada facility tem níveis (1-3) com custo mensal crescente.
Facilities que atendem idols diretamente **requerem slot na agenda** da idol.

**Departamento de Inteligência/Defesa** (prevenção de riscos):

| Facility | Nível | Custo/mês | Efeito | Requisito idol |
|---|---|---|---|---|
| Psicólogo | 1 | ¥500K | Alerta de burnout 2 semanas antes | Slot na agenda |
| Psicólogo | 2 | ¥1.5M | + redução de stress ×0.8 | Slot na agenda |
| Psicólogo | 3 | ¥3M | + recuperação de crise mais rápida | Slot na agenda |
| PR/Crisis Management | 1 | ¥800K | Reduz impacto de escândalos 20% | — |
| PR/Crisis Management | 2 | ¥2M | Reduz 40% + alerta de risco | — |
| Assessoria Jurídica | 1 | ¥1M | Melhora negociação de contratos | — |

**Departamento de Desenvolvimento** (melhoria de atributos):

| Facility | Nível | Custo/mês | Efeito | Requisito idol |
|---|---|---|---|---|
| Sala de Treino Vocal | 1-3 | ¥300K-¥2M | Bônus treino Vocal ×1.2/×1.5/×2.0 | Slot na agenda |
| Studio de Dança | 1-3 | ¥300K-¥2M | Bônus treino Dança ×1.2/×1.5/×2.0 | Slot na agenda |
| Academia Física | 1-3 | ¥200K-¥1.5M | Bônus Resistência + reduz decaimento | Slot na agenda |
| Coaching de Atuação | 1-3 | ¥400K-¥2.5M | Bônus Atuação e Variedade | Slot na agenda |
| Mentoria (veterana) | — | ¥0 | Bônus geral pra novatas, hints de ocultos | Veterana ocupa slot |

**Departamento de Marketing/Bem-estar** (visibilidade + felicidade):

| Facility | Nível | Custo/mês | Efeito | Requisito idol |
|---|---|---|---|---|
| Equipe de Social Media | 1-3 | ¥500K-¥3M | Bônus fama passiva, campanhas melhores | — |
| Sala de Convivência | 1-3 | ¥200K-¥1M | Bônus felicidade base todas idols | — |
| Área de Descanso | 1-2 | ¥300K-¥800K | Recuperação de stress mais rápida | — |
| Refeitório/Chef | 1-2 | ¥400K-¥1.5M | Bônus de Resistência passivo | — |

**Facilities de Produção** (redução de custo / geração de receita):

| Facility | Custo inicial | Custo/mês | Efeito | Tier mínimo |
|---|---|---|---|---|
| Studio de Gravação | ¥50M | ¥3M | Custo de produção musical -50% | Média |
| Gráfica/Impressão | ¥30M | ¥2M | Custo de merch -40% | Média |
| Loja Online Própria | ¥10M | ¥1M | Margem maior em vendas diretas | Pequena |

#### 7. Merchandising Progressivo

Produtos de merch desbloqueiam conforme tier da agência:

| Tier | Produtos | Custo unitário | Receita |
|---|---|---|---|
| Garagem | Light sticks, buttons, adesivos | Baixo | Baixa |
| Pequena | + Camisetas, pôsters, chaveiros | Baixo-médio | Média |
| Média | + CDs, singles físicos, photo cards | Médio | Alta |
| Grande | + Photo books, vinil, box sets, DVDs | Alto | Muito alta |
| Elite | + Coletâneas, collabs, edições especiais | Muito alto | Premium |

**Regras de merch:**
- Criar produto requer investimento de desenvolvimento (one-time cost)
- Disco/CD baseado na popularidade de músicas no ranking
- Vender discos aumenta popularidade da música E da idol
- Coletâneas com artistas famosos impulsionam novatos no mesmo disco
- Gráfica própria reduz custos de produção de merch em 40%
- Depto de MKT pode desenvolver novos tipos de produto (photo book, etc.)

**Nota de escopo:** Merch básico (light sticks, buttons) no Vertical Slice.
Sistema completo (discos, collabs, loja própria) no Alpha. Edições especiais
no Full Vision.

### States and Transitions

| Estado da Agência | Descrição | Transição |
|---|---|---|
| **Saudável** | Saldo positivo, metas sendo cumpridas | → Dificuldade (3 meses prejuízo) |
| **Dificuldade** | Saldo negativo ou metas falhando | → Saudável (lucro), → Crise (3+ meses dívida) |
| **Crise** | Dívida prolongada, dono intervém | → Dificuldade (cortes feitos), → Game Over (demissão) |
| **Game Over** | Dono demite o jogador | Jogador pode aceitar proposta de outra agência ou reiniciar |

Game over **não é permanente**: o jogador pode ser contratado por outra agência
(menor) levando sua reputação e afinidades. Como ser demitido no FM e recomeçar
num time menor.

### Interactions with Other Systems

| Sistema | Direção | O que flui |
|---|---|---|
| **Time/Calendar** | ← tick | Dispara processamento semanal e mensal de finanças |
| **Contract System** | ← custos | Salários, % receita, multas de rescisão |
| **Job Assignment** | ← receitas | Pagamento por jobs completados |
| **Scouting** | ← custos | Custo de olheiros, castings, viagens |
| **Market/Transfer** | ↔ bidirecional | Buyout pra comprar/vender idols |
| **Fame & Rankings** | ← dados | Ranking da agência afeta tier e propostas |
| **Agency Meta-Game** | → fornece | Dados financeiros pra metas do dono e troca de agência |
| **Financial Reporting** | → fornece | Dados brutos pra relatórios mensais |
| **Player-Created Events** | ← custos | Custo de produção de eventos, receita de bilheteria |
| **Music Charts** | ← receitas/custos | Royalties mensais de músicas. Cachê de compositores (despesa). Custo produção mídia física (despesa). Vendas de CDs/vinil (receita) |
| **Media Entities** | ← receitas/custos | Cachê de aparições em TV/rádio (receita). Airplay pago (despesa). Contratos de exclusividade de slot (despesa) |
| **Idol Personal Finance** | → alimenta | Pagamentos de salário e % jobs fluem pra finanças pessoais da idol. Agência não controla como idol gasta |

## Formulas

#### Receita de Job

```
receita_job = base_job × mult_performance × mult_fama × mult_tier_job

onde:
  base_job          = valor base definido por tipo de job (¥100K a ¥50M)
  mult_performance  = resultado_simulacao (0.5 a 2.0)
  mult_fama         = fama_idol / 50 (range: 0.02 a 2.0)
  mult_tier_job     = tier do job (local=0.5, regional=1.0, nacional=2.0, premium=5.0)

Parte da idol: receita_job × porcentagem_contrato
Parte da agência: receita_job - parte_idol
```

#### Custos Operacionais Mensais

```
custo_operacional = custo_base_tier + (num_idols × custo_por_idol) + facilities

onde:
  custo_base_tier = Garagem ¥1M, Pequena ¥5M, Média ¥15M, Grande ¥50M, Elite ¥150M
  custo_por_idol  = ¥200K/idol (staff de suporte, managers)
  facilities      = custo do nível de treino (básico ¥0, studio ¥5M, campus ¥20M)
```

#### Valor de Mercado de Idol (pra transferências)

```
valor_mercado = base_tier × mult_fama × mult_contrato × mult_idade

onde:
  base_tier     = F ¥1M, E ¥3M, D ¥8M, C ¥20M, B ¥50M, A ¥100M, S+ ¥300M+
  mult_fama     = ranking_position_factor (top 10 = ×3, top 100 = ×1.5, rest = ×1)
  mult_contrato = tempo_restante_contrato / duracao_total (mais tempo = mais caro)
  mult_idade    = 1.0 (prime), 0.7 (veterana), 0.4 (próxima de debut)
```

## Edge Cases

- **Saldo exatamente zero**: Não é crise. Crise só com dívida por 3+ meses
- **Idol gera receita maior que o orçamento total da agência**: Possível com
  idol SSS em agência Garagem. O dinheiro entra normal -- é o momento de
  crescer de tier
- **Jogador demitido com ¥0**: Pode aceitar agência menor que oferece salário
  e orçamento novo. Nunca fica "preso"
- **Todas idols vendem contrato ao mesmo tempo**: Agência fica sem roster.
  Custos operacionais continuam. Jogador precisa recrutar ou será demitido
- **Empréstimo não pago no prazo**: Dono cobra juros compostos. Após 6 meses
  de inadimplência, game over forçado
- **Agência Elite com 100 idols**: Custos operacionais altíssimos (~¥170M+/mês).
  Se receita cair, espiral de dívida é rápida. Risco real de "too big to manage"

## Dependencies

**Hard:**
- Time/Calendar — processamento financeiro depende do tick semanal/mensal

**Soft:**
- Contract System — sem ele, não há salários (mas economia funciona com jobs)
- Fame & Rankings — sem ele, multiplicadores de fama são neutros
- **Producer Profile** (#50): Cidade, estilo e traços afetam custos e revenue. Ver `producer-profile.md` seção 4b-4d.

**Depended on by:**
Contract System, Market/Transfer, Scouting, Job Assignment, Financial Reporting,
Agency Meta-Game, Player-Created Events, Rival Agency AI

## Tuning Knobs

| Knob | Default | Range | Se muito alto | Se muito baixo |
|---|---|---|---|---|
| `STARTING_BUDGET` | ¥10M | ¥1M-¥100M | Sem tensão inicial | Impossível contratar ninguém |
| `DEBT_CRISIS_MONTHS` | 3 | 1-12 | Muito tolerante | Muito punitivo pro casual |
| `LOAN_INTEREST_RATE` | 5%/mês | 1-15% | Empréstimo = armadilha | Empréstimo sem consequência |
| `AGENCY_TIER_THRESHOLDS` | Ver tabela | Ajustável | Sobe rápido demais | Nunca sobe |
| `OWNER_GOAL_SCALING` | 1.2× | 1.0-2.0× | Metas impossíveis | Metas triviais |
| `OWNER_PATIENCE_MONTHS` | 6 | 3-12 | Nunca demite | Demite muito rápido |
| `OPERATIONAL_COST_PER_IDOL` | ¥200K | ¥50K-¥500K | Ter muitas idols é insustentável | Sem pressão de roster |
| `MERCHANDISE_FAME_FACTOR` | 0.01 | 0.005-0.05 | Merch é receita dominante | Merch irrelevante |

## Acceptance Criteria

1. Agência Garagem com 3 idols rank D consegue ser lucrativa com boa gestão
2. Agência Elite com 50+ idols tem custos operacionais que exigem gestão ativa
3. Dívida por 3 meses consecutivos dispara intervenção do dono
4. Game over permite recomeçar em agência menor (não é fim permanente)
5. Metas do dono escalam proporcionalmente ao tier e faturamento recente
6. Empréstimo com juros funciona e inadimplência leva a game over em 6 meses
7. Todos 6 tipos de receita e 11 tipos de despesa são rastreados separadamente
8. Relatório mensal mostra receitas, despesas, lucro/prejuízo, saldo
9. Progressão de tier funciona: cumprir requisitos → subir → desbloquear recursos
10. Transferência de idol calcula valor de mercado corretamente pela fórmula

## Open Questions

- **RESOLVIDO**: Moeda fictícia comparada ao Yen (mesma escala, nome diferente)
- **RESOLVIDO**: Sem inflação. Valores estáveis ao longo dos 20 anos
- **RESOLVIDO**: Sem impostos. Simplificado
- **RESOLVIDO**: Agências IA usam as mesmas regras do jogador. Ideal pra
  fairness e meta-game. Otimizar performance se necessário
