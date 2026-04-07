# Idol Personal Finance System

> **Status**: Designed
> **Author**: user + game-designer
> **Last Updated**: 2026-03-30
> **Implements Pillar**: Pilar 2 — Suas Decisões, Suas Consequências, Pilar 4 — O Drama Nasce das Mecânicas

## Overview

O Idol Personal Finance System simula a vida financeira individual de cada idol.
Cada idol é uma mini-IA econômica que recebe salário/cachês, tem gastos mensais,
persegue objetivos de vida (casa, carro, cirurgia, viagens) e pode se endividar.
A motivação da idol pra trabalhar não é só o salário -- é o que o dinheiro
COMPRA. Uma idol que conquistou casa própria é permanentemente mais feliz. Uma
idol endividada está desesperada e aceita qualquer contrato. O jogador não
controla as finanças da idol diretamente -- vê os efeitos pelo comportamento
e notícias no feed.

## Player Fantasy

A fantasia é de **entender a pessoa por trás dos números**. Não basta pagar bem
-- a idol tem sonhos e planos próprios. Ver no feed "Idol X comprou apartamento
em Tokyo" e saber que isso vai mantê-la feliz por muito tempo. Ou ver "Idol Y
está endividada após cirurgia" e saber que ela vai aceitar qualquer proposta --
oportunidade pra contrato barato, ou risco de perdê-la pra rival que ofereça
mais. Serve o **Pilar 4 (Drama Emergente)**: dramas financeiros das idols são
histórias que o sistema gera sozinho.

## Detailed Design

### Core Rules

#### 1. Ficha Financeira da Idol

```
IdolFinance {
  savings:          ¥amount  // Poupança acumulada
  debt:             ¥amount  // Dívida total
  monthly_income:   ¥amount  // Salário + royalties + bônus
  monthly_expenses: ¥amount  // Gastos fixos de vida
  standard_of_living: "low" | "normal" | "high" | "luxury"  // Ajusta com renda

  // Objetivos são completados UM DE CADA VEZ (fila)
  current_goal:     goal     // Objetivo ativo no momento
  completed_goals:  goal[]   // Histórico de conquistas
  goal_queue:       goal[]   // Próximos objetivos na fila
}
```

**Visibilidade pro jogador:**
- Ficha financeira é **atributo oculto** -- jogador NÃO vê números
- Sabe das finanças da idol **pelas notícias** (fonte de fofoca)
- Se idol está contratada: jogador vê a **aspiração atual** (objetivo corrente)
  mas não saldo/dívida
- News Feed: "Idol X comprou apartamento", "Idol Y com dificuldades financeiras"

#### 2. Stats que Afetam Finanças Pessoais

Saúde financeira depende dos stats da idol:

| Stat/Oculto | Efeito nas finanças |
|---|---|
| **Disciplina** (visível) | Alta = gasta com controle, poupa mais. Baixa = impulsiva, gasta demais |
| **Visual** (visível) | Alto = tende a priorizar estética (cirurgia, roupas, cuidados) |
| **Ambição** (oculto) | Alta = quer objetivos caros (casa grande, carro luxo). Baixa = se contenta com pouco |
| **Vida Pessoal** (oculto) | Alta = gasta em experiências (viagens, saídas, hobbies). Baixa = econômica |

**Vaidade** não é um atributo separado -- é derivada:
```
tendencia_estetica = (Visual / 100 × 0.4) + (Ambicao / 20 × 0.3) + (Vida_Pessoal / 20 × 0.3)
  Alta: prioriza cirurgia, roupas, cuidados pessoais nos gastos
  Baixa: prioriza conforto (casa, viagem) ou investimentos
```

  personal_manager: {
    hired: bool,
    cost: ¥amount/month (10% da renda)
  }
}
```

#### 3. Renda da Idol

| Fonte | Frequência | Valor |
|---|---|---|
| Salário fixo (contrato) | Mensal | Cláusula do contrato |
| % de receita de jobs | Por job | Cláusula × receita do job |
| Royalties de músicas | Mensal | Chart position × % contrato |
| Bônus de compositor (+20%) | Mensal | Se compôs a música |
| Ganhos de jobs sem exclusividade | Variável | Jobs aceitos por fora |

#### 4. Gastos da Idol

| Gasto | Frequência | Valor depende de |
|---|---|---|
| **Vida básica** (aluguel, comida, transporte) | Mensal | Região + fama (famosa gasta mais) |
| **Poupança pra objetivo** | Mensal | Idol direciona % da renda |
| **Manager pessoal** | Mensal | 10% da renda (se contratou) |
| **Pagamento de dívida** | Mensal | Juros + amortização |
| **Luxos** (roupas, hobbies, saídas) | Variável | Proporcional à renda e Vida Pessoal (oculto) |

**Oculto "Vida Pessoal" afeta gastos:**
- Alto (15-20): Gasta mais em luxos, viagens, saídas. Fica mais feliz mas
  poupa menos. Mais risco de ser flagrada em público
- Baixo (1-5): Gasta pouco, poupa mais. Menos risco de exposição. Mais
  reservada e estável financeiramente

#### 5. Objetivos de Vida (Life Goals)

Idol completa objetivos **UM DE CADA VEZ** (fila). Seed gera a lista e
prioridade. Stats determinam quais objetivos a idol persegue:

| Objetivo | Custo típico | Efeito ao conquistar | Influenciado por |
|---|---|---|---|
| **Casa própria** | ¥15M-¥50M | Felicidade +5 permanente, para de pagar aluguel | Ambição alta |
| **Carro** | ¥2M-¥15M | Felicidade +3, qualidade de vida | Ambição média+ |
| **Cirurgia estética** | ¥5M-¥30M | Visual +5-15 permanente, Felicidade +10 | Visual alto + tendência estética alta |
| **Viagem internacional** | ¥3M-¥10M | Felicidade +5 (2 meses), Stress -20 | Vida Pessoal alta |
| **Viagem nacional** | ¥500K-¥3M | Felicidade +2 (1 mês), Stress -10 | Vida Pessoal média |
| **Educação** | ¥2M-¥10M | Adaptabilidade +5-10 permanente | Disciplina alta |
| **Ajudar família** | ¥1M-¥20M | Felicidade +3 permanente | Lealdade alta |
| **Investimento** | ¥5M-¥50M | Renda passiva mensal (juros sobre capital) | Disciplina alta + Ambição alta |
| **Herança/Família** | Variável | Eventos de família (casamento, filho, parente doente) | Vida Pessoal alta + idade |

**Regras da fila de objetivos:**
- Idol foca em 1 objetivo por vez (poupa toda renda livre pro objetivo atual)
- Ao completar, próximo da fila vira ativo
- Jogador contratado vê o **objetivo atual** da idol (aspiração visível)
- Jogador NÃO vê a fila completa nem o progresso financeiro
- Conquista de objetivo vira notícia no News Feed

**Priorização da fila (baseada em stats):**
- Tendência estética alta → cirurgia sobe na fila
- Ambição alta → casa/carro/investimento sobem
- Vida Pessoal alta → viagens/experiências sobem
- Disciplina alta → educação/investimento sobem
- Lealdade alta → ajudar família sobe

#### 6. Sistema de Dívida

Idol pode se endividar se:
- Gasta mais do que ganha (luxos + vida básica > renda)
- Toma empréstimo pra acelerar objetivo
- Sofre emergência (médica, familiar)

**Falência sutil**: Idol NUNCA fica "falida" formalmente. Quando endividada:
- **Abaixa padrão de vida** automaticamente (luxury → normal → low)
- Padrão mais baixo = felicidade cai (-2 a -5 permanente enquanto baixo)
- Corta luxos, viagens, gastos extras
- Sempre tenta voltar ao 0 de dívida antes de retomar objetivos
- Se dívida persiste por meses: stress sobe, motivação pra trabalhar sobe
  (precisa do dinheiro)

```
Dívida cresce com juros: 1%/mês (12% anual)
Pagamento mensal = min(renda × 0.3, dívida_total) // máx 30% da renda pra dívida
Se dívida > renda_anual × 3: "crise financeira pessoal"
```

**Efeitos da dívida:**
- Stress +5-20/semana (proporcional ao peso da dívida)
- Felicidade -2 a -10 (permanente enquanto endividada)
- Aceita contratos piores (desesperada por dinheiro)
- Negociação: pede salário mais alto OU aceita termos piores por dinheiro rápido

#### 7. Assessor Pessoal (Manager)

Idol com poupança > 5× salário anual pode contratar assessor:
- Custo: 10% da renda mensal
- Efeitos: +20% chance de aceitação em negociações, bloqueia ofertas < 90%
  do valor de mercado, impede overwork (recusa contratos com >6 jobs/semana)
- Assessor gerencia melhor o dinheiro da idol (gasto com luxos cai 30%)

#### 8. Visibilidade pro Jogador

Finanças pessoais são **atributo oculto** -- como os ocultos de personalidade.
Jogador NUNCA vê saldo, dívida, ou progresso exato. Percebe por:

- **News Feed** (fonte principal de fofoca): "Idol X comprou apartamento",
  "Fontes dizem que Idol Y enfrenta dificuldades financeiras"
- **Aspiração atual** (se contratada): Jogador vê o objetivo corrente
  ("Poupando pra casa própria") mas não o progresso financeiro
- **Comportamento**: Idol endividada aceita contratos piores. Idol rica
  fica mais exigente. Padrão de vida visível (low/normal/high/luxury)
- **Felicidade**: Conquistas dão boost permanente visível na barra.
  Padrão de vida baixo = felicidade cai visivelmente
- **Sem rótulo financeiro**: Diferente de personalidade, não tem label
  explícito. Tudo é inferido por notícias e comportamento

### States and Transitions

| Estado Financeiro | Poupança | Dívida | Efeito |
|---|---|---|---|
| **Iniciante** | <¥1M | 0 | Normal, sem luxos. Motivada por qualquer renda |
| **Estável** | ¥1M-¥10M | 0 | Confortável. Pode investir em objetivos |
| **Poupando** | Crescendo | 0 | Direcionando % pra objetivo específico |
| **Conquistando** | Atingiu objetivo | 0 | Boost de felicidade permanente |
| **Endividada** | 0 | >0 | Stress +10/semana, aceita contratos piores |
| **Crise financeira** | 0 | >3× renda anual | Stress +20/semana, desesperada, risco de exposição na mídia |
| **Bem-sucedida** | >5× renda | 0 | Pode contratar assessor. Mais exigente em contratos |
| **Acomodada** | >>renda | 0 | Se Ambição baixa: motivação cai (não precisa de dinheiro) |

### Interactions with Other Systems

| Sistema | Direção | O que flui |
|---|---|---|
| **Contract System** | ← renda | Salário e % de jobs como fonte de renda |
| **Contract System** | → afeta | Dívida afeta negociação (aceita termos piores OU pede mais) |
| **Agency Economy** | ← renda | Pagamentos da agência alimentam finanças da idol |
| **Happiness & Wellness** | → afeta | Conquistas = +felicidade permanente. Dívida = +stress, -felicidade |
| **Music Charts** | ← renda | Royalties alimentam finanças pessoais |
| **Stats System** | → afeta | Cirurgia pode dar +Visual permanente. Educação +Adaptabilidade |
| **Market/Transfer** | → afeta | Idol endividada vulnerável a buyout. Assessor bloqueia ofertas baixas |
| **News Feed** | → notícias | Conquistas e crises financeiras aparecem no feed |
| **Event/Scandal Generator** | → afeta | Crise financeira pode gerar escândalos (empréstimo de fontes duvidosas) |
| **Idol Database** | ← seed | Objetivos de vida gerados pela seed, custos proporcionais à região |

## Formulas

#### Balanço Mensal da Idol

```
renda_mensal = salario + sum(jobs × porcentagem) + royalties + bonus_compositor
gastos_mensais = vida_basica + poupanca_objetivo + manager_fee + pagamento_divida + luxos

vida_basica = BASE_LIVING_COST × mult_regiao × mult_fama
  BASE_LIVING_COST = ¥200K
  mult_regiao = Tokyo 1.5, Osaka 1.2, Regional 0.8
  mult_fama = 1.0 (desconhecida) a 2.0 (superestrela, precisa de segurança, roupas, etc)

luxos = (renda - gastos_fixos) × LUXURY_RATE × (Vida_Pessoal / 20)
  LUXURY_RATE = 0.20 (20% da renda livre vai pra luxos)

saldo_mensal = renda_mensal - gastos_mensais
savings += max(saldo_mensal, 0)
debt += max(-saldo_mensal, 0) // se negativo, vira dívida
```

#### Stress por Dívida

```
stress_from_debt = (monthly_debt_payment / monthly_income) × DEBT_STRESS_MULT
  DEBT_STRESS_MULT = 20
  Exemplo: renda ¥1M, pagamento dívida ¥300K → stress = 0.3 × 20 = +6/semana
```

#### Tempo pra Atingir Objetivo

```
meses_pra_objetivo = (custo_objetivo - ja_poupado) / poupanca_mensal_direcionada
  poupanca_mensal_direcionada = saldo_mensal × SAVINGS_RATE (default 30%)
```

## Edge Cases

- **Idol rank F com salário ¥50K/mês**: Gastos básicos (¥160K+) > renda.
  Endivida-se imediatamente. Precisa de mais jobs ou renegociar salário
- **Idol SSS com ¥500M poupados e Ambição 3**: Acomodada. Motivação cai
  naturalmente (-3/semana). Difícil manter engajada. Pode querer debutar cedo
- **Idol faz cirurgia e ganha Visual +15**: Boost permanente. Se Visual já
  era 90, vai a 100 (cap). Se era 50, vai a 65 -- impacto maior
- **Idol endividada é rescindida**: Sem renda + dívida com juros = espiral.
  Idol fica desesperada no mercado, aceita qualquer proposta
- **Assessor pessoal bloqueia proposta do jogador**: Oferta abaixo de 90%
  do mercado → assessor recusa automaticamente. Jogador precisa pagar mais
- **Idol gasta toda renda em luxos (Vida Pessoal 20)**: Possível. Nunca
  poupa, nunca conquista objetivos, mas Felicidade mantida por luxos
  temporários. Frágil -- qualquer crise financeira a destrói
- **Dois objetivos simultâneos**: Idol pode poupar pra 2 objetivos mas
  leva mais tempo. IA da idol prioriza o mais importante (Ambição decide)

## Dependencies

**Hard:**
- Contract System — fonte de renda (salário, %)
- Happiness & Wellness — conquistas/dívida afetam barras
- Agency Economy — fluxo de dinheiro agência → idol

**Soft:**
- Music Charts — royalties como fonte de renda
- Stats System — cirurgia/educação afetam stats permanentemente
- Event/Scandal Generator — crise financeira gera eventos
- Market/Transfer — dívida afeta vulnerabilidade a buyout

**Depended on by:**
Contract System (dívida afeta negociação), Happiness (felicidade/stress),
Market/Transfer (assessor bloqueia ofertas), News Feed (conquistas/crises)

## Tuning Knobs

| Knob | Default | Range | Efeito |
|---|---|---|---|
| `BASE_LIVING_COST` | ¥200K/mês | ¥100K-¥500K | Custo de vida base |
| `LUXURY_RATE` | 0.20 | 0.05-0.50 | % de renda livre gasta em luxos |
| `SAVINGS_RATE` | 0.30 | 0.10-0.50 | % de saldo livre direcionada a objetivo |
| `DEBT_INTEREST_MONTHLY` | 1% | 0.5-3% | Juros sobre dívida pessoal |
| `DEBT_STRESS_MULT` | 20 | 10-40 | Quanto dívida afeta stress |
| `DEBT_CRISIS_THRESHOLD` | 3× renda anual | 1-5× | Quando entra em crise |
| `MANAGER_INCOME_SHARE` | 10% | 5-20% | Custo do assessor pessoal |
| `MANAGER_MIN_SAVINGS` | 5× salário anual | 3-10× | Poupança mínima pra contratar |
| `SURGERY_VISUAL_BOOST` | +5 a +15 | +3 a +20 | Boost de Visual por cirurgia |
| `HOUSE_FELICIDADE_BOOST` | +5 | +3 a +10 | Felicidade permanente por casa |

## Acceptance Criteria

1. Idol com salário ¥1M e gastos ¥800K poupa ~¥60K/mês (após luxos)
2. Idol endividada tem stress proporcional ao peso da dívida
3. Conquista de objetivo (casa, carro) dá boost permanente de felicidade
4. Cirurgia altera stat Visual permanentemente dentro do range configurado
5. Assessor pessoal bloqueia ofertas abaixo de 90% do mercado
6. Idol com Vida Pessoal alta gasta mais em luxos e poupa menos
7. Idol com Ambição alta prioriza objetivos caros (casa, cirurgia)
8. Crise financeira (dívida > 3× renda) aparece no News Feed
9. Idol acomodada (rica + Ambição baixa) perde motivação gradualmente
10. Balanço mensal calculado corretamente (renda - gastos = saldo)

## Open Questions

- **RESOLVIDO**: Investimentos sim. É um tipo de objetivo ("Investimento"
  na fila de goals). Idol com Disciplina + Ambição alta prioriza
- **RESOLVIDO**: Herança/família sim. É objetivo na fila. Pode gerar
  eventos (familiar doente, casamento, filho) que criam custo + felicidade
- **RESOLVIDO**: Falência sutil. Idol abaixa padrão de vida ao se endividar,
  corta luxos, tenta voltar ao 0. Padrão baixo = felicidade cai
- **RESOLVIDO**: Visibilidade oculta. Jogador sabe pelas notícias (fofoca).
  Se contratada, vê aspiração atual. Nunca vê saldo/dívida exatos
- Vaidade como derivação (Visual + Ambição + Vida Pessoal) precisa de
  calibração por playtest pra não tornar cirurgia estética dominante
